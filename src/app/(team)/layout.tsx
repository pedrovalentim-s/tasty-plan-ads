import { AppSidebar } from '@/components/layout/app-sidebar';

export default function TeamLayout({ children }: { children: React.ReactNode }) {
  return <AppSidebar>{children}</AppSidebar>;
}
