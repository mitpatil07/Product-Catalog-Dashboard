import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './Button';

export function Pagination({
  currentPage,
  totalItems,
  itemsPerPage,
  onPageChange,
  className = '',
}) {
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;

  if (totalPages <= 1) {
    return (
      <div className={`flex items-center justify-between py-3 ${className}`}>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Showing 1 to {totalItems} of {totalItems} entries
        </p>
      </div>
    );
  }

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  // Generate page numbers
  const pages = [];
  for (let i = 1; i <= totalPages; i++) {
    pages.push(i);
  }

  return (
    <div className={`flex flex-col sm:flex-row items-center justify-between gap-4 py-4 border-t border-slate-100 dark:border-slate-800 ${className}`}>
      <div className="text-xs text-slate-500 dark:text-slate-400">
        Showing <span className="font-semibold text-slate-700 dark:text-slate-200">{startItem}</span> to{' '}
        <span className="font-semibold text-slate-700 dark:text-slate-200">{endItem}</span> of{' '}
        <span className="font-semibold text-slate-700 dark:text-slate-200">{totalItems}</span> entries
      </div>
      
      <div className="flex items-center gap-1.5">
        <Button
          variant="outline"
          size="sm"
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
          className="h-8 w-8 !p-0"
          aria-label="Previous page"
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>

        {pages.map((page) => {
          // If total pages is small, show all. If large, we can truncate, but since this is a local catalog catalog, pages will be few.
          const isActive = page === currentPage;
          return (
            <Button
              key={page}
              variant={isActive ? 'primary' : 'outline'}
              size="sm"
              onClick={() => onPageChange(page)}
              className={`h-8 min-w-8 !px-2 !py-0 text-xs ${
                isActive
                  ? 'shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              {page}
            </Button>
          );
        })}

        <Button
          variant="outline"
          size="sm"
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          className="h-8 w-8 !p-0"
          aria-label="Next page"
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
