import clsx from "clsx";
import type { ButtonHTMLAttributes, ReactNode } from "react";

interface Props {
  onClick?: () => void;
  type?: ButtonHTMLAttributes<HTMLButtonElement>["type"];
  children: ReactNode;
  variant?: "primary" | "secondary";
}

export default function Button({
  onClick,
  type,
  children,
  variant = "primary",
}: Props) {
  return (
    <button
      onClick={onClick}
      type={type}
      className={clsx({
        "rounded bg-slate-900 py-4 px-8 uppercase text-slate-50 hover:bg-slate-700":
          variant === "primary",
        "rounded py-4 px-8 text-xs uppercase text-slate-50 hover:bg-slate-600":
          variant === "secondary",
      })}
    >
      {children}
    </button>
  );
}
