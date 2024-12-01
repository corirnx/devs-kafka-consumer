import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { PartitionedMessages } from "@/lib/types";
import MessagesTable from "@/app/ui/messagesResultTable/messagesResultTable";


const mockPartition: PartitionedMessages = {
    partition: 1,
    messages: [
        {
            partition: 1,
            key: "key1",
            timestamp: Date.now(),
            message: { content: "message1" },
            header: { header1: "value1" },
            offset: 0,
            size: "100",
        },
        {
            partition: 1,
            key: "key2",
            timestamp: Date.now(),
            message: { content: "message2" },
            header: { header2: "value2" },
            offset: 1,
            size: "200",
        },        
    ],
};


describe('MessagesTable', () => {
    const renderComponent = (partition = mockPartition) => {
        render(<MessagesTable partition={partition} />);
    };

    it('renders the table headers correctly', () => {
        renderComponent();
        const headers = screen.getAllByRole('columnheader');
        expect(headers).toHaveLength(8);
        expect(headers[0]).toHaveTextContent(/no./i);
        expect(headers[1]).toHaveTextContent(/partition/i);
        expect(headers[2]).toHaveTextContent(/key/i);
        expect(headers[3]).toHaveTextContent(/timestamp/i);
        expect(headers[4]).toHaveTextContent(/value/i);
        expect(headers[5]).toHaveTextContent(/header/i);
        expect(headers[6]).toHaveTextContent(/offset/i);
        expect(headers[7]).toHaveTextContent(/size/i);
    });

    it('renders the table rows with correct data', () => {
        renderComponent();
        expect(screen.getByText(/message1/i)).toBeInTheDocument();
        expect(screen.getByText(/message2/i)).toBeInTheDocument();
        expect(screen.getByText(/value1/i)).toBeInTheDocument();
        expect(screen.getByText(/value2/i)).toBeInTheDocument();
    });

    it('handles pagination correctly', () => {
        renderComponent();
        expect(screen.getByText(/Messages Page 1 of 1/i)).toBeInTheDocument();
        const nextButton = screen.getByRole('paging-right');
        fireEvent.click(nextButton);
        expect(screen.getByText(/Messages Page 1 of 1/i)).toBeInTheDocument(); // No change as there is only one page
    });
});