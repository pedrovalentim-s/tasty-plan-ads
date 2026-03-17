"use client";

import { Button } from '@/components/ui/button';
import { ArrowLeft, Presentation, Copy, Info, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PlanHeaderToolbarProps {
  onBack: () => void;
  isPresentation: boolean;
  setIsPresentation: (isPresentation: boolean) => void;
}

export function PlanHeaderToolbar({ onBack, isPresentation, setIsPresentation }: PlanHeaderToolbarProps) {
  const { toast } = useToast();

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({
      title: 'Link copiado!',
      description: 'O link para este planejamento foi copiado para a área de transferência.',
    });
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
