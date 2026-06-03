import { cn } from '@/utils/cn';

/**
 * Primary gradient button matching the Voyage CTA style
 * @param {{ children: React.ReactNode, className?: string, disabled?: boolean, type?: string, onClick?: Function, icon?: string }} props
 */
export default function PrimaryButton({ children, className = '', disabled = false, type = 'button', onClick, icon }) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'btn-primary',
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
    >
      {children}
      {icon && (
        <span className="material-symbols-outlined text-xl group-hover:translate-x-1 transition-transform">
          {icon}
        </span>
      )}
    </button>
  );
}
