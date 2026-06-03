import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';
import useSearchStore from '@/store/useSearchStore';
import { cn } from '@/utils/cn';

const SEARCH_TABS = [
  { id: 'flights', label: 'Flights', icon: 'flight' },
  { id: 'hotels', label: 'Hotels', icon: 'hotel' },
];

export default function SearchBar() {
  const navigate = useNavigate();
  const { searchType, setSearchType, setSearchParams } = useSearchStore();
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [departDate, setDepartDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [travelers, setTravelers] = useState(1);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchParams({ from, to, departDate, returnDate, travelers });
    if (searchType === 'flights') {
      navigate(ROUTES.FLIGHTS);
    } else {
      navigate(ROUTES.HOTELS);
    }
  };

  return (
    <div className="glass-panel ghost-border rounded-[2rem] p-6 md:p-8 shadow-glass-xl w-full max-w-4xl mx-auto">
      {/* Tabs */}
      <div className="flex items-center gap-2 mb-6">
        {SEARCH_TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSearchType(tab.id)}
            className={cn(
              'flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold transition-all duration-200',
              searchType === tab.id
                ? 'bg-primary text-white shadow-primary-glow'
                : 'bg-white/50 text-on-surface-variant hover:bg-white/80'
            )}
          >
            <span className="material-symbols-outlined text-lg">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Search Form */}
      <form onSubmit={handleSearch}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {searchType === 'flights' ? (
            <>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-outline text-xl">flight_takeoff</span>
                <input
                  type="text"
                  placeholder="From (City or Airport)"
                  value={from}
                  onChange={(e) => setFrom(e.target.value)}
                  className="input-field pl-11"
                />
              </div>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-outline text-xl">flight_land</span>
                <input
                  type="text"
                  placeholder="To (City or Airport)"
                  value={to}
                  onChange={(e) => setTo(e.target.value)}
                  className="input-field pl-11"
                />
              </div>
            </>
          ) : (
            <>
              <div className="relative md:col-span-2">
                <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-outline text-xl">location_on</span>
                <input
                  type="text"
                  placeholder="City or Hotel name"
                  value={to}
                  onChange={(e) => setTo(e.target.value)}
                  className="input-field pl-11"
                />
              </div>
            </>
          )}
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-outline text-xl">calendar_today</span>
            <input
              type="date"
              value={departDate}
              onChange={(e) => setDepartDate(e.target.value)}
              className="input-field pl-11"
            />
          </div>
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-outline text-xl">group</span>
            <select
              value={travelers}
              onChange={(e) => setTravelers(Number(e.target.value))}
              className="input-field pl-11 appearance-none"
            >
              {[1,2,3,4,5,6,7,8,9].map(n => (
                <option key={n} value={n}>{n} Traveler{n > 1 ? 's' : ''}</option>
              ))}
            </select>
          </div>
        </div>
        <button type="submit" className="btn-primary w-full mt-4 group">
          <span className="material-symbols-outlined text-xl">search</span>
          Search {searchType === 'flights' ? 'Flights' : 'Hotels'}
        </button>
      </form>
    </div>
  );
}
