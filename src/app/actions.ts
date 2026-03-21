"use server";

import { generateStrategicPlan as generateStrategicPlanFlow } from '@/ai/flows/generate-strategic-plan';
import { parseBriefing as parseBriefingFlow } from '@/ai/flows/parse-briefing';
import type { Plan, FormData, ParseBriefingOutput } from '@/lib/definitions';
import mammoth from 'mammoth';

export async function parseBriefingAction(uploadData: globalThis.FormData): Promise<ParseBriefingOutput> {
  const file = uploadData.get('file') as File;
  if (!file) throw new Error('Nenhum arquivo enviado para o servidor.');
  
  let fileContent = '';
  const fileBuffer = Buffer.from(await file.arrayBuffer());

  if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
    const { value } = await mammoth.extractRawText({ buffer: fileBuffer });
    fileContent = value;
  } else if (file.type === 'text/plain' || file.type === 'application/json') {
    fileContent = fileBuffer.toString('utf-8');
  } else {
    throw new Error('Formato de arquivo não suportado. Use .docx, .txt ou .json');
  }

  if (!fileContent.trim()) {
    throw new Error('O arquivo está vazio ou não pôde ser lido.');
  }

  return await parseBriefingFlow({
    fileContent: fileContent,
    fileName: file.name,
  });
}

export async function generateStrategicPlan(data: FormData): Promise<Plan> {
  const result = await generateStrategicPlanFlow({
    clientName: data.clientName,
    segment: data.segment || 'Não especificado',
    monthlyBudget: data.monthlyBudget,
    goals: data.goals,
    notes: data.notes || '',
    platforms: data.platforms,
  });
  
  if (!result) {
    throw new Error('Falha ao gerar o plano estratégico.');
  }

  return result;
}
