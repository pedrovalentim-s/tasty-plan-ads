'use server';

import * as fs from 'fs';
import * as path from 'path';
import { claude, CLAUDE_MODEL, FALLBACK_MODEL, CLAUDE_BETAS, extractJson } from '@/ai/claude';
import {
  GenerateStrategicPlanInputSchema,
  type GenerateStrategicPlanInput,
  PlanSchema,
  type GenerateStrategicPlanOutput,
} from '@/lib/definitions';

/**
 * System prompt em duas partes para aproveitar prompt caching:
 * a persona + cérebro estratégico são estáveis (cacheados entre gerações);
 * os dados do cliente entram na mensagem do usuário, que varia.
 */
function buildSystemBlocks(strategyBrain: string) {
  return [
    {
      type: 'text' as const,
      text: `Você é um estrategista sênior de mídia digital especializado em restaurantes e gastronomia, responsável pelo planejamento de campanhas de tráfego pago da agência Tasty Media.

Seu trabalho é criar planos de campanhas completos, profundos e acionáveis — o nível de detalhe e insight que um especialista com anos de mercado entregaria. O plano será usado pelo gestor de tráfego para montar as campanhas reais e será apresentado ao cliente.

CÉREBRO ESTRATÉGICO DA AGÊNCIA (siga estritamente estas diretrizes):
${strategyBrain}

REGRAS DO PLANO:
- Sempre gere as seções "campaigns", "strategy_notes" e "kpis".
- Gere a quantidade ideal de campanhas por plataforma com base nos objetivos e orçamento (sinta-se livre para criar 3, 4 ou mais campanhas cobrindo todo o funil).
- Cada campanha deve ter 2-3 ad sets diferentes, com todos os campos preenchidos (placements, schedule, cta, creatives, link).
- Distribua o orçamento de forma estratégica entre as campanhas (a soma deve respeitar o orçamento do cliente).
- Cada ad set deve ter 3+ interesses no público.
- CTAs relevantes para restaurantes (Reservar, Conhecer, Pedir agora, etc).
- Sugestões de criativo específicas e acionáveis, não genéricas.
- Strategy notes devem ser dicas práticas de implementação e otimização.
- KPIs devem ser SMART e mensuráveis, coerentes com o orçamento.
- IDs podem ser strings curtas únicas (ex: "camp-1", "adset-1a").

FORMATO DA RESPOSTA — responda APENAS com JSON válido nesta estrutura exata, sem markdown e sem delimitadores:
{
  "id": "id-do-plano",
  "summary": {
    "clientName": "...", "segment": "...", "monthlyBudget": 5000, "dailyBudget": 166.67,
    "platforms": ["Meta"], "period": "30 dias", "mainObjective": "resumo em 1-2 linhas"
  },
  "campaigns": [
    {
      "id": "camp-1", "platform": "Meta", "type": "Tráfego",
      "objective": "objetivo da campanha", "name": "nome da campanha",
      "dailyBudget": 50, "monthlyBudget": 1500,
      "adSets": [
        {
          "id": "adset-1a", "name": "nome do ad set", "objective": "objetivo",
          "audience": {
            "type": "tipo de público", "description": "descrição",
            "location": "localização", "interests": ["i1", "i2", "i3"], "exclusions": ""
          },
          "placements": ["Feed", "Stories", "Reels"], "schedule": "Contínuo",
          "cta": "Reservar", "link": "",
          "creatives": { "format": "Imagem", "suggestions": ["s1", "s2", "s3"] }
        }
      ]
    }
  ],
  "strategy_notes": ["nota 1", "nota 2", "nota 3"],
  "kpis": [{ "name": "nome do KPI", "target": "meta específica" }],
  "createdAt": "", "updatedAt": ""
}`,
      cache_control: { type: 'ephemeral' as const },
    },
  ];
}

export async function generateStrategicPlan(
  input: GenerateStrategicPlanInput
): Promise<GenerateStrategicPlanOutput> {
  const parsed = GenerateStrategicPlanInputSchema.parse(input);
  const dailyBudget = parsed.monthlyBudget / 30;

  let strategyBrain = '';
  try {
    const brainPath = path.join(process.cwd(), 'src/ai/knowledge/strategy-brain.md');
    strategyBrain = fs.readFileSync(brainPath, 'utf-8');
  } catch {
    console.warn('Cérebro Estratégico não encontrado em src/ai/knowledge/strategy-brain.md.');
  }

  const userMessage = `Crie o planejamento estratégico de tráfego para o cliente abaixo.

DADOS DO CLIENTE:
- Nome: ${parsed.clientName}
- Segmento: ${parsed.segment}
- Orçamento Mensal: R$ ${parsed.monthlyBudget} (diário: R$ ${dailyBudget.toFixed(2)})
- Objetivos: ${parsed.goals}
- Plataformas: ${parsed.platforms.join(', ')}
- Notas: ${parsed.notes || 'Sem notas adicionais.'}

DIRECIONAMENTO PRÉVIO DO GESTOR DE TRÁFEGO (PRIORIDADE MÁXIMA):
${parsed.managerDirection || 'Sem direcionamento prévio do gestor.'}
Este direcionamento carrega a expertise empírica do gestor e deve guiar todas as decisões da estratégia — considere-o MAIS IMPORTANTE que os objetivos e notas ao estruturar as campanhas.`;

  // Streaming: saídas longas (plano completo + raciocínio) excedem o limite
  // de requisições não-streamadas do SDK.
  const stream = claude.beta.messages.stream({
    model: CLAUDE_MODEL,
    max_tokens: 32000,
    betas: CLAUDE_BETAS,
    fallbacks: [{ model: FALLBACK_MODEL }],
    output_config: {
      effort: 'high',
    },
    system: buildSystemBlocks(strategyBrain),
    messages: [{ role: 'user', content: userMessage }],
  });
  const response = await stream.finalMessage();

  if (response.stop_reason === 'refusal') {
    throw new Error('A IA não pôde gerar este planejamento. Tente novamente.');
  }
  if (response.stop_reason === 'max_tokens') {
    throw new Error('O planejamento ficou longo demais e foi truncado. Tente novamente.');
  }

  const textBlock = response.content.find((b) => b.type === 'text');
  if (!textBlock || textBlock.type !== 'text') {
    throw new Error('A IA não retornou uma resposta para o plano.');
  }

  const output = PlanSchema.parse(extractJson(textBlock.text));
  const now = new Date().toISOString();

  // Defaults defensivos (mesmo pós-processamento da versão anterior)
  const processedCampaigns = (output.campaigns || []).map((campaign) => ({
    ...campaign,
    adSets: (campaign.adSets || []).map((adSet) => ({
      ...adSet,
      placements: adSet.placements || [],
      schedule: adSet.schedule || 'Contínuo',
      cta: adSet.cta || 'Saiba Mais',
      link: adSet.link || '',
      creatives: adSet.creatives || { format: 'Imagem/Vídeo', suggestions: [] },
      audience: {
        ...adSet.audience,
        interests: adSet.audience.interests || [],
        exclusions: adSet.audience.exclusions || '',
      },
    })),
  }));

  return {
    ...output,
    id: output.id || crypto.randomUUID(),
    campaigns: processedCampaigns,
    strategy_notes: output.strategy_notes || [],
    kpis: output.kpis || [],
    createdAt: output.createdAt || now,
    updatedAt: output.updatedAt || now,
  };
}
