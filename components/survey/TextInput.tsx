interface TextInputProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: "text" | "number" | "email";
  placeholder?: string;
  required?: boolean;
  min?: number;
  max?: number;
}

export default function TextInput({
  id,
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  required = false,
  min,
  max,
}: TextInputProps) {
  return (
    <div className="flex flex-col gap-2">
      <label
        htmlFor={id}
        className="text-sm font-medium text-black dark:text-zinc-50 text-left"
      >
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <input
        type={type}
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        min={min}
        max={max}
        className="h-12 w-full rounded-full border border-zinc-300 bg-white px-5 text-black placeholder:text-zinc-400 focus:border-black focus:outline-none focus:ring-2 focus:ring-black dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50 dark:focus:border-zinc-50 dark:focus:ring-zinc-50"
      />
    </div>
  );
}


