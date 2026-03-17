'use server';
/**
 * @fileOverview A Genkit flow for parsing client briefing documents.
 *
 * - parseBriefing - A function that handles the parsing of a briefing document.
 * - ParseBriefingInput - The input type for the parseBriefing function.
 * - ParseBriefingOutput - The return type for the parseBriefing function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

// Input Schema
const ParseBriefingInputSchema = z.object({
  fileContent: z.string().describe('The content of the briefing file as a string.'),
  fileName: z.string().describe('The name of the briefing file (e.g., briefing.docx).'),
});
export type ParseBriefingInput = z.infer<typeof ParseBriefingInputSchema>;

// Output Schema
const ParseBriefingOutputSchema = z.object({
  clientName: z.string().optional().describe('The name of the client/restaurant.'),
  segment: z.string().optional().describe('The segment of the business (e.g., Pizzaria, Gastronomia premium).'),
  monthlyBudget: z.number().optional().describe('The monthly budget in R$.'),
  goals: z.string().optional().describe('The main goals of the client in 2-3 lines.'),
  notes: z.string().optional().describe('Additional notes or observations.'),
  platforms: z.array(z.enum(['Meta', 'Google'])).optional().describe('An array of selected platforms (e.g., ["Meta", "Google"]).'),
});
export type ParseBriefingOutput = z.infer<typeof ParseBriefingOutputSchema>;

// Wrapper function
export async function parseBriefing(input: ParseBriefingInput): Promise<ParseBriefingOutput> {
  return parseBriefingFlow(input);
}

// Genkit Prompt Definition
const parseBriefingPrompt = ai.definePrompt({
  name: 'parseBriefingPrompt',
  input: { schema: ParseBriefingInputSchema },
  output: { schema: ParseBriefingOutputSchema },
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
    const { output } = await parseBriefingPrompt(input);
    return output!;
  }
);
