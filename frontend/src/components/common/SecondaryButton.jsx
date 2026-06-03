import { cn } from '@/utils/cn';

/**
 * Secondary ghost-glass button
 * @param {{ children: React.ReactNode, className?: string, onClick?: Function, type?: string }} props
 */
export default function SecondaryButton({ children, className = '', onClick, type = 'button' }) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={cn('btn-secondary', className)}
    >
      {children}
    </button>
  );
}
