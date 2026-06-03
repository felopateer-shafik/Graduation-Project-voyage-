import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import { GoogleLogin } from '@react-oauth/google'; // 1. استدعاء المكتبة
import { ROUTES } from '@/constants/routes';
import { loginSchema } from '@/utils/validators';
import { authAPI } from '@/api/auth';
import useAuthStore from '@/store/useAuthStore';
import PageShell from '@/components/common/PageShell';
import InputField from '@/components/common/InputField';
import AtmosphericBackground from '@/components/common/AtmosphericBackground';

export default function LoginPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const { setAuth, setLoading, setError: setAuthError } = useAuthStore();
    const [showPassword, setShowPassword] = useState(false);

    const from = location.state?.from?.pathname || ROUTES.HOME;

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: zodResolver(loginSchema),
        defaultValues: { email: '', password: '' },
    });

    // 2. ميثود التعامل مع نجاح دخول جوجل
    const handleGoogleSuccess = async (credentialResponse) => {
        try {
            setLoading(true);
            // بنبعت الـ credential (التوكن) للباك إند
            const { user, token } = await authAPI.googleLogin(credentialResponse.credential);
            setAuth(user, token);
            toast.success(`Welcome, ${user.fullName.split(' ')[0]}!`);
            navigate(from, { replace: true });
        } catch (err) {
            const message = err?.response?.data?.message || 'Google login failed.';
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    const onSubmit = async (formData) => {
        try {
            setLoading(true);
            const { user, token } = await authAPI.login(formData);
            setAuth(user, token);
            toast.success(`Welcome back, ${user.fullName.split(' ')[0]}!`);
            navigate(from, { replace: true });
        } catch (err) {
            const message = err?.response?.data?.message || 'Login failed. Please try again.';
            setAuthError(message);
            toast.error(message);
        }
    };

    return (
        <PageShell showFooter={false}>
            <AtmosphericBackground />
            <div className="relative z-10 flex items-center justify-center min-h-[calc(100vh-5rem)] px-4 sm:px-6">
                <div className="w-full max-w-md animate-fade-in">
                    <div className="glass-panel ghost-border rounded-[2rem] p-8 sm:p-10 shadow-glass-xl">
                        <div className="text-center mb-8">
                            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <span className="material-symbols-outlined text-primary text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                  flight_takeoff
                </span>
                            </div>
                            <h1 className="font-headline text-3xl font-extrabold text-on-surface tracking-tight">
                                Voyage
                            </h1>
                            <p className="text-on-surface-variant text-sm mt-1.5">
                                Sign in to continue your journey
                            </p>
                        </div>

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                            <InputField
                                label="Email"
                                icon="mail"
                                type="email"
                                placeholder="you@example.com"
                                error={errors.email?.message}
                                {...register('email')}
                            />

                            <div className="relative">
                                <InputField
                                    label="Password"
                                    icon="lock"
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="Enter your password"
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

                            <div className="flex justify-end">
                                <button type="button" className="text-xs text-primary font-semibold hover:underline">
                                    Forgot Password?
                                </button>
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="btn-primary w-full group"
                            >
                                {isSubmitting ? (
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <>
                                        Sign In
                                        <span className="material-symbols-outlined text-xl group-hover:translate-x-1 transition-transform">
                      arrow_forward
                    </span>
                                    </>
                                )}
                            </button>
                        </form>

                        {/* 3. إضافة فاصل وزرار جوجل */}
                        <div className="mt-6">
                            <div className="relative mb-6">
                                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-outline/30"></div></div>
                                <div className="relative flex justify-center text-xs uppercase"><span className="bg-transparent px-2 text-on-surface-variant">Or continue with</span></div>
                            </div>

                            <div className="flex justify-center">
                                <GoogleLogin
                                    onSuccess={handleGoogleSuccess}
                                    onError={() => toast.error('Google Sign-In failed')}
                                    useOneTap
                                    shape="pill"
                                    theme="outline"
                                    width="100%"
                                />
                            </div>
                        </div>

                        <p className="text-center text-sm text-on-surface-variant mt-8">
                            Don't have an account?{' '}
                            <Link to={ROUTES.REGISTER} className="text-primary font-bold hover:underline">
                                Create one
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </PageShell>
    );
}