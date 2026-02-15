interface LikertScaleProps {
  id: string;
  statement: string;
  value: number | null;
  onChange: (value: number) => void;
  required?: boolean;
  reverse?: boolean; // For reverse-scored items
}

const scaleLabels = {
  1: "Strongly Disagree",
  2: "Disagree",
  3: "Somewhat Disagree",
  4: "Neutral",
  5: "Somewhat Agree",
  6: "Agree",
  7: "Strongly Agree",
};

export default function LikertScale({
  id,
  statement,
  value,
  onChange,
  required = false,
  reverse = false,
}: LikertScaleProps) {
  const scale = [1, 2, 3, 4, 5, 6, 7];

  return (
    <div className="flex flex-col gap-3">
      <label className="text-sm font-medium text-black dark:text-zinc-50 text-left">
        {statement}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <div className="flex flex-col gap-2">
        <div className="grid grid-cols-7 gap-2">
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
        <div className="flex justify-between text-xs text-zinc-500 dark:text-zinc-400">
          <span>Strongly Disagree</span>
          <span>Strongly Agree</span>
        </div>
        {value && (
          <p className="text-xs text-zinc-600 dark:text-zinc-400 text-center mt-1">
            Selected: {scaleLabels[value as keyof typeof scaleLabels]}
          </p>
        )}
      </div>
    </div>
  );
}

