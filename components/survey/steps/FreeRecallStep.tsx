import TextareaInput from "../TextareaInput";

interface FreeRecallStepProps {
  data: {
    everythingRemembered: string;
  };
  onChange: (field: string, value: string) => void;
}

export default function FreeRecallStep({
  data,
  onChange,
}: FreeRecallStepProps) {
  return (
    <div className="w-full max-w-md space-y-6">
      <TextareaInput
        id="everythingRemembered"
        label="Write down 3 details you remember from the story."
        value={data.everythingRemembered}
        onChange={(value: string) => onChange("everythingRemembered", value)}
        placeholder="Write your response here..."
        rows={8}
        required
      />
    </div>
  );
}


