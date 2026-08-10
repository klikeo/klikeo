import { forwardRef, TextareaHTMLAttributes } from "react";

interface TextareaProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, className = "", ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="mb-2 block text-sm font-medium text-text">
            {label}
          </label>
        )}

        <textarea
          ref={ref}
          {...props}
          className={`
            min-h-[130px]
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
      </div>
    );
  }
);

Textarea.displayName = "Textarea";

export default Textarea;