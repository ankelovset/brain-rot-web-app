interface ScaleInputProps {
  id: string;
  label: string;
  value: number | null;
  onChange: (value: number) => void;
  min: number;
  max: number;
  labels?: { [key: number]: string };
  required?: boolean;
}

export default function ScaleInput({
  id,
  label,
  value,
  onChange,
  min,
  max,
  labels,
  required = false,
}: ScaleInputProps) {
  const scale = Array.from({ length: max - min + 1 }, (_, i) => min + i);

  return (
    <div className="flex flex-col gap-2">
      <label
        htmlFor={id}
        className="text-sm font-medium text-black dark:text-zinc-50 text-left"
      >
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <div className="flex flex-col gap-3">
        <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${scale.length}, 1fr)` }}>
          {scale.map((num) => (
            <label
              key={num}
              className="flex flex-col items-center gap-1 cursor-pointer group"
            >
              <input
                type="radio"
                name={id}
                value={num}
                checked={value === num}
                onChange={() => onChange(num)}
                required={required}
                className="w-4 h-4 text-black border-zinc-300 focus:ring-2 focus:ring-black dark:border-zinc-700 dark:bg-zinc-900 dark:focus:ring-zinc-50"
              />
              <span className="text-xs text-zinc-600 dark:text-zinc-400 text-center">
                {num}
              </span>
            </label>
          ))}
        </div>
        {labels && (
          <div className="flex justify-between text-xs text-zinc-500 dark:text-zinc-400">
            {labels[min] && <span>{labels[min]}</span>}
            {labels[max] && <span className="ml-auto">{labels[max]}</span>}
          </div>
        )}
      </div>
    </div>
  );
}

