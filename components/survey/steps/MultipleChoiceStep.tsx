
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
    colleaguesArrived: string;
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
        label="What is the main character's name?"
        value={data.storyAbout}
        onChange={(value) => onChange("storyAbout", value)}
        options={[
          { value: "sarah", label: "Sarah" },
          { value: "john", label: "John" },
          { value: "laura", label: "Laura" },
          { value: "michael", label: "Michael" },
        ]}
        required
      />

      <RadioGroup
        id="arrivalTime"
        label="At what time did the main character arrive at the university?"
        value={data.arrivalTime}
        onChange={(value) => onChange("arrivalTime", value)}
        options={[
          { value: "08.47", label: "08:47" },
          { value: "09.05", label: "09:05" },
          { value: "09.30", label: "09:30" },
          { value: "10.15", label: "10:15" },
        ]}
        required
      />

      <RadioGroup
        id="researchRoom"
        label="What room was the meeting held in?"
        value={data.researchRoom}
        onChange={(value) => onChange("researchRoom", value)}
        options={[
          { value: "217", label: "217" },
          { value: "312", label: "312" },
          { value: "930", label: "930" },
          { value: "847", label: "847" },
        ]}
        required
      />

      <RadioGroup
        id="kioskPurchase"
        label="What did the main character buy at the kiosk?"
        value={data.kioskPurchase}
        onChange={(value) => onChange("kioskPurchase", value)}
        options={[
          { value: "coffee ", label: "Coffee" },
          { value: "water", label: "Water" },
          { value: "sandwich", label: "Sandwich" },
          { value: "chips", label: "Chips" },
        ]}
        required
      />

      <RadioGroup
        id="lauraRoom"
        label="Which room did the main character mistakenly go to first?"
        value={data.lauraRoom}
        onChange={(value) => onChange("lauraRoom", value)}
        options={[
          { value: "217", label: "217" },
          { value: "312", label: "312" },
          { value: "930", label: "930" },
          { value: "847", label: "847" },
        ]}
        required
      />

      <RadioGroup
        id="meetingRescheduled"
        label="At what time was the meeting scheduled to start?"
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
        label="What extra topic was added to the meeting agenda?"
        value={data.arrivalBeforeMeeting}
        onChange={(value) => onChange("arrivalBeforeMeeting", value)}
        options={[
          { value: "budget-planning-for-the-project", label: "Budget planning for the project" },
          { value: "assignment-of-research-roles", label: "Assignment of research roles" },
          { value: "data-collection-deadlines", label: "Data collection deadlines" },
          { value: "scheduling-future-seminars", label: "Scheduling future seminars" },
        ]}
        required
      />

      <RadioGroup
        id="colleaguesArrived"
        label="How many colleagues had arrived when the main character entered the room?"
        value={data.colleaguesArrived}
        onChange={(value) => onChange("colleaguesArrived", value)}
        options={[
          { value: "1", label: "1" },
          { value: "2", label: "2" },
          { value: "3", label: "3" },
          { value: "4", label: "4" },
        ]}
        required
      />
    </div>
  );
}

