import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageShell from '@/components/common/PageShell';
import EmptyState from '@/components/common/EmptyState';
import useTripsStore from '@/store/useTripsStore';
import GlassCard from '@/components/common/GlassCard';
import { ROUTES } from '@/constants/routes';
import { cn } from '@/utils/cn';

export default function TripsPage() {
  const { trips, removeTrip } = useTripsStore();
  const navigate = useNavigate();
  const [expandedId, setExpandedId] = useState(null);

  return (
    <PageShell>
      <div className="max-w-5xl mx-auto px-6 py-10">
        <h1 className="font-headline text-4xl font-extrabold tracking-tight mb-8">My Trips</h1>

        {trips.length === 0 ? (
          <EmptyState
            icon="luggage"
            title="No Trips Yet"
            description="Plan your first trip and it will appear here."
            action={
              <button onClick={() => navigate(ROUTES.TRIP_PLANNER)} className="btn-primary">
                Plan a Trip
              </button>
            }
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {trips.map((trip) => {
              const isExpanded = expandedId === trip.id;
              const visibleDays = isExpanded
                ? trip.itinerary
                : trip.itinerary?.slice(0, 2);

              return (
                <GlassCard key={trip.id} className="relative overflow-hidden group p-0">
                  <div className="absolute inset-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] z-0 pointer-events-none" />

                  <div className="p-6 relative z-10">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-headline text-2xl font-bold mb-1">{trip.destination}</h3>
                        <p className="text-sm text-on-surface-variant flex items-center gap-1 font-medium">
                          <span className="material-symbols-outlined text-sm">calendar_month</span>
                          {trip.days} Days Itinerary
                        </p>
                      </div>
                      <button
                        onClick={() => removeTrip(trip.id)}
                        className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:text-error hover:bg-error/10 transition-colors"
                        title="Remove Trip"
                      >
                        <span className="material-symbols-outlined text-sm">delete</span>
                      </button>
                    </div>

                    {trip.interests && trip.interests.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-6">
                        {trip.interests.map(interest => (
                          <span key={interest} className="text-[10px] uppercase font-bold tracking-widest text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                            {interest}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="space-y-3">
                      {visibleDays?.map((day) => (
                        <div key={day.day} className="flex gap-3">
                          <div className="w-8 h-8 rounded-lg bg-surface-container-high flex items-center justify-center shrink-0">
                            <span className="font-headline font-bold text-sm">D{day.day}</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium leading-tight mt-1 truncate">{day.title}</p>
                            {isExpanded && day.activities?.length > 0 && (
                              <ul className="mt-1.5 space-y-1">
                                {day.activities.map((act, i) => (
                                  <li key={i} className="flex items-start gap-1.5 text-xs text-on-surface-variant">
                                    <span className="material-symbols-outlined text-primary text-xs mt-0.5 shrink-0" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                                    {act}
                                  </li>
                                ))}
                              </ul>
                            )}
                          </div>
                        </div>
                      ))}
                      {!isExpanded && trip.itinerary && trip.itinerary.length > 2 && (
                        <p className="text-xs text-outline font-bold pl-11">
                          + {trip.itinerary.length - 2} more days
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="px-6 py-4 border-t border-outline-variant/10 bg-surface-container-low/50 relative z-10 flex justify-between items-center">
                    <button
                      onClick={() => navigate(ROUTES.TRIP_PLANNER)}
                      className="text-xs text-on-surface-variant hover:text-primary transition-colors flex items-center gap-1"
                    >
                      <span className="material-symbols-outlined text-sm">refresh</span>
                      Replan
                    </button>
                    <button
                      onClick={() => setExpandedId(isExpanded ? null : trip.id)}
                      className={cn(
                        'text-sm font-bold transition-colors flex items-center gap-1',
                        isExpanded ? 'text-on-surface-variant' : 'text-primary hover:text-primary-dim'
                      )}
                    >
                      {isExpanded ? 'Show Less' : 'View Full Itinerary'}
                      <span className="material-symbols-outlined text-sm">
                        {isExpanded ? 'expand_less' : 'arrow_forward'}
                      </span>
                    </button>
                  </div>
                </GlassCard>
              );
            })}
          </div>
        )}
      </div>
    </PageShell>
  );
}
