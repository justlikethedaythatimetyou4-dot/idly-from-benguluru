import { useState, useEffect, useCallback } from 'react';
import {
  supabase,
  type Order,
  ORDER_STATUS_LABELS,
  ORDER_STATUS_COLORS,
} from '@/lib/supabase';
import { X, Phone, MapPin, Clock, Package } from 'lucide-react';

const STATUSES: Order['status'][] = [
  'pending',
  'preparing',
  'ready',
  'delivered',
  'cancelled',
];

export default function OrdersManager() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<Order['status'] | 'all'>('all');
  const [selected, setSelected] = useState<Order | null>(null);

  const fetchOrders = useCallback(async () => {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });
    if (!error && data) setOrders(data as Order[]);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const updateStatus = async (id: string, status: Order['status']) => {
    await supabase.from('orders').update({ status }).eq('id', id);
    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status } : o))
    );
    if (selected?.id === id) {
      setSelected({ ...selected, status });
    }
  };

  const filtered = filter === 'all' ? orders : orders.filter((o) => o.status === filter);

  const statusCounts = STATUSES.reduce((acc, s) => {
    acc[s] = orders.filter((o) => o.status === s).length;
    return acc;
  }, {} as Record<Order['status'], number>);

  if (loading) {
    return (
      <div className="p-6 lg:p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-stone-200 rounded w-40" />
          <div className="h-20 bg-stone-200 rounded-2xl" />
          <div className="h-20 bg-stone-200 rounded-2xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8">
      <h1 className="text-2xl font-bold text-stone-900 mb-1">Orders</h1>
      <p className="text-stone-500 text-sm mb-6">
        Manage and track all customer orders.
      </p>

      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
            filter === 'all'
              ? 'bg-stone-900 text-white'
              : 'bg-white text-stone-600 border border-stone-200 hover:border-stone-400'
          }`}
        >
          All ({orders.length})
        </button>
        {STATUSES.map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              filter === s
                ? 'bg-stone-900 text-white'
                : 'bg-white text-stone-600 border border-stone-200 hover:border-stone-400'
            }`}
          >
            {ORDER_STATUS_LABELS[s]} ({statusCounts[s]})
          </button>
        ))}
      </div>

      {/* Orders list */}
      <div className="space-y-3">
        {filtered.map((order) => (
          <div
            key={order.id}
            className="bg-white rounded-2xl border border-stone-100 p-4 hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => setSelected(order)}
          >
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center text-sm font-bold text-stone-600 shrink-0">
                  {order.customer_name.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-stone-900 truncate">
                    {order.customer_name}
                  </p>
                  <p className="text-xs text-stone-400">
                    {order.items.length} item(s) ·{' '}
                    {new Date(order.created_at).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <span className="font-bold text-stone-900 text-sm">
                  ₹{Number(order.total)}
                </span>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium border ${ORDER_STATUS_COLORS[order.status]}`}
                >
                  {ORDER_STATUS_LABELS[order.status]}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 text-stone-400">
          <Package className="w-12 h-12 text-stone-200 mx-auto mb-3" />
          No orders in this category.
        </div>
      )}

      {/* Order detail modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm"
            onClick={() => setSelected(null)}
          />
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100">
              <div>
                <h2 className="font-bold text-lg text-stone-900">Order Details</h2>
                <p className="text-xs text-stone-400 font-mono">
                  #{selected.id.slice(0, 8).toUpperCase()}
                </p>
              </div>
              <button
                onClick={() => setSelected(null)}
                className="p-2 rounded-full hover:bg-stone-100"
              >
                <X className="w-5 h-5 text-stone-500" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-5">
              {/* Customer info */}
              <div>
                <h3 className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-3">
                  Customer
                </h3>
                <div className="space-y-2">
                  <p className="font-semibold text-stone-900">{selected.customer_name}</p>
                  <div className="flex items-center gap-2 text-sm text-stone-600">
                    <Phone className="w-4 h-4 text-stone-400" />
                    {selected.customer_phone}
                  </div>
                  {selected.customer_address && (
                    <div className="flex items-start gap-2 text-sm text-stone-600">
                      <MapPin className="w-4 h-4 text-stone-400 mt-0.5" />
                      {selected.customer_address}
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-sm text-stone-600">
                    <Clock className="w-4 h-4 text-stone-400" />
                    {new Date(selected.created_at).toLocaleString('en-IN')}
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Package className="w-4 h-4 text-stone-400" />
                    <span className="text-stone-600 capitalize">{selected.order_type}</span>
                  </div>
                </div>
              </div>

              {/* Items */}
              <div>
                <h3 className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-3">
                  Items
                </h3>
                <div className="space-y-2">
                  {selected.items.map((item, i) => (
                    <div
                      key={i}
                      className="flex justify-between items-center bg-stone-50 rounded-xl px-4 py-2.5"
                    >
                      <div>
                        <p className="font-medium text-stone-900 text-sm">{item.name}</p>
                        <p className="text-xs text-stone-400">
                          ₹{item.price} × {item.quantity}
                        </p>
                      </div>
                      <p className="font-semibold text-stone-900 text-sm">
                        ₹{item.price * item.quantity}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Notes */}
              {selected.notes && (
                <div>
                  <h3 className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-2">
                    Notes
                  </h3>
                  <p className="text-sm text-stone-600 bg-amber-50 rounded-xl px-4 py-3">
                    {selected.notes}
                  </p>
                </div>
              )}

              {/* Totals */}
              <div className="bg-stone-50 rounded-xl p-4 space-y-1.5">
                <div className="flex justify-between text-sm text-stone-500">
                  <span>Subtotal</span>
                  <span>₹{Number(selected.subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm text-stone-500">
                  <span>Delivery fee</span>
                  <span>₹{Number(selected.delivery_fee)}</span>
                </div>
                <div className="flex justify-between font-bold text-stone-900 pt-1.5 border-t border-stone-200">
                  <span>Total</span>
                  <span>₹{Number(selected.total)}</span>
                </div>
              </div>
            </div>

            {/* Status actions */}
            <div className="px-6 py-4 border-t border-stone-100">
              <p className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-2">
                Update Status
              </p>
              <div className="flex flex-wrap gap-2">
                {STATUSES.map((s) => (
                  <button
                    key={s}
                    onClick={() => updateStatus(selected.id, s)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                      selected.status === s
                        ? ORDER_STATUS_COLORS[s] + ' ring-2 ring-offset-1 ring-stone-300'
                        : 'bg-white text-stone-500 border-stone-200 hover:border-stone-400'
                    }`}
                  >
                    {ORDER_STATUS_LABELS[s]}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
