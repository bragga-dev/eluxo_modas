import { forwardRef, useId, type TextareaHTMLAttributes } from "react";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
  hint?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { label, error, hint, id, className = "", rows = 4, ...rest },
  ref
) {
  const generatedId = useId();
  const textareaId = id ?? generatedId;
  const errorId = error ? `${textareaId}-error` : undefined;
  const hintId = hint ? `${textareaId}-hint` : undefined;

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={textareaId} className="text-sm font-medium text-ink">
        {label}
        {rest.required && <span className="text-red-600"> *</span>}
      </label>
      <textarea
        ref={ref}
        id={textareaId}
        rows={rows}
        aria-invalid={Boolean(error)}
        aria-describedby={errorId ?? hintId}
        className={`resize-y rounded-lg border px-4 py-2.5 text-sm text-ink placeholder:text-ink/40 outline-none
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