import { z } from 'zod';

// Form Data Schema for the frontend
export const FormDataSchema = z.object({
  clientName: z.string().min(1, 'Nome do cliente é obrigatório.'),
  segment: z.string().optional(),
  monthlyBudget: z.coerce.number().min(1, 'Orçamento deve ser maior que 0.'),
  goals: z.string().min(1, 'Objetivos são obrigatórios.'),
  notes: z.string().optional(),
  platforms: z.array(z.string()).min(1, 'Selecione pelo menos uma plataforma.'),
  briefingFile: z.any().optional(),
});
export type FormData = z.infer<typeof FormDataSchema>;

// --== AI Flow Schemas & Types ==--

// PARSE BRIEFING FLOW
export const ParseBriefingInputSchema = z.object({
  fileContent: z.string().describe('The content of the briefing file as a string.'),
  fileName: z.string().describe('The name of the briefing file (e.g., briefing.docx).'),
});
export type ParseBriefingInput = z.infer<typeof ParseBriefingInputSchema>;

export const ParseBriefingOutputSchema = z.object({
  clientName: z.string().optional().describe('The name of the client/restaurant.'),
  segment: z.string().optional().describe('The segment of the business (e.g., Pizzaria, Gastronomia premium).'),
  monthlyBudget: z.number().optional().describe('The monthly budget in R$.'),
  goals: z.string().optional().describe('The main goals of the client in 2-3 lines.'),
  notes: z.string().optional().describe('Additional notes or observations.'),
  platforms: z.array(z.enum(['Meta', 'Google'])).optional().describe('An array of selected platforms (e.g., ["Meta", "Google"]).'),
});
export type ParseBriefingOutput = z.infer<typeof ParseBriefingOutputSchema>;


// GENERATE STRATEGIC PLAN FLOW

// Input Schema
export const GenerateStrategicPlanInputSchema = z.object({
  clientName: z.string().describe('Nome do cliente'),
  segment: z.string().describe('Segmento (ex: "Gastronomia premium")'),
  monthlyBudget: z.number().describe('Orçamento mensal em R$'),
  goals: z.string().describe('Objetivos principais do cliente'),
  notes: z.string().describe('Observações adicionais'),
  platforms: z.array(z.string()).describe('Plataformas selecionadas (Meta, Google)'),
});
export type GenerateStrategicPlanInput = z.infer<typeof GenerateStrategicPlanInputSchema>;

// Output Schema (Plan) and its constituents
export const AudienceSchema = z.object({
  type: z.string().describe('Ex: "Personalizado", "Lookalike"'),
  description: z.string().describe('Descrição do público-alvo'),
  location: z.string().describe('Localização geográfica'),
  interests: z.array(z.string()).optional().describe('Array de interesses'),
  exclusions: z.string().optional().describe('Exclusões demográficas'),
});
export type Audience = z.infer<typeof AudienceSchema>;

export const CreativesSchema = z.object({
  format: z.string().describe('Ex: "Imagem/Vídeo", "Carrossel"'),
  suggestions: z.array(z.string()).describe('Array de sugestões de criativo'),
});
export type Creatives = z.infer<typeof CreativesSchema>;

export const AdSetSchema = z.object({
  id: z.string().describe('ID único (UUID)'),
  name: z.string().describe('Nome do ad set'),
  objective: z.string().describe('Objetivo do ad set (ex: "Tráfego")'),
  audience: AudienceSchema,
  placements: z.array(z.string()).optional().describe('Posicionamentos (Feed, Stories, etc)'),
  schedule: z.string().optional().describe('Agendamento (ex: "Contínuo", "Datas específicas")'),
  cta: z.string().optional().describe('Call-to-action (ex: "Saiba Mais")'),
  link: z.string().optional().describe('URL de destino'),
  creatives: CreativesSchema.optional(),
});
export type AdSet = z.infer<typeof AdSetSchema>;

export const CampaignSchema = z.object({
  id: z.string().describe('ID único (UUID)'),
  platform: z.string().describe('"Meta" ou "Google"'),
  type: z.string().describe('Tipo de campanha (ex: "Tráfego")'),
  objective: z.string().describe('Objetivo geral da campanha'),
  name: z.string().describe('Nome da campanha'),
  dailyBudget: z.number().describe('Orçamento diário (R$)'),
  monthlyBudget: z.number().describe('Orçamento mensal (R$)'),
  adSets: z.array(AdSetSchema).describe('Array de conjuntos de anúncios'),
});
export type Campaign = z.infer<typeof CampaignSchema>;

export const PlanSummarySchema = z.object({
  clientName: z.string().describe('Nome do cliente/restaurante'),
  segment: z.string().describe('Segmento (ex: "Gastronomia premium")'),
  monthlyBudget: z.number().describe('Orçamento total mensal'),
  dailyBudget: z.number().describe('Orçamento total diário'),
  platforms: z.array(z.string()).describe('Plataformas selecionadas'),
  period: z.string().describe('Período do plano'),
  mainObjective: z.string().describe('Objetivo principal do plano'),
});
export type PlanSummary = z.infer<typeof PlanSummarySchema>;

export const KPISchema = z.object({
  name: z.string().describe('Nome do KPI'),
  target: z.string().describe('Meta do KPI'),
});
export type KPI = z.infer<typeof KPISchema>;

export const PlanSchema = z.object({
  id: z.string().describe('ID único do plano'),
  summary: PlanSummarySchema,
  campaigns: z.array(CampaignSchema).optional().describe('Array de campanhas'),
  strategy_notes: z.array(z.string()).optional().describe('Notas estratégicas'),
  kpis: z.array(KPISchema).optional().describe('Array de KPIs'),
  createdAt: z.string().optional().describe('Data de criação (ISO 8601 string)'),
  updatedAt: z.string().optional().describe('Data de atualização (ISO 8601 string)'),
  clientId: z.string().optional().describe('ID do cliente (opcional)'),
});
export type Plan = z.infer<typeof PlanSchema>;

export type GenerateStrategicPlanOutput = Plan;
