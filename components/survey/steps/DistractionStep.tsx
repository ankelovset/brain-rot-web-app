"use client";

import { useEffect } from "react";
import LikertScale from "../LikertScale";

const VISUALS_DISTRACTING_LABELS: { [key: number]: string } = {
  1: "Not distracting",
  2: "Slightly distracting",
  3: "Somewhat distracting",
  4: "Moderately distracting",
  5: "Distracting",
  6: "Very distracting",
  7: "Extremely distracting",
};

const EXPERIENCE_OF_VISUALS_LABELS: { [key: number]: string } = {
  1: "Very distracting",
  2: "Somewhat distracting",
  3: "Slightly distracting",
  4: "Neutral",
  5: "Slightly helpful for focus",
  6: "Somewhat helpful for focus",
  7: "Very helpful for focus",
};

interface DistractionStepProps {
  data: {
    lookingAtBackground: number | null;
    visualsDistracting: number | null;
    experienceOfBackgroundVisuals: number | null;
  };
  onChange: (field: string, value: string | number) => void;
}

export default function DistractionStep({ data, onChange }: DistractionStepProps) {
  const showExperienceQuestion = data.visualsDistracting !== null && data.visualsDistracting >= 4;

  // Clear experience answer when rating drops below 4
  useEffect(() => {
    if (!showExperienceQuestion && data.experienceOfBackgroundVisuals !== null) {
      onChange("experienceOfBackgroundVisuals", null);
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
        <LikertScale
          id="experienceOfBackgroundVisuals"
          statement="How did you experience the background visuals?"
          value={data.experienceOfBackgroundVisuals}
          onChange={(value) => onChange("experienceOfBackgroundVisuals", value)}
          required
          customLabels={EXPERIENCE_OF_VISUALS_LABELS}
        />
      )}
    </div>
  );
}
