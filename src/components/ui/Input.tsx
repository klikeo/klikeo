import { forwardRef, InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = "", ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="mb-2 block text-sm font-medium text-text">
            {label}
          </label>
        )}

        <input
          ref={ref}
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
            placeholder:text-text-secondary
            focus:border-primary
            focus:ring-4
            focus:ring-primary/10
            ${className}
          `}
        />

        {error && (
          <p className="mt-2 text-sm text-red-400">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;