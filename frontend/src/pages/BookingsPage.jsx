import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import PageShell from "@/components/common/PageShell";
import GlassCard from "@/components/common/GlassCard";
import EmptyState from "@/components/common/EmptyState";
import StatusBadge from "@/components/common/StatusBadge";
import LoadingSkeleton from "@/components/common/LoadingSkeleton";
import { formatCurrency } from "@/utils/formatCurrency";
import { ROUTES } from "@/constants/routes";
import { bookingsAPI } from "@/api/bookings";
import { cn } from "@/utils/cn";

const TABS = ["All", "Flights", "Hotels", "Tours"];

function BookingSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <div
          key={i}
          className="glass-card-subtle rounded-[2rem] p-6 animate-pulse"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-surface-container" />
              <div className="space-y-2 flex-1">
                <div className="h-5 w-48 bg-surface-container rounded-lg" />
                <div className="h-4 w-64 bg-surface-container/60 rounded-lg" />
                <div className="h-3 w-36 bg-surface-container/40 rounded-lg" />
              </div>
            </div>
            <div className="text-right space-y-1">
              <div className="h-6 w-24 bg-surface-container rounded-lg ml-auto" />
              <div className="h-3 w-16 bg-surface-container/60 rounded-lg ml-auto" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function BookingsPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("All");
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchBookings() {
      setLoading(true);
      setError(null);
      try {
        const data = await bookingsAPI.list();
        // Transform backend Booking objects into frontend display shape
        const transformed = (Array.isArray(data) ? data : []).map((b) => {
          let type = "flight";
          let route = "";
          let details = "";

          let itemId = null;

          if (b.tour) {
            type = "tour";
            itemId = b.tour.id;
            route = b.tour.title || "Tour";
            details = `${b.tour.location || ""} · ${b.tour.duration || ""}`;
          } else if (b.hotel && b.flight) {
            type = "package";
            itemId = b.flight.id; // Using flight ID to route to flight details for package
            route = `${b.flight.departureCity} → ${b.flight.arrivalCity}`;
            details = `${b.flight.airlineName || ""} + ${b.hotel.name || ""}`;
          } else if (b.flight) {
            type = "flight";
            itemId = b.flight.id;
            route = `${b.flight.departureCity} → ${b.flight.arrivalCity}`;
            details = `${b.flight.airlineName || ""} ${b.flight.flightNumber || ""} · ${b.flight.cabinClass || "Economy"}`;
          } else if (b.hotel) {
            type = "hotel";
            itemId = b.hotel.id;
            route = b.hotel.name || "Hotel";
            details = `${b.hotel.city || ""} · ${b.hotel.roomType || "Standard"}`;
          }

          return {
            id: b.id,
            itemId,
            confirmationCode: b.transactionId || `VGA-${b.id}`,
            type,
            status: b.status || "PENDING",
            route,
            details,
            date: b.bookingDate,
            totalAmount: b.totalPrice,
            isPaid: b.paid,
            loyaltyPointsEarned: b.loyaltyPointsEarned || 0,
            // Keep raw item refs for confirmation page
            _tour: b.tour,
            _flight: b.flight,
            _hotel: b.hotel,
          };
        });
        setBookings(transformed);
      } catch (err) {
        console.error("Failed to fetch bookings:", err);
        setError("Failed to load bookings");
      } finally {
        setLoading(false);
      }
    }
    fetchBookings();
  }, []);

  const filtered =
    activeTab === "All"
      ? bookings
      : bookings.filter((b) => {
          const tab = activeTab.toLowerCase();
          if (tab === "flights")
            return b.type === "flight" || b.type === "package";
          if (tab === "hotels")
            return b.type === "hotel" || b.type === "package";
          if (tab === "tours") return b.type === "tour";
          return true;
        });

  return (
    <PageShell>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 animate-fade-in">
        <h1 className="font-headline text-4xl sm:text-5xl font-extrabold tracking-tighter text-on-surface mb-2">
          My Bookings
        </h1>
        <p className="text-on-surface-variant mb-8">
          {loading
            ? "Loading..."
            : `${bookings.length} total booking${bookings.length !== 1 ? "s" : ""}`}
        </p>

        {/* Tabs */}
        <div className="flex gap-2 mb-8">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "px-5 py-2.5 rounded-full text-sm font-bold transition-all",
                activeTab === tab
                  ? "bg-primary text-white shadow-primary-glow"
                  : "bg-white/50 text-on-surface-variant hover:bg-white/80",
              )}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Bookings List */}
        {loading ? (
          <BookingSkeleton />
        ) : error ? (
          <EmptyState
            icon="error"
            title="Something Went Wrong"
            description={error}
            action={
              <button
                onClick={() => window.location.reload()}
                className="btn-primary"
              >
                Try Again
              </button>
            }
          />
        ) : filtered.length === 0 ? (
          <EmptyState
            icon="confirmation_number"
            title="No Bookings Found"
            description={`You haven't made any ${activeTab === "All" ? "" : activeTab.toLowerCase() + " "}bookings yet.`}
            action={
              <Link
                to={
                  activeTab === "Hotels"
                    ? ROUTES.HOTELS
                    : activeTab === "Tours"
                      ? ROUTES.TOURS
                      : ROUTES.FLIGHTS
                }
                className="btn-primary"
              >
                Browse {activeTab === "All" ? "Flights" : activeTab}
              </Link>
            }
          />
        ) : (
          <div className="space-y-4">
            {filtered.map((booking) => {
              const detailRoute =
                booking.type === "flight" || booking.type === "package"
                  ? `${ROUTES.FLIGHTS}/${booking.itemId || booking.id}`
                  : booking.type === "hotel"
                    ? `${ROUTES.HOTELS}/${booking.itemId || booking.id}`
                    : booking.type === "tour"
                      ? `${ROUTES.TOURS}/${booking.itemId || booking.id}`
                      : "#";
              return (
                <GlassCard
                  key={booking.id}
                  hover
                  onClick={() => {
                    if (booking.status === "CONFIRMED") {
                      // Build the item object from the raw booking data
                      const item = booking._tour || booking._flight || booking._hotel || {};
                      navigate(ROUTES.BOOKING_CONFIRMATION, {
                        state: {
                          booking: {
                            confirmationCode: booking.confirmationCode,
                            status: booking.status,
                            totalAmount: booking.totalAmount,
                            type: booking.type,
                            item,
                            loyaltyPointsEarned: booking.loyaltyPointsEarned,
                          },
                        },
                      });
                    } else {
                      navigate(detailRoute);
                    }
                  }}
                  className="!p-6 cursor-pointer"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div
                        className={cn(
                          "w-12 h-12 rounded-2xl flex items-center justify-center shrink-0",
                          booking.type === "flight" ||
                            booking.type === "package"
                            ? "bg-primary/10"
                            : booking.type === "hotel"
                              ? "bg-secondary/10"
                              : "bg-tertiary/10",
                        )}
                      >
                        <span
                          className={cn(
                            "material-symbols-outlined text-2xl",
                            booking.type === "flight" ||
                              booking.type === "package"
                              ? "text-primary"
                              : booking.type === "hotel"
                                ? "text-secondary"
                                : "text-tertiary",
                          )}
                        >
                          {booking.type === "flight"
                            ? "flight"
                            : booking.type === "hotel"
                              ? "hotel"
                              : booking.type === "tour"
                                ? "explore"
                                : "package_2"}
                        </span>
                      </div>
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <p className="font-bold text-base">{booking.route}</p>
                          <StatusBadge status={booking.status} />
                        </div>
                        <p className="text-sm text-on-surface-variant">
                          {booking.details}
                        </p>
                        <p className="text-xs text-outline mt-1">
                          {booking.confirmationCode} ·{" "}
                          {booking.date
                            ? new Date(booking.date).toLocaleDateString(
                                "en-US",
                                {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                },
                              )
                            : ""}
                        </p>
                      </div>
                    </div>
                    <div className="text-right sm:min-w-[120px]">
                      <p className="font-headline text-xl font-extrabold">
                        {formatCurrency(booking.totalAmount)}
                      </p>
                      <p
                        className={cn(
                          "text-[10px] font-bold uppercase",
                          booking.isPaid ? "text-green-600" : "text-amber-500",
                        )}
                      >
                        {booking.isPaid ? "✓ Paid" : "⏳ Pending"}
                      </p>
                    </div>
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
