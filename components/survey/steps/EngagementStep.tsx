import LikertScale from "../LikertScale";
import RadioGroup from "../RadioGroup";

const FEED_RESPONSE_OPTIONS = [
  { value: "scroll-past", label: "Scroll past" },
  { value: "continue-watching", label: "Continue watching" },
  { value: "look-for-similar", label: "Look for similar videos" },
];

interface EngagementStepProps {
  data: {
    videoEngaging: number | null;
    feedResponse: string;
    visualsEnjoyable: number | null;
  };
  onChange: (field: string, value: string | number) => void;
  /** When true, hide the visualsEnjoyable question (e.g. no-video condition). */
  hideVisualsEnjoyable?: boolean;
}

export default function EngagementStep({
  data,
  onChange,
  hideVisualsEnjoyable = false,
}: EngagementStepProps) {
  return (
    <div className="w-full max-w-md space-y-6">
      <h3 className="text-lg font-semibold text-black dark:text-zinc-50 mb-4">
        Engagement
      </h3>

      <LikertScale
        id="videoEngaging"
        statement="The video was engaging"
        value={data.videoEngaging}
        onChange={(value) => onChange("videoEngaging", value)}
        required
      />



      {!hideVisualsEnjoyable && (
        <LikertScale
          id="visualsEnjoyable"
          statement="The visuals made the video more enjoyable"
          value={data.visualsEnjoyable}
          onChange={(value) => onChange("visualsEnjoyable", value)}
          required
        />
      )}

      <RadioGroup
        id="feedResponse"
        label="How would you most likely respond if this video appeared in your feed?"
        value={data.feedResponse}
        onChange={(value) => onChange("feedResponse", value)}
        options={FEED_RESPONSE_OPTIONS}
        required
      />
      
    </div>
  );
}
