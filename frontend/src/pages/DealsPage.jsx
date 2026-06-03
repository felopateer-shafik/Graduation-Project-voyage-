import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import PageShell from '@/components/common/PageShell';
import { countriesAPI } from '@/api/countries';
import { packagesAPI } from '@/api/packages';
import { formatCurrency } from '@/utils/formatCurrency';
import { ROUTES } from '@/constants/routes';
import { cn } from '@/utils/cn';

function CountryCard({ country }) {
  const navigate = useNavigate();
  return (
    <article
      onClick={() => navigate(`/deals/${country.code}`)}
      className="group relative h-[400px] rounded-[2rem] overflow-hidden cursor-pointer hover:-translate-y-2 hover:shadow-2xl transition-all duration-500"
    >
      {country.heroImageUrl ? (
        <img
          src={country.heroImageUrl}
          alt={country.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        />
      ) : (
        <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
          <span className="material-symbols-outlined text-primary text-7xl">public</span>
        </div>
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
      <div className="absolute bottom-5 left-5 right-5">
        <div className="bg-white/20 backdrop-blur-md border border-white/30 rounded-2xl p-5">
          <p className="text-[10px] font-bold uppercase tracking-widest text-white/70 mb-1">{country.continent}</p>
          <h3 className="font-headline text-xl font-extrabold text-white mb-2">{country.name}</h3>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[10px] bg-white/20 text-white px-2 py-0.5 rounded-full font-bold">{country.language}</span>
            <span className="text-[10px] bg-white/20 text-white px-2 py-0.5 rounded-full font-bold">EGP prices</span>
          </div>
        </div>
      </div>
    </article>
  );
}

function PackageDealCard({ pkg }) {
  const navigate = useNavigate();
  return (
    <article
      onClick={() => navigate(`/packages/${pkg.id}`)}
      className="glass-card rounded-[2rem] overflow-hidden cursor-pointer group hover:shadow-card-hover transition-all duration-300 flex flex-col"
    >
      <div className="relative h-44 overflow-hidden">
        {pkg.heroImageUrl ? (
          <img
            src={pkg.heroImageUrl}
            alt={pkg.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
            <span className="material-symbols-outlined text-primary text-5xl">travel_explore</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
        <div className="absolute bottom-3 left-4 text-white">
          <p className="font-bold text-sm">{pkg.originCityCode} → {pkg.destinationCityCode}</p>
          <p className="text-xs text-white/80">{pkg.nights} nights</p>
        </div>
      </div>
      <div className="p-5 flex flex-col gap-3 flex-1">
        <h3 className="font-headline font-extrabold text-sm text-on-surface leading-snug line-clamp-2">{pkg.name}</h3>
        <div className="mt-auto pt-3 border-t border-white/20 flex items-end justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-widest text-outline font-extrabold">From</p>
            <p className="font-headline text-xl font-extrabold text-on-surface">{formatCurrency(pkg.pricePerPerson)}</p>
            <p className="text-[10px] text-outline">per person</p>
          </div>
          <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
            <span className="material-symbols-outlined text-base">arrow_forward</span>
          </div>
        </div>
      </div>
    </article>
  );
}

export default function DealsPage() {
  const [countries, setCountries] = useState([]);
  const [packages, setPackages] = useState([]);
  const [loadingCountries, setLoadingCountries] = useState(true);
  const [loadingPackages, setLoadingPackages] = useState(true);

  useEffect(() => {
    countriesAPI.list(true)
      .then(setCountries)
      .catch(() => setCountries([]))
      .finally(() => setLoadingCountries(false));

    packagesAPI.list()
      .then(setPackages)
      .catch(() => setPackages([]))
      .finally(() => setLoadingPackages(false));
  }, []);

  return (
    <PageShell>
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 py-12 pt-8">
        {/* Hero */}
        <section className="mb-14">
          <p className="text-primary font-bold tracking-widest uppercase text-xs mb-3">Curated for you</p>
          <h1 className="font-headline text-5xl md:text-6xl font-extrabold tracking-tighter text-on-surface mb-4">
            Top Destinations &{' '}
            <span className="text-primary">Deals</span>
          </h1>
          <p className="text-on-surface-variant max-w-xl text-lg">
            Explore our most popular destinations and all-inclusive packages crafted for every type of traveler.
          </p>
        </section>

        {/* Top Destinations */}
        <section className="mb-20">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="font-headline text-3xl font-extrabold tracking-tighter">Popular Destinations</h2>
              <p className="text-on-surface-variant text-sm mt-1">Click a destination to see available packages</p>
            </div>
            <span className="px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest">
              {countries.length} countries
            </span>
          </div>

          {loadingCountries ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-[400px] rounded-[2rem] bg-surface-container/50 animate-pulse" />
              ))}
            </div>
          ) : countries.length === 0 ? (
            <div className="text-center py-16 text-on-surface-variant">No destinations found.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {countries.map((country) => (
                <CountryCard key={country.code} country={country} />
              ))}
            </div>
          )}
        </section>

        {/* Featured Packages */}
        <section>
          <div className="flex items-end justify-between mb-8">
            <div>
              <span className="material-symbols-outlined text-tertiary align-middle mr-2" style={{ fontVariationSettings: '"FILL" 1' }}>local_offer</span>
              <span className="font-headline text-3xl font-extrabold tracking-tighter">Featured Packages</span>
              <p className="text-on-surface-variant text-sm mt-1">All-inclusive flight + hotel bundles</p>
            </div>
            <Link to={ROUTES.FLIGHT_HOTEL} className="flex items-center gap-1.5 text-sm font-bold text-primary hover:underline">
              View all <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </Link>
          </div>

          {loadingPackages ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-64 rounded-[2rem] bg-surface-container/50 animate-pulse" />
              ))}
            </div>
          ) : packages.length === 0 ? (
            <div className="text-center py-16 text-on-surface-variant">No packages available yet.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {packages.map((pkg) => (
                <PackageDealCard key={pkg.id} pkg={pkg} />
              ))}
            </div>
          )}
        </section>
      </div>
    </PageShell>
  );
}
