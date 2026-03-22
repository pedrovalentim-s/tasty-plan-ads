"use client";

import { useState, useEffect } from 'react';
import type { Plan, FormData as AppFormData, ParseBriefingOutput } from '@/lib/definitions';
import { FormStep } from './form-step';
import { LoadingStep } from './loading-step';
import { PlanStep } from './plan-step';
import { generateStrategicPlan, parseBriefingAction } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { createStrategy, updateStrategy } from '@/lib/firebase/firestore';

type Step = 'form' | 'loading' | 'plan';

interface TastyPlanAppProps {
  initialPlan?: Plan | null;
  strategyId?: string;
}

export function TastyPlanApp({ initialPlan, strategyId }: TastyPlanAppProps) {
  const [step, setStep] = useState<Step>(initialPlan ? 'plan' : 'form');
  const [plan, setPlan] = useState<Plan | null>(initialPlan || null);
  const [currentStrategyId, setCurrentStrategyId] = useState<string | undefined>(strategyId);
  const [formData, setFormData] = useState<Partial<AppFormData>>({});
  const { toast } = useToast();

  useEffect(() => {
    if (initialPlan) {
      setPlan(initialPlan);
      setStep('plan');
      setCurrentStrategyId(strategyId);
    } else {
      setPlan(null);
      setStep('form');
      setCurrentStrategyId(undefined);
    }
  }, [initialPlan, strategyId]);

  const handleFormSubmit = async (data: AppFormData) => {
    setStep('loading');
    setFormData(data);
    try {
      const result = await generateStrategicPlan(data);
      if (result) {
        // Save to Firestore explicitly
        const id = await createStrategy(result);
        setCurrentStrategyId(id);
        result.id = id;
        
        setPlan(result);
        setStep('plan');
        toast({
          title: 'Sucesso!',
          description: 'Seu planejamento estratégico foi gerado e salvo.',
        });
        // Dispatch custom event to notify sidebar
        window.dispatchEvent(new Event('strategyListUpdated'));
        // Update URL to match strategy id smoothly
        window.history.pushState(null, '', `/strategies/${id}`);
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
      const uploadData = new FormData();
      uploadData.append('file', file);
      const result = await parseBriefingAction(uploadData);
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

  const handlePlanChange = async (newPlan: Plan) => {
    setPlan(newPlan);
    if (currentStrategyId) {
      try {
         await updateStrategy(currentStrategyId, newPlan);
         // Dispatch list update just in case client name changed
         window.dispatchEvent(new Event('strategyListUpdated'));
      } catch (err) {
         console.error('Failed to auto-save', err);
      }
    }
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
