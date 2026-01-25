/**
 * Content Disclosure Component
 * 
 * Displays transparency about AI-assisted content creation with human oversight.
 * This helps satisfy Google's E-E-A-T requirements by showing editorial process.
 */

export default function ContentDisclosure() {
  return (
    <div className="my-8 sm:my-12 p-4 sm:p-6 bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-xl">
      <div className="flex items-start gap-3">
        <div className="shrink-0 mt-0.5">
          <svg
            className="w-5 h-5 text-emerald-600 dark:text-emerald-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <div className="flex-1">
          <h4 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 mb-2">
            Content Transparency
          </h4>
          <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
            This article was created with the assistance of AI technology and has been{' '}
            <strong>thoroughly reviewed, fact-checked, and verified</strong> by our editorial team
            of nutrition professionals and registered dietitians. All information is based on
            current scientific research and medical guidelines. Our editorial process ensures
            accuracy, relevance, and adherence to evidence-based practices.
          </p>
        </div>
      </div>
    </div>
  );
}
