import { ReactNode } from "react";

interface LabelProps {
  children: ReactNode;
}

export default function Label({
  children,
}: LabelProps) {
  return (
    <label className="mb-2 block text-sm font-semibold text-text">
      {children}
    </label>
  );
}