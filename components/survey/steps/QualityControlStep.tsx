import RadioGroup from "../RadioGroup";
import ScaleInput from "../ScaleInput";
import SelectInput from "../SelectInput";
import TextareaInput from "../TextareaInput";

interface QualityControlStepProps {
  data: {
    attentionCheck: string;
    attentionPaid: number | null;
    watchedEntireVideo: string;
    comments: string;
    wasMultitasking: string;
    narrationFocus: number | null;
    distractionFocus: number | null;
    backgroundVisuals: number | null;
  };
  onChange: (field: string, value: string | number) => void;
  /** Video shown in this session (e.g. "01-no-video.mp4"). Used to show condition-specific questions. */
  shownVideoFilename: string;
}

export default function QualityControlStep({
  data,
  onChange,
  shownVideoFilename,
}: QualityControlStepProps) {
  return (
    <div className="w-full max-w-md space-y-6">
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

      <TextareaInput
        id="comments"
        label="If the video wasn't engaging, what would you change? Du you usually watch these types of videos? Do you have any other comments? (Optional)"
        value={data.comments}
        onChange={(value) => onChange("comments", value)}
        placeholder="Comments, feedback, or notes..."
        rows={4}
      />

      {/* <ScaleInput
        id="narrationFocus"
        label="I found it difficult to focus on the narration."
        value={data.narrationFocus}
        onChange={(value) => onChange("narrationFocus", value)}
        min={1}
        max={5}
        labels={{
          1: "Strongly disagree",
          5: "Strongly agree",
        }}
        required
      /> */}

      {/* <ScaleInput
        id="distractionFocus"
        label="I felt distracted while watching the video."
        value={data.distractionFocus}
        onChange={(value) => onChange("distractionFocus", value)}
        min={1}
        max={5}
        labels={{
          1: "Strongly disagree",
          5: "Strongly agree",
        }}
        required
      /> */}

      {/* {shownVideoFilename !== "01-no-video.mp4" && (
        <ScaleInput
          id="backgroundVisuals"
          label="The background visuals distracted me from the narration."
          value={data.backgroundVisuals}
          onChange={(value) => onChange("backgroundVisuals", value)}
          min={1}
          max={5}
          labels={{
            1: "Strongly disagree",
            5: "Strongly agree",
          }}
          required
        />
      )} */}

      {/*<SelectInput
        id="wasMultitasking"
        label="Were you multitasking while watching?"
        value={data.wasMultitasking}
        onChange={(value) => onChange("wasMultitasking", value)}
        options={[
          { value: "yes", label: "Yes" },
          { value: "no", label: "No" },
        ]}
        required
      />*/}
    </div>
  );
}


