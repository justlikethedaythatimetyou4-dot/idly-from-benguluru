import { type Review } from '@/lib/supabase';
import { Star, Quote } from 'lucide-react';

type ReviewsProps = {
  reviews: Review[];
};

export default function Reviews({ reviews }: ReviewsProps) {
  const avgRating =
    reviews.length > 0
      ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
      : '4.9';

  return (
    <section id="reviews" className="py-20 bg-stone-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-amber-400 font-semibold tracking-widest text-sm uppercase mb-2">
            Google Reviews
          </p>
          <h2 className="text-4xl sm:text-5xl font-bold text-white">
            What People Say
          </h2>
          <div className="mt-6 inline-flex items-center gap-4 px-6 py-3 rounded-full bg-white/5 border border-white/10">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <span className="text-2xl font-bold text-white">{avgRating}</span>
            <span className="text-stone-400 text-sm">({reviews.length} reviews)</span>
          </div>
        </div>

        {/* Reviews grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-amber-400/30 transition-all hover:-translate-y-1"
            >
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shrink-0">
                  <span className="text-white font-bold text-lg">
                    {review.author_name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-white">{review.author_name}</h4>
                  <div className="flex mt-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${
                          i < review.rating
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-stone-600'
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <Quote className="w-8 h-8 text-white/10 shrink-0" />
              </div>
              {review.text && (
                <p className="mt-4 text-stone-300 text-sm leading-relaxed">
                  "{review.text}"
                </p>
              )}
            </div>
          ))}
        </div>

        {reviews.length === 0 && (
          <div className="text-center py-16 text-stone-500">
            No reviews yet. Be the first to review!
          </div>
        )}
      </div>
    </section>
  );
}
