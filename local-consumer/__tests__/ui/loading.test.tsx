import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import LoadingCircle from "@/app/ui/loading";


describe('LoadingCircle', () => {
    it('renders the loading circle and text', () => {
        render(<LoadingCircle />);

        // Check if the SVG element is rendered
        const svgElement = screen.getByRole('img', { hidden: true });
        expect(svgElement).toBeInTheDocument();
        expect(svgElement).toHaveClass('animate-spin');

        // Check if the loading text is rendered
        const loadingText = screen.getByText(/loading.../i);
        expect(loadingText).toBeInTheDocument();
    });
});