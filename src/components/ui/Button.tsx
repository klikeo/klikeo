import Link from "next/link";
import { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  href?: string;
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
}

export default function Button({
  children,
  href,
  variant = "primary",
  size = "md",
  fullWidth = false,
  className = "",
  ...props
}: ButtonProps) {
  const variants = {
    primary:
      "bg-primary text-on-primary hover:brightness-105 shadow-[var(--shadow-card)]",

    secondary:
      "border border-border bg-card text-text hover:border-primary",

    ghost:
      "text-text hover:bg-card",
  };

  const sizes = {
    sm: "h-10 px-4 text-sm",

    md: "h-12 px-6",

    lg: "h-14 px-8 text-lg",
  };

  const classes = `
inline-flex
items-center
justify-center
rounded-xl
font-semibold
transition-all
duration-300
hover:-translate-y-0.5
active:translate-y-0
${variants[variant]}
${sizes[size]}
${fullWidth ? "w-full" : ""}
${className}
`;

  if (href) {
    return (
      <Link
        href={href}
        className={classes}
      >
        {children}
      </Link>
    );
  }

  return (
    <button
      className={classes}
      {...props}
    >
      {children}
    </button>
  );
}