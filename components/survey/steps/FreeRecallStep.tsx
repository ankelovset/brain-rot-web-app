import TextareaInput from "../TextareaInput";
import TextInput from "../TextInput";

interface FreeRecallStepProps {
  data: {
    everythingRemembered: string;
    specificDetails: string[];
  };
  onChange: (field: string, value: string | string[]) => void;
}

export default function FreeRecallStep({
  data,
  onChange,
}: FreeRecallStepProps) {
  const handleDetailChange = (index: number, value: string) => {
    const newDetails = [...data.specificDetails];
    newDetails[index] = value;
    onChange("specificDetails", newDetails);
  };

  return (
    <div className="w-full max-w-md space-y-6">
      <TextareaInput
        id="everythingRemembered"
        label="Please write down everything you remember from the story. Include as many details as you can."
        value={data.everythingRemembered}
        onChange={(value) => onChange("everythingRemembered", value)}
        placeholder="Write your response here..."
        rows={8}
        required
      />

      <div className="flex flex-col gap-4">
        <label className="text-sm font-medium text-black dark:text-zinc-50 text-left">
          List up to 3 specific details you remember (e.g., names, places, objects, numbers).
        </label>
        {[0, 1, 2].map((index) => (
          <TextInput
            key={index}
            id={`detail-${index}`}
            label={`Detail ${index + 1}`}
            value={data.specificDetails[index] || ""}
            onChange={(value) => handleDetailChange(index, value)}
            placeholder={`Enter detail ${index + 1}...`}
            required={index === 0}
          />
        ))}
      </div>
    </div>
  );
}


