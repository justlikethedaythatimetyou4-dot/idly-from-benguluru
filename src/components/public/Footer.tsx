import { MapPin, Phone, Clock } from 'lucide-react';

export default function Footer() {
  return (
    <footer id="about" className="bg-stone-900 text-stone-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-3 gap-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <img src="/image.png" alt="The Idli Lab" className="h-12 w-auto object-contain rounded-md" />
            </div>
            <p className="text-sm text-stone-400 leading-relaxed">
              Fresh, indulgent idlis crafted every morning with authentic South Indian flavors.
              From classic steamed idli to rich chocolate idli, every dish is an idli.
            </p>
            <div className="flex items-center gap-1 mt-4">
              <span className="text-amber-400 font-bold text-lg">4.9</span>
              <span className="text-stone-500 text-sm">· 17 Google Reviews</span>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-white mb-4">Visit Us</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
                <span>
                  1st Cross, Begur Rd, near Maheshwaramma Temple,
                  Bommanahalli, Bengaluru, Karnataka 560068
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                <a href="tel:09738014895" className="hover:text-amber-400 transition-colors">
                  097380 14895
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Closed · Opens 7 AM Wed</span>
              </div>
            </div>
          </div>

          {/* Hours */}
          <div>
            <h3 className="font-semibold text-white mb-4">Opening Hours</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span>Monday</span>
                <span className="text-stone-500">Closed</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span>Tuesday</span>
                <span className="text-stone-500">Closed</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span>Wed – Sun</span>
                <span className="text-amber-400">7:00 AM – 11:00 AM</span>
              </div>
              <div className="flex justify-between">
                <span>Wed – Sun (Eve)</span>
                <span className="text-amber-400">4:00 PM – 8:00 PM</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-stone-500">
            © 2026 The Idli Lab. All rights reserved.
          </p>
          <a
            href="#/admin"
            className="text-xs text-stone-600 hover:text-amber-400 transition-colors"
          >
            Admin Panel
          </a>
        </div>
      </div>
    </footer>
  );
}
