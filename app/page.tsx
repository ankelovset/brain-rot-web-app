export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex flex-col items-center justify-between gap-8 sm:items-start">
          {/* UiB Logo */}
          <div className="w-full flex justify-center sm:justify-start">
            <img
              src="/uib-logo.png"
              alt="University of Bergen Logo"
              style={{ 
                height: '80px', 
                width: 'auto',
                maxWidth: '250px',
                display: 'block',
                objectFit: 'contain'
              }}
            />
          </div>
          <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left w-full">
            <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
              Do Hypnotic Videos Reduce Memory Recall?
            </h1>
            <p className="max-w-md text-lg leading-8 text-zinc-600 dark:text-zinc-400">
              This research examines whether background media content, specifically "brainrot" or "hypnotic" style videos,affects your ability to recall story details. You'll watch a short video telling a story, and then answer questions about what you remember.
            </p>
          </div>
          <div className="flex flex-col gap-4 text-base font-medium sm:flex-row w-full sm:w-auto">
            <a
              className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-foreground px-5 text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc] md:w-[158px]"
              href="/survey"
              rel="noopener noreferrer"
            >
              Start
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
