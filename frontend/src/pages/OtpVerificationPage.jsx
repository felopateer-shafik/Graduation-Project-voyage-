import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import { ROUTES } from '@/constants/routes';
import { authAPI } from '@/api/auth';
import useAuthStore from '@/store/useAuthStore';
import PageShell from '@/components/common/PageShell';
import AtmosphericBackground from '@/components/common/AtmosphericBackground';

export default function OtpVerificationPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { setAuth } = useAuthStore();

  const email = location.state?.email;
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isVerifying, setIsVerifying] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(60);
  const inputRefs = useRef([]);

  // If no email in state, redirect to register
  useEffect(() => {
    if (!email) {
      navigate(ROUTES.REGISTER, { replace: true });
    }
  }, [email, navigate]);

  // Countdown timer for resend
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setInterval(() => {
      setResendCooldown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [resendCooldown]);

  // Focus first input on mount
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleChange = (index, value) => {
    if (!/^\d*$/.test(value)) return; // Only allow digits

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1); // Take only the last digit
    setOtp(newOtp);

    // Auto-advance to next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    // Backspace: go to previous input
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pastedData.length === 6) {
      const newOtp = pastedData.split('');
      setOtp(newOtp);
      inputRefs.current[5]?.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const otpCode = otp.join('');
    if (otpCode.length !== 6) {
      toast.error('Please enter the complete 6-digit code');
      return;
    }

    setIsVerifying(true);
    try {
      const { user, token } = await authAPI.verifyOtp({ email, otpCode });
      setAuth(user, token);
      toast.success('Account verified! Welcome aboard!');
      navigate(ROUTES.HOME, { replace: true });
    } catch (err) {
      const message = err?.response?.data?.message || 'Invalid or expired OTP. Please try again.';
      toast.error(message);
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResend = async () => {
    if (resendCooldown > 0) return;
    try {
      await authAPI.resendOtp({ email });
      toast.success('A new OTP has been sent to your email');
      setResendCooldown(60);
    } catch {
      toast.error('Failed to resend OTP. Please try again.');
    }
  };

  if (!email) return null;

  return (
    <PageShell showFooter={false}>
      <AtmosphericBackground />
      <div className="relative z-10 flex items-center justify-center min-h-[calc(100vh-5rem)] px-4 sm:px-6">
        <div className="w-full max-w-md animate-fade-in">
          {/* Glass OTP Card */}
          <div className="glass-panel ghost-border rounded-[2rem] p-8 sm:p-10 shadow-glass-xl">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <span className="material-symbols-outlined text-primary text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                  verified
                </span>
              </div>
              <h1 className="font-headline text-3xl font-extrabold text-on-surface tracking-tight">
                Verify Your Email
              </h1>
              <p className="text-on-surface-variant text-sm mt-2 leading-relaxed">
                We've sent a 6-digit verification code to
              </p>
              <p className="text-primary font-bold text-sm mt-1">{email}</p>
            </div>

            {/* OTP Input */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex justify-center gap-3" onPaste={handlePaste}>
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => (inputRefs.current[index] = el)}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className={`
                      w-12 h-14 text-center text-xl font-bold rounded-xl
                      bg-surface-container/60 border-2 outline-none transition-all duration-200
                      ${digit
                        ? 'border-primary text-on-surface shadow-sm'
                        : 'border-outline-variant/30 text-on-surface-variant'
                      }
                      focus:border-primary focus:ring-2 focus:ring-primary/20
                    `}
                  />
                ))}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isVerifying || otp.join('').length !== 6}
                className="btn-primary w-full group"
              >
                {isVerifying ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    Verify Account
                    <span className="material-symbols-outlined text-xl group-hover:translate-x-1 transition-transform">
                      check_circle
                    </span>
                  </>
                )}
              </button>
            </form>

            {/* Resend */}
            <div className="text-center mt-6">
              {resendCooldown > 0 ? (
                <p className="text-sm text-outline">
                  Resend code in <span className="font-bold text-on-surface-variant">{resendCooldown}s</span>
                </p>
              ) : (
                <button
                  onClick={handleResend}
                  className="text-sm text-primary font-bold hover:underline"
                >
                  Resend verification code
                </button>
              )}
            </div>

            {/* Back to Register */}
            <p className="text-center text-sm text-on-surface-variant mt-6">
              Wrong email?{' '}
              <button
                onClick={() => navigate(ROUTES.REGISTER)}
                className="text-primary font-bold hover:underline"
              >
                Go back
              </button>
            </p>
          </div>

          {/* Hint */}
          <div className="mt-4 glass-card-subtle rounded-2xl p-4 text-center">
            <p className="text-xs text-outline">
              <span className="font-semibold">Tip:</span> Check your spam folder if you don't see the email.
              The OTP is also logged in the backend console.
            </p>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
