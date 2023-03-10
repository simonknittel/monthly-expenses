import clsx from "clsx";
import type { ComponentPropsWithoutRef } from "react";
import { forwardRef } from "react";

interface Props extends ComponentPropsWithoutRef<"button"> {
  variant?: "primary" | "secondary" | "tertiary" | null;
  iconOnly?: boolean | null;
}

const Button = forwardRef<HTMLButtonElement, Props>(function Button(
  props,
  ref
) {
  const { variant = "primary", iconOnly, className, ...other } = props;

  return (
    <button
      className={clsx(
        {
          "flex items-center justify-center gap-4 rounded uppercase ": true,
          "h-11 bg-sky-500 text-base font-bold text-slate-50 hover:bg-sky-600 active:bg-sky-700 ":
            variant === "primary",
          "h-11 border border-sky-800 text-base text-sky-500 hover:bg-sky-800 active:bg-sky-900 ":
            variant === "secondary",
          "h-8 text-xs text-sky-500 hover:bg-sky-800 active:bg-sky-900":
            variant === "tertiary",
          "w-11": iconOnly,
          "px-6": !iconOnly,
        },
        className
      )}
      {...other}
      ref={ref}
    />
  );
});

export default Button;
