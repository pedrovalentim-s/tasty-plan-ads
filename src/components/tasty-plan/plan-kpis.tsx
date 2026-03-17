"use client";

import type { Plan, KPI } from '@/lib/definitions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TrendingUp, PlusCircle, Trash2 } from 'lucide-react';
import { EditableField } from './editable-field';

interface PlanKPIsProps {
    plan: Plan;
    onPlanChange: (newPlan: Plan) => void;
    isPresentation: boolean;
}

export function PlanKPIs({ plan, onPlanChange, isPresentation }: PlanKPIsProps) {
    
    const handleKPIChange = (index: number, field: keyof KPI, value: string) => {
        const newKPIs = [...plan.kpis];
        newKPIs[index] = { ...newKPIs[index], [field]: value };
        onPlanChange({ ...plan, kpis: newKPIs });
    };

    const addKPI = () => {
        onPlanChange({ ...plan, kpis: [...plan.kpis, { name: 'Novo KPI', target: 'Definir meta' }] });
    };

    const removeKPI = (index: number) => {
        const newKPIs = plan.kpis.filter((_, i) => i !== index);
        onPlanChange({ ...plan, kpis: newKPIs });
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="text-primary" /> KPIs & Metas
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid sm:grid-cols-2 gap-4">
                    {plan.kpis.map((kpi, index) => (
                        <div key={index} className="bg-muted/50 p-4 rounded-lg group relative">
                            <EditableField
                                value={kpi.name}
                                onSave={(value) => handleKPIChange(index, 'name', String(value))}
                                isPresentation={isPresentation}
                                className="text-sm text-muted-foreground"
                            />
                            <EditableField
                                value={kpi.target}
                                onSave={(value) => handleKPIChange(index, 'target', String(value))}
                                isPresentation={isPresentation}
                                className="text-xl font-bold mt-1"
                            />
                             {!isPresentation && (
                                <Button variant="ghost" size="icon" className="absolute top-1 right-1 h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => removeKPI(index)}>
                                    <Trash2 size={14} className="text-muted-foreground" />
                                </Button>
                            )}
                        </div>
                    ))}
                </div>
                {!isPresentation && (
                    <Button variant="outline" className="w-full mt-6" onClick={addKPI}>
                        <PlusCircle size={16} className="mr-2" /> Adicionar KPI
                    </Button>
                )}
            </CardContent>
        </Card>
    );
}
