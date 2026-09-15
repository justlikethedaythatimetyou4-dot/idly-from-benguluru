import { useState } from 'react';
import { supabase, type MenuItem, type OrderItem } from '@/lib/supabase';
import { X, Trash2, Minus, Plus, ShoppingBag, Check, Loader2 } from 'lucide-react';

type OrderModalProps = {
  open: boolean;
  onClose: () => void;
  cart: { item: MenuItem; quantity: number }[];
  cartTotal: number;
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemoveFromCart: (id: string) => void;
  onOrderPlaced: () => void;
};

export default function OrderModal({
  open,
  onClose,
  cart,
  cartTotal,
  onUpdateQuantity,
  onRemoveFromCart,
  onOrderPlaced,
}: OrderModalProps) {
  const [step, setStep] = useState<'cart' | 'details' | 'success'>('cart');
  const [orderType, setOrderType] = useState<'delivery' | 'pickup'>('delivery');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [orderId, setOrderId] = useState<string>('');

  const deliveryFee = orderType === 'delivery' ? 30 : 0;
  const total = cartTotal + deliveryFee;

  const handleSubmit = async () => {
    if (!name.trim() || !phone.trim()) {
      setError('Please enter your name and phone number.');
      return;
    }
    if (orderType === 'delivery' && !address.trim()) {
      setError('Please enter your delivery address.');
      return;
    }
    if (cart.length === 0) return;

    setSubmitting(true);
    setError(null);

    const orderItems: OrderItem[] = cart.map((c) => ({
      id: c.item.id,
      name: c.item.name,
      price: c.item.price,
      quantity: c.quantity,
    }));

    const { data, error: insertError } = await supabase
      .from('orders')
      .insert({
        customer_name: name,
        customer_phone: phone,
        customer_address: orderType === 'delivery' ? address : null,
        items: orderItems,
        subtotal: cartTotal,
        delivery_fee: deliveryFee,
        total,
        status: 'pending',
        order_type: orderType,
        notes: notes.trim() || null,
      })
      .select()
      .single();

    if (insertError) {
      setError('Could not place your order. Please try again.');
      setSubmitting(false);
      return;
    }

    setOrderId(data.id);
    setStep('success');
    setSubmitting(false);
    setName('');
    setPhone('');
    setAddress('');
    setNotes('');
    onOrderPlaced();
  };

  const handleClose = () => {
    setStep('cart');
    setError(null);
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="relative w-full sm:max-w-lg max-h-[90vh] bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100">
          <h2 className="font-bold text-lg text-stone-900">
            {step === 'success' ? 'Order Confirmed' : 'Your Order'}
          </h2>
          <button
            onClick={handleClose}
            className="p-2 rounded-full hover:bg-stone-100 transition-colors"
          >
            <X className="w-5 h-5 text-stone-500" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto">
          {/* Success step */}
          {step === 'success' && (
            <div className="p-8 text-center">
              <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
                <Check className="w-10 h-10 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-stone-900 mb-2">Thank you!</h3>
              <p className="text-stone-500 mb-4">
                Your order has been placed. We'll call you shortly to confirm.
              </p>
              <div className="bg-stone-50 rounded-xl p-4 mb-6">
                <p className="text-xs text-stone-400 mb-1">Order Reference</p>
                <p className="font-mono text-sm text-stone-700">
                  #{orderId.slice(0, 8).toUpperCase()}
                </p>
              </div>
              <button
                onClick={handleClose}
                className="w-full py-3 bg-stone-900 text-white rounded-xl font-semibold hover:bg-stone-800 transition-colors"
              >
                Done
              </button>
            </div>
          )}

          {/* Cart step */}
          {step === 'cart' && (
            <div className="p-6">
              {cart.length === 0 ? (
                <div className="py-16 text-center">
                  <ShoppingBag className="w-16 h-16 text-stone-200 mx-auto mb-4" />
                  <p className="text-stone-400">Your cart is empty.</p>
                  <p className="text-sm text-stone-400 mt-1">
                    Add items from the menu to get started.
                  </p>
                </div>
              ) : (
                <>
                  <div className="space-y-3 mb-6">
                    {cart.map((c) => (
                      <div
                        key={c.item.id}
                        className="flex items-center gap-3 bg-stone-50 rounded-xl p-3"
                      >
                        <div className="flex-1">
                          <h4 className="font-medium text-stone-900 text-sm">
                            {c.item.name}
                          </h4>
                          <p className="text-xs text-stone-500">
                            ₹{c.item.price} × {c.quantity} = ₹{c.item.price * c.quantity}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => onUpdateQuantity(c.item.id, c.quantity - 1)}
                            className="w-7 h-7 rounded-full bg-white border border-stone-200 flex items-center justify-center hover:border-stone-400"
                          >
                            <Minus className="w-3 h-3 text-stone-600" />
                          </button>
                          <span className="w-6 text-center text-sm font-semibold">
                            {c.quantity}
                          </span>
                          <button
                            onClick={() => onUpdateQuantity(c.item.id, c.quantity + 1)}
                            className="w-7 h-7 rounded-full bg-white border border-stone-200 flex items-center justify-center hover:border-stone-400"
                          >
                            <Plus className="w-3 h-3 text-stone-600" />
                          </button>
                          <button
                            onClick={() => onRemoveFromCart(c.item.id)}
                            className="w-7 h-7 rounded-full flex items-center justify-center text-stone-400 hover:text-red-500"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-between text-sm text-stone-500 mb-1">
                    <span>Subtotal</span>
                    <span>₹{cartTotal}</span>
                  </div>
                  <div className="flex justify-between text-sm text-stone-500 mb-4">
                    <span>Delivery fee</span>
                    <span>{orderType === 'delivery' ? `₹${deliveryFee}` : 'Free (pickup)'}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg text-stone-900 border-t border-stone-100 pt-4 mb-6">
                    <span>Total</span>
                    <span>₹{total}</span>
                  </div>

                  <button
                    onClick={() => setStep('details')}
                    className="w-full py-3.5 bg-amber-500 text-white rounded-xl font-semibold hover:bg-amber-600 transition-colors shadow-md shadow-amber-500/20"
                  >
                    Proceed to Checkout
                  </button>
                </>
              )}
            </div>
          )}

          {/* Details step */}
          {step === 'details' && (
            <div className="p-6">
              {/* Order type toggle */}
              <div className="mb-5">
                <label className="block text-sm font-semibold text-stone-700 mb-2">
                  Order Type
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setOrderType('delivery')}
                    className={`py-3 rounded-xl border-2 text-sm font-medium transition-all ${
                      orderType === 'delivery'
                        ? 'border-amber-500 bg-amber-50 text-amber-700'
                        : 'border-stone-200 text-stone-500'
                    }`}
                  >
                    Delivery
                  </button>
                  <button
                    onClick={() => setOrderType('pickup')}
                    className={`py-3 rounded-xl border-2 text-sm font-medium transition-all ${
                      orderType === 'pickup'
                        ? 'border-amber-500 bg-amber-50 text-amber-700'
                        : 'border-stone-200 text-stone-500'
                    }`}
                  >
                    Pickup
                  </button>
                </div>
              </div>

              {/* Form */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-stone-700 mb-1.5">
                    Name *
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                    className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none transition-all text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-stone-700 mb-1.5">
                    Phone *
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Your phone number"
                    className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none transition-all text-sm"
                  />
                </div>
                {orderType === 'delivery' && (
                  <div>
                    <label className="block text-sm font-semibold text-stone-700 mb-1.5">
                      Delivery Address *
                    </label>
                    <textarea
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Full delivery address"
                      rows={3}
                      className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none transition-all text-sm resize-none"
                    />
                  </div>
                )}
                <div>
                  <label className="block text-sm font-semibold text-stone-700 mb-1.5">
                    Notes (optional)
                  </label>
                  <input
                    type="text"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Any special requests..."
                    className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none transition-all text-sm"
                  />
                </div>
              </div>

              {/* Summary */}
              <div className="mt-6 bg-stone-50 rounded-xl p-4 space-y-1.5">
                <div className="flex justify-between text-sm text-stone-500">
                  <span>Subtotal</span>
                  <span>₹{cartTotal}</span>
                </div>
                <div className="flex justify-between text-sm text-stone-500">
                  <span>Delivery fee</span>
                  <span>{orderType === 'delivery' ? `₹${deliveryFee}` : 'Free'}</span>
                </div>
                <div className="flex justify-between font-bold text-stone-900 pt-1.5 border-t border-stone-200">
                  <span>Total</span>
                  <span>₹{total}</span>
                </div>
              </div>

              {error && (
                <p className="mt-4 text-sm text-red-600 bg-red-50 rounded-lg px-4 py-2">
                  {error}
                </p>
              )}

              {/* Actions */}
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setStep('cart')}
                  className="px-5 py-3.5 rounded-xl border border-stone-200 text-stone-600 font-medium hover:bg-stone-50 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="flex-1 py-3.5 bg-amber-500 text-white rounded-xl font-semibold hover:bg-amber-600 transition-colors shadow-md shadow-amber-500/20 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Placing Order...
                    </>
                  ) : (
                    `Place Order · ₹${total}`
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
