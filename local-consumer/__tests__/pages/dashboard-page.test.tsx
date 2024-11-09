import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import Page from "@/app/dashboard/(overview)/page";


describe('Page Component', () => {
    test('renders the main element with role main', () => {
        render(<Page />);
        const mainElement = screen.getByRole('main');
        expect(mainElement).toBeInTheDocument();
    });
});