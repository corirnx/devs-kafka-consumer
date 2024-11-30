import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import CollapsibleJsonItem from "@/app/ui/collapsibleJsonItem";

const mockData = {
    key1: "value1",
    key2: "value2",
    key3: "value3",
};

describe('CollapsibleJsonItem', () => {
    const renderComponent = (data = mockData) => {
        render(<CollapsibleJsonItem data={data} />);
    };

    it('renders the component in collapsed state initially', () => {
        renderComponent();
        const previewText = screen.getByRole('expand');
        expect(previewText).toBeInTheDocument();
        expect(previewText).toHaveTextContent(/"key1": "value1"/i);
        expect(screen.queryByRole('collapse')).not.toBeInTheDocument();
    });

    it('expands and shows full JSON data on button click', () => {
        renderComponent();
        const button = screen.getByRole('expand');
        fireEvent.click(button);
        const collapseText = screen.getByRole('collapse');
        expect(collapseText).toBeInTheDocument();
        expect(screen.getByText(/"key1": "value1"/i)).toBeInTheDocument();
        expect(screen.getByText(/"key2": "value2"/i)).toBeInTheDocument();
        expect(screen.getByText(/"key3": "value3"/i)).toBeInTheDocument();
    });

    it('collapses back to preview on button click again', () => {
        renderComponent();
        const button = screen.getByRole('expand');
        fireEvent.click(button);
        const collapseButton = screen.getByRole('collapse');
        fireEvent.click(collapseButton);
        const previewText = screen.getByRole('expand');
        expect(previewText).toBeInTheDocument();
        expect(previewText).toHaveTextContent(/"key1": "value1"/i);
        expect(screen.queryByRole('collapse')).not.toBeInTheDocument();
    });

    it('renders nothing if data is empty or undefined', () => {        
        renderComponent({} as any);
        expect(screen.queryByRole('expand')).not.toBeInTheDocument();
        expect(screen.queryByRole('collapse')).not.toBeInTheDocument();
    });
});