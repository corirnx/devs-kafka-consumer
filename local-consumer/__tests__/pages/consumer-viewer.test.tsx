import ConsumerViewer from "@/app/dashboard/consumer/page";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";

describe("ConsumerViewer", () => {
    it("renders a heading", () => {
        render(<ConsumerViewer />);

        const heading = screen.getByRole("heading", {
            name: /Local Consumer/i,
        });

        expect(heading).toBeInTheDocument();
    });

    it("renders three input fields", () => {
        render(<ConsumerViewer />);

        const inputFields = screen.getAllByRole("textbox");

        expect(inputFields).toHaveLength(3);
    });

    it("should handle invalid input", async () => {
        render(<ConsumerViewer />);

        const consumeButton = screen.getByRole("consume-button");

        fireEvent.click(consumeButton);

        await waitFor(() => {
            expect(screen.getByText((content, element) => {
                return element?.tagName.toLowerCase() === 'pre' && content.includes("required fields are missing");
            })).toBeInTheDocument();
        });
    });
});
