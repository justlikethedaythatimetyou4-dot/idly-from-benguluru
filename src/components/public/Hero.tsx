import { Star, MapPin, Clock, Phone } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <img
          src="https://images.pexels.com/photos/4331488/pexels-photo-4331488.jpeg?auto=compress&cs=tinysrgb&w=1920"
          alt="Fresh South Indian idli with chutney and spices"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-stone-900/92 via-stone-900/75 to-stone-900/30" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-40 pb-32">
        <div className="max-w-2xl">
          {/* Rating badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/20 border border-amber-400/30 backdrop-blur-sm mb-6">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <span className="text-amber-300 text-sm font-semibold">4.9 · 17 Reviews</span>
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-tight tracking-tight">
            THE IDLI LAB
          </h1>
          <p className="mt-2 text-lg tracking-[0.3em] text-amber-400 font-medium">
            I D L
          </p>

          <p className="mt-6 text-lg sm:text-xl text-stone-200 leading-relaxed max-w-xl">
            Soft, steamed idlis made fresh every morning — from the classic plain
            to rich chocolate idli. Every dish here is an idli, crafted to delight.
          </p>

          {/* Quick info */}
          <div className="mt-8 flex flex-wrap gap-4 text-stone-300 text-sm">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-400" />
              <span>Closed · Opens 7 AM Wed</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-amber-400" />
              <span>Begur Rd, Bommanahalli, Bengaluru</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-amber-400" />
              <span>097380 14895</span>
            </div>
          </div>

          {/* CTAs */}
          <div className="mt-10 flex flex-wrap gap-4">
            <a
              href="#menu"
              onClick={(e) => {
                e.preventDefault();
                document.querySelector('#menu')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-8 py-3.5 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-full transition-all shadow-lg shadow-amber-500/30 hover:shadow-xl hover:shadow-amber-500/40 hover:-translate-y-0.5"
            >
              View Menu
            </a>
            <a
              href="tel:09738014895"
              className="px-8 py-3.5 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white font-semibold rounded-full border border-white/20 transition-all hover:-translate-y-0.5"
            >
              Call to Order
            </a>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/50 rounded-full mt-2 animate-bounce" />
        </div>
      </div>
    </section>
  );
}
