import { useState, useEffect, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import PageShell from '@/components/common/PageShell';
import { citiesAPI } from '@/api/cities';
import { cn } from '@/utils/cn';

const CATEGORY_LABELS = {
  all: 'All',
  historic: 'Historic',
  cultural: 'Cultural',
  natural: 'Natural',
};

function LandmarkCard({ landmark, cityName }) {
  const navigate = useNavigate();
  const [imageFailed, setImageFailed] = useState(false);
  const categoryColors = {
    historic: 'bg-amber-50 text-amber-700',
    cultural: 'bg-blue-50 text-blue-700',
    natural: 'bg-green-50 text-green-700',
    'hidden-gem': 'bg-purple-50 text-purple-700',
  };

  return (
    <article
      onClick={() => navigate(`/landmarks/${landmark.id}`)}
      className="glass-card rounded-[2rem] overflow-hidden flex flex-col group hover:shadow-card-hover transition-all duration-300 cursor-pointer"
    >
      <div className="relative h-48 overflow-hidden">
        {landmark.imageUrl && !imageFailed ? (
          <img
            src={landmark.imageUrl}
            alt={landmark.name}
            onError={() => setImageFailed(true)}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
            <span className="material-symbols-outlined text-primary text-5xl">photo_camera</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
        <div className="absolute top-3 right-3">
          <span className={cn('px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide', categoryColors[landmark.category] || 'bg-surface-container text-on-surface-variant')}>
            {landmark.category}
          </span>
        </div>
        <div className="absolute bottom-3 left-4">
          <div className="flex items-center gap-1 text-white/90">
            <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: '"FILL" 1' }}>location_on</span>
            <span className="text-xs font-bold">{cityName || landmark.cityCode}</span>
          </div>
        </div>
      </div>
      <div className="p-5 flex-1 flex flex-col">
        <h3 className="font-headline font-extrabold text-base text-on-surface mb-2 leading-snug">{landmark.name}</h3>
        <p className="text-xs text-on-surface-variant leading-relaxed line-clamp-3 flex-1">{landmark.description}</p>
      </div>
    </article>
  );
}

export default function ExplorePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [iconic, setIconic] = useState([]);
  const [hiddenGems, setHiddenGems] = useState([]);
  const [cityNamesByCode, setCityNamesByCode] = useState({});
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');
  const query = searchParams.get('q')?.trim() || '';

  useEffect(() => {
    const load = async () => {
      try {
        const [iconicData, gemsData, citiesData] = await Promise.all([
          citiesAPI.getLandmarks({ hiddenGem: false }),
          citiesAPI.getLandmarks({ hiddenGem: true }),
          citiesAPI.list(),
        ]);
        setIconic(Array.isArray(iconicData) ? iconicData : []);
        setHiddenGems(Array.isArray(gemsData) ? gemsData : []);
        setCityNamesByCode(Object.fromEntries(
          (Array.isArray(citiesData) ? citiesData : [])
            .filter((city) => city?.code)
            .map((city) => [city.code, city.name])
        ));
      } catch {
        setIconic([]);
        setHiddenGems([]);
        setCityNamesByCode({});
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const matchesQuery = (landmark) => {
    if (!query) return true;
    const haystack = [
      landmark.name,
      landmark.cityCode,
      cityNamesByCode[landmark.cityCode],
      landmark.category,
      landmark.description,
    ].join(' ').toLowerCase();
    return haystack.includes(query.toLowerCase());
  };

  const filteredIconic = useMemo(() => {
    const byCategory = activeCategory === 'all' ? iconic : iconic.filter((l) => l.category === activeCategory);
    return byCategory.filter(matchesQuery);
  }, [iconic, activeCategory, query, cityNamesByCode]);

  const filteredGems = useMemo(() => {
    const byCategory = activeCategory === 'all' ? hiddenGems : hiddenGems.filter((l) => l.category === activeCategory);
    return byCategory.filter(matchesQuery);
  }, [hiddenGems, activeCategory, query, cityNamesByCode]);

  return (
    <PageShell>
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 py-12 pt-8">
        {/* Hero */}
        <section className="mb-12">
          <p className="text-primary font-bold tracking-widest uppercase text-xs mb-3">Discover the world</p>
          <h1 className="font-headline text-5xl md:text-6xl font-extrabold tracking-tighter text-on-surface leading-tight">
            Explore the{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-tertiary">
              Extraordinary.
            </span>
          </h1>
          <p className="text-on-surface-variant text-lg max-w-2xl mt-4">
            Iconic landmarks and hidden gems curated from the world's most captivating destinations.
          </p>
        </section>

        {query && (
          <div className="mb-8 glass-card rounded-2xl px-5 py-3 flex items-center gap-3">
            <span className="material-symbols-outlined text-primary text-lg">search</span>
            <p className="text-sm font-semibold text-on-surface">
              Showing places matching <span className="text-primary">"{query}"</span>
            </p>
            <button
              onClick={() => setSearchParams({})}
              className="ml-auto text-xs font-bold text-on-surface-variant hover:text-primary transition-colors"
            >
              Clear
            </button>
          </div>
        )}

        {/* Category filter chips */}
        <div className="flex gap-3 mb-12 overflow-x-auto pb-2" style={{ scrollbarWidth: 'none' }}>
          {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setActiveCategory(key)}
              className={cn(
                'flex-shrink-0 px-6 py-2.5 rounded-full font-bold text-sm transition-all',
                activeCategory === key
                  ? 'bg-primary text-white shadow-lg shadow-primary/25'
                  : 'glass-card text-on-surface-variant hover:text-on-surface'
              )}
            >
              {label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-72 rounded-[2rem] bg-surface-container/50 animate-pulse" />
            ))}
          </div>
        ) : (
          <>
            {/* Iconic Landmarks */}
            {filteredIconic.length > 0 && (
              <section className="mb-16">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: '"FILL" 1' }}>star</span>
                  </div>
                  <div>
                    <h2 className="font-headline text-2xl font-extrabold">Iconic Landmarks</h2>
                    <p className="text-on-surface-variant text-sm">The world's must-see destinations</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredIconic.map((landmark) => (
                    <LandmarkCard key={landmark.id} landmark={landmark} cityName={cityNamesByCode[landmark.cityCode]} />
                  ))}
                </div>
              </section>
            )}

            {/* Hidden Gems */}
            {filteredGems.length > 0 && (
              <section className="mb-16">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
                    <span className="material-symbols-outlined text-purple-600" style={{ fontVariationSettings: '"FILL" 1' }}>diamond</span>
                  </div>
                  <div>
                    <h2 className="font-headline text-2xl font-extrabold">Hidden Gems</h2>
                    <p className="text-on-surface-variant text-sm">Off the beaten path, unforgettable</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredGems.map((landmark) => (
                    <LandmarkCard key={landmark.id} landmark={landmark} cityName={cityNamesByCode[landmark.cityCode]} />
                  ))}
                </div>
              </section>
            )}

            {filteredIconic.length === 0 && filteredGems.length === 0 && (
              <div className="text-center py-24">
                <span className="material-symbols-outlined text-6xl text-outline mb-4 block">explore_off</span>
                <h2 className="font-headline text-2xl font-bold mb-2">No landmarks found</h2>
                <p className="text-on-surface-variant">Try a different search or category filter.</p>
              </div>
            )}
          </>
        )}
      </div>
    </PageShell>
  );
}
