import { ReactNode } from "react";

interface BadgeProps {
  children: ReactNode;
}

export default function Badge({
  children,
}: BadgeProps) {
  return (
    <span
      className="
      inline-flex
      items-center
      rounded-full
      border
      border-primary/20
      bg-primary/10
      px-4
      py-1.5
      text-xs
      font-semibold
      uppercase
      tracking-[0.18em]
      text-primary
      "
    >
      {children}
    </span>
  );
}