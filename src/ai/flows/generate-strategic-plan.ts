'use server';
/**
 * @fileOverview A Genkit flow for generating a comprehensive digital media strategic plan
 * based on client input, including campaigns, ad sets, audience targeting, creative suggestions, and KPIs.
 *
 * - generateStrategicPlan - A function that handles the strategic plan generation process.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { 
  GenerateStrategicPlanInputSchema,
  type GenerateStrategicPlanInput,
  PlanSchema,
  type GenerateStrategicPlanOutput,
  type Plan,
} from '@/lib/definitions';


// Helper type for the prompt input, including calculated dailyBudget and joined platforms
const GeneratePlanPromptInputSchema = z.object({
  clientName: z.string(),
  segment: z.string(),
  monthlyBudget: z.number(),
  dailyBudget: z.number(), // Calculated daily budget
  goals: z.string(),
  platforms: z.string(), // Joined platforms string
  notes: z.string(),
});
type GeneratePlanPromptInput = z.infer<typeof GeneratePlanPromptInputSchema>;


const generateStrategicPlanPrompt = ai.definePrompt({
  name: 'generateStrategicPlanPrompt',
  input: {
    schema: GeneratePlanPromptInputSchema
  },
  // output: { schema: PlanSchema }, // REMOVED to avoid responseMimeType issue
  config: {
    temperature: 0.8,
    maxOutputTokens: 8000,
  },
  prompt: `Você é um especialista em planejamento estratégico de mídia digital para restaurantes. Crie um plano completo e profissional.\n\nDADOS DO CLIENTE:\n- Nome: {{{clientName}}}\n- Segmento: {{{segment}}}\n- Orçamento Mensal: R$ {{{monthlyBudget}}}\n- Objetivos: {{{goals}}}\n- Plataformas: {{{platforms}}}\n- Notas: {{{notes}}}\n\nGERE um plano JSON estruturado com:\n\n{\n  "id": "uuid-ou-random-id-para-o-plano",\n  "summary": {\n    "clientName": "{{{clientName}}}",\n    "segment": "{{{segment}}}",\n    "monthlyBudget": {{{monthlyBudget}}},\n    "dailyBudget": {{{dailyBudget}}},\n    "platforms": [{{{platforms}}}],\n    "period": "30 dias",\n    "mainObjective": "resumo do objetivo principal em 1-2 linhas"\n  },\n  "campaigns": [\n    {\n      "id": "uuid-ou-random-id",\n      "platform": "Meta" ou "Google",\n      "type": "Tráfego",\n      "objective": "objetivo específico da campanha",\n      "name": "nome descritivo da campanha",\n      "dailyBudget": número (R$),\n      "monthlyBudget": número (R$),\n      "adSets": [\n        {\n          "id": "uuid-ou-random-id",\n          "name": "nome do ad set",\n          "objective": "objetivo do ad set",\n          "audience": {\n            "type": "tipo de público",\n            "description": "descrição do público-alvo",\n            "location": "localização geográfica",\n            "interests": ["interesse1", "interesse2", "interesse3"],\n            "exclusions": "exclusões demográficas se houver"\n          },\n          "placements": ["Feed", "Stories", "Reels"],\n          "schedule": "Contínuo" ou "datas específicas",\n          "cta": "call-to-action (ex: 'Faça uma Reserva')",\n          "link": "URL de destino se houver",\n          "creatives": {\n            "format": "Imagem" ou "Vídeo" ou "Carrossel",\n            "suggestions": ["sugestão1", "sugestão2", "sugestão3"]\n          }\n        }\n      ]\n    }\n  ],\n  "strategy_notes": [\n    "nota estratégica 1",\n    "nota estratégica 2",\n    "nota estratégica 3"\n  ],\n  "kpis": [\n    {\n      "name": "nome do KPI",\n      "target": "meta específica (ex: '5000 cliques')"\n    },\n    {\n      "name": "outro KPI",\n      "target": "meta específica"\n    }\n  ],\n  "createdAt": "YYYY-MM-DDTHH:mm:ssZ",\n  "updatedAt": "YYYY-MM-DDTHH:mm:ssZ"\n}\n\nREGRAS:\n- Sempre gere as seções "campaigns", "strategy_notes", e "kpis".\n- Gere 1-2 campanhas por plataforma selecionada.\n- Cada campanha deve ter 2-3 ad sets diferentes.\n- Garanta que todos os campos para cada 'adSet' (como 'placements', 'schedule', 'cta', 'creatives', e 'link') sejam sempre preenchidos.\n- Distribua orçamento de forma estratégica entre campanhas.\n- Cada ad set deve ter 3+ interesses.\n- CTA deve ser relevante para restaurante (Reservar, Conhecer, etc).\n- Suggestions de criativo devem ser específicas e acionáveis.\n- Strategy notes devem ser dicas práticas de implementação.\n- KPIs devem ser SMART e mensuráveis.\n- Seja extremamente detalhado e aprofundado em suas sugestões, como um especialista sênior faria. Gere uma estratégia rica e com insights valiosos.\n- Retorne APENAS JSON válido, sem markdown.`
});

const generateStrategicPlanFlow = ai.defineFlow(
  {
    name: 'generateStrategicPlanFlow',
    inputSchema: GenerateStrategicPlanInputSchema,
    outputSchema: PlanSchema,
  },
  async (input) => {
    const monthlyBudgetNum = input.monthlyBudget;
    const dailyBudget = monthlyBudgetNum / 30;
    const platformsString = input.platforms.map(p => `"${p}"`).join(', ');

    const promptInput: GeneratePlanPromptInput = {
      clientName: input.clientName,
      segment: input.segment,
      monthlyBudget: monthlyBudgetNum,
      dailyBudget: dailyBudget,
      goals: input.goals,
      platforms: platformsString,
      notes: input.notes,
    };

    const response = await generateStrategicPlanPrompt(promptInput);
    const jsonString = response.text;

    if (!jsonString) {
      throw new Error('A IA não retornou uma resposta para o plano.');
    }

    let output: Plan;
    try {
      // The model sometimes wraps the JSON in ```json ... ```
      const cleanedJsonString = jsonString.replace(/^```json\s*/, '').replace(/\s*```$/, '').trim();
      output = JSON.parse(cleanedJsonString);
    } catch (e) {
      console.error("Falha ao analisar JSON do plano:", jsonString, e);
      throw new Error("A resposta da IA para o plano estratégico não era um JSON válido.");
    }
    
    const now = new Date().toISOString();

    const processedCampaigns = (output.campaigns || []).map(campaign => ({
      ...campaign,
      adSets: (campaign.adSets || []).map(adSet => ({
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
        }
      }))
    }));

    // Ensure fields are set, as the prompt might not strictly follow the format for these.
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
);

export async function generateStrategicPlan(input: GenerateStrategicPlanInput): Promise<GenerateStrategicPlanOutput> {
  return generateStrategicPlanFlow(input);
}
