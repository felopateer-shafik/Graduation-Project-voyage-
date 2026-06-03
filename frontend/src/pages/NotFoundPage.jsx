import { Link } from 'react-router-dom';
import PageShell from '@/components/common/PageShell';
import { ROUTES } from '@/constants/routes';

export default function NotFoundPage() {
  return (
    <PageShell showFooter={false}>
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-5rem)] px-6 text-center">
        <h1 className="font-headline text-8xl font-extrabold text-primary/20 mb-4">404</h1>
        <h2 className="font-headline text-3xl font-bold text-on-surface mb-3">Page Not Found</h2>
        <p className="text-on-surface-variant mb-8 max-w-md">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link to={ROUTES.HOME} className="btn-primary">
          <span className="material-symbols-outlined text-xl">home</span>
          Back to Home
        </Link>
      </div>
    </PageShell>
  );
}
