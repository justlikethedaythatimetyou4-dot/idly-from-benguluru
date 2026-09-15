import { useState, useEffect } from 'react';
import { ShoppingBag } from 'lucide-react';

type NavbarProps = {
  cartCount: number;
  onCartClick: () => void;
};

export default function Navbar({ cartCount, onCartClick }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navLinks = [
    { label: 'Menu', href: '#menu' },
    { label: 'Reviews', href: '#reviews' },
    { label: 'Photos', href: '#photos' },
    { label: 'About', href: '#about' },
  ];

  const scrollTo = (href: string) => {
    setMobileOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      {/* Full-width logo banner — spans left edge to right edge */}
      <div
        className={`w-full transition-all duration-300 ${
          scrolled ? 'bg-stone-900/95 backdrop-blur-md' : 'bg-stone-900'
        }`}
      >
        <div
          className="flex items-center justify-center cursor-pointer py-2"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          <img
            src="/image.png"
            alt="The Idli Lab"
            className="h-14 sm:h-16 md:h-20 w-auto max-w-[90vw] object-contain"
          />
        </div>
      </div>

      {/* Nav bar below logo */}
      <div
        className={`w-full transition-all duration-300 ${
          scrolled
            ? 'bg-stone-900/95 backdrop-blur-md shadow-lg'
            : 'bg-stone-900/80 backdrop-blur-sm'
        }`}
      >
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-12">
            {/* Desktop nav */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <button
                  key={link.href}
                  onClick={() => scrollTo(link.href)}
                  className="text-sm font-medium text-stone-300 hover:text-amber-400 transition-colors"
                >
                  {link.label}
                </button>
              ))}
            </div>

            {/* Mobile nav toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 rounded-full text-white"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={mobileOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'} />
              </svg>
            </button>

            {/* Cart */}
            <button
              onClick={onCartClick}
              className="relative p-2 rounded-full text-white hover:bg-white/10 transition-colors"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-amber-500 text-white text-xs font-bold flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </nav>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden pb-4 px-4 space-y-2">
            {navLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => scrollTo(link.href)}
                className="block w-full text-left px-4 py-2 text-stone-200 hover:bg-white/10 rounded-lg"
              >
                {link.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </header>
  );
}
