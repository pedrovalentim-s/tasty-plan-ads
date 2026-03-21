"use client";
import type { PlanSummary as TPlanSummary, Campaign } from "@/lib/definitions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, TrendingUp, Megaphone, Users, RefreshCw } from "lucide-react";
import { EditableField } from "./editable-field";
import { formatCurrency } from "@/lib/formatters";
import { Button } from "../ui/button";

interface PlanSummaryProps {
    summary: TPlanSummary;
    campaigns: Campaign[];
    onRecalculate: () => void;
    onFieldChange: (path: string, value: any) => void;
    isPresentation: boolean;
}

export function PlanSummary({ summary, campaigns, onRecalculate, onFieldChange, isPresentation }: PlanSummaryProps) {
    
    const totalAdSets = campaigns.reduce((acc, campaign) => acc + campaign.adSets.length, 0);

    const summaryItems = [
        { icon: DollarSign, title: "Verba Mensal", value: summary.monthlyBudget, field: "summary.monthlyBudget", format: formatCurrency, extra: (
          <Button variant="link" size="sm" className="p-0 h-auto text-xs" onClick={onRecalculate} disabled={isPresentation}>
              <RefreshCw size={12} className="mr-1"/> Recalcular das campanhas
          </Button>
        )},
        { icon: TrendingUp, title: "Verba Diária", value: summary.dailyBudget, field: "summary.dailyBudget", format: (v) => `${formatCurrency(v)}`, extra: "Calculado de mensal/30" },
        { icon: Megaphone, title: "Campanhas", value: campaigns.length, field: null },
        { icon: Users, title: "Conjuntos de Anúncios", value: totalAdSets, field: null },
    ];

    return (
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {summaryItems.map((item, index) => (
                <Card key={index}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">{item.title}</CardTitle>
                        <item.icon className="h-5 w-5 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        {item.field ? (
                            <EditableField
                                value={item.value}
                                displayValue={item.format && typeof item.value === 'number' ? item.format(item.value) : undefined}
                                onSave={(value) => onFieldChange(item.field!, value)}
                                isPresentation={isPresentation}
                                type="number"
                                className="text-2xl font-bold"
                            />
                        ) : (
                            <div className="text-2xl font-bold">{item.value}</div>
                        )}
                        {typeof item.extra === 'string' ? <p className="text-xs text-muted-foreground">{item.extra}</p> : item.extra}
                    </CardContent>
                </Card>
            ))}
        </section>
    );
}
