"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Menu, Plus, FileText, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getStrategies, deleteStrategy, StrategyRecord } from '@/lib/firebase/firestore';
import { useToast } from '@/hooks/use-toast';

export function AppSidebar({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(true);
  const [strategies, setStrategies] = useState<StrategyRecord[]>([]);
  const { toast } = useToast();
  const pathname = usePathname();
  const router = useRouter();

  const fetchStrategies = async () => {
    try {
      const data = await getStrategies();
      setStrategies(data);
    } catch (e) {
      console.error("Error fetching strategies:", e);
    }
  };

  useEffect(() => {
    fetchStrategies();
    // Listen to custom event for refetching when a new strategy is created
    const handleUpdate = () => fetchStrategies();
    window.addEventListener('strategyListUpdated', handleUpdate);
    return () => window.removeEventListener('strategyListUpdated', handleUpdate);
  }, []);

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (confirm("Tem certeza que deseja apagar essa estratégia definitivamente?")) {
      try {
        await deleteStrategy(id);
        toast({ title: 'Estratégia apagada com sucesso.' });
        fetchStrategies();
        if (pathname.includes('/strategies/' + id)) {
          router.push('/');
        }
      } catch (err) {
         toast({ variant: 'destructive', title: 'Erro ao apagar' });
      }
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <div 
        className={`${isOpen ? 'w-64' : 'w-0 md:w-16'} transition-all duration-300 ease-in-out border-r bg-card flex flex-col shrink-0`}
      >
        <div className="flex items-center justify-between p-4 border-b h-16">
          {isOpen && <span className="font-headline font-bold text-primary truncate">Tasty Plan</span>}
          <Button variant="ghost" size="icon" onClick={() => setIsOpen(!isOpen)} className="shrink-0">
            <Menu className="h-5 w-5" />
          </Button>
        </div>
        
        <div className="flex-1 overflow-y-auto py-4">
          <nav className="space-y-2 px-2">
            <Link href="/" className={`flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted transition-colors ${pathname === '/' ? 'bg-muted font-medium' : ''}`}>
              <Plus className="h-5 w-5 shrink-0 text-muted-foreground" />
              {isOpen && <span className="truncate">Nova Estratégia</span>}
            </Link>

            {isOpen && (
              <div className="pt-6 pb-2 pl-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Suas Estratégias
              </div>
            )}
            
            {strategies.map(s => (
              <Link key={s.id} href={`/strategies/${s.id}`} className={`flex items-center justify-between px-3 py-2 rounded-md hover:bg-muted transition-colors group ${pathname === `/strategies/${s.id}` ? 'bg-muted' : ''}`}>
                <div className="flex items-center gap-3 overflow-hidden">
                  <FileText className="h-4 w-4 shrink-0 text-muted-foreground" />
                  {isOpen && <span className="truncate text-sm">{s.clientName}</span>}
                </div>
                {isOpen && (
                  <Button variant="ghost" size="icon" className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" onClick={(e) => handleDelete(e, s.id)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                )}
              </Link>
            ))}
          </nav>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto relative">
        {children}
      </div>
    </div>
  );
}
