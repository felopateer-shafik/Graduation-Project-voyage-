import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PageShell from '@/components/common/PageShell';
import { countriesAPI } from '@/api/countries';
import { packagesAPI } from '@/api/packages';
import { formatCurrency } from '@/utils/formatCurrency';
import { ROUTES } from '@/constants/routes';

function PackageCard({ pkg }) {
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
        {pkg.inclusions?.length > 0 && (
          <p className="text-xs text-on-surface-variant line-clamp-1">{pkg.inclusions[0]}</p>
        )}
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

export default function DestinationDetailPage() {
  const { code } = useParams();
  const navigate = useNavigate();
  const [country, setCountry] = useState(null);
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const [countryData, allPackages] = await Promise.all([
          countriesAPI.getByCode(code),
          packagesAPI.list(),
        ]);
        setCountry(countryData);

        const cityCodes = new Set((countryData.cities || []).map((c) => c.code.toUpperCase()));
        const filtered = allPackages.filter((p) =>
          cityCodes.has(p.destinationCityCode?.toUpperCase())
        );
        setPackages(filtered);
      } catch {
        setError('Destination not found');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [code]);

  if (loading) {
    return (
      <PageShell>
        <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
          <div className="h-72 rounded-[2rem] bg-surface-container/50 animate-pulse" />
          <div className="h-8 w-1/2 rounded-xl bg-surface-container/50 animate-pulse" />
          <div className="h-4 w-full rounded-xl bg-surface-container/50 animate-pulse" />
        </div>
      </PageShell>
    );
  }

  if (error || !country) {
    return (
      <PageShell>
        <div className="text-center py-24">
          <span className="material-symbols-outlined text-6xl text-outline mb-4 block">public_off</span>
          <h2 className="font-headline text-2xl font-bold mb-2">Destination Not Found</h2>
          <button onClick={() => navigate(ROUTES.DEALS)} className="btn-primary mx-auto mt-4">
            Back to Deals
          </button>
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-on-surface-variant text-sm mb-6">
          <button onClick={() => navigate(ROUTES.DEALS)} className="font-medium hover:text-primary transition-colors">
            Deals
          </button>
          <span className="material-symbols-outlined text-xs">chevron_right</span>
          <span className="text-primary font-bold">{country.name}</span>
        </nav>

        {/* Hero */}
        <div className="relative rounded-[2rem] overflow-hidden h-72 sm:h-96 mb-8">
          {country.heroImageUrl ? (
            <img src={country.heroImageUrl} alt={country.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
              <span className="material-symbols-outlined text-primary text-7xl">public</span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          <div className="absolute bottom-6 left-6">
            <p className="text-white/70 text-xs font-bold uppercase tracking-widest mb-1">{country.continent}</p>
            <h1 className="font-headline text-4xl sm:text-5xl font-extrabold text-white tracking-tight">{country.name}</h1>
          </div>
        </div>

        {/* Info chips */}
        <div className="flex flex-wrap gap-3 mb-8">
          {[
            { icon: 'language', label: country.language },
            { icon: 'payments', label: 'All prices in EGP' },
            { icon: 'schedule', label: country.timezone },
          ].map(({ icon, label }) => label && (
            <div key={icon} className="flex items-center gap-1.5 bg-surface-container-high/50 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20 text-sm font-semibold">
              <span className="material-symbols-outlined text-primary text-base">{icon}</span>
              {label}
            </div>
          ))}
        </div>

        {/* Description */}
        <div className="glass-card rounded-[2rem] p-8 mb-10">
          <h2 className="font-headline text-xl font-extrabold mb-3">About {country.name}</h2>
          <p className="text-on-surface-variant leading-relaxed">{country.description}</p>
        </div>

        {/* Cities */}
        {country.cities?.length > 0 && (
          <div className="mb-10">
            <h2 className="font-headline text-xl font-extrabold mb-4">Cities</h2>
            <div className="flex flex-wrap gap-3">
              {country.cities.map((city) => (
                <button
                  key={city.code}
                  onClick={() => navigate(`/cities/${city.code}`)}
                  className="flex items-center gap-2 glass-card rounded-xl px-4 py-2 hover:shadow-card-hover transition-all"
                >
                  <span className="material-symbols-outlined text-primary text-base">location_city</span>
                  <span className="font-semibold text-sm">{city.name}</span>
                  <span className="text-xs text-outline font-bold">{city.code}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Packages */}
        <section>
          <div className="flex items-end justify-between mb-6">
            <h2 className="font-headline text-2xl font-extrabold tracking-tighter">
              Packages to {country.name}
            </h2>
            {packages.length > 0 && (
              <span className="text-xs text-on-surface-variant">{packages.length} package{packages.length !== 1 ? 's' : ''}</span>
            )}
          </div>

          {packages.length === 0 ? (
            <div className="text-center py-16 glass-card rounded-[2rem]">
              <span className="material-symbols-outlined text-5xl text-outline mb-3 block">travel_explore</span>
              <p className="text-on-surface-variant mb-6">No packages available for {country.name} yet.</p>
              <button onClick={() => navigate(ROUTES.FLIGHT_HOTEL)} className="btn-primary mx-auto">
                Browse All Packages
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {packages.map((pkg) => (
                <PackageCard key={pkg.id} pkg={pkg} />
              ))}
            </div>
          )}
        </section>
      </div>
    </PageShell>
  );
}
