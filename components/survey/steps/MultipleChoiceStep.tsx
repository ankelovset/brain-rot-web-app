
import RadioGroup from "../RadioGroup";

interface MultipleChoiceStepProps {
  data: {
    storyAbout: string;
    arrivalTime: string;
    researchRoom: string;
    kioskPurchase: string;
    lauraRoom: string;
    meetingRescheduled: string;
    arrivalBeforeMeeting: string;
  };
  onChange: (field: string, value: string) => void;
}

export default function MultipleChoiceStep({
  data,
  onChange,
}: MultipleChoiceStepProps) {
  return (
    <div className="w-full max-w-md space-y-6">
      <RadioGroup
        id="storyAbout"
        label="Who is the story about?"
        value={data.storyAbout}
        onChange={(value) => onChange("storyAbout", value)}
        options={[
          { value: "laura", label: "Laura" },
          { value: "john", label: "John" },
          { value: "sarah", label: "Sarah" },
          { value: "michael", label: "Michael" },
        ]}
        required
      />

      <RadioGroup
        id="arrivalTime"
        label="When did the main character arrive at the university?"
        value={data.arrivalTime}
        onChange={(value) => onChange("arrivalTime", value)}
        options={[
          { value: "morning", label: "Morning" },
          { value: "afternoon", label: "Afternoon" },
          { value: "evening", label: "Evening" },
          { value: "night", label: "Night" },
        ]}
        required
      />

      <RadioGroup
        id="researchRoom"
        label="What room was the research meeting in?"
        value={data.researchRoom}
        onChange={(value) => onChange("researchRoom", value)}
        options={[
          { value: "217", label: "217" },
          { value: "218", label: "218" },
          { value: "216", label: "216" },
          { value: "219", label: "219" },
        ]}
        required
      />

      <RadioGroup
        id="kioskPurchase"
        label="What did she buy at the kiosk?"
        value={data.kioskPurchase}
        onChange={(value) => onChange("kioskPurchase", value)}
        options={[
          { value: "water", label: "Water" },
          { value: "coffee", label: "Coffee" },
          { value: "sandwich", label: "Sandwich" },
          { value: "chips", label: "Chips" },
        ]}
        required
      />

      <RadioGroup
        id="lauraRoom"
        label="Which room did Laura go to?"
        value={data.lauraRoom}
        onChange={(value) => onChange("lauraRoom", value)}
        options={[
          { value: "312", label: "312" },
          { value: "313", label: "313" },
          { value: "311", label: "311" },
          { value: "314", label: "314" },
        ]}
        required
      />

      <RadioGroup
        id="meetingRescheduled"
        label="When had the meeting been rescheduled to?"
        value={data.meetingRescheduled}
        onChange={(value) => onChange("meetingRescheduled", value)}
        options={[
          { value: "8.30", label: "8:30" },
          { value: "9.00", label: "9:00" },
          { value: "8.00", label: "8:00" },
          { value: "9.30", label: "9:30" },
        ]}
        required
      />

      <RadioGroup
        id="arrivalBeforeMeeting"
        label="How long before the meeting did Laura actually arrive?"
        value={data.arrivalBeforeMeeting}
        onChange={(value) => onChange("arrivalBeforeMeeting", value)}
        options={[
          { value: "5-minutes", label: "5 minutes" },
          { value: "10-minutes", label: "10 minutes" },
          { value: "15-minutes", label: "15 minutes" },
          { value: "20-minutes", label: "20 minutes" },
        ]}
        required
      />
    </div>
  );
}

