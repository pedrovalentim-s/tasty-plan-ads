import { getStrategy } from '@/lib/firebase/firestore';
import { TastyPlanApp } from '@/components/tasty-plan/tasty-plan-app';
import { notFound } from 'next/navigation';

interface StrategyPageProps {
  params: Promise<{ id: string }>;
}

export default async function StrategyPage({ params }: StrategyPageProps) {
  const resolvedParams = await params;
  const strategy = await getStrategy(resolvedParams.id);

  if (!strategy) {
    notFound();
  }

  return <TastyPlanApp initialPlan={strategy.planData} strategyId={strategy.id} />;
}
