import { forwardRef, useId, type InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  hint?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, error, hint, id, className = "", ...rest },
  ref
) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const errorId = error ? `${inputId}-error` : undefined;
  const hintId = hint ? `${inputId}-hint` : undefined;

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={inputId} className="text-sm font-medium text-ink">
        {label}
        {rest.required && <span className="text-red-600"> *</span>}
      </label>
      <input
        ref={ref}
        id={inputId}
        aria-invalid={Boolean(error)}
        aria-describedby={errorId ?? hintId}
        className={`rounded-lg border px-4 py-2.5 text-sm text-ink placeholder:text-ink/40 outline-none
          transition-colors focus:border-gold focus:ring-1 focus:ring-gold
          ${error ? "border-red-500" : "border-black/15"} ${className}`}
        {...rest}
      />
      {hint && !error && (
        <span id={hintId} className="text-xs text-ink/50">
          {hint}
        </span>
      )}
      {error && (
        <span id={errorId} role="alert" className="text-xs text-red-600">
          {error}
        </span>
      )}
    </div>
  );
});
