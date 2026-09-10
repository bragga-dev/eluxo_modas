import { forwardRef, type ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "outline" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  isLoading?: boolean;
  fullWidth?: boolean;
}

const VARIANT_CLASSES: Record<Variant, string> = {
  primary: "bg-gold text-white hover:bg-gold-dark focus-visible:ring-gold-dark",
  secondary: "bg-ink text-white hover:bg-black focus-visible:ring-ink",
  outline: "border border-gold text-gold-dark hover:bg-gold/10 focus-visible:ring-gold",
  ghost: "text-ink hover:bg-black/5 focus-visible:ring-ink",
  danger: "bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-600",
};

const SIZE_CLASSES: Record<Size, string> = {
  sm: "text-sm px-3 py-1.5 rounded-md",
  md: "text-sm px-5 py-2.5 rounded-lg",
  lg: "text-base px-7 py-3 rounded-lg",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = "primary", size = "md", isLoading, fullWidth, disabled, className = "", children, ...rest },
  ref
) {
  return (
    <button
      ref={ref}
      disabled={disabled || isLoading}
      className={`inline-flex items-center justify-center gap-2 font-sans font-semibold tracking-wide
        transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
        disabled:cursor-not-allowed disabled:opacity-60
        ${VARIANT_CLASSES[variant]} ${SIZE_CLASSES[size]} ${fullWidth ? "w-full" : ""} ${className}`}
      {...rest}
    >
      {isLoading && (
        <span
          className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
          aria-hidden="true"
        />
      )}
      {children}
    </button>
  );
});
