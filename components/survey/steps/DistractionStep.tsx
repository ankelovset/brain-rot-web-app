"use client";

import { useEffect } from "react";
import LikertScale from "../LikertScale";
import RadioGroup from "../RadioGroup";

const VISUALS_DISTRACTING_LABELS: { [key: number]: string } = {
  1: "Not distracting",
  2: "Slightly distracting",
  3: "Somewhat distracting",
  4: "Moderately distracting",
  5: "Distracting",
  6: "Very distracting",
  7: "Extremely distracting",
};

const EXPERIENCE_OF_VISUALS_OPTIONS = [
  { value: "mostly-ignored", label: "I mostly ignored them" },
  { value: "noticed-but-focused", label: "I noticed them but could focus on the narration" },
  { value: "competed-with-narration", label: "They competed with the narration for my attention" },
  { value: "took-most-attention", label: "They took most of my attention" },
];

interface DistractionStepProps {
  data: {
    lookingAtBackground: number | null;
    visualsDistracting: number | null;
    experienceOfBackgroundVisuals: string;
  };
  onChange: (field: string, value: string | number | null) => void;
}

export default function DistractionStep({ data, onChange }: DistractionStepProps) {
  const showExperienceQuestion = data.visualsDistracting !== null && data.visualsDistracting >= 4;

  // Clear experience answer when rating drops below 4
  useEffect(() => {
    if (!showExperienceQuestion && data.experienceOfBackgroundVisuals !== "") {
      onChange("experienceOfBackgroundVisuals", "");
    }
  }, [showExperienceQuestion, data.experienceOfBackgroundVisuals, onChange]);

  return (
    <div className="w-full max-w-md space-y-6">
      <h3 className="text-lg font-semibold text-black dark:text-zinc-50 mb-4">
        Distraction / Divided Attention
      </h3>

      <LikertScale
        id="lookingAtBackground"
        statement="My attention was split between the visuals and the narration"
        value={data.lookingAtBackground}
        onChange={(value) => onChange("lookingAtBackground", value)}
        required
      />

      <LikertScale
        id="visualsDistracting"
        statement="How distracting were the visuals?"
        value={data.visualsDistracting}
        onChange={(value) => onChange("visualsDistracting", value)}
        required
        customLabels={VISUALS_DISTRACTING_LABELS}
      />

      {showExperienceQuestion && (
        <RadioGroup
          id="experienceOfBackgroundVisuals"
          label="What best describes your experience of the visuals?"
          value={data.experienceOfBackgroundVisuals}
          onChange={(value) => onChange("experienceOfBackgroundVisuals", value)}
          options={EXPERIENCE_OF_VISUALS_OPTIONS}
          required
        />
      )}
    </div>
  );
}
