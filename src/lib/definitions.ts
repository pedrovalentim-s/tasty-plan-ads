import type {
  Plan,
  Campaign,
  AdSet,
  Audience,
  Creatives,
  KPI,
  PlanSummary,
} from '@/ai/flows/generate-strategic-plan';

import { z } from 'zod';

// This is the form data shape used in the frontend form
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


// Re-exporting types from the AI flow for consistency
export type {
  Plan,
  Campaign,
  AdSet,
  Audience,
  Creatives,
  KPI,
  PlanSummary,
};
