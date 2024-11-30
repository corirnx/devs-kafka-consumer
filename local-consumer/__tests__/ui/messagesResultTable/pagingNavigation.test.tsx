import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import PagingNavigation from "@/app/ui/messagesResultTable/pagingNavigation";

describe('PagingNavigation', () => {
    const onPageChange = jest.fn();

    const renderComponent = (currentPage = 1, totalItems = 50, itemsPerPage = 10) => {
        render(
            <PagingNavigation
                pagingTitle="Page"
                totalItems={totalItems}
                itemsPerPage={itemsPerPage}
                onPageChange={onPageChange}
            />
        );
    };

    it('renders the paging navigation with initial state', () => {
        renderComponent();
        expect(screen.getByText(/Page 1 of 5/i)).toBeInTheDocument();
        expect(screen.getByRole('paging-left')).toBeDisabled();
        expect(screen.getByRole('paging-right')).not.toBeDisabled();
    });

    it('navigates to the next page when "Next" button is clicked', () => {
        renderComponent();
        const nextButton = screen.getByRole('paging-right');
        fireEvent.click(nextButton);
        expect(onPageChange).toHaveBeenCalledWith(2);
        expect(screen.getByText(/Page 2 of 5/i)).toBeInTheDocument();
    });

    it('navigates to the previous page when "Previous" button is clicked', () => {
        renderComponent();
        const nextButton = screen.getByRole('paging-right');
        fireEvent.click(nextButton); // Move to page 2
        const prevButton = screen.getByRole('paging-left');
        fireEvent.click(prevButton); // Move back to page 1
        expect(onPageChange).toHaveBeenCalledWith(1);
        expect(screen.getByText(/Page 1 of 5/i)).toBeInTheDocument();
    });

    it('disables the "Previous" button on the first page', () => {
        renderComponent(1, 50, 10);
        expect(screen.getByRole('paging-left')).toBeDisabled();
    });
});