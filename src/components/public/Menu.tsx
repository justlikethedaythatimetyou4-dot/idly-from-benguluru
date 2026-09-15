import { useState, useMemo } from 'react';
import { type MenuItem } from '@/lib/supabase';
import { Plus } from 'lucide-react';

type MenuProps = {
  items: MenuItem[];
  loading: boolean;
  onAddToCart: (item: MenuItem) => void;
};

export default function Menu({ items, loading, onAddToCart }: MenuProps) {
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const categories = useMemo(() => {
    const cats = Array.from(new Set(items.map((i) => i.category)));
    return ['All', ...cats];
  }, [items]);

  const filtered = useMemo(() => {
    if (activeCategory === 'All') return items;
    return items.filter((i) => i.category === activeCategory);
  }, [items, activeCategory]);

  if (loading) {
    return (
      <section id="menu" className="py-20 bg-stone-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-stone-900">Our Menu</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 animate-pulse">
                <div className="h-4 bg-stone-200 rounded w-1/3 mb-4" />
                <div className="h-3 bg-stone-200 rounded w-full mb-2" />
                <div className="h-3 bg-stone-200 rounded w-2/3 mb-4" />
                <div className="h-8 bg-stone-200 rounded w-1/4" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="menu" className="py-20 bg-stone-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-10">
          <p className="text-amber-600 font-semibold tracking-widest text-sm uppercase mb-2">
            Freshly Made
          </p>
          <h2 className="text-4xl sm:text-5xl font-bold text-stone-900">Our Menu</h2>
          <p className="mt-4 text-stone-500 max-w-2xl mx-auto">
            Every dish is prepared with authentic recipes and the freshest ingredients.
            Tap to add items to your order.
          </p>
        </div>

        {/* Category filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                activeCategory === cat
                  ? 'bg-stone-900 text-white shadow-md'
                  : 'bg-white text-stone-600 border border-stone-200 hover:border-stone-400 hover:text-stone-900'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Menu grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="group bg-white rounded-2xl border border-stone-100 overflow-hidden hover:shadow-xl hover:border-amber-200 transition-all duration-300 hover:-translate-y-1"
            >
              <div className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="font-bold text-stone-900 text-lg leading-snug">
                      {item.name}
                    </h3>
                    {item.description && (
                      <p className="mt-1.5 text-sm text-stone-500 leading-relaxed">
                        {item.description}
                      </p>
                    )}
                    <span className="inline-block mt-3 text-xs font-medium text-amber-600 bg-amber-50 px-3 py-1 rounded-full">
                      {item.category}
                    </span>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-2xl font-bold text-stone-900">
                      ₹{item.price}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => onAddToCart(item)}
                  disabled={!item.is_available}
                  className={`mt-4 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                    item.is_available
                      ? 'bg-amber-500 text-white hover:bg-amber-600 shadow-sm hover:shadow-md'
                      : 'bg-stone-100 text-stone-400 cursor-not-allowed'
                  }`}
                >
                  {item.is_available ? (
                    <>
                      <Plus className="w-4 h-4" />
                      Add to Order
                    </>
                  ) : (
                    'Unavailable'
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16 text-stone-400">
            No items in this category.
          </div>
        )}
      </div>
    </section>
  );
}
