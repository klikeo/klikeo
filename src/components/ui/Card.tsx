import { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
}

export default function Card({
  children,
  className = "",
}: CardProps) {
  return (
    <div
      className={`
relative
rounded-lg
border
border-border
bg-card
shadow-[var(--shadow-card)]
transition-all
duration-300
hover:-translate-y-0.5
hover:shadow-[0_8px_24px_rgba(43,38,32,.12)]
${className}
`}
    >
      {children}
    </div>
  );
}