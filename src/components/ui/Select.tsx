import { SelectHTMLAttributes } from "react";

interface SelectProps
  extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
}

export default function Select({
  label,
  className = "",
  children,
  ...props
}: SelectProps) {
  return (
    <div className="w-full">
      {label && (
        <label className="mb-2 block text-sm font-medium text-text">
          {label}
        </label>
      )}

      <select
        {...props}
        className={`
          w-full
          rounded-xl
          border
          border-border
          bg-card
          px-4
          py-3
          text-text
          outline-none
          transition-all
          duration-300
          focus:border-primary
          focus:ring-4
          focus:ring-primary/10
          ${className}
        `}
      >
        {children}
      </select>
    </div>
  );
}