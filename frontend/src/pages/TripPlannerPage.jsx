import { useState, useEffect } from 'react';
import PageShell from '@/components/common/PageShell';
import GlassPanel from '@/components/common/GlassPanel';
import GlassCard from '@/components/common/GlassCard';
import { cn } from '@/utils/cn';
import useTripsStore from '@/store/useTripsStore';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';
import { aiAPI } from '@/api/ai';
import toast from 'react-hot-toast';

const SESSION_KEY = 'voyage-trip-planner';

const INTEREST_OPTIONS = [
  { id: 'culture', label: 'Culture', icon: 'museum' },
  { id: 'adventure', label: 'Adventure', icon: 'hiking' },
  { id: 'food', label: 'Food & Dining', icon: 'restaurant' },
  { id: 'relaxation', label: 'Relaxation', icon: 'spa' },
  { id: 'shopping', label: 'Shopping', icon: 'shopping_bag' },
  { id: 'nature', label: 'Nature', icon: 'park' },
];

const ACTIVITY_ICONS = {
  transport: 'flight',
  hotel: 'hotel',
  tour: 'tour',
  food: 'restaurant',
  free: 'self_improvement',
  shopping: 'shopping_bag',
  sightseeing: 'photo_camera',
};

function loadSession() {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

function saveSession(data) {
  try { sessionStorage.setItem(SESSION_KEY, JSON.stringify(data)); } catch {}
}

export default function TripPlannerPage() {
  const saved = loadSession();
  const [origin, setOrigin] = useState(saved?.origin || '');
  const [destination, setDestination] = useState(saved?.destination || '');
  const [days, setDays] = useState(saved?.days || 4);
  const [interests, setInterests] = useState(saved?.interests || []);
  const [customInstructions, setCustomInstructions] = useState(saved?.customInstructions || '');
  const [departureDate, setDepartureDate] = useState(saved?.departureDate || '');
  const [returnDate, setReturnDate] = useState(saved?.returnDate || '');
  const [plan, setPlan] = useState(saved?.plan || null);
  const [generating, setGenerating] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const addTrip = useTripsStore((state) => state.addTrip);
  const navigate = useNavigate();

  // Persist state changes to sessionStorage
  useEffect(() => {
    saveSession({ origin, destination, days, interests, customInstructions, departureDate, returnDate, plan });
  }, [origin, destination, days, interests, customInstructions, departureDate, returnDate, plan]);

  const toggleInterest = (id) => {
    setInterests(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const canGenerate = origin.trim() && destination.trim();

  const handleGenerate = async () => {
    if (!canGenerate) return;
    setGenerating(true);
    setPlan(null);
    setIsSaved(false);
    try {
      const data = await aiAPI.tripPlan(
        origin.trim(), destination.trim(), days, interests,
        customInstructions.trim(), departureDate, returnDate
      );
      if (data?.days?.length > 0) {
        setPlan(data);
      } else {
        toast.error('Could not generate itinerary. Please try again.');
      }
    } catch (err) {
      toast.error('Failed to generate itinerary. Check your connection and try again.');
    } finally {
      setGenerating(false);
    }
  };

  const handleSaveTrip = () => {
    addTrip({
      origin,
      destination,
      days,
      interests,
      customInstructions: customInstructions.trim(),
      itinerary: plan?.days || [],
      recommendedFlight: plan?.recommendedFlight,
      recommendedHotel: plan?.recommendedHotel,
      estimatedTotal: plan?.estimatedTotal,
    });
    setIsSaved(true);
    toast.success('Trip saved!');
  };

  const formatPrice = (price) => {
    if (price == null || price === 0) return 'Free';
    return `EGP ${Number(price).toLocaleString()}`;
  };

  return (
    <PageShell>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 animate-fade-in">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full mb-4">
            <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
            <span className="text-xs font-bold text-primary">AI-Powered by Gemini</span>
          </div>
          <h1 className="font-headline text-4xl sm:text-5xl font-extrabold tracking-tighter text-on-surface mb-3">
            Trip Planner
          </h1>
          <p className="text-on-surface-variant max-w-lg mx-auto">
            Tell us where you're traveling from and to, and our AI will craft a personalized plan with real flights, hotels & pricing.
          </p>
        </div>

        {/* Input Panel */}
        <GlassPanel className="mb-10">
          {/* Row 1: From & To (mandatory) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2 block">
                Traveling From <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-outline text-xl">flight_takeoff</span>
                <input
                  type="text"
                  value={origin}
                  onChange={(e) => setOrigin(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
                  placeholder="City you're departing from"
                  className="input-field pl-11"
                />
              </div>
            </div>
            <div>
              <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2 block">
                Destination <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-outline text-xl">flight_land</span>
                <input
                  type="text"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
                  placeholder="Where do you want to go?"
                  className="input-field pl-11"
                />
              </div>
            </div>
          </div>

          {/* Row 2: Duration & Dates (optional) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-6">
            <div>
              <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2 block">Trip Duration</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-outline text-xl">calendar_today</span>
                <select
                  value={days}
                  onChange={(e) => setDays(Number(e.target.value))}
                  className="input-field pl-11 appearance-none"
                >
                  {[1,2,3,4,5,6,7,10,14].map(d => (
                    <option key={d} value={d}>{d} {d === 1 ? 'Day' : 'Days'}</option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2 block">Departure Date</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-outline text-xl">event</span>
                <input
                  type="date"
                  value={departureDate}
                  onChange={(e) => setDepartureDate(e.target.value)}
                  className="input-field pl-11"
                />
              </div>
            </div>
            <div>
              <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2 block">Return Date</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-outline text-xl">event_available</span>
                <input
                  type="date"
                  value={returnDate}
                  onChange={(e) => setReturnDate(e.target.value)}
                  className="input-field pl-11"
                />
              </div>
            </div>
          </div>

          {/* Row 3: Interests */}
          <div className="mt-6">
            <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-3 block">Your Interests</label>
            <div className="flex flex-wrap gap-3">
              {INTEREST_OPTIONS.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => toggleInterest(opt.id)}
                  className={cn(
                    'flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-bold transition-all',
                    interests.includes(opt.id)
                      ? 'bg-primary text-white shadow-primary-glow'
                      : 'bg-white/50 text-on-surface-variant hover:bg-white/80 border border-white/30'
                  )}
                >
                  <span className="material-symbols-outlined text-lg">{opt.icon}</span>
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Row 4: Custom Instructions */}
          <div className="mt-6">
            <label
              htmlFor="custom-instructions"
              className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2 block"
            >
              Custom Instructions
            </label>
            <textarea
              id="custom-instructions"
              value={customInstructions}
              onChange={(e) => setCustomInstructions(e.target.value)}
              placeholder="Add budget, pace, accessibility needs, food preferences, or places to avoid."
              className="input-field min-h-28 resize-y"
            />
          </div>

          <button
            onClick={handleGenerate}
            disabled={generating || !canGenerate}
            className="btn-primary w-full mt-8 group"
          >
            {generating ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Generating your itinerary...
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
                Generate Itinerary
              </>
            )}
          </button>
        </GlassPanel>

        {/* Generated Plan */}
        {plan && (
          <div className="animate-fade-in space-y-6">
            <div className="text-center mb-8">
              <h2 className="font-headline text-3xl font-extrabold tracking-tight">
                Your {origin} → {destination} Trip
              </h2>
              <p className="text-on-surface-variant">{days} day{days !== 1 ? 's' : ''} · Personalized by AI · Real Prices</p>
            </div>

            {/* Flight & Hotel Recommendations */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Recommended Flight */}
              <GlassCard hover className="!p-0 overflow-hidden">
                <div className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 px-5 py-3 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-blue-500" style={{ fontVariationSettings: "'FILL' 1" }}>flight</span>
                    <span className="text-xs font-bold text-blue-500 uppercase tracking-wider">Recommended Flight</span>
                  </div>
                </div>
                <div className="p-5">
                  {plan.recommendedFlight ? (
                    <>
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-headline font-bold text-lg">{plan.recommendedFlight.airline}</h3>
                        <div className="flex items-center gap-2">
                          {plan.recommendedFlight.refundable && <span className="text-[10px] font-bold text-green-700 bg-green-50 px-2 py-0.5 rounded-full">Refundable</span>}
                          <span className="text-xs font-mono bg-surface-container px-2 py-1 rounded">{plan.recommendedFlight.flightNumber}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 mb-3">
                        <div className="text-center">
                          <p className="font-headline text-xl font-black text-primary">{plan.recommendedFlight.departureCityCode || plan.recommendedFlight.departureCity?.substring(0,3).toUpperCase()}</p>
                          <p className="text-xs text-on-surface-variant">{plan.recommendedFlight.departureCity}</p>
                          <p className="text-[10px] text-outline">{plan.recommendedFlight.departureTime}</p>
                        </div>
                        <div className="flex-1 flex flex-col items-center gap-1">
                          <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">{plan.recommendedFlight.duration}</span>
                          <div className="w-full flex items-center gap-1">
                            <div className="h-px flex-1 bg-outline/30" />
                            <span className="material-symbols-outlined text-primary text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>flight</span>
                            <div className="h-px flex-1 bg-outline/30" />
                          </div>
                          <span className="text-[10px] font-bold text-outline uppercase">{plan.recommendedFlight.stops === 0 ? 'Non-stop' : plan.recommendedFlight.stops + ' stop(s)'}</span>
                        </div>
                        <div className="text-center">
                          <p className="font-headline text-xl font-black">{plan.recommendedFlight.arrivalCityCode || plan.recommendedFlight.arrivalCity?.substring(0,3).toUpperCase()}</p>
                          <p className="text-xs text-on-surface-variant">{plan.recommendedFlight.arrivalCity}</p>
                          <p className="text-[10px] text-outline">{plan.recommendedFlight.arrivalTime}</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-on-surface-variant">{plan.recommendedFlight.cabinClass} · {plan.recommendedFlight.aircraft || ''}</span>
                        <span className="text-lg font-black text-primary">{formatPrice(plan.recommendedFlight.price)}</span>
                      </div>
                      {plan.recommendedFlight.id && (
                        <button onClick={() => navigate(`/flights/${plan.recommendedFlight.id}`)} className="mt-3 text-xs font-bold text-primary hover:underline flex items-center gap-1">
                          View Flight Details <span className="material-symbols-outlined text-sm">arrow_forward</span>
                        </button>
                      )}
                    </>
                  ) : (
                    <p className="text-sm text-on-surface-variant italic">No matching flights found in our database for this route.</p>
                  )}
                </div>
              </GlassCard>

              {/* Recommended Hotel */}
              <GlassCard hover className="!p-0 overflow-hidden">
                <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 px-5 py-3 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-amber-500" style={{ fontVariationSettings: "'FILL' 1" }}>hotel</span>
                    <span className="text-xs font-bold text-amber-500 uppercase tracking-wider">Recommended Hotel</span>
                  </div>
                </div>
                <div className="p-5">
                  {plan.recommendedHotel ? (
                    <>
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-headline font-bold text-lg">{plan.recommendedHotel.name}</h3>
                        {plan.recommendedHotel.rating && (
                          <span className="text-xs font-bold bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full">★ {plan.recommendedHotel.rating}</span>
                        )}
                      </div>
                      <div className="flex items-center gap-1 mb-2">
                        {Array.from({ length: plan.recommendedHotel.stars || 0 }).map((_, i) => (
                          <span key={i} className="material-symbols-outlined text-amber-400 text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                        ))}
                        <span className="text-xs text-on-surface-variant ml-2">{plan.recommendedHotel.city}</span>
                      </div>
                      {plan.recommendedHotel.roomType && (
                        <p className="text-xs text-on-surface-variant mb-2">Room: {plan.recommendedHotel.roomType}</p>
                      )}
                      {plan.recommendedHotel.amenities && (
                        <div className="flex flex-wrap gap-1.5 mb-3">
                          {(typeof plan.recommendedHotel.amenities === 'string' ? plan.recommendedHotel.amenities.split(',') : []).map((a, i) => (
                            <span key={i} className="text-xs bg-surface-container px-2 py-0.5 rounded-full capitalize">{a.trim()}</span>
                          ))}
                        </div>
                      )}
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-on-surface-variant">{formatPrice(plan.recommendedHotel.pricePerNight)}/night × {days} nights</span>
                        <span className="text-lg font-black text-primary">{formatPrice(plan.recommendedHotel.totalPrice)}</span>
                      </div>
                      {plan.recommendedHotel.id && (
                        <button onClick={() => navigate(`/hotels/${plan.recommendedHotel.id}`)} className="mt-3 text-xs font-bold text-amber-600 hover:underline flex items-center gap-1">
                          View Hotel Details <span className="material-symbols-outlined text-sm">arrow_forward</span>
                        </button>
                      )}
                    </>
                  ) : (
                    <p className="text-sm text-on-surface-variant italic">No matching hotels found in our database for this destination.</p>
                  )}
                </div>
              </GlassCard>
            </div>

            {/* Day-by-day Itinerary */}
            <div className="space-y-4">
              <h3 className="font-headline text-xl font-bold flex items-center gap-2">
                <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>map</span>
                Day-by-Day Itinerary
              </h3>
              {(plan.days || []).map((day) => (
                <GlassCard key={day.day} hover className="!p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
                      <span className="font-headline font-black text-primary text-lg">{day.day}</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-headline font-bold text-lg mb-3">{day.title}</h3>
                      <ul className="space-y-2.5">
                        {(day.activities || []).map((activity, i) => {
                          const isObject = typeof activity === 'object' && activity !== null;
                          const actName = isObject ? activity.name : activity;
                          const actType = isObject ? activity.type : 'sightseeing';
                          const actCost = isObject ? activity.cost : null;
                          const icon = ACTIVITY_ICONS[actType] || 'check_circle';
                          return (
                            <li key={i} className="flex items-start justify-between gap-2 text-sm">
                              <div className="flex items-start gap-2 flex-1">
                                <span className="material-symbols-outlined text-primary text-sm mt-0.5" style={{ fontVariationSettings: "'FILL' 1" }}>{icon}</span>
                                <span className="text-on-surface-variant">{actName}</span>
                              </div>
                              {actCost != null && (
                                <span className={cn(
                                  "text-xs font-bold shrink-0 px-2 py-0.5 rounded-full",
                                  actCost === 0 ? "bg-green-500/10 text-green-600" : "bg-primary/10 text-primary"
                                )}>
                                  {actCost === 0 ? 'Free' : `EGP ${Number(actCost).toLocaleString()}`}
                                </span>
                              )}
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  </div>
                </GlassCard>
              ))}
            </div>

            {/* Price Breakdown */}
            {plan.estimatedTotal && (
              <GlassPanel className="!p-0 overflow-hidden">
                <div className="bg-gradient-to-r from-emerald-500/10 to-teal-500/10 px-6 py-3 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-emerald-500" style={{ fontVariationSettings: "'FILL' 1" }}>payments</span>
                    <span className="text-xs font-bold text-emerald-500 uppercase tracking-wider">Estimated Price Breakdown</span>
                  </div>
                </div>
                <div className="p-6 space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-blue-400 text-lg">flight</span>
                      <span className="text-on-surface-variant">Flight</span>
                    </div>
                    <span className="font-bold">{formatPrice(plan.estimatedTotal.flight)}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-amber-400 text-lg">hotel</span>
                      <span className="text-on-surface-variant">Hotel ({days} nights)</span>
                    </div>
                    <span className="font-bold">{formatPrice(plan.estimatedTotal.hotel)}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-purple-400 text-lg">local_activity</span>
                      <span className="text-on-surface-variant">Activities & Tours</span>
                    </div>
                    <span className="font-bold">{formatPrice(plan.estimatedTotal.activities)}</span>
                  </div>
                  <div className="h-px bg-outline/20 my-2" />
                  <div className="flex items-center justify-between">
                    <span className="font-headline font-bold text-lg">Estimated Total</span>
                    <span className="font-headline font-black text-2xl text-primary">
                      {plan.estimatedTotal.currency || 'EGP'} {Number(plan.estimatedTotal.total || 0).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-xs text-on-surface-variant/60 mt-1">
                    * Prices are estimates based on current database listings. Actual prices may vary at time of booking.
                  </p>
                </div>
              </GlassPanel>
            )}

            {/* Action Buttons */}
            <div className="flex justify-center gap-4 mt-8 flex-wrap">
              <button
                onClick={handleGenerate}
                className="flex items-center gap-2 font-bold rounded-full py-3 px-6 bg-surface-container text-on-surface hover:bg-surface-container-high transition-all text-sm"
              >
                <span className="material-symbols-outlined text-lg">refresh</span>
                Regenerate
              </button>
              <button
                onClick={isSaved ? () => navigate(ROUTES.TRIPS) : handleSaveTrip}
                className={cn(
                  'font-headline font-bold rounded-full py-3 px-8 transition-all flex items-center gap-2 shadow-sm text-sm',
                  isSaved
                    ? 'bg-secondary-container text-on-secondary-container hover:bg-secondary-container/80'
                    : 'bg-surface-container-high text-on-surface hover:bg-surface-container-highest'
                )}
              >
                <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: isSaved ? '"FILL" 1' : '"FILL" 0' }}>
                  {isSaved ? 'bookmark_added' : 'bookmark_add'}
                </span>
                {isSaved ? 'Saved — View Trips' : 'Save This Trip'}
              </button>
            </div>
          </div>
        )}
      </div>
    </PageShell>
  );
}
