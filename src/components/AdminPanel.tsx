import { useState } from 'react';
import {
  LayoutDashboard,
  ShoppingBag,
  Star,
  ArrowLeft,
  UtensilsCrossed,
} from 'lucide-react';
import Dashboard from '@/components/admin/Dashboard';
import MenuManager from '@/components/admin/MenuManager';
import OrdersManager from '@/components/admin/OrdersManager';
import ReviewsManager from '@/components/admin/ReviewsManager';

type Tab = 'dashboard' | 'menu' | 'orders' | 'reviews';

export default function AdminPanel() {
  const [tab, setTab] = useState<Tab>('dashboard');

  const tabs: { id: Tab; label: string; icon: typeof LayoutDashboard }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'menu', label: 'Menu', icon: UtensilsCrossed },
    { id: 'orders', label: 'Orders', icon: ShoppingBag },
    { id: 'reviews', label: 'Reviews', icon: Star },
  ];

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col lg:flex-row">
      {/* Sidebar */}
      <aside className="lg:w-64 bg-stone-900 text-stone-300 flex flex-col shrink-0">
        <div className="p-5 border-b border-white/10">
          <div className="flex items-center gap-2">
            <img src="/image.png" alt="The Idli Lab" className="h-9 w-auto object-contain rounded-md shrink-0" />
            <div className="leading-tight">
              <div className="font-bold text-white text-sm">THE IDLI LAB</div>
              <div className="text-[10px] tracking-widest text-amber-400">ADMIN PANEL</div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-1">
          {tabs.map((t) => {
            const Icon = t.icon;
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  tab === t.id
                    ? 'bg-amber-500 text-white'
                    : 'text-stone-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4" />
                {t.label}
              </button>
            );
          })}
        </nav>

        {/* Back to site */}
        <div className="p-3 border-t border-white/10">
          <a
            href="#"
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-stone-400 hover:bg-white/5 hover:text-white transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Website
          </a>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        {tab === 'dashboard' && <Dashboard onNavigate={setTab} />}
        {tab === 'menu' && <MenuManager />}
        {tab === 'orders' && <OrdersManager />}
        {tab === 'reviews' && <ReviewsManager />}
      </main>
    </div>
  );
}
