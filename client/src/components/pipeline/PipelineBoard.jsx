import { useState, useEffect } from "react";
import { DragDropContext } from "@hello-pangea/dnd";
import { PipelineColumn } from "./PipelineColumn";

// Mock data initialization
const initialColumns = {
    "col-1": {
        id: "col-1",
        name: "1. GEPEC",
        totalValue: "R$ 585.000.000",
        count: 3,
        cards: [
            { id: "c1", name: "Faz. Soledade", value: "R$ 550.000.000", rawValue: 550000000, rating: "AA", analyst: "Ag. Brasília", days: 5, type: "Rural" },
            { id: "c2", name: "Faz. Casa Branca", value: "R$ 30.000.000", rawValue: 30000000, rating: "C", analyst: "Ag. Brasília", days: 8, type: "Rural" },
            { id: "c3", name: "Faz. Águas Claras", value: "R$ 5.000.000", rawValue: 5000000, rating: "D", analyst: "Ag. Brasília", days: 18, type: "Rural", hasPendency: true },
        ]
    },
    "col-2": {
        id: "col-2",
        name: "2. GECRE",
        totalValue: "R$ 350.000.000",
        count: 2,
        cards: [
            { id: "c4", name: "Faz. Aurora", value: "R$ 250.000.000", rawValue: 250000000, rating: "A", analyst: "Ag. Brasília", days: 8, type: "Rural", hasPendency: true, hasFlag: true },
            { id: "c5", name: "Faz. Girassol", value: "R$ 100.000.000", rawValue: 100000000, rating: "B", analyst: "Ag. Brasília", days: 5, type: "Rural" },
        ]
    },
    "col-3": {
        id: "col-3",
        name: "3. GEOPE",
        totalValue: "R$ 270.000.000",
        count: 1,
        cards: [
            { id: "c6", name: "Fernando Fagundes", value: "R$ 50.000.000", rawValue: 50000000, rating: "A", analyst: "Ag. Brasília", days: 16, type: "Rural", hasPendency: true, hasFlag: true },
        ]
    },
    "col-4": {
        id: "col-4",
        name: "4. GERPF/PJ/MIP/RED",
        totalValue: "R$ 180.000.000",
        count: 2,
        cards: [
            { id: "c7", name: "Vale do Cedro", value: "R$ 70.000.000", rawValue: 70000000, rating: "C", analyst: "Ag. Brasília", days: 5, type: "Corporate" },
            { id: "c8", name: "Faz. Barra Funda", value: "R$ 110.000.000", rawValue: 110000000, rating: "B", analyst: "Ag. Brasília", days: 2, type: "Corporate" },
        ]
    },
    "col-5": {
        id: "col-5",
        name: "5. GERIS",
        totalValue: "R$ 780.000.000",
        count: 3,
        cards: [] // Empty for now as per design
    },
    "col-6": {
        id: "col-6",
        name: "6. CCONS",
        totalValue: "R$ 0",
        count: 0,
        cards: []
    }
};

const columnOrder = ["col-1", "col-2", "col-3", "col-4", "col-5", "col-6"];

export function PipelineBoard({ sortBy, onCardClick }) {
    const [columns, setColumns] = useState(initialColumns);

    // Effect to sort columns when sortBy changes
    useEffect(() => {
        if (!sortBy) return;

        const newColumns = { ...columns };

        Object.keys(newColumns).forEach(colId => {
            const col = newColumns[colId];
            if (col.cards.length > 0) {
                let sortedCards = [...col.cards];
                if (sortBy === 'value') {
                    sortedCards.sort((a, b) => b.rawValue - a.rawValue);
                } else if (sortBy === 'date') {
                    sortedCards.sort((a, b) => a.days - b.days);
                } else if (sortBy === 'priority') {
                    // Mock priority: AA > A > B > C > D
                    const ratingWeight = { 'AA': 5, 'A': 4, 'B': 3, 'C': 2, 'D': 1 };
                    sortedCards.sort((a, b) => ratingWeight[b.rating] - ratingWeight[a.rating]);
                }
                col.cards = sortedCards;
            }
        });

        setColumns(newColumns);
    }, [sortBy]);

    // Special modification to PipelineColumn to pass onClick
    const ModifiedPipelineColumn = ({ column }) => {
        // We need to clone the PipelineColumn or pass the onClick prop down deeply.
        // For simplicity, let's just inline the logic or assume PipelineColumn accepts it.
        // But PipelineColumn imports PipelineCard directly. 
        // We will need to update PipelineColumn to pass the props.
        // Let's assume we updated PipelineColumn to accept onCardClick?
        // Actually, let's just rewrite PipelineColumn here quickly or import it?
        // Wait, I already updated PipelineColumn in the previous step but I didn't add onCardClick there.
        // I should update PipelineColumn to pass ...props to PipelineCard or specifically onCardClick.
        // Let's do a quick inline re-implementation or helper since we can't easily modify the import's behavior without editing that file too.
        // Better: Update PipelineColumn.jsx as well.
        // For now, I will assume I'll update PipelineColumn next.
        return <PipelineColumn column={column} onCardClick={onCardClick} />;
    }

    // Re-importing inside the file won't work. I need to make sure PipelineColumn accepts `onCardClick`.

    const onDragEnd = (result) => {
        const { destination, source, draggableId } = result;

        if (!destination) return;

        if (
            destination.droppableId === source.droppableId &&
            destination.index === source.index
        ) {
            return;
        }

        const startColumn = columns[source.droppableId];
        const finishColumn = columns[destination.droppableId];

        if (startColumn === finishColumn) {
            const newCardIds = Array.from(startColumn.cards);
            const [movedCard] = newCardIds.splice(source.index, 1);
            newCardIds.splice(destination.index, 0, movedCard);

            const newColumn = {
                ...startColumn,
                cards: newCardIds,
            };

            setColumns({
                ...columns,
                [newColumn.id]: newColumn,
            });
            return;
        }

        const startCardIds = Array.from(startColumn.cards);
        const [movedCard] = startCardIds.splice(source.index, 1);

        const finishCardIds = Array.from(finishColumn.cards);
        finishCardIds.splice(destination.index, 0, movedCard);

        const newStartColumn = {
            ...startColumn,
            cards: startCardIds,
            count: startColumn.count - 1
        };

        const newFinishColumn = {
            ...finishColumn,
            cards: finishCardIds,
            count: finishColumn.count + 1
        };

        setColumns({
            ...columns,
            [newStartColumn.id]: newStartColumn,
            [newFinishColumn.id]: newFinishColumn,
        });
    };

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <div className="flex h-full gap-6 overflow-x-auto pb-4">
                {columnOrder.map((columnId) => {
                    const column = columns[columnId];
                    // We need custom PipelineColumn that passes onCardClick
                    return (
                        <PipelineColumnKeyed
                            key={column.id}
                            column={column}
                            onCardClick={onCardClick}
                        />
                    );
                })}
            </div>
        </DragDropContext>
    );
}

// Helper to avoid circular dependency issues if I was editing multiple files in one go
// But I can just edit PipelineColumn.jsx separately.
import { PipelineColumn as OriginalPipelineColumn } from "./PipelineColumn";
function PipelineColumnKeyed({ column, onCardClick }) {
    return <OriginalPipelineColumn column={column} onCardClick={onCardClick} />;
}
