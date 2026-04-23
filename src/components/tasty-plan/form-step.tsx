"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormDataSchema, type FormData, type ParseBriefingOutput } from '@/lib/definitions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Upload, Wand2, FileText, Utensils, DollarSign, Target } from 'lucide-react';
import { formatCurrency } from '@/lib/formatters';

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
      managerDirection: '',
      notes: '',
      platforms: ['Meta'],
      ...initialData,
    },
  });

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
        managerDirection: form.getValues('managerDirection'),
        notes: parsedData.notes || form.getValues('notes'),
        platforms: parsedData.platforms?.length ? parsedData.platforms : form.getValues('platforms'),
      });
    }
    setIsParsing(false);
    // Reset file input
    event.target.value = '';
  };

  return (
    <main className="container mx-auto max-w-3xl py-12 px-4">
      <div className="text-center mb-10">
        <h1 className="font-headline text-5xl font-bold text-primary">Tasty Plan</h1>
        <p className="text-xl text-muted-foreground mt-2">Gere um planejamento estratégico de tráfego em minutos.</p>
      </div>

      <div className="border-2 border-dashed border-primary/30 rounded-xl p-8 mb-8 bg-primary/5">
        <div className="text-center">
          <div className="flex justify-center items-center mb-4">
            <div className="bg-primary/10 p-3 rounded-full">
              <Upload className="h-8 w-8 text-primary" />
            </div>
          </div>
          <h2 className="text-xl font-semibold">Importar Briefing do Cliente</h2>
          <p className="text-muted-foreground mt-1 mb-4">
            Envie um arquivo .docx, .txt ou .json e os campos serão preenchidos automaticamente
          </p>
          <Button variant="outline" className="w-full max-w-xs mx-auto" disabled={isParsing} onClick={() => document.getElementById('briefing-file-input')?.click()}>
            <FileText className="mr-2" />
            {isParsing ? 'Processando...' : 'Selecionar Arquivo'}
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
      </div>

      <div className="relative mb-8">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="bg-background px-3 text-muted-foreground">
            ou preencha manualmente
          </span>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Utensils className="text-primary" />
                Dados do Cliente
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="clientName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome do cliente / restaurante *</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: Espaço Cheia de Graça" {...field} />
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
                        <Input placeholder="Ex: Gastronomia premium, Pizzaria, Bar" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <DollarSign className="text-primary" />
                Orçamento & Plataformas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="monthlyBudget"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Orçamento mensal total (R$) *</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} onChange={e => field.onChange(e.target.value === '' ? '' : Number(e.target.value))} />
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
                    <FormLabel>Plataformas *</FormLabel>
                    <FormDescription>Selecione onde as campanhas serão veiculadas.</FormDescription>
                    <div className="flex items-center space-x-6 pt-2">
                      {['Meta', 'Google'].map((item) => (
                        <FormField
                          key={item}
                          control={form.control}
                          name="platforms"
                          render={({ field }) => (
                            <FormItem
                              key={item}
                              className="flex flex-row items-center space-x-3 space-y-0"
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
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Target className="text-primary" />
                Objetivos & Detalhes
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="managerDirection"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-primary font-semibold">Direcionamento Prévio do Gestor</FormLabel>
                    <FormDescription>
                      Descreva sua expertise empírica e o direcionamento estratégico que deve nortear o planejamento. Este campo orienta e tem prioridade máxima na geração da estratégia via IA.
                    </FormDescription>
                    <FormControl>
                      <Textarea placeholder="Ex: Focar o orçamento inicial 70% na campanha de conversão para público quente usando ofertas de combos e os criativos X..." className="min-h-[100px]" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="goals"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Objetivos Principais *</FormLabel>
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
            </CardContent>
          </Card>

          <Button type="submit" className="w-full h-12 text-lg" disabled={form.formState.isSubmitting}>
            <Wand2 className="mr-2" />
            {form.formState.isSubmitting ? 'Gerando...' : 'Gerar Planejamento com IA'}
          </Button>
        </form>
      </Form>
    </main>
  );
}
