import Link from 'next/link';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  basePath?: string;
  onPageChange?: (page: number) => void;
}

/**
 * Pagination component for navigating between pages
 * Supports both server-side (URL-based) and client-side (callback-based) pagination
 */
export default function Pagination({
  currentPage,
  totalPages,
  basePath,
  onPageChange,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const isClientSide = !!onPageChange;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  // Determine which page numbers to show
  const getVisiblePages = () => {
    if (totalPages <= 7) return pages;

    if (currentPage <= 3) {
      return [...pages.slice(0, 5), '...', totalPages];
    }

    if (currentPage >= totalPages - 2) {
      return [1, '...', ...pages.slice(totalPages - 5)];
    }

    return [
      1,
      '...',
      currentPage - 1,
      currentPage,
      currentPage + 1,
      '...',
      totalPages,
    ];
  };

  const visiblePages = getVisiblePages();

  return (
    <div className="flex items-center justify-center gap-2 mt-12">
      {/* Previous Button */}
      {currentPage > 1 ? (
        isClientSide ? (
          <button
            onClick={() => onPageChange(currentPage - 1)}
            className="px-4 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 hover:border-zinc-400 transition-colors font-medium"
          >
            Previous
          </button>
        ) : (
          <Link
            href={`${basePath}?page=${currentPage - 1}`}
            className="px-4 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 hover:border-zinc-400 transition-colors font-medium"
          >
            Previous
          </Link>
        )
      ) : (
        <button
          disabled
          className="px-4 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 text-zinc-400 dark:text-zinc-600 cursor-not-allowed font-medium"
        >
          Previous
        </button>
      )}

      {/* Page Numbers */}
      <div className="flex items-center gap-1">
        {visiblePages.map((page, index) => {
          if (page === '...') {
            return (
              <span
                key={`ellipsis-${index}`}
                className="px-3 py-2 text-zinc-500 dark:text-zinc-400"
              >
                ...
              </span>
            );
          }

          const pageNum = page as number;
          const isActive = pageNum === currentPage;

          return isClientSide ? (
            <button
              key={pageNum}
              onClick={() => onPageChange(pageNum)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-emerald-600 dark:bg-emerald-500 text-white'
                  : 'border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 hover:border-zinc-400'
              }`}
            >
              {pageNum}
            </button>
          ) : (
            <Link
              key={pageNum}
              href={`${basePath}?page=${pageNum}`}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-emerald-600 dark:bg-emerald-500 text-white'
                  : 'border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 hover:border-zinc-400'
              }`}
            >
              {pageNum}
            </Link>
          );
        })}
      </div>

      {/* Next Button */}
      {currentPage < totalPages ? (
        isClientSide ? (
          <button
            onClick={() => onPageChange(currentPage + 1)}
            className="px-4 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 hover:border-zinc-400 transition-colors font-medium"
          >
            Next
          </button>
        ) : (
          <Link
            href={`${basePath}?page=${currentPage + 1}`}
            className="px-4 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 hover:border-zinc-400 transition-colors font-medium"
          >
            Next
          </Link>
        )
      ) : (
        <button
          disabled
          className="px-4 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 text-zinc-400 dark:text-zinc-600 cursor-not-allowed font-medium"
        >
          Next
        </button>
      )}
    </div>
  );
}
