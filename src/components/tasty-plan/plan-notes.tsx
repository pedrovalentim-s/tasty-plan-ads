"use client";

import type { Plan } from '@/lib/definitions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart3, PlusCircle, Trash2 } from 'lucide-react';
import { EditableField } from './editable-field';

interface PlanNotesProps {
    plan: Plan;
    onPlanChange: (newPlan: Plan) => void;
    isPresentation: boolean;
}

export function PlanNotes({ plan, onPlanChange, isPresentation }: PlanNotesProps) {
    
    const handleNoteChange = (index: number, value: string) => {
        const newNotes = [...plan.strategy_notes];
        newNotes[index] = value;
        onPlanChange({ ...plan, strategy_notes: newNotes });
    };

    const addNote = () => {
        onPlanChange({ ...plan, strategy_notes: [...plan.strategy_notes, 'Nova nota estratégica'] });
    };

    const removeNote = (index: number) => {
        const newNotes = plan.strategy_notes.filter((_, i) => i !== index);
        onPlanChange({ ...plan, strategy_notes: newNotes });
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="text-primary" /> Notas Estratégicas
                </CardTitle>
            </CardHeader>
            <CardContent>
                <ul className="space-y-4">
                    {plan.strategy_notes.map((note, index) => (
                        <li key={index} className="flex items-start gap-3 group">
                            <span className="text-primary font-bold mt-1">→</span>
                            <div className="flex-1">
                                <EditableField
                                    value={note}
                                    onSave={(value) => handleNoteChange(index, String(value))}
                                    isPresentation={isPresentation}
                                    multiline
                                />
                            </div>
                            {!isPresentation && (
                                <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => removeNote(index)}>
                                    <Trash2 size={16} className="text-muted-foreground" />
                                </Button>
                            )}
                        </li>
                    ))}
                </ul>
                {!isPresentation && (
                    <Button variant="outline" className="w-full mt-6" onClick={addNote}>
                        <PlusCircle size={16} className="mr-2" /> Adicionar Nota
                    </Button>
                )}
            </CardContent>
        </Card>
    );
}
