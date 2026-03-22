import { getStrategy } from '@/lib/firebase/firestore';
import { PlanStep } from '@/components/tasty-plan/plan-step';
import { notFound } from 'next/navigation';

interface ViewStrategyPageProps {
  params: Promise<{ id: string }>;
}

export default async function ViewStrategyPage({ params }: ViewStrategyPageProps) {
  const resolvedParams = await params;
  const strategy = await getStrategy(resolvedParams.id);

  if (!strategy) {
    notFound();
  }

  // PlanStep handles isPresentation natively if we pass a flag to presentation mode, or wrap it.
  // Wait, PlanStep takes plan, onPlanChange, onBack, but here we enforce presentation mode.
  // Actually, PlanStep manages isPresentation internally via a toolbar. We should allow overriding it via props, 
  // or we create a PresentationOnlyWrapper that forces the layout to not include the toolbar.
  // For now, let's just render the PlanStep and we'll update it to hide the toolbar if a prop is set.
  return (
    <div className="min-h-screen w-full">
      <PlanStep
        plan={strategy.planData}
        forcePresentation={true}
      />
    </div>
  );
}
