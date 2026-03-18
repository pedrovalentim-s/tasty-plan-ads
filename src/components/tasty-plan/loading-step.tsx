"use client";

import { Sparkles } from 'lucide-react';
import { useEffect, useState } from 'react';

export function LoadingStep() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground">
      <h2 className="font-headline text-3xl font-bold text-primary">Gerando seu planejamento...</h2>
      <p className="text-lg text-muted-foreground mt-2">Aguarde, a criatividade está a todo vapor!</p>
      <div className="flex space-x-2 mt-8">
        <div className="w-4 h-4 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]"></div>
        <div className="w-4 h-4 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]"></div>
        <div className="w-4 h-4 bg-primary rounded-full animate-bounce"></div>
      </div>
    </div>
  );
}
