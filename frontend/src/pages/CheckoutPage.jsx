import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import PageShell from '@/components/common/PageShell';
import GlassPanel from '@/components/common/GlassPanel';
import GlassCard from '@/components/common/GlassCard';
import InputField from '@/components/common/InputField';
import { paymentSchema } from '@/utils/validators';
import { formatCurrency } from '@/utils/formatCurrency';
import { bookingsAPI } from '@/api/bookings';
import { loyaltyAPI } from '@/api/loyalty';
import useBookingStore from '@/store/useBookingStore';
import { ROUTES } from '@/constants/routes';
import { cn } from '@/utils/cn';
import { calculateBookingEstimate } from '@/utils/bookingPricing';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { bookingItem, bookingType, bookingDetails, setConfirmation, setProcessing, clearBooking } = useBookingStore();
  const [processing, setLocalProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('visa'); // 'visa' | 'wallet'
  const [walletBalance, setWalletBalance] = useState(null);
  const [walletLoading, setWalletLoading] = useState(false);
  const [walletError, setWalletError] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(paymentSchema),
    defaultValues: { cardNumber: '', cardHolderName: '', expiryDate: '', cvv: '' },
  });

  const estimate = calculateBookingEstimate({ type: bookingType, item: bookingItem, details: bookingDetails });
  const total = estimate.total;
  const walletRemaining = walletBalance == null ? null : walletBalance - total;

  useEffect(() => {
    let isMounted = true;

    if (paymentMethod !== 'wallet' || !bookingItem) {
      return undefined;
    }

    async function fetchWalletBalance() {
      setWalletLoading(true);
      setWalletError(null);
      try {
        const balance = await loyaltyAPI.getBalance();
        if (isMounted) {
          setWalletBalance(balance.walletBalance ?? 0);
        }
      } catch (err) {
        if (isMounted) {
          setWalletError('Could not load wallet balance.');
        }
      } finally {
        if (isMounted) {
          setWalletLoading(false);
        }
      }
    }

    fetchWalletBalance();

    return () => {
      isMounted = false;
    };
  }, [bookingItem, paymentMethod]);

  if (!bookingItem) {
    return (
      <PageShell showFooter={false}>
        <div className="flex items-center justify-center min-h-[calc(100vh-5rem)]">
          <div className="text-center">
            <span className="material-symbols-outlined text-6xl text-outline mb-4 block">shopping_cart</span>
            <h2 className="font-headline text-2xl font-bold mb-2">No items in checkout</h2>
            <p className="text-on-surface-variant mb-6">Select a flight or hotel to proceed</p>
            <button onClick={() => navigate(ROUTES.FLIGHTS)} className="btn-primary">
              Browse Flights
            </button>
          </div>
        </div>
      </PageShell>
    );
  }

  const isHotel = bookingType === 'hotel';
  const isTour = bookingType === 'tour';
  const isPackage = bookingType === 'package';

  /**
   * Two-step checkout flow:
   * 1. Create booking → gets a bookingId
   * 2. Pay for booking → visa or wallet
   */
  const processCheckout = async (formData) => {
    setLocalProcessing(true);
    setProcessing(true);
    try {
      // Step 1: Create the booking
      const bookingPayload = {
        item: bookingItem,
        type: bookingType,
        ...bookingDetails,
      };
      
      // Add specific IDs based on type
      if (bookingType === 'hotel') bookingPayload.hotelId = bookingItem.id;
      if (bookingType === 'flight') bookingPayload.flightId = bookingItem.id;
      if (bookingType === 'tour') bookingPayload.tourId = bookingItem.id;
      if (bookingType === 'package') bookingPayload.packageId = bookingItem.id;

      const booking = await bookingsAPI.create(bookingPayload);
      const bookingId = booking.id;

      // Step 2: Pay for the booking and use the paid backend response as source of truth
      let paidBooking;
      if (paymentMethod === 'wallet') {
        paidBooking = await bookingsAPI.checkout(bookingId, 'WALLET');
      } else {
        paidBooking = await bookingsAPI.checkoutVisa(bookingId, {
          cardNumber: formData?.cardNumber?.replace(/\s/g, '') || '',
          expiryDate: formData?.expiryDate || '',
          cvv: formData?.cvv || '',
          cardHolderName: formData?.cardHolderName || '',
        });
      }

      const confirmationCode = paidBooking.confirmationCode || paidBooking.transactionId || `VGA-${bookingId}`;
      setConfirmation(confirmationCode, paidBooking.status || 'CONFIRMED');
      toast.success('Booking confirmed!');
      navigate(ROUTES.BOOKING_CONFIRMATION, {
        state: {
          booking: {
            ...paidBooking,
            confirmationCode,
            status: paidBooking.status || 'CONFIRMED',
            totalAmount: paidBooking.totalPrice ?? total,
            type: bookingType,
            item: bookingItem,
          }
        }
      });
    } catch (err) {
      const message = err?.response?.data?.message || 'Payment failed. Please try again.';
      toast.error(message);
    } finally {
      setLocalProcessing(false);
      setProcessing(false);
    }
  };

  const onSubmit = (formData) => processCheckout(formData);
  const handleWalletPayment = () => {
    setPaymentMethod('wallet');
    processCheckout(null);
  };

  return (
    <PageShell showFooter={false}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 animate-fade-in">
        {/* Header */}
        <div className="mb-8">
          <nav className="flex items-center gap-2 text-on-surface-variant text-sm mb-2">
            <button onClick={() => navigate(-1)} className="font-medium hover:text-primary transition-colors">Back</button>
            <span className="material-symbols-outlined text-xs">chevron_right</span>
            <span className="text-primary font-bold">Checkout</span>
          </nav>
          <h1 className="font-headline text-4xl font-extrabold tracking-tighter">Secure Checkout</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Payment Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Booking Summary */}
            <GlassCard>
              <h3 className="font-headline font-bold text-lg mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">
                  {isPackage ? 'travel_explore' : isTour ? 'explore' : isHotel ? 'hotel' : 'flight'}
                </span>
                {isPackage ? 'Package Booking' : isTour ? 'Tour Booking' : isHotel ? 'Hotel Reservation' : 'Flight Booking'}
              </h3>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <p className="font-bold text-base">
                    {isPackage
                      ? bookingItem.name
                      : isTour
                        ? bookingItem.title
                        : isHotel
                          ? bookingItem.name
                          : `${bookingItem.from?.city || bookingItem.departureCity} → ${bookingItem.to?.city || bookingItem.arrivalCity}`
                    }
                  </p>
                  <p className="text-on-surface-variant text-sm">
                    {isPackage
                      ? `${bookingItem.originCityCode} → ${bookingItem.destinationCityCode} · ${bookingItem.nights} nights`
                      : isTour
                        ? `${bookingItem.location} · ${bookingItem.duration}`
                        : isHotel
                          ? `${bookingItem.roomType || 'Standard'} · ${estimate.quantityLabel}`
                          : `${bookingItem.airline || bookingItem.airlineName} ${bookingItem.flightNumber || ''} · ${bookingItem.class || bookingItem.cabinClass || 'Economy'}`
                    }
                  </p>
                </div>
                <p className="font-headline text-2xl font-extrabold">{formatCurrency(total)}</p>
              </div>
            </GlassCard>

            {/* Payment Method Selector */}
            <div className="flex gap-3">
              <button
                onClick={() => setPaymentMethod('visa')}
                className={cn(
                  'flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl font-bold text-sm transition-all border-2',
                  paymentMethod === 'visa'
                    ? 'border-primary bg-primary/5 text-primary'
                    : 'border-outline-variant/20 text-on-surface-variant hover:border-outline-variant/40'
                )}
              >
                <span className="material-symbols-outlined text-lg">credit_card</span>
                Credit Card
              </button>
              <button
                onClick={() => setPaymentMethod('wallet')}
                className={cn(
                  'flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl font-bold text-sm transition-all border-2',
                  paymentMethod === 'wallet'
                    ? 'border-primary bg-primary/5 text-primary'
                    : 'border-outline-variant/20 text-on-surface-variant hover:border-outline-variant/40'
                )}
              >
                <span className="material-symbols-outlined text-lg">account_balance_wallet</span>
                Wallet
              </button>
            </div>

            {/* Credit Card Form */}
            {paymentMethod === 'visa' && (
              <GlassPanel>
                <h3 className="font-headline font-bold text-lg mb-6 flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">credit_card</span>
                  Payment Details
                </h3>

                <form id="payment-form" onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                  <InputField
                    label="Card Number"
                    icon="credit_card"
                    placeholder="1234 5678 9012 3456"
                    error={errors.cardNumber?.message}
                    {...register('cardNumber')}
                  />

                  <InputField
                    label="Cardholder Name"
                    icon="person"
                    placeholder="As shown on card"
                    error={errors.cardHolderName?.message}
                    {...register('cardHolderName')}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <InputField
                      label="Expiry Date"
                      icon="calendar_today"
                      placeholder="MM/YY"
                      error={errors.expiryDate?.message}
                      {...register('expiryDate')}
                    />
                    <InputField
                      label="CVV"
                      icon="lock"
                      type="password"
                      placeholder="•••"
                      error={errors.cvv?.message}
                      {...register('cvv')}
                    />
                  </div>
                </form>
              </GlassPanel>
            )}

            {/* Wallet Payment */}
            {paymentMethod === 'wallet' && (
              <GlassPanel>
                <div className="text-center py-6">
                  <span className="material-symbols-outlined text-5xl text-primary mb-4 block">account_balance_wallet</span>
                  <h3 className="font-headline text-lg font-bold mb-2">Pay with Wallet</h3>
                  <p className="text-on-surface-variant text-sm mb-6">
                    The total of {formatCurrency(total)} will be deducted from your wallet balance.
                  </p>
                  <div className="mx-auto mb-6 max-w-sm rounded-2xl bg-surface-container/60 p-4 text-left text-sm">
                    <div className="flex justify-between gap-4">
                      <span className="text-on-surface-variant">Wallet balance</span>
                      <span className="font-bold">
                        {walletLoading ? 'Loading...' : walletBalance == null ? 'Unavailable' : formatCurrency(walletBalance)}
                      </span>
                    </div>
                    <div className="flex justify-between gap-4 mt-2">
                      <span className="text-on-surface-variant">After payment</span>
                      <span className={cn('font-bold', walletRemaining != null && walletRemaining < 0 && 'text-red-600')}>
                        {walletLoading || walletRemaining == null ? 'Unavailable' : formatCurrency(walletRemaining)}
                      </span>
                    </div>
                    {walletError && <p className="text-red-600 text-xs mt-3">{walletError}</p>}
                  </div>
                  <button
                    onClick={handleWalletPayment}
                    disabled={processing}
                    className="btn-primary mx-auto"
                  >
                    {processing ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        Confirm Payment
                        <span className="material-symbols-outlined text-xl">check_circle</span>
                      </>
                    )}
                  </button>
                </div>
              </GlassPanel>
            )}
          </div>

          {/* Right: Order Summary */}
          <div>
            <div className="bg-surface-container-high/50 backdrop-blur-md rounded-[2rem] p-8 flex flex-col gap-5 ghost-border-light sticky top-28">
              <h3 className="font-headline font-bold text-xl">Order Summary</h3>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-on-surface-variant">{estimate.quantityLabel}</span>
                  <span className="font-semibold">{formatCurrency(total)}</span>
                </div>
                <div className="h-px bg-outline-variant/10" />
                <div className="flex justify-between items-end pt-2">
                  <span className="font-bold text-base text-primary">Total</span>
                  <div className="text-right">
                    <p className="text-2xl font-black font-headline">{formatCurrency(total)}</p>
                    <p className="text-[10px] text-outline font-bold uppercase">Egypt Pound</p>
                  </div>
                </div>
              </div>

              {/* Secure badge */}
              <div className="flex items-center gap-2 bg-green-50 px-3 py-2 rounded-xl">
                <span className="material-symbols-outlined text-green-600 text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>verified_user</span>
                <span className="text-xs text-green-700 font-bold">256-bit SSL Encrypted</span>
              </div>

              {paymentMethod === 'visa' && (
                <button
                  type="submit"
                  form="payment-form"
                  disabled={processing}
                  className="btn-primary w-full group"
                >
                  {processing ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      Pay {formatCurrency(total)}
                      <span className="material-symbols-outlined text-xl group-hover:translate-x-1 transition-transform">lock</span>
                    </>
                  )}
                </button>
              )}

              <p className="text-[10px] text-center text-outline leading-relaxed">
                By completing this purchase, you agree to our Terms of Service and Cancellation Policy.
              </p>
            </div>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
