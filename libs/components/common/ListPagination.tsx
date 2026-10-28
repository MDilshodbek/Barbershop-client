import React, { FC } from "react";
import usePagination from "@mui/material/usePagination";
import ChevronLeftRoundedIcon from "@mui/icons-material/ChevronLeftRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import { useTranslation } from "react-i18next";

interface ListPaginationProps {
  /** COMMENT: current page (1-based) */
  page: number;
  /** COMMENT: number of pages */
  pageCount: number;
  onChange: (page: number) => void;
  /** COMMENT: number shown in the "Total N …" line */
  total: number;
  /** COMMENT: text after the number, e.g. "reservations" or "services available" */
  totalLabel: string;
  className?: string;
}

/**
 * Shared list pagination: ‹ 1 2 3 … 8 › with round page buttons, centered,
 * and a "Total N <label>" line under it. Numbers and chevrons are hidden when there is one page.
 */
const ListPagination: FC<ListPaginationProps> = ({
  page,
  pageCount,
  onChange,
  total,
  totalLabel,
  className = "",
}) => {
  const { t } = useTranslation("common");
  const { items } = usePagination({
    count: pageCount,
    page,
    onChange: (_, value) => onChange(value),
    siblingCount: 1,
    boundaryCount: 1,
  });

  return (
    <nav className={`list-pagination ${className}`} aria-label={t("Pagination")}>
      {pageCount > 1 && (
        <ul className="list-pagination__items">
          {items.map(({ page: itemPage, type, selected, disabled, onClick }, index) => {
            if (type === "start-ellipsis" || type === "end-ellipsis") {
              return (
                <li key={`${type}-${index}`} className="list-pagination__ellipsis" aria-hidden="true">
                  …
                </li>
              );
            }

            if (type === "previous" || type === "next") {
              const isPrev = type === "previous";
              return (
                <li key={type}>
                  <button
                    type="button"
                    className="list-pagination__btn list-pagination__btn--nav"
                    aria-label={isPrev ? t("Previous page") : t("Next page")}
                    disabled={disabled}
                    onClick={onClick}
                  >
                    {isPrev ? (
                      <ChevronLeftRoundedIcon aria-hidden="true" />
                    ) : (
                      <ChevronRightRoundedIcon aria-hidden="true" />
                    )}
                  </button>
                </li>
              );
            }

            if (type === "page") {
              return (
                <li key={`page-${itemPage}`}>
                  <button
                    type="button"
                    className={`list-pagination__btn list-pagination__btn--page ${selected ? "is-active" : ""}`}
                    aria-current={selected ? "page" : undefined}
                    aria-label={t("Page {{page}}", { page: itemPage })}
                    onClick={onClick}
                  >
                    {itemPage}
                  </button>
                </li>
              );
            }

            return null;
          })}
        </ul>
      )}

      <p className="list-pagination__total">
        {t("Total")} {total} {totalLabel}
      </p>
    </nav>
  );
};

export default ListPagination;
