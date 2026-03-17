"use client";

import { Sparkles } from 'lucide-react';

export function LoadingStep() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground">
      <div className="relative">
        <Sparkles className="text-primary h-24 w-24 animate-spin-slow" />
        <Sparkles className="text-accent h-16 w-16 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-spin-slow-reverse" />
      </div>
      <h2 className="mt-8 text-3xl font-headline font-bold">Gerando seu planejamento...</h2>
      <p className="mt-2 text-lg text-muted-foreground">A IA está criando campanhas, públicos e criativos personalizados.</p>

      <style jsx>{`
        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        .animate-spin-slow {
          animation: spin-slow 3s linear infinite;
        }
        @keyframes spin-slow-reverse {
          from {
            transform: rotate(360deg);
          }
          to {
            transform: rotate(0deg);
          }
        }
        .animate-spin-slow-reverse {
          animation: spin-slow-reverse 5s linear infinite;
        }
      `}</style>
    </div>
  );
}
