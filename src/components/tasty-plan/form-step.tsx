"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormDataSchema, type FormData } from '@/lib/definitions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Upload, Wand2, FileText, Bot } from 'lucide-react';
import { formatCurrency } from '@/lib/formatters';
import type { ParseBriefingOutput } from '@/ai/flows/parse-briefing';

interface FormStepProps {
  initialData: Partial<FormData>;
  onSubmit: (data: FormData) => void;
  onFileParse: (file: File) => Promise<ParseBriefingOutput | null>;
}

export function FormStep({ initialData, onSubmit, onFileParse }: FormStepProps) {
  const [isParsing, setIsParsing] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(FormDataSchema),
    defaultValues: {
      clientName: '',
      segment: '',
      monthlyBudget: 1000,
      goals: '',
      notes: '',
      platforms: ['Meta'],
      ...initialData,
    },
  });

  const monthlyBudget = form.watch('monthlyBudget');
  const dailyBudget = monthlyBudget > 0 ? monthlyBudget / 30 : 0;

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsParsing(true);
    const parsedData = await onFileParse(file);
    if (parsedData) {
      form.reset({
        ...form.getValues(),
        clientName: parsedData.clientName || form.getValues('clientName'),
        segment: parsedData.segment || form.getValues('segment'),
        monthlyBudget: parsedData.monthlyBudget || form.getValues('monthlyBudget'),
        goals: parsedData.goals || form.getValues('goals'),
        notes: parsedData.notes || form.getValues('notes'),
        platforms: parsedData.platforms?.length ? parsedData.platforms : form.getValues('platforms'),
      });
    }
    setIsParsing(false);
    // Reset file input
    event.target.value = '';
  };

  return (
    <main className="container mx-auto max-w-4xl py-12 px-4">
      <div className="text-center mb-10">
        <h1 className="font-headline text-5xl font-bold text-primary">Tasty Plan</h1>
        <p className="text-xl text-muted-foreground mt-2">Gere um planejamento estratégico de tráfego em minutos.</p>
      </div>

      <div className="grid md:grid-cols-5 gap-8 items-start">
        <div className="md:col-span-2">
            <Card className="bg-primary/5 border-primary/20 sticky top-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-primary">
                  <Bot size={24} />
                  Comece com a IA
                </CardTitle>
                <CardDescription>
                  Faça o upload de um arquivo de briefing (.docx, .txt) e deixe nossa IA preencher o formulário para você.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative">
                    <Button variant="outline" className="w-full h-12 text-lg" disabled={isParsing} onClick={() => document.getElementById('briefing-file-input')?.click()}>
                        <Upload className="mr-2" />
                        {isParsing ? 'Processando Briefing...' : 'Upload do Briefing'}
                    </Button>
                    <input
                      type="file"
                      id="briefing-file-input"
                      className="hidden"
                      accept=".docx,.txt,.json"
                      onChange={handleFileChange}
                      disabled={isParsing}
                    />
                </div>
                 <p className="text-xs text-center text-muted-foreground mt-2">Suporta .docx, .txt, .json</p>
              </CardContent>
            </Card>
        </div>

        <div className="md:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText />
                Detalhes do Planejamento
              </CardTitle>
              <CardDescription>
                Preencha os campos abaixo para gerar o plano.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="clientName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome do Cliente</FormLabel>
                        <FormControl>
                          <Input placeholder="Ex: Restaurante Sabor Divino" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="segment"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Segmento</FormLabel>
                        <FormControl>
                          <Input placeholder="Ex: Gastronomia Premium, Pizzaria" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="monthlyBudget"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Orçamento Mensal (R$)</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormDescription>Orçamento diário: {formatCurrency(dailyBudget)}</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="goals"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Objetivos Principais</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Ex: Aumentar as reservas em 20%, fortalecer a presença online." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Notas Adicionais</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Ex: Focar em público local, promoções de terça-feira." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="platforms"
                    render={() => (
                      <FormItem>
                        <div className="mb-4">
                          <FormLabel className="text-base">Plataformas</FormLabel>
                          <FormDescription>Selecione onde as campanhas serão veiculadas.</FormDescription>
                        </div>
                        <div className="flex items-center space-x-6">
                          {['Meta', 'Google'].map((item) => (
                            <FormField
                              key={item}
                              control={form.control}
                              name="platforms"
                              render={({ field }) => (
                                <FormItem
                                  key={item}
                                  className="flex flex-row items-start space-x-3 space-y-0"
                                >
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value?.includes(item)}
                                      onCheckedChange={(checked) => {
                                        const newValue = checked
                                          ? [...(field.value || []), item]
                                          : (field.value || []).filter(
                                              (value) => value !== item
                                            );
                                        field.onChange(newValue);
                                      }}
                                    />
                                  </FormControl>
                                  <FormLabel className="font-normal">
                                    {item}
                                  </FormLabel>
                                </FormItem>
                              )}
                            />
                          ))}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button type="submit" className="w-full h-12 text-lg" disabled={form.formState.isSubmitting}>
                    <Wand2 className="mr-2" />
                    Gerar Planejamento com IA
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
