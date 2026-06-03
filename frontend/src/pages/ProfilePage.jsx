import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/common/Navbar";
import useAuthStore from "@/store/useAuthStore";
import { getLoyaltyTier, LOYALTY_TIERS } from "@/constants/loyaltyTiers";
import { authAPI } from "@/api/auth";
import { loyaltyAPI } from "@/api/loyalty";
import { bookingsAPI } from "@/api/bookings";
import { formatCurrency } from "@/utils/formatCurrency";
import { ROUTES } from "@/constants/routes";
import toast from "react-hot-toast";

function computeLoyaltyProgress(points) {
  const tierValues = Object.values(LOYALTY_TIERS);
  const tier = getLoyaltyTier(points);
  const currentIndex = tierValues.findIndex((t) => t.name === tier.name);
  const nextTier = tierValues[currentIndex + 1] || null;
  const progress = nextTier
    ? Math.min(
        100,
        Math.round(
          ((points - tier.minPoints) / (nextTier.minPoints - tier.minPoints)) *
            100,
        ),
      )
    : 100;
  const pointsToNext = nextTier ? Math.max(0, nextTier.minPoints - points) : 0;
  return { tier, nextTier, progress, pointsToNext };
}

export default function ProfilePage() {
  const { user, setUser } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ fullName: "", phone: "" });
  const [isSaving, setIsSaving] = useState(false);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const fileInputRef = useRef(null);

  const [redeemInput, setRedeemInput] = useState("");
  const [isRedeeming, setIsRedeeming] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [freezes, setFreezes] = useState([]);

  // Refresh user data, loyalty history, and active freezes on mount
  useEffect(() => {
    authAPI
      .getMe()
      .then((freshUser) => setUser(freshUser))
      .catch(() => {});
    loyaltyAPI
      .getHistory()
      .then(setTransactions)
      .catch(() => {});
    bookingsAPI
      .listFreezes()
      .then(setFreezes)
      .catch(() => {});
  }, []);

  if (!user) return null;

  const loyaltyPoints = user.loyaltyPoints ?? 0;
  const { tier, nextTier, progress, pointsToNext } =
    computeLoyaltyProgress(loyaltyPoints);

  const redeemPoints = parseInt(redeemInput, 10) || 0;
  const redeemCredit =
    redeemPoints >= 500 ? (redeemPoints / 100).toFixed(2) : 0;

  const handleRedeem = async () => {
    if (redeemPoints < 500) {
      toast.error("Minimum redemption is 500 points");
      return;
    }
    if (redeemPoints % 100 !== 0) {
      toast.error("Points must be a multiple of 100");
      return;
    }
    if (redeemPoints > loyaltyPoints) {
      toast.error("Insufficient points");
      return;
    }
    try {
      setIsRedeeming(true);
      const result = await loyaltyAPI.redeem(redeemPoints);
      const freshUser = await authAPI.getMe();
      setUser(freshUser);
      const freshTx = await loyaltyAPI.getHistory();
      setTransactions(freshTx);
      setRedeemInput("");
      toast.success(
        result.message ||
          `Redeemed ${redeemPoints} pts for ${redeemCredit} EGP credit!`,
      );
    } catch (err) {
      toast.error(err?.response?.data?.message || "Redemption failed");
    } finally {
      setIsRedeeming(false);
    }
  };

  const handleEditClick = () => {
    setEditForm({ fullName: user.fullName || "", phone: user.phone || "" });
    setIsEditing(true);
  };

  const handleCancelEdit = () => setIsEditing(false);

  const handleSaveProfile = async () => {
    try {
      setIsSaving(true);
      const updatedUser = await authAPI.updateProfile(editForm);
      setUser(updatedUser);
      setIsEditing(false);
      toast.success("Profile updated!");
    } catch {
      toast.error("Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  const handleAvatarClick = () => fileInputRef.current?.click();

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be under 5 MB");
      return;
    }
    try {
      setAvatarUploading(true);
      const updatedUser = await authAPI.uploadAvatar(file);
      setUser(updatedUser);
      toast.success("Profile picture updated!");
    } catch (err) {
      const msg = err?.response?.data?.message || "Failed to upload picture";
      toast.error(msg);
    } finally {
      setAvatarUploading(false);
      e.target.value = "";
    }
  };

  const handleDeleteAvatar = async () => {
    if (!user.profilePictureUrl) return;
    try {
      setAvatarUploading(true);
      const updatedUser = await authAPI.deleteAvatar();
      setUser(updatedUser);
      toast.success("Profile picture removed");
    } catch {
      toast.error("Failed to remove picture");
    } finally {
      setAvatarUploading(false);
    }
  };

  const memberSinceYear = user.createdAt
    ? new Date(user.createdAt).getFullYear()
    : new Date().getFullYear();

  return (
    <div className="min-h-screen bg-background text-on-surface">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 py-12 md:py-16 pt-28">
        {/* ─── Profile Header ─── */}
        <header className="relative mb-12 flex flex-col md:flex-row items-center md:items-end gap-8 glass-card rounded-[3rem] p-8 md:p-10">
          {/* Avatar */}
          <div className="relative">
            <div
              className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-white/60 shadow-2xl ring-4 ring-primary/5 cursor-pointer"
              onClick={handleAvatarClick}
            >
              {user.profilePictureUrl ? (
                <img
                  src={user.profilePictureUrl}
                  alt={user.fullName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                  <span
                    className="material-symbols-outlined text-primary text-7xl"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    person
                  </span>
                </div>
              )}
              {avatarUploading && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center rounded-full">
                  <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                </div>
              )}
            </div>
            <button
              onClick={handleAvatarClick}
              disabled={avatarUploading}
              className="absolute bottom-2 right-2 bg-primary text-white p-2 rounded-full shadow-lg hover:bg-primary-dim transition-colors disabled:opacity-50"
            >
              <span className="material-symbols-outlined text-sm">edit</span>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={handleAvatarChange}
            />
          </div>

          {/* Name & Badges */}
          <div className="text-center md:text-left pb-2 flex-grow">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-on-surface mb-3 font-headline leading-tight">
              {user.fullName || "Traveler"}
            </h1>
            <div className="flex items-center gap-3 justify-center md:justify-start flex-wrap">
              <span
                className="px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase text-white"
                style={{ backgroundColor: tier.color }}
              >
                {tier.name} Member
              </span>
              {user.profilePictureUrl && (
                <button
                  onClick={handleDeleteAvatar}
                  disabled={avatarUploading}
                  className="text-xs text-outline hover:text-error transition-colors disabled:opacity-50"
                >
                  Remove photo
                </button>
              )}
            </div>
          </div>

          {/* Member Since */}
          <div className="hidden lg:flex flex-col items-end gap-2 pb-2">
            <span className="text-xs font-bold text-outline uppercase tracking-widest">
              Member Since
            </span>
            <span className="text-lg font-bold text-on-surface">
              {user.createdAt
                ? new Date(user.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                  })
                : "January 2024"}
            </span>
          </div>
        </header>

        {/* ─── Main Content ─── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <section className="space-y-8">
            {/* Loyalty Points Card */}
            <div className="glass-card rounded-[2.5rem] p-8">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-xl font-extrabold font-headline">
                  Loyalty Points
                </h2>
                <div className="p-2 bg-primary/10 rounded-xl">
                  <span className="material-symbols-outlined text-primary">
                    military_tech
                  </span>
                </div>
              </div>

              <div className="space-y-8">
                <div>
                  <div className="flex justify-between items-end mb-3">
                    <span className="text-4xl font-black text-primary tracking-tight">
                      {loyaltyPoints.toLocaleString()}
                    </span>
                    <span className="text-[10px] font-extrabold text-outline uppercase tracking-[0.2em]">
                      Points Total
                    </span>
                  </div>
                  <div className="w-full h-3 bg-surface-container/50 rounded-full overflow-hidden p-0.5 border border-white/20">
                    <div
                      className="h-full bg-gradient-to-r from-primary via-primary-container to-secondary rounded-full shadow-[0_0_12px_rgba(41,76,214,0.3)] transition-all duration-700"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <div className="flex justify-between mt-3">
                    {nextTier ? (
                      <>
                        <span className="text-xs font-semibold text-on-surface-variant">
                          {pointsToNext.toLocaleString()} more to{" "}
                          {nextTier.name}
                        </span>
                        <span className="text-xs font-black text-primary">
                          {progress}%
                        </span>
                      </>
                    ) : (
                      <span className="text-xs font-semibold text-primary">
                        Maximum tier reached!
                      </span>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/40 backdrop-blur-md p-5 rounded-[1.5rem] border border-white/60">
                    <span className="text-[9px] uppercase tracking-[0.2em] text-outline font-extrabold">
                      Wallet Balance
                    </span>
                    <p className="text-2xl font-black text-on-surface mt-1">
                      {formatCurrency(user.walletBalance ?? 0)}
                    </p>
                  </div>
                  <div className="bg-white/40 backdrop-blur-md p-5 rounded-[1.5rem] border border-white/60">
                    <span className="text-[9px] uppercase tracking-[0.2em] text-outline font-extrabold">
                      Member Since
                    </span>
                    <p className="text-2xl font-black text-on-surface mt-1">
                      {memberSinceYear}
                    </p>
                  </div>
                </div>

                {/* Redeem widget */}
                <div className="border-t border-white/30 pt-6 space-y-3">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-outline font-extrabold">
                    Redeem Points
                  </p>
                  <p className="text-xs text-on-surface-variant">
                    100 pts = 1 EGP wallet credit &bull; min 500 pts
                  </p>
                  <div className="flex gap-3">
                    <input
                      type="number"
                      min={500}
                      step={100}
                      value={redeemInput}
                      onChange={(e) => setRedeemInput(e.target.value)}
                      placeholder="e.g. 500"
                      className="flex-1 bg-white/40 border border-white/60 rounded-xl px-4 py-2.5 text-sm font-bold outline-none focus:border-primary transition"
                    />
                    <button
                      onClick={handleRedeem}
                      disabled={isRedeeming || redeemPoints < 500}
                      className="px-5 py-2.5 bg-primary text-white text-sm font-extrabold rounded-xl hover:bg-primary-dim active:scale-95 transition-all disabled:opacity-40"
                    >
                      {isRedeeming ? "..." : `+${redeemCredit} EGP`}
                    </button>
                  </div>
                </div>

                <Link
                  to={ROUTES.BOOKINGS}
                  className="w-full py-4 bg-primary text-white font-extrabold rounded-full shadow-xl shadow-primary/25 hover:bg-primary-dim active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                  View My Bookings
                  <span className="material-symbols-outlined text-lg">
                    confirmation_number
                  </span>
                </Link>
              </div>
            </div>
            {/* Frozen Flights Widget */}
            <div className="glass-card rounded-[2.5rem] p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-extrabold font-headline">
                  Frozen Flights
                </h2>
                <div className="p-2 bg-blue-500/10 rounded-xl">
                  <span className="material-symbols-outlined text-blue-500">
                    ac_unit
                  </span>
                </div>
              </div>
              {freezes.length === 0 ? (
                <div className="text-center py-8">
                  <span className="material-symbols-outlined text-5xl text-outline/30 mb-3 block">
                    ac_unit
                  </span>
                  <p className="text-sm text-on-surface-variant">
                    No price-frozen flights yet.
                  </p>
                  <p className="text-xs text-outline mt-1">
                    Freeze a flight's price to lock it in for 24 hours.
                  </p>
                </div>
              ) : (
                <ul className="space-y-4">
                  {freezes.map((f) => {
                    const flight = f.booking?.flight;
                    const expiresAt = f.expiresAt
                      ? new Date(f.expiresAt)
                      : null;
                    const now = new Date();
                    const hoursLeft = expiresAt
                      ? Math.max(0, Math.round((expiresAt - now) / 3600000))
                      : 0;
                    const isExpired = expiresAt && expiresAt < now;
                    return (
                      <li
                        key={f.id}
                        onClick={() =>
                          flight
                            ? (window.location.href = `${ROUTES.FLIGHTS}/${flight.id}`)
                            : null
                        }
                        className="bg-white/40 backdrop-blur-md rounded-2xl p-4 border border-white/60 cursor-pointer hover:bg-white/60 transition-colors"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span
                              className="material-symbols-outlined text-blue-500 text-lg"
                              style={{ fontVariationSettings: "'FILL' 1" }}
                            >
                              flight
                            </span>
                            <span className="font-bold text-sm">
                              {flight?.airlineName || "Flight"}
                            </span>
                          </div>
                          <span className="text-[10px] font-mono bg-surface-container px-2 py-0.5 rounded">
                            {flight?.flightNumber || ""}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-on-surface-variant mb-2">
                          <span className="font-bold">
                            {flight?.departureCityCode || flight?.departureCity}
                          </span>
                          <span className="material-symbols-outlined text-xs">
                            arrow_forward
                          </span>
                          <span className="font-bold">
                            {flight?.arrivalCityCode || flight?.arrivalCity}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <div>
                            <span className="text-on-surface-variant">
                              Frozen at{" "}
                            </span>
                            <span className="font-black text-primary">
                              {formatCurrency(f.frozenPrice)}
                            </span>
                          </div>
                          <div>
                            <span className="text-on-surface-variant">
                              Fee:{" "}
                            </span>
                            <span className="font-bold text-red-500">
                              {formatCurrency(f.freezeFee)}
                            </span>
                          </div>
                        </div>
                        <div className="mt-2 flex items-center gap-1">
                          <span
                            className={`material-symbols-outlined text-xs ${isExpired ? "text-red-500" : "text-green-600"}`}
                          >
                            {isExpired ? "timer_off" : "timer"}
                          </span>
                          <span
                            className={`text-[10px] font-bold ${isExpired ? "text-red-500" : "text-green-600"}`}
                          >
                            {isExpired ? "Expired" : `${hoursLeft}h left`}
                          </span>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </section>

          {/* ─── Column 2 ─── */}
          <section className="space-y-8">
            {/* Transaction History */}
            {transactions.length > 0 && (
              <div className="glass-card rounded-[2.5rem] p-8">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-extrabold font-headline">
                    Points History
                  </h2>
                  <div className="p-2 bg-primary/10 rounded-xl">
                    <span className="material-symbols-outlined text-primary">
                      history
                    </span>
                  </div>
                </div>
                <ul className="space-y-3">
                  {transactions.slice(0, 8).map((tx) => (
                    <li
                      key={tx.id}
                      className="flex items-center justify-between py-2 border-b border-white/20 last:border-0"
                    >
                      <div>
                        <p className="text-sm font-bold text-on-surface capitalize">
                          {tx.reason === "EARN_BOOKING"
                            ? "Booking reward"
                            : tx.reason === "REDEEM"
                              ? "Points redeemed"
                              : "Adjustment"}
                        </p>
                        <p className="text-[10px] text-outline mt-0.5">
                          {new Date(tx.createdAt).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </p>
                      </div>
                      <span
                        className={`text-sm font-black ${tx.delta > 0 ? "text-green-600" : "text-red-500"}`}
                      >
                        {tx.delta > 0 ? "+" : ""}
                        {tx.delta.toLocaleString()} pts
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Personal Info Card */}
            <div className="glass-card rounded-[2.5rem] p-8">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-xl font-extrabold font-headline">
                  Personal Info
                </h2>
                {!isEditing ? (
                  <button
                    onClick={handleEditClick}
                    className="p-2 bg-primary/10 rounded-xl hover:bg-primary/20 transition"
                  >
                    <span className="material-symbols-outlined text-primary">
                      edit
                    </span>
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button
                      onClick={handleCancelEdit}
                      disabled={isSaving}
                      className="p-2 bg-surface-container rounded-xl hover:bg-surface-variant transition"
                    >
                      <span className="material-symbols-outlined text-on-surface">
                        close
                      </span>
                    </button>
                    <button
                      onClick={handleSaveProfile}
                      disabled={isSaving}
                      className="p-2 bg-primary rounded-xl text-white hover:bg-primary-dim transition"
                    >
                      <span className="material-symbols-outlined">
                        {isSaving ? "hourglass_empty" : "check"}
                      </span>
                    </button>
                  </div>
                )}
              </div>

              <div className="space-y-6">
                <div className="group">
                  <label className="text-[9px] uppercase tracking-[0.2em] text-outline font-extrabold">
                    Full Name
                  </label>
                  <div className="flex justify-between items-center mt-1">
                    {isEditing ? (
                      <input
                        type="text"
                        value={editForm.fullName}
                        onChange={(e) =>
                          setEditForm({ ...editForm, fullName: e.target.value })
                        }
                        className="w-full bg-transparent border-b border-primary/30 outline-none text-on-surface font-bold py-1 focus:border-primary transition"
                      />
                    ) : (
                      <p className="font-bold text-on-surface">
                        {user.fullName || "Not set"}
                      </p>
                    )}
                  </div>
                </div>

                <div className="group">
                  <label className="text-[9px] uppercase tracking-[0.2em] text-outline font-extrabold">
                    Email Address
                  </label>
                  <div className="flex justify-between items-center mt-1">
                    <p className="font-bold text-on-surface opacity-70">
                      {user.email}
                    </p>
                    <span className="text-[9px] text-outline">Read Only</span>
                  </div>
                </div>

                <div className="group">
                  <label className="text-[9px] uppercase tracking-[0.2em] text-outline font-extrabold">
                    Phone
                  </label>
                  <div className="flex justify-between items-center mt-1">
                    {isEditing ? (
                      <input
                        type="tel"
                        value={editForm.phone}
                        onChange={(e) =>
                          setEditForm({ ...editForm, phone: e.target.value })
                        }
                        className="w-full bg-transparent border-b border-primary/30 outline-none text-on-surface font-bold py-1 focus:border-primary transition"
                      />
                    ) : (
                      <p className="font-bold text-on-surface">
                        {user.phone || "Add phone number"}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* ─── Footer ─── */}
      <footer className="bg-white/20 backdrop-blur-xl border-t border-white/40 w-full mt-24 py-16">
        <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="space-y-6">
            <div className="font-headline font-black text-3xl text-primary tracking-tighter">
              Voyage
            </div>
            <p className="text-slate-500 text-sm max-w-sm font-medium leading-relaxed">
              Crafting unforgettable journeys for those who seek the
              extraordinary.
            </p>
            <p className="text-slate-400 text-[10px] font-extrabold uppercase tracking-widest">
              © 2024 Voyage Travel. All rights reserved.
            </p>
          </div>
          <div className="flex flex-wrap gap-8 md:justify-end items-center">
            <Link
              to={ROUTES.CONTACT}
              className="text-slate-600 hover:text-primary transition-colors text-[11px] font-extrabold tracking-widest uppercase"
            >
              Contact Us
            </Link>
            <Link
              to={ROUTES.PRIVACY}
              className="text-slate-600 hover:text-primary transition-colors text-[11px] font-extrabold tracking-widest uppercase"
            >
              Privacy Policy
            </Link>
            <Link
              to={ROUTES.TERMS}
              className="text-slate-600 hover:text-primary transition-colors text-[11px] font-extrabold tracking-widest uppercase"
            >
              Terms
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
