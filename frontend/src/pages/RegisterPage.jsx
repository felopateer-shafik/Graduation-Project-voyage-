import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import { ROUTES } from '@/constants/routes';
import { registerSchema } from '@/utils/validators';
import { authAPI } from '@/api/auth';
import useAuthStore from '@/store/useAuthStore';
import PageShell from '@/components/common/PageShell';
import InputField from '@/components/common/InputField';
import AtmosphericBackground from '@/components/common/AtmosphericBackground';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { setAuth, setLoading, setError: setAuthError } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (formData) => {
    try {
      setLoading(true);
      const response = await authAPI.register(formData);
      toast.success('Verification code sent to your email!');
      // Navigate to OTP page with the email
      navigate(ROUTES.VERIFY_OTP, { 
        state: { email: formData.email },
        replace: true 
      });
    } catch (err) {
      const message = err?.response?.data?.message || 'Registration failed. Please try again.';
      setAuthError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageShell showFooter={false}>
      <AtmosphericBackground />
      <div className="relative z-10 flex items-center justify-center min-h-[calc(100vh-5rem)] px-4 sm:px-6 py-10">
        <div className="w-full max-w-md animate-fade-in">
          {/* Glass Register Card */}
          <div className="glass-panel ghost-border rounded-[2rem] p-8 sm:p-10 shadow-glass-xl">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="w-14 h-14 rounded-2xl bg-secondary/10 flex items-center justify-center mx-auto mb-4">
                <span className="material-symbols-outlined text-secondary text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                  person_add
                </span>
              </div>
              <h1 className="font-headline text-3xl font-extrabold text-on-surface tracking-tight">
                Create Account
              </h1>
              <p className="text-on-surface-variant text-sm mt-1.5">
                Start your travel journey today
              </p>
            </div>

            {/* Register Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <InputField
                label="Full Name"
                icon="person"
                placeholder="Ali Shams"
                error={errors.fullName?.message}
                {...register('fullName')}
              />

              <InputField
                label="Email"
                icon="mail"
                type="email"
                placeholder="you@example.com"
                error={errors.email?.message}
                {...register('email')}
              />

              <InputField
                label="Phone (Optional)"
                icon="phone"
                type="tel"
                placeholder="+20 100 123 4567"
                error={errors.phone?.message}
                {...register('phone')}
              />

              <div className="relative">
                <InputField
                  label="Password"
                  icon="lock"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Minimum 8 characters"
                  error={errors.password?.message}
                  {...register('password')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-[2.1rem] text-outline hover:text-on-surface transition-colors"
                >
                  <span className="material-symbols-outlined text-xl">
                    {showPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>

              <InputField
                label="Confirm Password"
                icon="lock"
                type={showPassword ? 'text' : 'password'}
                placeholder="Re-enter your password"
                error={errors.confirmPassword?.message}
                {...register('confirmPassword')}
              />

              {/* Terms */}
              <p className="text-xs text-outline leading-relaxed">
                By creating an account, you agree to our{' '}
                <button type="button" className="text-primary font-semibold hover:underline">Terms of Service</button>
                {' '}and{' '}
                <button type="button" className="text-primary font-semibold hover:underline">Privacy Policy</button>.
              </p>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary w-full group !mt-6"
              >
                {isSubmitting ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    Create Account
                    <span className="material-symbols-outlined text-xl group-hover:translate-x-1 transition-transform">
                      arrow_forward
                    </span>
                  </>
                )}
              </button>
            </form>

            {/* Login Link */}
            <p className="text-center text-sm text-on-surface-variant mt-8">
              Already have an account?{' '}
              <Link to={ROUTES.LOGIN} className="text-primary font-bold hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
