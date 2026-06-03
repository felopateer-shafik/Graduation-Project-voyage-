/**
 * Error state placeholder
 * @param {{ message?: string, onRetry?: Function }} props
 */
export default function ErrorState({ message = 'Something went wrong. Please try again.', onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-20 h-20 rounded-full bg-error/10 flex items-center justify-center mb-6">
        <span className="material-symbols-outlined text-4xl text-error">error_outline</span>
      </div>
      <h3 className="font-headline font-bold text-xl text-on-surface mb-2">Oops!</h3>
      <p className="text-on-surface-variant text-sm max-w-md mb-6">{message}</p>
      {onRetry && (
        <button onClick={onRetry} className="btn-secondary">
          <span className="material-symbols-outlined text-sm mr-1">refresh</span>
          Try Again
        </button>
      )}
    </div>
  );
}
