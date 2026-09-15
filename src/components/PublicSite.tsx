import { useState, useEffect, useCallback } from 'react';
import { supabase, type MenuItem, type Review } from '@/lib/supabase';
import Hero from '@/components/public/Hero';
import Menu from '@/components/public/Menu';
import Reviews from '@/components/public/Reviews';
import Photos from '@/components/public/Photos';
import OrderModal from '@/components/public/OrderModal';
import Navbar from '@/components/public/Navbar';
import Footer from '@/components/public/Footer';

export default function PublicSite() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [cart, setCart] = useState<{ item: MenuItem; quantity: number }[]>([]);
  const [orderModalOpen, setOrderModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchMenu = useCallback(async () => {
    const { data, error } = await supabase
      .from('menu_items')
      .select('*')
      .order('display_order', { ascending: true });
    if (!error && data) setMenuItems(data as MenuItem[]);
  }, []);

  const fetchReviews = useCallback(async () => {
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .order('created_at', { ascending: false });
    if (!error && data) setReviews(data as Review[]);
  }, []);

  useEffect(() => {
    Promise.all([fetchMenu(), fetchReviews()]).finally(() => setLoading(false));
  }, [fetchMenu, fetchReviews]);

  const addToCart = (item: MenuItem) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.item.id === item.id);
      if (existing) {
        return prev.map((c) =>
          c.item.id === item.id ? { ...c, quantity: c.quantity + 1 } : c
        );
      }
      return [...prev, { item, quantity: 1 }];
    });
  };

  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter((c) => c.item.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }
    setCart((prev) =>
      prev.map((c) => (c.item.id === id ? { ...c, quantity } : c))
    );
  };

  const cartCount = cart.reduce((sum, c) => sum + c.quantity, 0);
  const cartTotal = cart.reduce((sum, c) => sum + c.item.price * c.quantity, 0);

  return (
    <div className="min-h-screen bg-stone-50">
      <Navbar cartCount={cartCount} onCartClick={() => setOrderModalOpen(true)} />
      <Hero />
      <Menu items={menuItems} loading={loading} onAddToCart={addToCart} />
      <Reviews reviews={reviews} />
      <Photos />
      <Footer />
      <OrderModal
        open={orderModalOpen}
        onClose={() => setOrderModalOpen(false)}
        cart={cart}
        cartTotal={cartTotal}
        onUpdateQuantity={updateQuantity}
        onRemoveFromCart={removeFromCart}
        onOrderPlaced={() => {
          setCart([]);
          setOrderModalOpen(false);
        }}
      />
    </div>
  );
}
