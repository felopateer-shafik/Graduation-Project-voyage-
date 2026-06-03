import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PageShell from "@/components/common/PageShell";
import GlassPanel from "@/components/common/GlassPanel";
import GlassCard from "@/components/common/GlassCard";
import LoadingSkeleton from "@/components/common/LoadingSkeleton";
import { flightsAPI } from "@/api/flights";
import { bookingsAPI } from "@/api/bookings";
import { loyaltyAPI } from "@/api/loyalty";
import { formatCurrency } from "@/utils/formatCurrency";
import useBookingStore from "@/store/useBookingStore";
import { ROUTES } from "@/constants/routes";
import { cn } from "@/utils/cn";
import toast from "react-hot-toast";

export default function FlightDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { setBookingItem } = useBookingStore();
  const [flight, setFlight] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFreezing, setIsFreezing] = useState(false);
  const [existingFreeze, setExistingFreeze] = useState(null);
  const [freezePaymentMethod, setFreezePaymentMethod] = useState("WALLET");
  const [freezeWalletBalance, setFreezeWalletBalance] = useState(null);
  const [freezeWalletLoading, setFreezeWalletLoading] = useState(false);
  const [freezeCard, setFreezeCard] = useState({
    cardNumber: "",
    cardHolderName: "",
    expiryDate: "",
    cvv: "",
  });

  useEffect(() => {
    async function fetchFlight() {
      setLoading(true);
      try {
        const data = await flightsAPI.getById(id);
        setFlight(data);
      } catch (err) {
        console.error("Failed to fetch flight:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchFlight();
  }, [id]);

  useEffect(() => {
    let isMounted = true;

    if (freezePaymentMethod !== "WALLET" || !flight) {
      return undefined;
    }

    async function fetchWalletBalance() {
      setFreezeWalletLoading(true);
      try {
        const balance = await loyaltyAPI.getBalance();
        if (isMounted) {
          setFreezeWalletBalance(balance.walletBalance ?? 0);
        }
      } catch (err) {
        if (isMounted) {
          setFreezeWalletBalance(null);
        }
      } finally {
        if (isMounted) {
          setFreezeWalletLoading(false);
        }
      }
    }

    fetchWalletBalance();

    return () => {
      isMounted = false;
    };
  }, [flight, freezePaymentMethod]);

  useEffect(() => {
    async function checkExistingFreeze() {
      try {
        const freezes = await bookingsAPI.listFreezes();
        const freeze = freezes.find(
          (f) => String(f.booking?.flight?.id) === String(id),
        );
        setExistingFreeze(freeze || null);
      } catch (err) {
        console.error("Failed to check freeze status:", err);
      }
    }
    if (flight) checkExistingFreeze();
  }, [flight, id]);

  const handleCheckout = () => {
    setBookingItem(flight, "flight");
    navigate(ROUTES.CHECKOUT);
  };

  const handleFreezeCardChange = (field, value) => {
    setFreezeCard((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleFreezePrice = async () => {
    try {
      setIsFreezing(true);
      const request = {
        type: "flight",
        item: flight,
        paymentMethod: freezePaymentMethod,
      };

      if (freezePaymentMethod === "CARD") {
        request.paymentDetails = {
          cardNumber: freezeCard.cardNumber.replace(/\s/g, ""),
          cardHolderName: freezeCard.cardHolderName,
          expiryDate: freezeCard.expiryDate,
          cvv: freezeCard.cvv,
        };
      }

      const freezeResponse = await bookingsAPI.freezePrice(request);
      toast.success(
        freezePaymentMethod === "WALLET"
          ? `Price frozen! ${formatCurrency(freezeResponse.freezeFee)} fee deducted.`
          : `Price frozen! ${formatCurrency(freezeResponse.freezeFee)} fee charged to card.`,
      );
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to freeze price.");
    } finally {
      setIsFreezing(false);
    }
  };

  if (loading) {
    return (
      <PageShell>
        <div className="max-w-5xl mx-auto px-6 py-10 space-y-6">
          <LoadingSkeleton variant="text" className="!h-10 !w-64" />
          <LoadingSkeleton variant="card" className="!h-64" />
          <LoadingSkeleton variant="card" className="!h-48" />
        </div>
      </PageShell>
    );
  }

  if (!flight) {
    return (
      <PageShell>
        <div className="max-w-5xl mx-auto px-6 py-20 text-center">
          <h1 className="font-headline text-3xl font-bold">Flight Not Found</h1>
        </div>
      </PageShell>
    );
  }

  const freezeFee = flight.price * 0.05;
  const walletAfterFreeze =
    freezeWalletBalance == null ? null : freezeWalletBalance - freezeFee;

  return (
    <PageShell>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8 animate-fade-in">
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <nav className="flex items-center gap-2 text-on-surface-variant text-sm mb-2">
              <button
                onClick={() => navigate(-1)}
                className="font-medium hover:text-primary transition-colors"
              >
                Flights
              </button>
              <span className="material-symbols-outlined text-xs">
                chevron_right
              </span>
              <span className="text-primary font-bold">{flight.to.city}</span>
            </nav>
            <h1 className="font-headline text-4xl md:text-5xl font-extrabold tracking-tighter text-on-surface leading-none">
              Flight Details
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <span className="badge-confirmed flex items-center gap-1.5">
              <span
                className="material-symbols-outlined text-sm"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                check_circle
              </span>
              Available
            </span>
            <span
              className={cn(
                "px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest",
                flight.refundable
                  ? "bg-green-50 text-green-700"
                  : "bg-surface-container-low text-on-surface-variant",
              )}
            >
              {flight.refundable ? "Refundable" : "Non-refundable"}
            </span>
            <span className="px-4 py-1.5 rounded-full bg-surface-container-low text-on-surface-variant text-xs font-bold uppercase tracking-widest">
              {flight.flightNumber}
            </span>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Flight Journey Card */}
          <div className="lg:col-span-2 space-y-6">
            <GlassPanel className="relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                <span className="material-symbols-outlined text-[6rem]">
                  flight
                </span>
              </div>

              <div className="flex flex-col md:flex-row justify-between items-center gap-8 relative z-10">
                {/* Origin */}
                <div className="text-center md:text-left">
                  <span className="font-headline text-5xl font-black text-primary leading-none block">
                    {flight.from.code}
                  </span>
                  <span className="text-on-surface-variant font-semibold text-sm mt-1 block">
                    {flight.from.airport}
                  </span>
                </div>

                {/* Path Visual */}
                <div className="flex-1 flex flex-col items-center gap-2 min-w-[120px]">
                  <span className="text-xs font-bold text-primary bg-primary/10 px-3 py-1 rounded-full">
                    {flight.duration}
                  </span>
                  <div className="w-full h-px flight-path-dash relative flex items-center justify-center">
                    <span
                      className="material-symbols-outlined text-primary absolute bg-white/50 backdrop-blur-sm p-1 rounded-full"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      flight_takeoff
                    </span>
                  </div>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-outline">
                    {flight.stopLabel}
                  </span>
                </div>

                {/* Destination */}
                <div className="text-center md:text-right">
                  <span className="font-headline text-5xl font-black text-on-surface leading-none block">
                    {flight.to.code}
                  </span>
                  <span className="text-on-surface-variant font-semibold text-sm mt-1 block">
                    {flight.to.airport}
                  </span>
                </div>
              </div>

              {/* Flight Details Grid */}
              <div className="mt-12 pt-8 border-t border-outline-variant/10 grid grid-cols-2 md:grid-cols-4 gap-6">
                <div>
                  <p className="text-[10px] uppercase font-bold tracking-widest text-outline mb-1">
                    Airline
                  </p>
                  <p className="font-bold text-sm">{flight.airline}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold tracking-widest text-outline mb-1">
                    Aircraft
                  </p>
                  <p className="font-bold text-sm">{flight.aircraft}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold tracking-widest text-outline mb-1">
                    Class
                  </p>
                  <p className="font-bold text-sm">{flight.class}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold tracking-widest text-outline mb-1">
                    Baggage
                  </p>
                  <p className="font-bold text-sm">{flight.baggage}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold tracking-widest text-outline mb-1">
                    Departure
                  </p>
                  <p className="font-bold text-sm">
                    {flight.departureFormatted}
                  </p>
                  <p className="text-xs text-on-surface-variant">
                    {flight.departureTimeLabel?.replace("_", " ")}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold tracking-widest text-outline mb-1">
                    Arrival
                  </p>
                  <p className="font-bold text-sm">{flight.arrivalFormatted}</p>
                  <p className="text-xs text-on-surface-variant">
                    {flight.arrivalTimeLabel?.replace("_", " ")}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold tracking-widest text-outline mb-1">
                    Stops
                  </p>
                  <p className="font-bold text-sm capitalize">
                    {flight.stopsText}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold tracking-widest text-outline mb-1">
                    Days Left
                  </p>
                  <p className="font-bold text-sm">
                    {flight.daysLeft != null
                      ? `${flight.daysLeft} day${flight.daysLeft !== 1 ? "s" : ""}`
                      : "N/A"}
                  </p>
                </div>
              </div>
            </GlassPanel>
          </div>

          {/* Right: Fare Summary */}
          <div className="space-y-6">
            <div className="bg-surface-container-high/50 backdrop-blur-md rounded-[2rem] p-8 flex flex-col gap-6 ghost-border-light">
              <h3 className="font-headline font-bold text-xl">Fare Summary</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-on-surface-variant">Flight price</span>
                  <span className="font-semibold">
                    {formatCurrency(flight.price)}
                  </span>
                </div>
                <div className="h-px bg-outline-variant/10 my-2" />
                <div className="flex justify-between items-end">
                  <span className="text-sm font-bold text-primary uppercase tracking-tighter">
                    Total Price
                  </span>
                  <div className="text-right">
                    <p className="text-2xl font-black font-headline">
                      {formatCurrency(flight.price)}
                    </p>
                    <p className="text-[10px] text-outline font-bold">
                      ONE WAY
                    </p>
                  </div>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                className="btn-primary w-full group"
              >
                Check Out
                <span className="material-symbols-outlined text-xl group-hover:translate-x-1 transition-transform">
                  arrow_forward
                </span>
              </button>

              <div className="rounded-2xl border border-outline-variant/20 bg-white/40 p-4 space-y-4">
                <div>
                  <p className="text-[10px] uppercase font-bold tracking-widest text-outline">
                    Price freeze payment
                  </p>
                  <p className="text-sm font-bold">
                    {formatCurrency(freezeFee)} due today
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {["WALLET", "CARD"].map((method) => (
                    <button
                      key={method}
                      type="button"
                      onClick={() => setFreezePaymentMethod(method)}
                      className={cn(
                        "rounded-xl border px-3 py-2 text-sm font-bold transition",
                        freezePaymentMethod === method
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-outline-variant/20 text-on-surface-variant hover:border-outline-variant/40",
                      )}
                    >
                      {method === "WALLET" ? "Wallet" : "Card"}
                    </button>
                  ))}
                </div>

                {freezePaymentMethod === "WALLET" && (
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-on-surface-variant">
                        Wallet balance
                      </span>
                      <span className="font-bold">
                        {freezeWalletLoading
                          ? "Loading..."
                          : freezeWalletBalance == null
                            ? "Unavailable"
                            : formatCurrency(freezeWalletBalance)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-on-surface-variant">
                        After freeze
                      </span>
                      <span
                        className={cn(
                          "font-bold",
                          walletAfterFreeze != null &&
                            walletAfterFreeze < 0 &&
                            "text-red-600",
                        )}
                      >
                        {freezeWalletLoading || walletAfterFreeze == null
                          ? "Unavailable"
                          : formatCurrency(walletAfterFreeze)}
                      </span>
                    </div>
                  </div>
                )}

                {freezePaymentMethod === "CARD" && (
                  <div className="space-y-3">
                    <label
                      htmlFor="freeze-card-number"
                      className="block text-sm font-bold"
                    >
                      Card Number
                      <input
                        id="freeze-card-number"
                        value={freezeCard.cardNumber}
                        onChange={(event) =>
                          handleFreezeCardChange(
                            "cardNumber",
                            event.target.value,
                          )
                        }
                        className="mt-1 w-full rounded-xl border border-outline-variant/20 bg-white/70 px-3 py-2 text-sm focus:border-primary focus:outline-none"
                        placeholder="1234 5678 9012 3456"
                      />
                    </label>
                    <label
                      htmlFor="freeze-cardholder-name"
                      className="block text-sm font-bold"
                    >
                      Cardholder Name
                      <input
                        id="freeze-cardholder-name"
                        value={freezeCard.cardHolderName}
                        onChange={(event) =>
                          handleFreezeCardChange(
                            "cardHolderName",
                            event.target.value,
                          )
                        }
                        className="mt-1 w-full rounded-xl border border-outline-variant/20 bg-white/70 px-3 py-2 text-sm focus:border-primary focus:outline-none"
                        placeholder="As shown on card"
                      />
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <label
                        htmlFor="freeze-expiry-date"
                        className="block text-sm font-bold"
                      >
                        Expiry Date
                        <input
                          id="freeze-expiry-date"
                          value={freezeCard.expiryDate}
                          onChange={(event) =>
                            handleFreezeCardChange(
                              "expiryDate",
                              event.target.value,
                            )
                          }
                          className="mt-1 w-full rounded-xl border border-outline-variant/20 bg-white/70 px-3 py-2 text-sm focus:border-primary focus:outline-none"
                          placeholder="MM/YY"
                        />
                      </label>
                      <label
                        htmlFor="freeze-cvv"
                        className="block text-sm font-bold"
                      >
                        CVV
                        <input
                          id="freeze-cvv"
                          type="password"
                          value={freezeCard.cvv}
                          onChange={(event) =>
                            handleFreezeCardChange("cvv", event.target.value)
                          }
                          className="mt-1 w-full rounded-xl border border-outline-variant/20 bg-white/70 px-3 py-2 text-sm focus:border-primary focus:outline-none"
                          placeholder="123"
                        />
                      </label>
                    </div>
                  </div>
                )}
              </div>

              <p className="text-xs text-red-500 font-bold text-center">
                Note: the price freeze fee is not refundable.
              </p>
              <button
                onClick={handleFreezePrice}
                disabled={isFreezing || !!existingFreeze}
                className="btn-secondary w-full border border-primary/30 hover:border-primary transition"
              >
                {existingFreeze
                  ? "Price Already Frozen"
                  : isFreezing
                    ? "Processing..."
                    : `Freeze Price (${formatCurrency(freezeFee)} Fee)`}
              </button>
            </div>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
