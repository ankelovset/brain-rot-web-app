"use client";

interface SurveyHeaderProps {
  currentStep: number;
  totalSteps: number;
  stepTitle: string;
}

export default function SurveyHeader({ currentStep, totalSteps, stepTitle }: SurveyHeaderProps) {
  return (
    <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* UiB Logo - dark logo in light mode, light logo in dark mode */}
      <div className="w-full flex justify-center sm:justify-start mb-6">
        <img
          src="/uib-logo-dark.png"
          alt="University of Bergen Logo"
          className="block dark:hidden"
          style={{ 
            height: '80px', 
            width: 'auto',
            maxWidth: '250px',
            objectFit: 'contain'
          }}
        />
        <img
          src="/uib-logo.png"
          alt="University of Bergen Logo"
          className="hidden dark:block"
          style={{ 
            height: '80px', 
            width: 'auto',
            maxWidth: '250px',
            objectFit: 'contain'
          }}
        />
      </div>
      
      <div className="w-full max-w-md">
        <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50 mb-2">
          Survey
        </h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-6">
          Step {currentStep + 1} of {totalSteps}: {stepTitle}
        </p>

        {/* Progress Bar */}
        <div className="w-full bg-zinc-200 dark:bg-zinc-800 rounded-full h-2 mb-8">
          <div
            className="bg-black dark:bg-zinc-50 h-2 rounded-full transition-all duration-300"
            style={{
              width: `${((currentStep + 1) / totalSteps) * 100}%`,
            }}
          />
        </div>
      </div>
    </div>
  );
}

