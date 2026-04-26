"use client";

import { Button } from '@/components/ui/button';
import { ArrowLeft, Presentation, Copy, Info, X, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Plan } from '@/lib/definitions';

interface PlanHeaderToolbarProps {
  onBack: () => void;
  isPresentation: boolean;
  setIsPresentation: (isPresentation: boolean) => void;
  planId?: string;
  plan?: Plan;
}

export function PlanHeaderToolbar({ onBack, isPresentation, setIsPresentation, planId, plan }: PlanHeaderToolbarProps) {
  const { toast } = useToast();

  const handleCopyLink = () => {
    let link = window.location.href;
    if (planId) {
      link = `${window.location.origin}/view/${planId}`;
    }
    navigator.clipboard.writeText(link);
    toast({
      title: 'Link copiado!',
      description: 'O link para este planejamento foi copiado para a área de transferência.',
    });
  };

  const handleExportJSON = () => {
    if (!plan) return;
    const blob = new Blob([JSON.stringify(plan, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `planejamento_${planId || 'export'}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast({ title: 'Exportado com sucesso!' });
  };

  const handleExportMD = () => {
    if (!plan) return;
    let md = `# Planejamento Estratégico - ${plan.summary?.clientName || 'Cliente'}\n\n`;
    if (plan.summary) {
        md += `## Resumo\n`;
        md += `- Objetivo Principal: ${plan.summary.mainObjective}\n`;
        md += `- Orçamento Mensal: R$ ${plan.summary.monthlyBudget}\n`;
        md += `- Orçamento Diário: R$ ${plan.summary.dailyBudget}\n\n`;
    }
    md += `## Campanhas\n\n`;
    plan.campaigns?.forEach(c => {
        md += `### ${c.name}\n`;
        md += `- Plataforma: ${c.platform}\n`;
        md += `- Tipo: ${c.type}\n`;
        md += `- Objetivo: ${c.objective}\n`;
        md += `- Orçamento Mensal: R$ ${c.monthlyBudget}\n`;
        md += `- Orçamento Diário: R$ ${c.dailyBudget}\n`;
        md += `- Conjuntos de Anúncios:\n`;
        c.adSets?.forEach(adSet => {
            md += `  - **${adSet.name}**\n`;
            md += `    - Objetivo: ${adSet.objective}\n`;
            if (adSet.audience) {
                md += `    - Público: ${adSet.audience.type} - ${adSet.audience.description}\n`;
                if (adSet.audience.location) md += `    - Localização: ${adSet.audience.location}\n`;
                if (adSet.audience.interests?.length) md += `    - Interesses: ${adSet.audience.interests.join(', ')}\n`;
            }
            if (adSet.placements?.length) md += `    - Posicionamentos: ${adSet.placements.join(', ')}\n`;
            if (adSet.creatives) {
                md += `    - Criativos (${adSet.creatives.format}): ${adSet.creatives.suggestions.join('; ')}\n`;
            }
        });
        md += '\n';
    });
    if (plan.strategy_notes && plan.strategy_notes.length > 0) {
        md += `## Notas Estratégicas\n`;
        plan.strategy_notes.forEach(n => {
            md += `- ${n}\n`;
        });
        md += '\n';
    } else if ((plan as any).notes) {
        md += `## Notas Adicionais\n${Array.isArray((plan as any).notes) ? (plan as any).notes.map((n: string) => '- ' + n).join('\n') : (plan as any).notes}\n\n`;
    }
    if (plan.kpis && plan.kpis.length > 0) {
        md += `## KPIs\n`;
        plan.kpis.forEach(kpi => {
            md += `- ${kpi.name}${kpi.target ? `: ${kpi.target}` : ''}\n`;
        });
    }
    
    const blob = new Blob([md], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `planejamento_${planId || 'export'}.md`;
    a.click();
    URL.revokeObjectURL(url);
    toast({ title: 'Exportado com sucesso!' });
  };

  if (isPresentation) {
    return (
      <div className="sticky top-0 z-50 bg-background/80 backdrop-blur-sm p-2 flex justify-end">
        <Button onClick={() => setIsPresentation(false)}>
          <X className="mr-2" /> Sair do Modo Apresentação
        </Button>
      </div>
    );
  }

  return (
    <div className="sticky top-0 z-50 bg-background/80 backdrop-blur-sm border-b">
      <div className="container mx-auto max-w-6xl flex items-center justify-between h-16 px-4">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft />
          </Button>
          <div className="hidden md:flex items-center gap-2 text-sm text-muted-foreground">
            <Info size={16} />
            <p>Clique em qualquer texto para editar.</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {plan && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <Download className="mr-2 h-4 w-4" /> Exportar
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleExportJSON}>Exportar como JSON</DropdownMenuItem>
                <DropdownMenuItem onClick={handleExportMD}>Exportar como Markdown</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
          <Button variant="outline" onClick={() => setIsPresentation(true)}>
            <Presentation className="mr-2" /> Apresentar
          </Button>
          <Button onClick={handleCopyLink}>
            <Copy className="mr-2" /> Copiar Link
          </Button>
        </div>
      </div>
    </div>
  );
}
