const PHOTOS = [
  {
    url: '/image copy.png',
    alt: 'Chocolate idli from The Idli Lab',
  },
  {
    url: 'https://images.pexels.com/photos/37867687/pexels-photo-37867687.jpeg?auto=compress&cs=tinysrgb&w=800',
    alt: 'Idli, vada, sambar and chutney with coffee',
  },
  {
    url: 'https://images.pexels.com/photos/35514447/pexels-photo-35514447.jpeg?auto=compress&cs=tinysrgb&w=800',
    alt: 'Idli sambar meal on silver plate',
  },
  {
    url: 'https://images.pexels.com/photos/36854501/pexels-photo-36854501.jpeg?auto=compress&cs=tinysrgb&w=800',
    alt: 'Idli with chutneys and sambar',
  },
  {
    url: 'https://images.pexels.com/photos/31199041/pexels-photo-31199041.jpeg?auto=compress&cs=tinysrgb&w=800',
    alt: 'Idli on banana leaves with sambar and chutney',
  },
  {
    url: 'https://images.pexels.com/photos/14831540/pexels-photo-14831540.jpeg?auto=compress&cs=tinysrgb&w=800',
    alt: 'Idli, vada, chutney and coffee on banana leaf',
  },
];

export default function Photos() {
  return (
    <section id="photos" className="py-20 bg-stone-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className="text-amber-600 font-semibold tracking-widest text-sm uppercase mb-2">
            Gallery
          </p>
          <h2 className="text-4xl sm:text-5xl font-bold text-stone-900">Photos</h2>
          <p className="mt-4 text-stone-500 max-w-2xl mx-auto">
            A glimpse of what's cooking at The Idli Lab — every dish, an idli.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {PHOTOS.map((photo, i) => (
            <div
              key={i}
              className={`relative overflow-hidden rounded-2xl group cursor-pointer ${
                i === 0 ? 'col-span-2 row-span-2' : ''
              }`}
            >
              <img
                src={photo.url}
                alt={photo.alt}
                className={`w-full object-cover transition-transform duration-500 group-hover:scale-110 ${
                  i === 0 ? 'h-full min-h-[300px]' : 'h-48 sm:h-56'
                }`}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
