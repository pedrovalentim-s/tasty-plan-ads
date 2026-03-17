"use client";

import { useState } from 'react';
import type { Plan, Campaign, AdSet, KPI } from '@/lib/definitions';
import { PlanHeaderToolbar } from './plan-header-toolbar';
import { PlanSummary } from './plan-summary';
import { PlanCampaigns } from './plan-campaigns';
import { PlanNotes } from './plan-notes';
import { PlanKPIs } from './plan-kpis';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Zap, Target, BarChart3, TrendingUp } from 'lucide-react';
import { EditableField } from './editable-field';
import { useToast } from '@/hooks/use-toast';

interface PlanStepProps {
  plan: Plan;
  onPlanChange: (newPlan: Plan) => void;
  onBack: () => void;
}

export function PlanStep({ plan: initialPlan, onPlanChange, onBack }: PlanStepProps) {
  const [plan, setPlan] = useState(initialPlan);
  const [isPresentation, setIsPresentation] = useState(false);
  const [openCampaigns, setOpenCampaigns] = useState<string[]>(plan.campaigns.map(c => c.id));
  const { toast } = useToast();

  const handleUpdate = (newPlan: Plan) => {
    setPlan(newPlan);
    onPlanChange(newPlan);
  };
  
  const handleFieldChange = (path: string, value: any) => {
    const keys = path.split('.');
    const newPlan = JSON.parse(JSON.stringify(plan));
    let current = newPlan;
    for (let i = 0; i < keys.length - 1; i++) {
      current = current[keys[i]];
    }
    current[keys[keys.length - 1]] = value;
    handleUpdate(newPlan);
  };

  const recalculateSummary = () => {
    const monthlyBudget = plan.campaigns.reduce((sum, campaign) => sum + campaign.monthlyBudget, 0);
    const dailyBudget = monthlyBudget / 30;
    
    const newPlan = {
      ...plan,
      summary: {
        ...plan.summary,
        monthlyBudget: monthlyBudget,
        dailyBudget: dailyBudget,
      }
    };
    handleUpdate(newPlan);
    toast({
      title: "Orçamento recalculado!",
      description: "Os totais do resumo foram atualizados com base nas campanhas.",
    });
  }

  return (
    <div className={`bg-background min-h-screen pb-24 ${isPresentation ? 'presentation-mode' : ''}`}>
      <PlanHeaderToolbar
        onBack={onBack}
        isPresentation={isPresentation}
        setIsPresentation={setIsPresentation}
      />
      <main className="container mx-auto max-w-6xl mt-8 px-4">
        <header className="mb-10 text-center">
            <div className="inline-flex items-center gap-2">
                <Badge variant="outline" className="text-primary border-primary gap-1 pl-2 pr-3">
                    <Zap size={14} className="text-primary" /> HYPER DIGITAL
                </Badge>
            </div>
            <h1 className="font-headline text-4xl md:text-5xl font-bold mt-2">Planejamento Estratégico</h1>
            <EditableField
                value={plan.summary.clientName}
                onSave={(value) => handleFieldChange('summary.clientName', value)}
                isPresentation={isPresentation}
                className="text-2xl md:text-3xl text-muted-foreground mt-1 text-center"
                inputClassName="text-center"
            />
        </header>

        <PlanSummary summary={plan.summary} campaigns={plan.campaigns} onRecalculate={recalculateSummary} onFieldChange={handleFieldChange} isPresentation={isPresentation} />

        <section className="mt-10">
          <div className="bg-card p-6 rounded-lg shadow-sm">
            <h2 className="flex items-center gap-2 font-headline text-2xl font-bold mb-4">
                <Target className="text-primary" /> Objetivo Principal
            </h2>
            <EditableField
              value={plan.summary.mainObjective}
              onSave={(value) => handleFieldChange('summary.mainObjective', value)}
              isPresentation={isPresentation}
              multiline
              className="text-lg text-muted-foreground"
            />
          </div>
        </section>

        <PlanCampaigns plan={plan} onPlanChange={handleUpdate} isPresentation={isPresentation} openCampaigns={openCampaigns} setOpenCampaigns={setOpenCampaigns} />
        
        <div className="grid md:grid-cols-2 gap-8 mt-8">
            <PlanNotes plan={plan} onPlanChange={handleUpdate} isPresentation={isPresentation} />
            <PlanKPIs plan={plan} onPlanChange={handleUpdate} isPresentation={isPresentation} />
        </div>
        
        <footer className="text-center mt-16 text-sm text-muted-foreground">
            <p>Planejamento gerado por Hyper Digital</p>
        </footer>

      </main>
      <style jsx>{`
        .presentation-mode {
          --background: 0 0% 100%;
        }
      `}</style>
    </div>
  );
}
