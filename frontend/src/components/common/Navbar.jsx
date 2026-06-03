import { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';
import useAuthStore from '@/store/useAuthStore';
import useUIStore from '@/store/useUIStore';
import { cn } from '@/utils/cn';
import { resolveDestination } from '@/utils/destinationResolver';

const NAV_ITEMS = [
  { label: 'Flights', path: ROUTES.FLIGHTS },
  { label: 'Hotels', path: ROUTES.HOTELS },
  { label: 'Flight + Hotel', path: ROUTES.FLIGHT_HOTEL },
  { label: 'Tours', path: ROUTES.TOURS },
  { label: 'Trip Planner', path: ROUTES.TRIP_PLANNER },
  { label: 'Map', path: ROUTES.MAP },
  { label: 'Deals', path: ROUTES.DEALS },
  { label: 'Explore', path: ROUTES.EXPLORE },
];

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuthStore();
  const { isMobileMenuOpen, toggleMobileMenu, closeMobileMenu } = useUIStore();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  const handleDestinationSearch = async (value) => {
    const query = value.trim();
    if (!query) return;
    try {
      const resolved = await resolveDestination(query);
      navigate(resolved.path);
    } catch {
      navigate(`${ROUTES.EXPLORE}?q=${encodeURIComponent(query)}`);
    }
  };

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    setIsProfileOpen(false);
    navigate(ROUTES.HOME);
  };

  return (
    <>
      <nav
        className={cn(
          'fixed top-0 w-full z-50 font-headline transition-all duration-300',
          isScrolled
            ? 'glass-navbar border-b border-white/20'
            : 'bg-transparent'
        )}
      >
        {/* Main navbar row */}
        <div className="flex justify-between items-center px-6 lg:px-8 h-20">
          {/* Left: Logo + Nav Links */}
          <div className="flex items-center gap-8">
            <Link
              to={ROUTES.HOME}
              className="text-2xl font-extrabold tracking-tighter text-primary hover:opacity-80 transition-opacity italic"
            >
              Voyage
            </Link>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center gap-5">
              {NAV_ITEMS.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    cn(
                      'text-sm font-semibold transition-all duration-200 tracking-tight whitespace-nowrap',
                      isActive
                        ? 'text-primary font-bold border-b-2 border-primary pb-0.5'
                        : 'text-on-surface-variant hover:text-primary'
                    )
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </div>
          </div>

          {/* Right: Auth / Profile */}
          <div className="flex items-center gap-4">
            {/* Search Bar - Landing Page Only */}
            {isHomePage && (
              <div className="hidden lg:flex items-center bg-surface-container-low/50 px-4 py-2 rounded-full border border-outline-variant/20 mr-2">
                <span className="material-symbols-outlined text-slate-400 text-sm mr-2">search</span>
                <input 
                  className="bg-transparent border-none outline-none focus:ring-0 text-sm font-medium w-40 placeholder:text-slate-400 font-body text-on-surface" 
                  placeholder="Where to next?" 
                  type="text"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && e.target.value.trim()) {
                      handleDestinationSearch(e.target.value);
                      e.target.value = '';
                    }
                  }}
                />
              </div>
            )}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-3 p-1.5 pr-4 rounded-full bg-white/40 backdrop-blur-md border border-white/30 hover:bg-white/60 transition-all"
                >
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="material-symbols-outlined text-primary text-sm">person</span>
                  </div>
                  <span className="text-sm font-semibold text-on-surface hidden sm:block">
                    {user?.fullName?.split(' ')[0] || 'User'}
                  </span>
                </button>

                {/* Profile Dropdown - SOLID white background */}
                {isProfileOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsProfileOpen(false)} />
                    <div className="absolute right-0 top-14 w-56 bg-white rounded-2xl p-2 shadow-[0_20px_40px_rgba(42,47,55,0.15)] border border-surface-container z-50 animate-scale-in">
                      <Link
                        to={ROUTES.PROFILE}
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-surface-container transition-colors"
                      >
                        <span className="material-symbols-outlined text-on-surface-variant text-xl">account_circle</span>
                        <span className="text-sm font-medium">My Profile</span>
                      </Link>
                      <Link
                        to={ROUTES.BOOKINGS}
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-surface-container transition-colors"
                      >
                        <span className="material-symbols-outlined text-on-surface-variant text-xl">confirmation_number</span>
                        <span className="text-sm font-medium">My Bookings</span>
                      </Link>
                      <Link
                        to={ROUTES.WISHLIST}
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-surface-container transition-colors"
                      >
                        <span className="material-symbols-outlined text-on-surface-variant text-xl">favorite</span>
                        <span className="text-sm font-medium">Wishlist</span>
                      </Link>
                      <div className="h-px bg-surface-container my-1 mx-3" />
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-50 text-error transition-colors"
                      >
                        <span className="material-symbols-outlined text-xl">logout</span>
                        <span className="text-sm font-medium">Sign Out</span>
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to={ROUTES.LOGIN}
                  className="text-sm font-semibold text-on-surface-variant hover:text-primary transition-colors hidden sm:block"
                >
                  Sign In
                </Link>
                <Link
                  to={ROUTES.REGISTER}
                  className="btn-primary !py-2.5 !px-5 !text-sm !shadow-none"
                >
                  Get Started
                </Link>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={toggleMobileMenu}
              className="lg:hidden p-2 rounded-xl bg-white/40 backdrop-blur-md border border-white/20 hover:bg-white/60 transition-all"
            >
              <span className="material-symbols-outlined text-on-surface">
                {isMobileMenuOpen ? 'close' : 'menu'}
              </span>
            </button>
          </div>
        </div>


      </nav>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <>
          <div className="fixed inset-0 bg-black/20 z-40 lg:hidden" onClick={closeMobileMenu} />
          <div className="fixed top-20 left-0 right-0 bg-white border-b border-surface-container p-6 z-50 lg:hidden animate-slide-up shadow-xl">
            <div className="flex flex-col gap-2">
              {NAV_ITEMS.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={closeMobileMenu}
                  className={({ isActive }) =>
                    cn(
                      'px-4 py-3 rounded-xl text-base font-medium transition-colors',
                      isActive
                        ? 'bg-primary/10 text-primary font-bold'
                        : 'text-on-surface hover:bg-surface-container'
                    )
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </div>
          </div>
        </>
      )}
    </>
  );
}
