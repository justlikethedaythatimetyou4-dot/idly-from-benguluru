import { useState, useEffect, useCallback } from 'react';
import { supabase, type MenuItem } from '@/lib/supabase';
import { Plus, Pencil, Trash2, X, Loader2 } from 'lucide-react';

type EditState = {
  id?: string;
  name: string;
  description: string;
  price: string;
  category: string;
  is_available: boolean;
  display_order: string;
};

const EMPTY_EDIT: EditState = {
  name: '',
  description: '',
  price: '',
  category: '',
  is_available: true,
  display_order: '0',
};

export default function MenuManager() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<EditState | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchItems = useCallback(async () => {
    const { data, error } = await supabase
      .from('menu_items')
      .select('*')
      .order('display_order', { ascending: true });
    if (!error && data) setItems(data as MenuItem[]);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const handleSave = async () => {
    if (!editing) return;
    if (!editing.name.trim() || !editing.price || !editing.category.trim()) {
      setError('Name, price, and category are required.');
      return;
    }

    setSaving(true);
    setError(null);

    const payload = {
      name: editing.name.trim(),
      description: editing.description.trim() || null,
      price: parseFloat(editing.price),
      category: editing.category.trim(),
      is_available: editing.is_available,
      display_order: parseInt(editing.display_order) || 0,
    };

    let result;
    if (editing.id) {
      result = await supabase
        .from('menu_items')
        .update(payload)
        .eq('id', editing.id);
    } else {
      result = await supabase
        .from('menu_items')
        .insert(payload);
    }

    if (result.error) {
      setError('Could not save item. Please try again.');
      setSaving(false);
      return;
    }

    setSaving(false);
    setEditing(null);
    fetchItems();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this menu item?')) return;
    const { error } = await supabase.from('menu_items').delete().eq('id', id);
    if (!error) fetchItems();
  };

  const toggleAvailable = async (item: MenuItem) => {
    await supabase
      .from('menu_items')
      .update({ is_available: !item.is_available })
      .eq('id', item.id);
    fetchItems();
  };

  if (loading) {
    return (
      <div className="p-6 lg:p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-stone-200 rounded w-40" />
          <div className="h-20 bg-stone-200 rounded-2xl" />
          <div className="h-20 bg-stone-200 rounded-2xl" />
          <div className="h-20 bg-stone-200 rounded-2xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-stone-900 mb-1">Menu Management</h1>
          <p className="text-stone-500 text-sm">Add, edit, and manage your menu items.</p>
        </div>
        <button
          onClick={() => setEditing({ ...EMPTY_EDIT })}
          className="flex items-center gap-2 px-4 py-2.5 bg-amber-500 text-white rounded-xl font-semibold text-sm hover:bg-amber-600 transition-colors shadow-md shadow-amber-500/20"
        >
          <Plus className="w-4 h-4" />
          Add Item
        </button>
      </div>

      {/* Items list */}
      <div className="space-y-3">
        {items.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-2xl border border-stone-100 p-4 flex items-center gap-4 hover:shadow-md transition-shadow"
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-stone-900 truncate">{item.name}</h3>
                <span className="text-xs font-medium text-amber-600 bg-amber-50 px-2.5 py-0.5 rounded-full shrink-0">
                  {item.category}
                </span>
              </div>
              {item.description && (
                <p className="text-sm text-stone-500 truncate mt-0.5">{item.description}</p>
              )}
            </div>
            <div className="text-right shrink-0">
              <p className="font-bold text-stone-900">₹{item.price}</p>
            </div>
            <button
              onClick={() => toggleAvailable(item)}
              className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                item.is_available
                  ? 'bg-green-50 text-green-600 hover:bg-green-100'
                  : 'bg-red-50 text-red-600 hover:bg-red-100'
              }`}
            >
              {item.is_available ? 'Available' : 'Unavailable'}
            </button>
            <div className="flex items-center gap-1 shrink-0">
              <button
                onClick={() =>
                  setEditing({
                    id: item.id,
                    name: item.name,
                    description: item.description || '',
                    price: String(item.price),
                    category: item.category,
                    is_available: item.is_available,
                    display_order: String(item.display_order),
                  })
                }
                className="p-2 rounded-lg text-stone-400 hover:bg-stone-100 hover:text-stone-700 transition-colors"
              >
                <Pencil className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDelete(item.id)}
                className="p-2 rounded-lg text-stone-400 hover:bg-red-50 hover:text-red-500 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {items.length === 0 && (
        <div className="text-center py-16 text-stone-400">
          No menu items yet. Click "Add Item" to get started.
        </div>
      )}

      {/* Edit modal */}
      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm"
            onClick={() => setEditing(null)}
          />
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100">
              <h2 className="font-bold text-lg text-stone-900">
                {editing.id ? 'Edit Item' : 'New Menu Item'}
              </h2>
              <button
                onClick={() => setEditing(null)}
                className="p-2 rounded-full hover:bg-stone-100"
              >
                <X className="w-5 h-5 text-stone-500" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-stone-700 mb-1.5">Name *</label>
                <input
                  type="text"
                  value={editing.name}
                  onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                  placeholder="e.g. Rava Idli"
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-stone-700 mb-1.5">Description</label>
                <textarea
                  value={editing.description}
                  onChange={(e) => setEditing({ ...editing, description: e.target.value })}
                  placeholder="Short description..."
                  rows={2}
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none text-sm resize-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-stone-700 mb-1.5">Price (₹) *</label>
                  <input
                    type="number"
                    value={editing.price}
                    onChange={(e) => setEditing({ ...editing, price: e.target.value })}
                    placeholder="50"
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-stone-700 mb-1.5">Category *</label>
                  <input
                    type="text"
                    value={editing.category}
                    onChange={(e) => setEditing({ ...editing, category: e.target.value })}
                    placeholder="e.g. Idli Varieties"
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-stone-700 mb-1.5">Display Order</label>
                <input
                  type="number"
                  value={editing.display_order}
                  onChange={(e) => setEditing({ ...editing, display_order: e.target.value })}
                  placeholder="0"
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none text-sm"
                />
              </div>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={editing.is_available}
                  onChange={(e) => setEditing({ ...editing, is_available: e.target.checked })}
                  className="w-5 h-5 rounded accent-amber-500"
                />
                <span className="text-sm font-medium text-stone-700">Available for ordering</span>
              </label>

              {error && (
                <p className="text-sm text-red-600 bg-red-50 rounded-lg px-4 py-2">{error}</p>
              )}
            </div>
            <div className="px-6 pb-6 flex gap-3">
              <button
                onClick={() => setEditing(null)}
                className="px-5 py-2.5 rounded-xl border border-stone-200 text-stone-600 font-medium text-sm hover:bg-stone-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex-1 py-2.5 bg-amber-500 text-white rounded-xl font-semibold text-sm hover:bg-amber-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Save Item'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
