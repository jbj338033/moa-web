import { Page } from "../../types/pagination";

type PaginationProps = {
  page: Page<any>;
  onPageChange: (page: number) => void;
};

export default function Pagination({ page, onPageChange }: PaginationProps) {
  const currentPage = page.number;
  const totalPages = page.totalPages;
  const pageNumbers = [];
  const maxVisiblePages = 5;

  let startPage = Math.max(currentPage - Math.floor(maxVisiblePages / 2), 0);
  let endPage = Math.min(startPage + maxVisiblePages - 1, totalPages - 1);

  if (endPage - startPage < maxVisiblePages - 1) {
    startPage = Math.max(endPage - maxVisiblePages + 1, 0);
  }

  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-center items-center gap-2 mt-8">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={page.first}
        className="px-3 py-1 rounded-md border border-gray-300 
                 disabled:opacity-50 disabled:cursor-not-allowed
                 hover:bg-gray-50 transition-colors"
      >
        이전
      </button>

      {startPage > 0 && (
        <>
          <button
            onClick={() => onPageChange(0)}
            className="px-3 py-1 rounded-md hover:bg-gray-50 transition-colors"
          >
            1
          </button>
          {startPage > 1 && <span className="px-2">...</span>}
        </>
      )}

      {pageNumbers.map((pageNum) => (
        <button
          key={pageNum}
          onClick={() => onPageChange(pageNum)}
          className={`px-3 py-1 rounded-md transition-colors ${
            currentPage === pageNum
              ? "bg-blue-500 text-white"
              : "hover:bg-gray-50"
          }`}
        >
          {pageNum + 1}
        </button>
      ))}

      {endPage < totalPages - 1 && (
        <>
          {endPage < totalPages - 2 && <span className="px-2">...</span>}
          <button
            onClick={() => onPageChange(totalPages - 1)}
            className="px-3 py-1 rounded-md hover:bg-gray-50 transition-colors"
          >
            {totalPages}
          </button>
        </>
      )}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={page.last}
        className="px-3 py-1 rounded-md border border-gray-300 
                 disabled:opacity-50 disabled:cursor-not-allowed
                 hover:bg-gray-50 transition-colors"
      >
        다음
      </button>
    </div>
  );
}
