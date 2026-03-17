"use client";

import { useState } from 'react';
import type { Plan, FormData } from '@/lib/definitions';
import { FormStep } from './form-step';
import { LoadingStep } from './loading-step';
import { PlanStep } from './plan-step';
import { generateStrategicPlan, parseBriefingAction } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import type { ParseBriefingOutput } from '@/ai/flows/parse-briefing';

type Step = 'form' | 'loading' | 'plan';

export function TastyPlanApp() {
  const [step, setStep] = useState<Step>('form');
  const [plan, setPlan] = useState<Plan | null>(null);
  const [formData, setFormData] = useState<Partial<FormData>>({});
  const { toast } = useToast();

  const handleFormSubmit = async (data: FormData) => {
    setStep('loading');
    setFormData(data);
    try {
      const result = await generateStrategicPlan(data);
      if (result) {
        setPlan(result);
        setStep('plan');
        toast({
          title: 'Sucesso!',
          description: 'Seu planejamento estratégico foi gerado.',
        });
      } else {
        throw new Error('A IA não retornou um plano.');
      }
    } catch (error) {
      console.error('Error generating plan:', error);
      toast({
        variant: 'destructive',
        title: 'Erro ao gerar o plano',
        description: 'Houve um problema com a IA. Por favor, tente novamente.',
      });
      setStep('form');
    }
  };

  const handleFileParse = async (file: File): Promise<ParseBriefingOutput | null> => {
    try {
      const result = await parseBriefingAction(file);
      toast({
        title: 'Briefing importado!',
        description: 'O formulário foi preenchido com os dados do arquivo.',
      });
      return result;
    } catch (error) {
      console.error('Error parsing file:', error);
      toast({
        variant: 'destructive',
        title: 'Erro ao processar o arquivo',
        description: (error as Error).message || 'Houve um problema ao ler o arquivo.',
      });
      return null;
    }
  };

  const handleBackToForm = () => {
    setPlan(null);
    setStep('form');
  };

  const handlePlanChange = (newPlan: Plan) => {
    setPlan(newPlan);
  };

  return (
    <div className="min-h-screen w-full">
      {step === 'form' && (
        <FormStep
          initialData={formData}
          onSubmit={handleFormSubmit}
          onFileParse={handleFileParse}
        />
      )}
      {step === 'loading' && <LoadingStep />}
      {step === 'plan' && plan && (
        <PlanStep
          plan={plan}
          onPlanChange={handlePlanChange}
          onBack={handleBackToForm}
        />
      )}
    </div>
  );
}
