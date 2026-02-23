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
        label="Write down 3 details you remember from the story."
        value={data.everythingRemembered}
        onChange={(value) => onChange("everythingRemembered", value)}
        placeholder="Write your response here..."
        rows={8}
        required
      />
      
    </div>
  );
}


