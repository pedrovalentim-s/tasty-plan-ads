'use server';

import { claude, CLAUDE_MODEL, FALLBACK_MODEL, CLAUDE_BETAS, extractJson } from '@/ai/claude';
import {
  ParseBriefingInputSchema,
  type ParseBriefingInput,
  ParseBriefingOutputSchema,
  type ParseBriefingOutput,
} from '@/lib/definitions';

const SYSTEM_PROMPT = `Você é um especialista em planejamento estratégico de mídia digital para restaurantes.

Analise o briefing do cliente e EXTRAIA as informações estruturadas solicitadas.

IMPORTANTE:
- Se não encontrar um valor, omita o campo (não invente dados)
- monthlyBudget deve ser número (em R$)
- platforms: detecte automaticamente qual(is) plataforma(s) o cliente quer (Meta e/ou Google)

Responda APENAS com JSON válido nesta estrutura, sem markdown e sem delimitadores:
{
  "clientName": "nome da empresa/restaurante",
  "segment": "tipo de estabelecimento (ex: Pizzaria, Gastronomia premium)",
  "monthlyBudget": 5000,
  "goals": "objetivos principais do cliente em 2-3 linhas",
  "notes": "observações adicionais",
  "platforms": ["Meta", "Google"]
}`;

export async function parseBriefing(input: ParseBriefingInput): Promise<ParseBriefingOutput> {
  const parsed = ParseBriefingInputSchema.parse(input);

  const response = await claude.beta.messages.create({
    model: CLAUDE_MODEL,
    max_tokens: 8000,
    betas: CLAUDE_BETAS,
    fallbacks: [{ model: FALLBACK_MODEL }],
    output_config: {
      effort: 'low', // extração simples — rápido e barato
    },
    system: SYSTEM_PROMPT,
    messages: [
      {
        role: 'user',
        content: `Briefing (arquivo: ${parsed.fileName}):\n---\n${parsed.fileContent}\n---`,
      },
    ],
  });

  if (response.stop_reason === 'refusal') {
    throw new Error('A IA não pôde processar este briefing. Tente novamente ou revise o conteúdo.');
  }

  const textBlock = response.content.find((b) => b.type === 'text');
  if (!textBlock || textBlock.type !== 'text') {
    throw new Error('A IA não retornou uma resposta para o briefing.');
  }

  return ParseBriefingOutputSchema.parse(extractJson(textBlock.text));
}
