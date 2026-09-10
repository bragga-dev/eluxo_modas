interface QuantitySelectorProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  disabled?: boolean;
}

export function QuantitySelector({ value, onChange, min = 1, max = 99, disabled }: QuantitySelectorProps) {
  return (
    <div className="inline-flex items-center rounded-lg border border-black/15">
      <button
        type="button"
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={disabled || value <= min}
        aria-label="Diminuir quantidade"
        className="h-9 w-9 text-lg text-ink disabled:opacity-30"
      >
        −
      </button>
      <span aria-live="polite" className="w-9 text-center text-sm font-medium">
        {value}
      </span>
      <button
        type="button"
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={disabled || value >= max}
        aria-label="Aumentar quantidade"
        className="h-9 w-9 text-lg text-ink disabled:opacity-30"
      >
        +
      </button>
    </div>
  );
}
