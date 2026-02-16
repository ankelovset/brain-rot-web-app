import RadioGroup from "../RadioGroup";
import ScaleInput from "../ScaleInput";
import SelectInput from "../SelectInput";

interface QualityControlStepProps {
  data: {
    attentionCheck: string;
    attentionPaid: number | null;
    watchedEntireVideo: string;
    wasMultitasking: string;
  };
  onChange: (field: string, value: string | number) => void;
}

export default function QualityControlStep({
  data,
  onChange,
}: QualityControlStepProps) {
  return (
    <div className="w-full max-w-md space-y-6">
      <p>haha</p>
      <RadioGroup
        id="attentionCheck"
        label="To show you are paying attention, please select 'Option 3' for this statement."
        value={data.attentionCheck}
        onChange={(value) => onChange("attentionCheck", value)}
        options={[
          { value: "option-1", label: "Option 1" },
          { value: "option-2", label: "Option 2" },
          { value: "option-3", label: "Option 3" },
          { value: "option-4", label: "Option 4" },
        ]}
        required
      />

      <ScaleInput
        id="attentionPaid"
        label="How much attention did you pay to the story?"
        value={data.attentionPaid}
        onChange={(value) => onChange("attentionPaid", value)}
        min={1}
        max={7}
        labels={{
          1: "Very little",
          7: "A lot",
        }}
        required
      />

      <SelectInput
        id="watchedEntireVideo"
        label="Did you watch the entire video?"
        value={data.watchedEntireVideo}
        onChange={(value) => onChange("watchedEntireVideo", value)}
        options={[
          { value: "yes", label: "Yes" },
          { value: "no", label: "No" },
        ]}
        required
      />

      <SelectInput
        id="wasMultitasking"
        label="Were you multitasking while watching?"
        value={data.wasMultitasking}
        onChange={(value) => onChange("wasMultitasking", value)}
        options={[
          { value: "yes", label: "Yes" },
          { value: "no", label: "No" },
        ]}
        required
      />
    </div>
  );
}


