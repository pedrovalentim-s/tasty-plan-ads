'use server';
/**
 * @fileOverview A Genkit flow for parsing client briefing documents.
 *
 * - parseBriefing - A function that handles the parsing of a briefing document.
 */

import { ai } from '@/ai/genkit';
import {
  ParseBriefingInputSchema,
  type ParseBriefingInput,
  ParseBriefingOutputSchema,
  type ParseBriefingOutput
} from '@/lib/definitions';

// Wrapper function
export async function parseBriefing(input: ParseBriefingInput): Promise<ParseBriefingOutput> {
  return parseBriefingFlow(input);
}

// Genkit Prompt Definition
const parseBriefingPrompt = ai.definePrompt({
  name: 'parseBriefingPrompt',
  input: { schema: ParseBriefingInputSchema },
  // output: { schema: ParseBriefingOutputSchema }, // REMOVED to avoid responseMimeType issue
  prompt: `Você é um especialista em planejamento estratégico de mídia digital para restaurantes.

Analise o briefing do cliente abaixo e EXTRAIA APENAS as seguintes informações estruturadas em JSON:

{
  "clientName": "nome da empresa/restaurante",
  "segment": "tipo de estabelecimento (ex: Pizzaria, Gastronomia premium)",
  "monthlyBudget": número (orçamento em R$),
  "goals": "objetivos principais do cliente em 2-3 linhas",
  "notes": "observações adicionais",
  "platforms": ["Meta", "Google"] ou ["Meta"] ou ["Google"]
}

IMPORTANTE:
- Se não encontrar um valor, deixe vazio ou null (se a IA não encontrar, deve ser null/vazio no JSON)
- monthlyBudget deve ser número inteiro
- platforms: detecte automaticamente qual plataforma o cliente quer
- Retorne APENAS válido JSON, sem formatação markdown, e sem os delimitadores \`\`\`json\`\`\`.

Briefing:
---
{{{fileContent}}}
---`,
});

// Genkit Flow Definition
const parseBriefingFlow = ai.defineFlow(
  {
    name: 'parseBriefingFlow',
    inputSchema: ParseBriefingInputSchema,
    outputSchema: ParseBriefingOutputSchema,
  },
  async (input) => {
    const response = await parseBriefingPrompt(input);
    const jsonString = response.text;

    if (!jsonString) {
      throw new Error('A IA não retornou uma resposta para o briefing.');
    }
    
    try {
      // The model sometimes wraps the JSON in ```json ... ```
      const cleanedJsonString = jsonString.replace(/^```json\s*/, '').replace(/\s*```$/, '').trim();
      return JSON.parse(cleanedJsonString);
    } catch (e) {
      console.error("Falha ao analisar JSON do briefing:", jsonString, e);
      throw new Error("A resposta da IA para o briefing não era um JSON válido.");
    }
  }
);
