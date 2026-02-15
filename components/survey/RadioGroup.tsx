interface RadioGroupProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  required?: boolean;
}

export default function RadioGroup({
  id,
  label,
  value,
  onChange,
  options,
  required = false,
}: RadioGroupProps) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-black dark:text-zinc-50 text-left">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <div className="flex flex-col gap-2">
        {options.map((option) => (
          <label
            key={option.value}
            className="flex items-center gap-3 cursor-pointer"
          >
            <input
              type="radio"
              name={id}
              value={option.value}
              checked={value === option.value}
              onChange={(e) => onChange(e.target.value)}
              required={required}
              className="w-4 h-4 text-black border-zinc-300 focus:ring-2 focus:ring-black dark:border-zinc-700 dark:focus:ring-zinc-50"
            />
            <span className="text-sm text-black dark:text-zinc-50">
              {option.label}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
}
