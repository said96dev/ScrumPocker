'use client';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { ChevronLeft, ChevronRight } from 'lucide-react';

type ButtonContainerProps = {
    currentPage: number;
    totalPages: number;
};

type ButtonProps = {
    page: number;
    activeClass: boolean;
};

function ButtonContainer({ currentPage, totalPages }: ButtonContainerProps) {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    const handlePageChange = (page: number) => {
        const defaultParams = {
            search: searchParams.get('search') || '',
            jobStatus: searchParams.get('jobStatus') || '',
            page: String(page),
        };

        let params = new URLSearchParams(defaultParams);

        router.push(`${pathname}?${params.toString()}`);
    };

    const addPageButton = ({ page, activeClass }: ButtonProps) => {
        return (
            <button
                className="btn btn-secondary"
                onClick={() => handlePageChange(page)}
            >
                {page}
            </button>
        );
    };

    const renderPageButtons = () => {
        const pageButtons = [];
        // first page
        pageButtons.push(
            addPageButton({ page: 1, activeClass: currentPage === 1 })
        );
        // dots
        if (currentPage > 3) {
            pageButtons.push(
                <button>
                    ...
                </button>
            );
        }
        if (currentPage !== 1 && currentPage !== 2) {
            pageButtons.push(
                addPageButton({ page: currentPage - 1, activeClass: false })
            );
        }

        // current page
        if (currentPage !== 1 && currentPage !== totalPages) {
            pageButtons.push(
                addPageButton({
                    page: currentPage,
                    activeClass: true,
                })
            );
        }
        // one after current page
        if (currentPage !== totalPages && currentPage !== totalPages - 1) {
            pageButtons.push(
                addPageButton({ page: currentPage + 1, activeClass: false })
            );
        }
        if (currentPage < totalPages - 2) {
            pageButtons.push(
                <button>
                    ...
                </button>
            );
        }

        pageButtons.push(
            addPageButton({
                page: totalPages,
                activeClass: currentPage === totalPages,
            })
        );
        return pageButtons;
    };

    return (
        <div className='flex  gap-x-2'>
            {/* prev */}
            <button
                className='flex items-center gap-x-2 btn btn-secondary'
                onClick={() => {
                    let prevPage = currentPage - 1;
                    if (prevPage < 1) prevPage = totalPages;
                    handlePageChange(prevPage);
                }}
            >
                <ChevronLeft />
                prev
            </button>
            {renderPageButtons()}
            {/* next */}
            <button
                className='flex items-center gap-x-2 btn btn-secondary'
                onClick={() => {
                    let nextPage = currentPage + 1;
                    if (nextPage > totalPages) nextPage = 1;
                    handlePageChange(nextPage);
                }}
            >
                next
                <ChevronRight />
            </button>
        </div>
    );
}
export default ButtonContainer;