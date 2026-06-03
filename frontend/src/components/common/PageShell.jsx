import Navbar from './Navbar';
import Footer from './Footer';

/**
 * PageShell — Layout wrapper for all pages
 * Provides Navbar + Footer + main content area
 * @param {{ children: React.ReactNode, className?: string, showFooter?: boolean }} props
 */
export default function PageShell({ children, className = '', showFooter = true }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className={`flex-1 pt-20 ${className}`}>
        {children}
      </main>
      {showFooter && <Footer />}
    </div>
  );
}
