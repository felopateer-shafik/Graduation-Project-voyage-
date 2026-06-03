import { cn } from '@/utils/cn';

/**
 * GlassPanel — Heavier glass surface for primary content areas
 * @param {{ children: React.ReactNode, className?: string }} props
 */
export default function GlassPanel({ children, className = '' }) {
  return (
    <div className={cn('glass-panel ghost-border rounded-[2rem] p-8 shadow-glass-lg', className)}>
      {children}
    </div>
  );
}
