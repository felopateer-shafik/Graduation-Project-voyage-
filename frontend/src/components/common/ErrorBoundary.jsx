import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error('ErrorBoundary caught:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-background flex items-center justify-center px-6">
          <div className="text-center max-w-md animate-fade-in">
            <div className="w-20 h-20 rounded-3xl bg-error/10 flex items-center justify-center mx-auto mb-6">
              <span className="material-symbols-outlined text-error text-5xl">error</span>
            </div>
            <h1 className="font-headline text-3xl font-extrabold text-on-surface mb-3 tracking-tight">
              Something Went Wrong
            </h1>
            <p className="text-on-surface-variant text-sm mb-6 leading-relaxed">
              An unexpected error occurred. Our team has been notified and is working on a fix.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => window.location.reload()}
                className="btn-primary"
              >
                <span className="material-symbols-outlined text-lg">refresh</span>
                Reload Page
              </button>
              <button
                onClick={() => { window.location.href = '/'; }}
                className="btn-secondary"
              >
                Go Home
              </button>
            </div>
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mt-8 text-left glass-card-subtle rounded-2xl p-4">
                <summary className="text-xs font-bold text-error cursor-pointer">Error Details (Dev Only)</summary>
                <pre className="text-xs text-on-surface-variant mt-2 overflow-auto max-h-40 whitespace-pre-wrap">
                  {this.state.error.toString()}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
