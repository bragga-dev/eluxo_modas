import { forwardRef, useId, type SelectHTMLAttributes } from "react";

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: SelectOption[];
  error?: string;
  placeholder?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { label, options, error, placeholder, id, className = "", ...rest },
  ref
) {
  const generatedId = useId();
  const selectId = id ?? generatedId;

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={selectId} className="text-sm font-medium text-ink">
        {label}
        {rest.required && <span className="text-red-600"> *</span>}
      </label>
      <select
        ref={ref}
        id={selectId}
        aria-invalid={Boolean(error)}
        className={`rounded-lg border bg-white px-4 py-2.5 text-sm text-ink outline-none transition-colors
          focus:border-gold focus:ring-1 focus:ring-gold
          ${error ? "border-red-500" : "border-black/15"} ${className}`}
        {...rest}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <span role="alert" className="text-xs text-red-600">
          {error}
        </span>
      )}
    </div>
  );
});
