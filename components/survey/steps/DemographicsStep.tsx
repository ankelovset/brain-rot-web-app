import TextInput from "../TextInput";
import SelectInput from "../SelectInput";
import ScaleInput from "../ScaleInput";

interface DemographicsStepProps {
  data: {
    age: string;
    gender: string;
    education: string;
    isNativeEnglish: string;
    englishLevel: string;
    socialMediaFrequency: string;
    gameplayFamiliarity: string;
  };
  onChange: (field: string, value: string | number) => void;
}

export default function DemographicsStep({
  data,
  onChange,
}: DemographicsStepProps) {
  return (
    <div className="w-full max-w-md space-y-6">
      <TextInput
        id="age"
        label="What is your age?"
        value={data.age}
        onChange={(value) => onChange("age", value)}
        type="number"
        min={1}
        max={120}
        required
      />

      <SelectInput
        id="gender"
        label="What is your gender?"
        value={data.gender}
        onChange={(value) => onChange("gender", value)}
        options={[
          { value: "male", label: "Male" },
          { value: "female", label: "Female" },
          { value: "non-binary", label: "Non-binary" },
          { value: "prefer-not-to-say", label: "Prefer not to say" },
          { value: "other", label: "Other" },
        ]}
        required
      />

      <SelectInput
        id="education"
        label="What is your highest completed level of education?"
        value={data.education}
        onChange={(value) => onChange("education", value)}
        options={[
          { value: "high-school", label: "High School" },
          { value: "college", label: "College" },
          { value: "bachelors", label: "Bachelor's Degree" },
          { value: "masters", label: "Master's Degree" },
          { value: "phd", label: "PhD" },
          { value: "other", label: "Other" },
        ]}
        required
      />

      <SelectInput
        id="isNativeEnglish"
        label="Is English your native language?"
        value={data.isNativeEnglish}
        onChange={(value) => onChange("isNativeEnglish", value)}
        options={[
          { value: "yes", label: "Yes" },
          { value: "no", label: "No" },
        ]}
        required
      />

      <SelectInput
        id="englishLevel"
        label="How would you rate your English level?"
        value={data.englishLevel}
        onChange={(value) => onChange("englishLevel", value)}
        options={[
          { value: "beginner", label: "Beginner" },
          { value: "elementary", label: "Elementary" },
          { value: "intermediate", label: "Intermediate" },
          { value: "advanced", label: "Advanced" },
          { value: "native-like", label: "Native-like" },
        ]}
        required
      />
      {/* <SelectInput
        id="englishLevel"
        label="How would you rate your English level?"
        value={data.englishLevel}
        onChange={(value) => onChange("englishLevel", value)}
        min={1}
        max={5}
        labels={{
          1: "Beginner",
          5: "Advanced",
        }}
        required
      /> */}

      <SelectInput
        id="socialMediaFrequency"
        label="How often do you use social media (TikTok, Instagram Reels or similar)?"
        value={data.socialMediaFrequency}
        onChange={(value) => onChange("socialMediaFrequency", value)}
        options={[
          { value: "never", label: "Never" },
          { value: "rarely", label: "Rarely" },
          { value: "monthly", label: "Monthly" },
          { value: "weekly", label: "Weekly" },
          { value: "daily", label: "Daily" },
          { value: "multiple-daily", label: "Multiple times daily" },
        ]}
        required
      />

      <SelectInput
        id="gameplayFamiliarity"
        label="How familiar are you with gameplay videos such as Minecraft or Subway Surfers?"
        value={data.gameplayFamiliarity}
        onChange={(value) => onChange("gameplayFamiliarity", value)}
        options={[
          { value: "not-familiar", label: "Not familiar" },
          { value: "somewhat-familiar", label: "Somewhat familiar" },
          { value: "very-familiar", label: "Very familiar" },
          { value: "expert", label: "Expert" },
        ]}
        required
      />
    </div>
  );
}


