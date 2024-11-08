import ConsumerViewer from "@/app/dashboard/consumer/page";
import { render, screen } from "@testing-library/react";
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
});