"use client";

import { Sparkles } from 'lucide-react';
import { useEffect, useState } from 'react';

const loadingSteps = [
  'Analisando o briefing...',
  'Definindo objetivos estratégicos...',
  'Criando campanhas para Meta & Google...',
  'Detalhando públicos-alvo...',
  'Gerando sugestões de criativos...',
  'Montando os KPIs para o sucesso...',
  'Finalizando os detalhes do plano...'
];

export function LoadingStep() {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prevStep) => (prevStep + 1) % loadingSteps.length);
    }, 2000); // Change step every 2 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground overflow-hidden">
      <div className="relative mb-8">
        <div className="absolute -inset-2 bg-gradient-to-r from-primary to-purple-600 rounded-full blur-xl opacity-50 animate-pulse"></div>
        <div className="relative bg-background p-5 rounded-full">
            <Sparkles className="text-primary h-24 w-24 animate-spin-slow" />
        </div>
      </div>
      
      <h2 className="mt-4 text-3xl font-headline font-bold">Gerando seu planejamento...</h2>
      
      <div className="mt-6 text-lg text-muted-foreground h-8 text-center transition-all duration-500 w-full max-w-lg">
          <p key={currentStep} className="animate-fade-in-out">
            {loadingSteps[currentStep]}
          </p>
      </div>

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
          animation: spin-slow 4s linear infinite;
        }

        @keyframes fade-in-out {
          0% {
            opacity: 0;
            transform: translateY(10px);
          }
          20%, 80% {
            opacity: 1;
            transform: translateY(0);
          }
          100% {
            opacity: 0;
            transform: translateY(-10px);
          }
        }
        .animate-fade-in-out {
          animation: fade-in-out 2s ease-in-out forwards;
        }
      `}</style>
    </div>
  );
}
