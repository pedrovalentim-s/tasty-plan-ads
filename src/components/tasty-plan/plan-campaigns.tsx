"use client";

import type { Plan, Campaign, AdSet } from '@/lib/definitions';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Bot, Trash2, PlusCircle, ChevronsUpDown } from 'lucide-react';
import { EditableField } from './editable-field';
import { TagList } from './tag-list';
import { formatCurrency } from '@/lib/formatters';

interface PlanCampaignsProps {
    plan: Plan;
    onPlanChange: (newPlan: Plan) => void;
    isPresentation: boolean;
    openCampaigns: string[];
    setOpenCampaigns: (ids: string[]) => void;
}

export function PlanCampaigns({ plan, onPlanChange, isPresentation, openCampaigns, setOpenCampaigns }: PlanCampaignsProps) {

    const handleFieldChange = (path: string, value: any) => {
        const keys = path.split('.');
        const newPlan = JSON.parse(JSON.stringify(plan));
        let current: any = newPlan;
        for (let i = 0; i < keys.length - 1; i++) {
            current = current[keys[i]];
        }
        current[keys[keys.length - 1]] = value;
        onPlanChange(newPlan);
    };

    const handleBudgetChange = (campaignIndex: number, field: 'dailyBudget' | 'monthlyBudget', value: number) => {
        const newPlan = JSON.parse(JSON.stringify(plan));
        const campaign = newPlan.campaigns[campaignIndex];

        if (isNaN(value) || value < 0) return;

        if (field === 'monthlyBudget') {
            campaign.monthlyBudget = value;
            campaign.dailyBudget = parseFloat((value / 30).toFixed(2));
        } else { // field === 'dailyBudget'
            campaign.dailyBudget = value;
            campaign.monthlyBudget = parseFloat((value * 30).toFixed(2));
        }
        
        onPlanChange(newPlan);
    };

    const addCampaign = (platform: 'Meta' | 'Google') => {
        const newCampaign: Campaign = {
            id: crypto.randomUUID(),
            platform,
            type: 'Tráfego',
            name: `Nova Campanha ${platform}`,
            objective: 'Objetivo da nova campanha',
            dailyBudget: 10,
            monthlyBudget: 300,
            adSets: [],
        };
        const newPlan = { ...plan, campaigns: [...plan.campaigns, newCampaign] };
        onPlanChange(newPlan);
        setOpenCampaigns([...openCampaigns, newCampaign.id]);
    };
    
    const removeCampaign = (campaignId: string) => {
        const newPlan = { ...plan, campaigns: plan.campaigns.filter(c => c.id !== campaignId) };
        onPlanChange(newPlan);
    };

    const addAdSet = (campaignIndex: number) => {
        const newAdSet: AdSet = {
            id: crypto.randomUUID(),
            name: 'Novo Conjunto de Anúncios',
            objective: 'Definir objetivo',
            audience: { type: 'Personalizado', description: '', location: '', interests: [], exclusions: '' },
            placements: ['Feed', 'Stories'],
            schedule: 'Contínuo',
            cta: 'Saiba Mais',
            link: '',
            creatives: { format: 'Imagem/Vídeo', suggestions: [] },
        };
        const newPlan = JSON.parse(JSON.stringify(plan));
        newPlan.campaigns[campaignIndex].adSets.push(newAdSet);
        onPlanChange(newPlan);
    };

    const removeAdSet = (campaignIndex: number, adSetId: string) => {
        const newPlan = JSON.parse(JSON.stringify(plan));
        newPlan.campaigns[campaignIndex].adSets = newPlan.campaigns[campaignIndex].adSets.filter((as: AdSet) => as.id !== adSetId);
        onPlanChange(newPlan);
    };

    return (
        <section className="mt-8">
            <div className="flex justify-between items-center mb-4">
                <h2 className="font-headline text-2xl font-bold">Campanhas</h2>
                {!isPresentation && (
                    <div className="flex gap-2">
                        <Button onClick={() => addCampaign('Meta')}>+ Adicionar Meta</Button>
                        <Button onClick={() => addCampaign('Google')}>+ Adicionar Google</Button>
                    </div>
                )}
            </div>

            <Accordion type="multiple" value={openCampaigns} onValueChange={setOpenCampaigns} className="space-y-4">
                {plan.campaigns.map((campaign, cIndex) => (
                    <AccordionItem key={campaign.id} value={campaign.id} className="border-none">
                        <Card className="overflow-hidden">
                            <AccordionTrigger className="p-4 hover:no-underline data-[state=open]:bg-muted/50 transition-colors">
                                <div className="flex items-center gap-4 w-full">
                                    <div className="flex items-center gap-2 flex-1">
                                        <Badge variant={campaign.platform === 'Meta' ? 'default' : 'destructive'}>{campaign.platform}</Badge>
                                        <EditableField
                                            value={campaign.type}
                                            onSave={(value) => handleFieldChange(`campaigns.${cIndex}.type`, value)}
                                            isPresentation={isPresentation}
                                            displayValue={<Badge variant="secondary" className="hover:bg-secondary/80">{campaign.type}</Badge>}
                                            className="inline-flex m-0 p-0 hover:bg-transparent"
                                            inputClassName="w-24 h-6 text-xs px-1 py-0 my-0 border-primary"
                                        />
                                        <EditableField
                                            value={campaign.name}
                                            onSave={(value) => handleFieldChange(`campaigns.${cIndex}.name`, value)}
                                            isPresentation={isPresentation}
                                            className="font-bold text-lg"
                                        />
                                    </div>
                                    <div className="text-right">
                                        <EditableField
                                            value={campaign.dailyBudget}
                                            displayValue={`${formatCurrency(campaign.dailyBudget)}/dia`}
                                            onSave={(v) => handleBudgetChange(cIndex, 'dailyBudget', Number(v))}
                                            isPresentation={isPresentation}
                                            type="number"
                                            className="font-bold text-lg text-right"
                                            inputClassName="text-right"
                                        />
                                        <EditableField
                                            value={campaign.monthlyBudget}
                                            displayValue={`${formatCurrency(campaign.monthlyBudget)}/mês`}
                                            onSave={(v) => handleBudgetChange(cIndex, 'monthlyBudget', Number(v))}
                                            isPresentation={isPresentation}
                                            type="number"
                                            className="text-sm text-muted-foreground text-right"
                                            inputClassName="text-right"
                                        />
                                    </div>
                                    {!isPresentation && (
                                        <div
                                            role="button"
                                            aria-label="Remove campaign"
                                            onClick={(e) => { e.stopPropagation(); removeCampaign(campaign.id); }}
                                            className="p-2 rounded-full text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                                        >
                                            <Trash2 size={18} />
                                        </div>
                                    )}
                                </div>
                            </AccordionTrigger>
                            <AccordionContent>
                                <div className="p-4 bg-muted/20 space-y-6">
                                    {campaign.adSets.map((adSet, asIndex) => (
                                        <Card key={adSet.id}>
                                            <CardContent className="p-4">
                                                <div className="flex justify-between items-start mb-4">
                                                    <EditableField
                                                        value={adSet.name}
                                                        onSave={(v) => handleFieldChange(`campaigns.${cIndex}.adSets.${asIndex}.name`, v)}
                                                        isPresentation={isPresentation}
                                                        className="font-bold text-md"
                                                    />
                                                    {!isPresentation && (
                                                        <Button variant="ghost" size="icon" className="h-8 w-8 -mt-2 -mr-2" onClick={() => removeAdSet(cIndex, adSet.id)}>
                                                            <Trash2 size={16} className="text-muted-foreground" />
                                                        </Button>
                                                    )}
                                                </div>
                                                <div className="grid md:grid-cols-3 gap-6 text-sm">
                                                    <div>
                                                        <h4 className="font-semibold mb-2">Objetivo</h4>
                                                        <EditableField value={adSet.objective} onSave={(v) => handleFieldChange(`campaigns.${cIndex}.adSets.${asIndex}.objective`, v)} isPresentation={isPresentation} />
                                                    </div>
                                                    <div>
                                                        <h4 className="font-semibold mb-2">Público</h4>
                                                        <EditableField value={adSet.audience.description} multiline onSave={(v) => handleFieldChange(`campaigns.${cIndex}.adSets.${asIndex}.audience.description`, v)} isPresentation={isPresentation} />
                                                    </div>
                                                    <div>
                                                        <h4 className="font-semibold mb-2">Localização</h4>
                                                        <EditableField value={adSet.audience.location} onSave={(v) => handleFieldChange(`campaigns.${cIndex}.adSets.${asIndex}.audience.location`, v)} isPresentation={isPresentation} />
                                                    </div>
                                                    <div>
                                                        <h4 className="font-semibold mb-2">Posicionamentos</h4>
                                                        <TagList tags={adSet.placements} onTagsChange={(tags) => handleFieldChange(`campaigns.${cIndex}.adSets.${asIndex}.placements`, tags)} isPresentation={isPresentation} />
                                                    </div>
                                                    <div>
                                                        <h4 className="font-semibold mb-2">CTA</h4>
                                                        <EditableField value={adSet.cta} onSave={(v) => handleFieldChange(`campaigns.${cIndex}.adSets.${asIndex}.cta`, v)} isPresentation={isPresentation} />
                                                    </div>
                                                    <div>
                                                        <h4 className="font-semibold mb-2">Criativos ({adSet.creatives.format})</h4>
                                                        <TagList title="Sugestões" tags={adSet.creatives.suggestions} onTagsChange={(tags) => handleFieldChange(`campaigns.${cIndex}.adSets.${asIndex}.creatives.suggestions`, tags)} isPresentation={isPresentation} variant="vertical" />
                                                    </div>
                                                </div>
                                                <Separator className="my-4" />
                                                <div>
                                                    <h4 className="font-semibold mb-2">Interesses</h4>
                                                    <TagList tags={adSet.audience.interests} onTagsChange={(tags) => handleFieldChange(`campaigns.${cIndex}.adSets.${asIndex}.audience.interests`, tags)} isPresentation={isPresentation} />
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                     {!isPresentation && (
                                        <Button variant="outline" className="w-full" onClick={() => addAdSet(cIndex)}>
                                            <PlusCircle size={16} className="mr-2" /> Adicionar Conjunto de Anúncios
                                        </Button>
                                    )}
                                </div>
                            </AccordionContent>
                        </Card>
                    </AccordionItem>
                ))}
            </Accordion>
        </section>
    );
}
