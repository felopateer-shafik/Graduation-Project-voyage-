import { cn } from '@/utils/cn';

const STATUS_STYLES = {
  confirmed: 'badge-confirmed',
  pending: 'badge-pending',
  cancelled: 'badge-cancelled',
  completed: 'bg-blue-100 text-blue-700 text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full',
};

/**
 * Status badge component
 * @param {{ status: string, className?: string }} props
 */
export default function StatusBadge({ status, className = '' }) {
  const normalizedStatus = status.toLowerCase();
  return (
    <span className={cn(STATUS_STYLES[normalizedStatus] || STATUS_STYLES.pending, className)}>
      {status}
    </span>
  );
}
