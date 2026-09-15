import { useState, useEffect, useCallback } from 'react';
import { supabase, type Review } from '@/lib/supabase';
import { Star, Trash2, StarOff, Loader2 } from 'lucide-react';

export default function ReviewsManager() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [rating, setRating] = useState(5);
  const [text, setText] = useState('');

  const fetchReviews = useCallback(async () => {
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .order('created_at', { ascending: false });
    if (!error && data) setReviews(data as Review[]);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const toggleFeatured = async (review: Review) => {
    await supabase
      .from('reviews')
      .update({ is_featured: !review.is_featured })
      .eq('id', review.id);
    fetchReviews();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this review?')) return;
    await supabase.from('reviews').delete().eq('id', id);
    fetchReviews();
  };

  const handleAdd = async () => {
    if (!name.trim()) {
      setError('Please enter a reviewer name.');
      return;
    }
    setSubmitting(true);
    setError(null);

    const { error: insertError } = await supabase.from('reviews').insert({
      author_name: name.trim(),
      rating,
      text: text.trim() || null,
      is_featured: false,
    });

    if (insertError) {
      setError('Could not add review. Please try again.');
      setSubmitting(false);
      return;
    }

    setSubmitting(false);
    setShowForm(false);
    setName('');
    setRating(5);
    setText('');
    fetchReviews();
  };

  if (loading) {
    return (
      <div className="p-6 lg:p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-stone-200 rounded w-32" />
          <div className="h-20 bg-stone-200 rounded-2xl" />
          <div className="h-20 bg-stone-200 rounded-2xl" />
        </div>
      </div>
    );
  }

  const avgRating =
    reviews.length > 0
      ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
      : '0.0';

  return (
    <div className="p-6 lg:p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-stone-900 mb-1">Reviews</h1>
          <p className="text-stone-500 text-sm">
            {reviews.length} reviews · {avgRating} average rating
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2.5 bg-amber-500 text-white rounded-xl font-semibold text-sm hover:bg-amber-600 transition-colors shadow-md shadow-amber-500/20"
        >
          {showForm ? 'Cancel' : 'Add Review'}
        </button>
      </div>

      {/* Add review form */}
      {showForm && (
        <div className="bg-white rounded-2xl border border-stone-100 p-5 mb-6 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-stone-700 mb-1.5">
              Reviewer Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Customer name"
              className="w-full px-4 py-2.5 rounded-xl border border-stone-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-stone-700 mb-1.5">
              Rating
            </label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((r) => (
                <button
                  key={r}
                  onClick={() => setRating(r)}
                  className="p-1"
                >
                  <Star
                    className={`w-7 h-7 ${
                      r <= rating
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-stone-200'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-stone-700 mb-1.5">
              Review Text
            </label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="What did they say?"
              rows={3}
              className="w-full px-4 py-2.5 rounded-xl border border-stone-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none text-sm resize-none"
            />
          </div>
          {error && (
            <p className="text-sm text-red-600 bg-red-50 rounded-lg px-4 py-2">{error}</p>
          )}
          <button
            onClick={handleAdd}
            disabled={submitting}
            className="w-full py-2.5 bg-stone-900 text-white rounded-xl font-semibold text-sm hover:bg-stone-800 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Adding...
              </>
            ) : (
              'Save Review'
            )}
          </button>
        </div>
      )}

      {/* Reviews list */}
      <div className="space-y-3">
        {reviews.map((review) => (
          <div
            key={review.id}
            className="bg-white rounded-2xl border border-stone-100 p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3 flex-1 min-w-0">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shrink-0">
                  <span className="text-white font-bold text-sm">
                    {review.author_name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold text-stone-900 truncate">
                      {review.author_name}
                    </h4>
                    {review.is_featured && (
                      <span className="text-xs font-medium text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full shrink-0">
                        Featured
                      </span>
                    )}
                  </div>
                  <div className="flex mt-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${
                          i < review.rating
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-stone-200'
                        }`}
                      />
                    ))}
                    <span className="text-xs text-stone-400 ml-2">
                      {new Date(review.created_at).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                  {review.text && (
                    <p className="text-sm text-stone-600 mt-2 leading-relaxed">
                      "{review.text}"
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <button
                  onClick={() => toggleFeatured(review)}
                  className={`p-2 rounded-lg transition-colors ${
                    review.is_featured
                      ? 'text-amber-500 hover:bg-amber-50'
                      : 'text-stone-400 hover:bg-stone-100 hover:text-stone-700'
                  }`}
                  title={review.is_featured ? 'Unfeature' : 'Feature'}
                >
                  {review.is_featured ? (
                    <Star className="w-4 h-4" />
                  ) : (
                    <StarOff className="w-4 h-4" />
                  )}
                </button>
                <button
                  onClick={() => handleDelete(review.id)}
                  className="p-2 rounded-lg text-stone-400 hover:bg-red-50 hover:text-red-500 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {reviews.length === 0 && (
        <div className="text-center py-16 text-stone-400">
          No reviews yet. Click "Add Review" to add one.
        </div>
      )}
    </div>
  );
}
