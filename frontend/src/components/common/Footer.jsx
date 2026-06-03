import { Link } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';

export default function Footer() {
  return (
    <footer className="bg-surface-container-low/50 backdrop-blur-md pt-12 pb-32 md:pb-12 px-6 border-t border-white/20 mt-auto">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
          <div className="col-span-1 md:col-span-1">
            <span className="text-2xl font-black text-primary tracking-tighter font-headline mb-6 block">Voyage</span>
            <p className="text-on-surface-variant leading-relaxed">
              Redefining the way you experience the world through design and technology.
            </p>
          </div>
          <div>
            <h4 className="font-headline font-bold text-lg mb-6">Explore</h4>
            <ul className="space-y-4 text-on-surface-variant font-medium">
              <li><Link className="hover:text-primary transition-colors" to={ROUTES.EXPLORE}>Destinations</Link></li>
              <li><Link className="hover:text-primary transition-colors" to={ROUTES.FLIGHTS}>Flights</Link></li>
              <li><Link className="hover:text-primary transition-colors" to={ROUTES.HOTELS}>Hotels</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-headline font-bold text-lg mb-6">Company</h4>
            <ul className="space-y-4 text-on-surface-variant font-medium">
              <li><Link className="hover:text-primary transition-colors" to={ROUTES.ABOUT}>About Us</Link></li>
              <li><Link className="hover:text-primary transition-colors" to={ROUTES.CAREERS}>Careers</Link></li>
              <li><Link className="hover:text-primary transition-colors" to={ROUTES.CONTACT}>Contact</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-headline font-bold text-lg mb-6">Support</h4>
            <ul className="space-y-4 text-on-surface-variant font-medium">
              <li><Link className="hover:text-primary transition-colors" to={ROUTES.SUPPORT}>Help Center</Link></li>
              <li><Link className="hover:text-primary transition-colors" to={ROUTES.PRIVACY}>Privacy Policy</Link></li>
              <li><Link className="hover:text-primary transition-colors" to={ROUTES.TERMS}>Terms of Service</Link></li>
            </ul>
          </div>
        </div>
        <div className="pt-12 border-t border-outline-variant/20 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-on-surface-variant text-sm">&copy; {new Date().getFullYear()} Voyage Travel Inc. All rights reserved.</p>
          <div className="flex gap-6">
            <span className="text-on-surface-variant font-bold text-sm tracking-widest">EN</span>
            <span className="text-on-surface-variant font-bold text-sm tracking-widest">TW</span>
            <span className="text-on-surface-variant font-bold text-sm tracking-widest">IG</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
