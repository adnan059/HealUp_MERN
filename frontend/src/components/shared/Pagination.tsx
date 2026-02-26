import type { SetURLSearchParams } from "react-router-dom";
import {
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  Pagination as ShadPagination,
} from "@/components/ui/pagination";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  setSearchParams: SetURLSearchParams;
}

const Pagination = ({
  currentPage,
  totalPages,
  setSearchParams,
}: PaginationProps) => {
  const changePage = (page: number) => {
    setSearchParams((prev) => {
      const params = new URLSearchParams(prev);
      params.set("page", String(page));
      return params;
    });
    scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };
  return (
    <ShadPagination className="healupPagination">
      <PaginationContent>
        {currentPage > 1 && (
          <PaginationItem>
            <PaginationPrevious onClick={() => changePage(currentPage - 1)} />
          </PaginationItem>
        )}

        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <PaginationItem key={page}>
            <PaginationLink
              isActive={page === currentPage}
              onClick={() => changePage(page)}
            >
              {page}
            </PaginationLink>
          </PaginationItem>
        ))}

        {currentPage < totalPages && (
          <PaginationItem>
            <PaginationNext onClick={() => changePage(currentPage + 1)} />
          </PaginationItem>
        )}
      </PaginationContent>
    </ShadPagination>
  );
};

export default Pagination;
