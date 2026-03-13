import { type InputHTMLAttributes } from 'react';

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  icon?: React.ReactNode;
}

export default function FloatingInput({ label, error, icon, className = '', ...props }: Props) {
  return (
    <div className={className}>
      <div
        className={`relative border rounded-md transition-colors ${
          error ? 'border-red-400' : 'border-gray-border focus-within:border-gold'
        }`}
      >
        <label className="absolute -top-2.5 left-3 bg-white px-1 text-xs text-gray-text">
          {label}
        </label>
        <div className="flex items-center px-3 py-3">
          {icon && <span className="mr-2 text-gray-text shrink-0">{icon}</span>}
          <input
            {...props}
            className="w-full text-sm text-navy outline-none bg-transparent placeholder:text-gray-text/60"
          />
        </div>
      </div>
      {error && <p className="text-red-500 text-xs mt-1 ml-1">{error}</p>}
    </div>
  );
}
