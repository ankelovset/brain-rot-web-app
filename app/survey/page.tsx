"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import DemographicsStep from "@/components/survey/steps/DemographicsStep";
import VideoStep from "@/components/survey/steps/VideoStep";
import FreeRecallStep from "@/components/survey/steps/FreeRecallStep";
import MultipleChoiceStep from "@/components/survey/steps/MultipleChoiceStep";
import LikertStep from "@/components/survey/steps/LikertStep";
import QualityControlStep from "@/components/survey/steps/QualityControlStep";
import SurveyHeader from "@/components/SurveyHeader";

interface SurveyData {
  demographics: {
    age: string;
    gender: string;
    education: string;
    isNativeEnglish: string;
    englishLevel: string;
    socialMediaFrequency: string;
    gameplayFamiliarity: string;
  };
  video: {
    filename: string;
    timeSpentSeconds?: number;
    watchCount?: number;
  };
  freeRecall: {
    everythingRemembered: string;
  };
  multipleChoice: {
    storyAbout: string;
    arrivalTime: string;
    researchRoom: string;
    kioskPurchase: string;
    lauraRoom: string;
    meetingRescheduled: string;
    arrivalBeforeMeeting: string;
  };
  cognitiveLoad: {
    mentalEffort: number | null;
    concentrateHard: number | null;
    mentallyDemanding: number | null;
    easyToFollow: number | null;
  };
  distraction: {
    visualsDistracted: number | null;
    attentionSplit: number | null;
    lookingAtBackground: number | null;
    ableToIgnore: number | null;
  };
  engagement: {
    videoEngaging: number | null;
    wouldKeepWatching: number | null;
    visualsEnjoyable: number | null;
  };
  manipulationCheck: {
    fastPaced: number | null;
    visuallyStimulating: number | null;
  };
  qualityControl: {
    attentionCheck: string;
    attentionPaid: number | null;
    watchedEntireVideo: string;
    wasMultitasking: string;
    narrationFocus: number | null;
    distractionFocus: number | null;
    backgroundVisuals: number | null;
  };
}

const TOTAL_STEPS = 9;

export default function Page() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"success" | "error" | null>(null);
  const [startedAt, setStartedAt] = useState<Date | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<string>("");
  const [videoWatched, setVideoWatched] = useState(false);
  const [isLoadingVideo, setIsLoadingVideo] = useState(true);

  // Debug: skip steps from browser console (e.g. __surveyDebug.goToStep(3) or __surveyDebug.next())
  useEffect(() => {
    (window as unknown as { __surveyDebug?: object }).__surveyDebug = {
      goToStep: (n: number) => setCurrentStep(Math.max(0, Math.min(n, TOTAL_STEPS - 1))),
      next: () => setCurrentStep((s) => Math.min(s + 1, TOTAL_STEPS - 1)),
      markVideoWatched: () => setVideoWatched(true),
      totalSteps: TOTAL_STEPS,
    };
    return () => {
      delete (window as unknown as { __surveyDebug?: object }).__surveyDebug;
    };
  }, []);

  // Capture start time and load available videos when component mounts
  useEffect(() => {
    setStartedAt(new Date());
    const loadVideos = async () => {
      try {
        const response = await fetch("/api/videos");
        if (!response.ok) throw new Error("Failed to load videos");
        const data = await response.json();
        const videos = data.videos;
        if (videos?.length > 0) {
          const chosen = videos[Math.floor(Math.random() * videos.length)];
          setSelectedVideo(chosen);
          updateSurveyData("video", "filename", chosen);
        }
      } catch (error) {
        console.error("Error loading videos:", error);
      } finally {
        setIsLoadingVideo(false);
      }
    };
    loadVideos();
  }, []);

  const [surveyData, setSurveyData] = useState<SurveyData>({
    demographics: {
      age: "",
      gender: "",
      education: "",
      isNativeEnglish: "",
      englishLevel: "",
      socialMediaFrequency: "",
      gameplayFamiliarity: "",
    },
    video: {
      filename: "",
      timeSpentSeconds: 0,
      watchCount: 0,
    },
    freeRecall: {
      everythingRemembered: "",
    },
    multipleChoice: {
      storyAbout: "",
      arrivalTime: "",
      researchRoom: "",
      kioskPurchase: "",
      lauraRoom: "",
      meetingRescheduled: "",
      arrivalBeforeMeeting: "",
    },
    cognitiveLoad: {
      mentalEffort: null,
      concentrateHard: null,
      mentallyDemanding: null,
      easyToFollow: null,
    },
    distraction: {
      visualsDistracted: null,
      attentionSplit: null,
      lookingAtBackground: null,
      ableToIgnore: null,
    },
    engagement: {
      videoEngaging: null,
      wouldKeepWatching: null,
      visualsEnjoyable: null,
    },
    manipulationCheck: {
      fastPaced: null,
      visuallyStimulating: null,
    },
    qualityControl: {
      attentionCheck: "",
      attentionPaid: null,
      watchedEntireVideo: "",
      wasMultitasking: "",
      narrationFocus: null,
      distractionFocus: null,
      backgroundVisuals: null,
    },
  });

  const updateSurveyData = (section: keyof SurveyData, field: string, value: any) => {
    setSurveyData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  // Warn before closing tab / leaving when survey is not submitted
  useEffect(() => {
    if (submitStatus === "success") return;
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [submitStatus]);

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 0: // Demographics
        return (
          surveyData.demographics.age !== "" &&
          surveyData.demographics.gender !== "" &&
          surveyData.demographics.education !== "" &&
          surveyData.demographics.isNativeEnglish !== "" &&
          surveyData.demographics.englishLevel !== "" &&
          surveyData.demographics.socialMediaFrequency !== "" &&
          surveyData.demographics.gameplayFamiliarity !== ""
        );
      case 1: // Video — step is skippable; time/watchCount still recorded if they play
        return true;
      case 2: // Free Recall
        return (
          surveyData.freeRecall.everythingRemembered.trim() !== ""
        );
      case 3: // Multiple Choice
        return (
          surveyData.multipleChoice.storyAbout !== "" &&
          surveyData.multipleChoice.arrivalTime !== "" &&
          surveyData.multipleChoice.researchRoom !== "" &&
          surveyData.multipleChoice.kioskPurchase !== "" &&
          surveyData.multipleChoice.lauraRoom !== "" &&
          surveyData.multipleChoice.meetingRescheduled !== "" &&
          surveyData.multipleChoice.arrivalBeforeMeeting !== ""
        );
      case 4: // Cognitive Load
        return (
          surveyData.cognitiveLoad.mentalEffort !== null &&
          surveyData.cognitiveLoad.concentrateHard !== null &&
          surveyData.cognitiveLoad.mentallyDemanding !== null &&
          surveyData.cognitiveLoad.easyToFollow !== null
        );
      case 5: // Distraction
        return (
          surveyData.distraction.visualsDistracted !== null &&
          surveyData.distraction.attentionSplit !== null &&
          surveyData.distraction.lookingAtBackground !== null &&
          surveyData.distraction.ableToIgnore !== null
        );
      case 6: // Engagement
        return (
          surveyData.engagement.videoEngaging !== null &&
          surveyData.engagement.wouldKeepWatching !== null &&
          surveyData.engagement.visualsEnjoyable !== null
        );
      case 7: // Manipulation Check
        return (
          surveyData.manipulationCheck.fastPaced !== null &&
          surveyData.manipulationCheck.visuallyStimulating !== null
        );
      case 8: // Quality Control
        return (
          surveyData.qualityControl.attentionCheck !== "" &&
          surveyData.qualityControl.attentionPaid !== null &&
          surveyData.qualityControl.watchedEntireVideo !== "" &&
          surveyData.qualityControl.narrationFocus !== null &&
          surveyData.qualityControl.distractionFocus !== null &&
          (selectedVideo === "01-no-video.mp4" ||
            surveyData.qualityControl.backgroundVisuals !== null)
        );
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (validateStep(currentStep) && currentStep < TOTAL_STEPS - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    } else {
      // Navigate to home page if on first step
      router.push("/");
    }
  };

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) {
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      // Transform data for API
      const completedAt = new Date();
      const submissionData = {
        demographics: {
          age: parseInt(surveyData.demographics.age),
          gender: surveyData.demographics.gender,
          education: surveyData.demographics.education,
          isNativeEnglish: surveyData.demographics.isNativeEnglish === "yes",
          englishLevel: surveyData.demographics.englishLevel,
          socialMediaFrequency: surveyData.demographics.socialMediaFrequency,
          gameplayFamiliarity: surveyData.demographics.gameplayFamiliarity,
        },
        video: {
          filename: surveyData.video.filename,
          timeSpentSeconds: surveyData.video.timeSpentSeconds ?? 0,
          watchCount: surveyData.video.watchCount ?? 0,
        },
        freeRecall: {
          everythingRemembered: surveyData.freeRecall.everythingRemembered,
        },
        multipleChoice: {
          storyAbout: surveyData.multipleChoice.storyAbout,
          arrivalTime: surveyData.multipleChoice.arrivalTime,
          researchRoom: surveyData.multipleChoice.researchRoom,
          kioskPurchase: surveyData.multipleChoice.kioskPurchase,
          lauraRoom: surveyData.multipleChoice.lauraRoom,
          meetingRescheduled: surveyData.multipleChoice.meetingRescheduled,
          arrivalBeforeMeeting: surveyData.multipleChoice.arrivalBeforeMeeting,
        },
        cognitiveLoad: surveyData.cognitiveLoad,
        distraction: surveyData.distraction,
        engagement: surveyData.engagement,
        manipulationCheck: surveyData.manipulationCheck,
        qualityControl: {
          attentionCheck: surveyData.qualityControl.attentionCheck,
          attentionPaid: surveyData.qualityControl.attentionPaid,
          watchedEntireVideo: surveyData.qualityControl.watchedEntireVideo === "yes",
          wasMultitasking: surveyData.qualityControl.wasMultitasking === "yes",
          narrationFocus: surveyData.qualityControl.narrationFocus,
          distractionFocus: surveyData.qualityControl.distractionFocus,
          backgroundVisuals: surveyData.qualityControl.backgroundVisuals,
        },
        startedAt: startedAt || new Date(),
        completedAt: completedAt,
      };

      const response = await fetch("/api/survey", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submissionData),
      });

      if (!response.ok) {
        throw new Error("Failed to submit survey");
      }

      setSubmitStatus("success");
    } catch (error) {
      console.error("Error submitting survey:", error);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const stepTitles = [
    "Demographics",
    "Video",
    "Free Recall",
    "Multiple Choice",
    "Cognitive Load",
    "Distraction",
    "Engagement",
    "Manipulation Check",
    "Quality Control",
  ];

  const handleVideoEnded = () => {
    setVideoWatched(true);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <DemographicsStep
            data={surveyData.demographics}
            onChange={(field, value) =>
              updateSurveyData("demographics", field, value)
            }
          />
        );
      case 1:
        if (isLoadingVideo || !selectedVideo) {
          return (
            <div className="w-full max-w-md space-y-6 text-center">
              <p className="text-zinc-600 dark:text-zinc-400">
                Loading video...
              </p>
            </div>
          );
        }
        return (
          <VideoStep
            videoPath={`/videos/${selectedVideo}`}
            videoFilename={selectedVideo}
            onVideoEnded={handleVideoEnded}
            initialTimeSpentSeconds={surveyData.video.timeSpentSeconds ?? 0}
            initialWatchCount={surveyData.video.watchCount ?? 0}
            onVideoProgress={({ timeSpentSeconds: t, watchCount: w }) =>
              setSurveyData((prev) => ({
                ...prev,
                video: { ...prev.video, timeSpentSeconds: t, watchCount: w },
              }))
            }
          />
        );
      case 2:
        return (
          <FreeRecallStep
            data={surveyData.freeRecall}
            onChange={(field, value) =>
              updateSurveyData("freeRecall", field, value)
            }
          />
        );
      case 3:
        return (
          <MultipleChoiceStep
            data={surveyData.multipleChoice}
            onChange={(field, value) =>
              updateSurveyData("multipleChoice", field, value)
            }
          />
        );
      case 4:
        return (
          <LikertStep
            title="Perceived Cognitive Load"
            questions={[
              {
                id: "mentalEffort",
                statement:
                  "It took a lot of mental effort to follow the story",
              },
              {
                id: "concentrateHard",
                statement:
                  "I had to concentrate hard to understand the story",
              },
              {
                id: "mentallyDemanding",
                statement: "The video felt mentally demanding",
              },
              {
                id: "easyToFollow",
                statement: "I found it easy to follow the story",
                reverse: true,
              },
            ]}
            data={surveyData.cognitiveLoad}
            onChange={(field, value) =>
              updateSurveyData("cognitiveLoad", field, value)
            }
          />
        );
      case 5:
        return (
          <LikertStep
            title="Distraction / Divided Attention"
            questions={[
              {
                id: "visualsDistracted",
                statement:
                  "The background visuals distracted me from the story",
              },
              {
                id: "attentionSplit",
                statement:
                  "My attention was split between the visuals and the narration",
              },
              {
                id: "lookingAtBackground",
                statement:
                  "I found myself looking at the background more than listening",
              },
              {
                id: "ableToIgnore",
                statement:
                  "I was able to ignore the background visuals",
                reverse: true,
              },
            ]}
            data={surveyData.distraction}
            onChange={(field, value) =>
              updateSurveyData("distraction", field, value)
            }
          />
        );
      case 6:
        return (
          <LikertStep
            title="Engagement"
            questions={[
              {
                id: "videoEngaging",
                statement: "The video was engaging",
              },
              {
                id: "wouldKeepWatching",
                statement: "I would keep watching a video like this",
              },
              {
                id: "visualsEnjoyable",
                statement: "The visuals made the video more enjoyable",
              },
            ]}
            data={surveyData.engagement}
            onChange={(field, value) =>
              updateSurveyData("engagement", field, value)
            }
          />
        );
      case 7:
        return (
          <LikertStep
            title="Manipulation Check"
            questions={[
              {
                id: "fastPaced",
                statement: "The background visuals were fast-paced",
              },
              {
                id: "visuallyStimulating",
                statement:
                  "The background visuals were visually stimulating",
              },
            ]}
            data={surveyData.manipulationCheck}
            onChange={(field, value) =>
              updateSurveyData("manipulationCheck", field, value)
            }
          />
        );
      case 8:
        return (
          <QualityControlStep
            data={surveyData.qualityControl}
            onChange={(field, value) =>
              updateSurveyData("qualityControl", field, value)
            }
            shownVideoFilename={selectedVideo}
          />
        );
      default:
        return null;
    }
  };

  if (submitStatus === "success") {
    return (
      <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex flex-col items-center gap-8 text-center sm:items-start sm:text-left w-full">
          <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
            Thank You!
          </h1>
          <p className="max-w-md text-lg leading-8 text-zinc-600 dark:text-zinc-400">
            Your survey has been submitted successfully. We appreciate your participation!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <SurveyHeader 
        currentStep={currentStep}
        totalSteps={TOTAL_STEPS}
        stepTitle={stepTitles[currentStep]}
      />
      
      <div className="flex flex-col items-center gap-8 text-center sm:items-start sm:text-left w-full">

          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (currentStep === TOTAL_STEPS - 1) {
                handleSubmit();
              } else {
                handleNext();
              }
            }}
            className="w-full"
          >
            {renderStep()}

            {submitStatus === "error" && (
              <div className="rounded-full bg-red-100 dark:bg-red-900 px-5 py-3 text-sm text-red-800 dark:text-red-200 mt-6">
                Failed to submit survey. Please try again.
              </div>
            )}

            <div className="flex gap-4 mt-8 w-full max-w-md">
              <button
                type="button"
                onClick={handleBack}
                className="flex h-12 w-full items-center justify-center gap-2 rounded-full border border-zinc-300 bg-white px-5 text-black transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50 dark:hover:bg-zinc-800"
              >
                Back
              </button>
              {currentStep < TOTAL_STEPS - 1 ? (
                <button
                  type="submit"
                  disabled={!validateStep(currentStep)}
                  className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-foreground px-5 text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={!validateStep(currentStep) || isSubmitting}
                  className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-foreground px-5 text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Submitting..." : "Submit"}
                </button>
              )}
            </div>
          </form>
        </div>
    </div>
  );
}
