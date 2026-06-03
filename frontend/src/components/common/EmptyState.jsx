/**
 * Empty state placeholder
 * @param {{ icon?: string, title: string, description?: string, action?: React.ReactNode }} props
 */
export default function EmptyState({ icon = 'search_off', title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-20 h-20 rounded-full bg-surface-container flex items-center justify-center mb-6">
        <span className="material-symbols-outlined text-4xl text-outline">{icon}</span>
      </div>
      <h3 className="font-headline font-bold text-xl text-on-surface mb-2">{title}</h3>
      {description && (
        <p className="text-on-surface-variant text-sm max-w-md">{description}</p>
      )}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
