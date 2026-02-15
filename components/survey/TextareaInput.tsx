interface TextareaInputProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  rows?: number;
}

export default function TextareaInput({
  id,
  label,
  value,
  onChange,
  placeholder,
  required = false,
  rows = 6,
}: TextareaInputProps) {
  return (
    <div className="flex flex-col gap-2">
      <label
        htmlFor={id}
        className="text-sm font-medium text-black dark:text-zinc-50 text-left"
      >
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <textarea
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        rows={rows}
        className="w-full rounded-2xl border border-zinc-300 bg-white px-5 py-3 text-black placeholder:text-zinc-400 focus:border-black focus:outline-none focus:ring-2 focus:ring-black dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50 dark:focus:border-zinc-50 dark:focus:ring-zinc-50 resize-y"
      />
    </div>
  );
}


