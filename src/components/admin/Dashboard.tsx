import { useState, useEffect, useCallback } from 'react';
import { supabase, type Order, type MenuItem, type Review } from '@/lib/supabase';
import {
  TrendingUp,
  ShoppingBag,
  IndianRupee,
  Star,
  UtensilsCrossed,
  ArrowRight,
} from 'lucide-react';

type DashboardProps = {
  onNavigate: (tab: 'dashboard' | 'menu' | 'orders' | 'reviews') => void;
};

export default function Dashboard({ onNavigate }: DashboardProps) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [menuCount, setMenuCount] = useState(0);
  const [reviewCount, setReviewCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    const [ordersRes, menuRes, reviewsRes] = await Promise.all([
      supabase.from('orders').select('*').order('created_at', { ascending: false }),
      supabase.from('menu_items').select('id', { count: 'exact', head: true }),
      supabase.from('reviews').select('id', { count: 'exact', head: true }),
    ]);

    setOrders((ordersRes.data as Order[]) || []);
    setMenuCount(menuRes.count || 0);
    setReviewCount(reviewsRes.count || 0);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const totalRevenue = orders
    .filter((o) => o.status !== 'cancelled')
    .reduce((sum, o) => sum + Number(o.total), 0);

  const pendingOrders = orders.filter(
    (o) => o.status === 'pending' || o.status === 'preparing'
  ).length;

  const todayOrders = orders.filter((o) => {
    const today = new Date();
    const orderDate = new Date(o.created_at);
    return (
      orderDate.getDate() === today.getDate() &&
      orderDate.getMonth() === today.getMonth() &&
      orderDate.getFullYear() === today.getFullYear()
    );
  }).length;

  const recentOrders = orders.slice(0, 5);

  const stats = [
    {
      label: 'Total Revenue',
      value: `₹${totalRevenue.toLocaleString('en-IN')}`,
      icon: IndianRupee,
      color: 'bg-green-50 text-green-600 border-green-100',
    },
    {
      label: 'Total Orders',
      value: orders.length,
      icon: ShoppingBag,
      color: 'bg-blue-50 text-blue-600 border-blue-100',
    },
    {
      label: 'Pending Orders',
      value: pendingOrders,
      icon: TrendingUp,
      color: 'bg-amber-50 text-amber-600 border-amber-100',
    },
    {
      label: 'Today\'s Orders',
      value: todayOrders,
      icon: ShoppingBag,
      color: 'bg-stone-50 text-stone-600 border-stone-100',
    },
  ];

  if (loading) {
    return (
      <div className="p-6 lg:p-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-stone-200 rounded w-48" />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-28 bg-stone-200 rounded-2xl" />
            ))}
          </div>
          <div className="h-64 bg-stone-200 rounded-2xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8">
      <h1 className="text-2xl font-bold text-stone-900 mb-1">Dashboard</h1>
      <p className="text-stone-500 text-sm mb-8">
        Overview of your restaurant's performance.
      </p>

      {/* Stats grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="bg-white rounded-2xl p-5 border border-stone-100 hover:shadow-md transition-shadow"
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${stat.color}`}>
                <Icon className="w-5 h-5" />
              </div>
              <p className="mt-4 text-2xl font-bold text-stone-900">{stat.value}</p>
              <p className="text-sm text-stone-500 mt-0.5">{stat.label}</p>
            </div>
          );
        })}
      </div>

      {/* Quick stats row */}
      <div className="grid sm:grid-cols-2 gap-4 mb-8">
        <div className="bg-white rounded-2xl p-5 border border-stone-100 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center">
            <UtensilsCrossed className="w-6 h-6 text-amber-600" />
          </div>
          <div className="flex-1">
            <p className="text-2xl font-bold text-stone-900">{menuCount}</p>
            <p className="text-sm text-stone-500">Menu Items</p>
          </div>
          <button
            onClick={() => onNavigate('menu')}
            className="text-amber-600 hover:text-amber-700"
          >
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-stone-100 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center">
            <Star className="w-6 h-6 text-amber-600" />
          </div>
          <div className="flex-1">
            <p className="text-2xl font-bold text-stone-900">{reviewCount}</p>
            <p className="text-sm text-stone-500">Reviews</p>
          </div>
          <button
            onClick={() => onNavigate('reviews')}
            className="text-amber-600 hover:text-amber-700"
          >
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Recent orders */}
      <div className="bg-white rounded-2xl border border-stone-100 overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-stone-100">
          <h2 className="font-bold text-stone-900">Recent Orders</h2>
          <button
            onClick={() => onNavigate('orders')}
            className="text-sm text-amber-600 font-medium hover:text-amber-700 flex items-center gap-1"
          >
            View All <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
        {recentOrders.length === 0 ? (
          <div className="p-8 text-center text-stone-400 text-sm">
            No orders yet.
          </div>
        ) : (
          <div className="divide-y divide-stone-50">
            {recentOrders.map((order) => (
              <div key={order.id} className="px-5 py-3.5 flex items-center justify-between hover:bg-stone-50/50">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-stone-100 flex items-center justify-center text-sm font-bold text-stone-600">
                    {order.customer_name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-medium text-stone-900 text-sm">{order.customer_name}</p>
                    <p className="text-xs text-stone-400">
                      {order.items.length} item(s) · {new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-stone-900 text-sm">₹{Number(order.total)}</p>
                  <span className="text-xs text-stone-400 capitalize">{order.status}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
