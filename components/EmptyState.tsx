interface EmptyStateProps {
  title?: string;
  message?: string;
  icon?: React.ReactNode;
}

/**
 * Empty state component for when no results are found
 */
export default function EmptyState({
  title = 'No posts found',
  message = 'Try adjusting your search or filter to find what you\'re looking for.',
  icon,
}: EmptyStateProps) {
  return (
    <div className="text-center py-12 px-4">
      {icon || (
        <svg
          className="mx-auto h-12 w-12 text-zinc-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      )}
      <h3 className="mt-4 text-lg font-semibold text-zinc-900">{title}</h3>
      <p className="mt-2 text-sm text-zinc-600 max-w-md mx-auto">{message}</p>
    </div>
  );
}
