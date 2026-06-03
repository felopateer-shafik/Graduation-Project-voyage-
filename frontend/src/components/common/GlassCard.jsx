import { cn } from '@/utils/cn';

/**
 * GlassCard — Primary card component with glassmorphism styling
 * @param {{ children: React.ReactNode, className?: string, hover?: boolean, onClick?: Function }} props
 */
export default function GlassCard({ children, className = '', hover = false, onClick }) {
  return (
    <div
      onClick={onClick}
      className={cn(
        'glass-card rounded-3xl p-6',
        hover && 'cursor-pointer hover:shadow-card-hover transition-all duration-300',
        onClick && 'cursor-pointer',
        className
      )}
    >
      {children}
    </div>
  );
}
