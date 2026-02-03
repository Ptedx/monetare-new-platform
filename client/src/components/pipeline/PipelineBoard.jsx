import { useState, useEffect } from "react";
import { DragDropContext } from "@hello-pangea/dnd";
import { PipelineColumn } from "./PipelineColumn";

// Mock data initialization
const initialColumns = {
    "col-1": {
        id: "col-1",
        name: "1. CECAD",
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

export function PipelineBoard({ sortConfig, onCardClick }) {
    const [columns, setColumns] = useState(initialColumns);

    // Load proposals from localStorage and merge
    useEffect(() => {
        const storedProposals = JSON.parse(localStorage.getItem("proposals") || "[]");

        setColumns(prevColumns => {
            const workingColumns = JSON.parse(JSON.stringify(initialColumns)); // Start fresh from initial + localStorage to avoid duplicates issue
            // Actually, we should probably respect current state if we want drag to persist?
            // But we already established that re-sorting resets order.
            // Using initialColumns + storedProposals ensures clean state every time sort changes or proposals load

            // Let's stick to safe merge into a copy of prevColumns to avoid resetting if user drifted,
            // BUT we must dedupe carefully.
            // Re-creating from initialColumns is safer for "Sort".
            // Let's go with: workingColumns = { ...prevColumns } but we must not add duplicates.
            // And we must RE-SORT everything.

            // Wait, if we use { ...prevColumns }, we are operating on the ALREADY existing cards.
            // If we re-sort, we just re-order them. 
            // We only need to ADD storedProposals if they are missing.

            // BUT if we want to ensure "Default Sort" works on page load, we must run this.

            const currentColumns = { ...prevColumns };

            storedProposals.forEach(p => {
                let targetColId = "col-1";
                if (p.stage.includes("2.")) targetColId = "col-2";
                else if (p.stage.includes("3.")) targetColId = "col-3";
                else if (p.stage.includes("4.")) targetColId = "col-4";

                if (currentColumns[targetColId].cards.some(c => c.id === String(p.id))) {
                    return;
                }

                const rawValue = p.value ? parseFloat(p.value.replace(/[^0-9,]/g, '').replace(',', '.')) : 0;

                const dateParts = p.date.split('/');
                const createdDate = new Date(dateParts[2], dateParts[1] - 1, dateParts[0]);
                const daysDiff = Math.floor((new Date() - createdDate) / (1000 * 60 * 60 * 24));

                const newCard = {
                    id: String(p.id),
                    name: p.name,
                    value: p.value,
                    rawValue: rawValue,
                    rating: p.score || "B",
                    analyst: "Ag. Brasília",
                    days: daysDiff >= 0 ? daysDiff : 0,
                    type: p.segment
                };

                currentColumns[targetColId].cards.push(newCard);
                currentColumns[targetColId].count = currentColumns[targetColId].cards.length;
            });

            // Re-calculate totals
            Object.keys(currentColumns).forEach(colId => {
                const col = currentColumns[colId];
                const total = col.cards.reduce((sum, card) => sum + card.rawValue, 0);
                col.totalValue = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(total);
            });

            // Apply Sort
            if (sortConfig && sortConfig.key) {
                const { key, direction } = sortConfig;
                const multiplier = direction === 'asc' ? 1 : -1;

                Object.keys(currentColumns).forEach(colId => {
                    const col = currentColumns[colId];
                    if (col.cards.length > 0) {
                        let sortedCards = [...col.cards];

                        if (key === 'value') {
                            sortedCards.sort((a, b) => (a.rawValue - b.rawValue) * multiplier);
                        } else if (key === 'date') {
                            // Date logic: 'desc' = Newest (Smallest days). 'asc' = Oldest (Largest days).
                            if (direction === 'desc') {
                                sortedCards.sort((a, b) => a.days - b.days);
                            } else {
                                sortedCards.sort((a, b) => b.days - a.days);
                            }
                        } else if (key === 'priority') {
                            const ratingWeight = { 'AA': 5, 'A': 4, 'B': 3, 'C': 2, 'D': 1 };
                            sortedCards.sort((a, b) => {
                                const weightA = ratingWeight[a.rating] || 0;
                                const weightB = ratingWeight[b.rating] || 0;
                                return (weightA - weightB) * multiplier;
                            });
                        }
                        col.cards = sortedCards;
                    }
                });
            }

            return currentColumns;
        });

    }, [sortConfig]);

    // Special modification to PipelineColumn to pass onClick
    const ModifiedPipelineColumn = ({ column }) => {
        return <PipelineColumn column={column} onCardClick={onCardClick} />;
    }

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

// Helper to avoid circular dependency issues
import { PipelineColumn as OriginalPipelineColumn } from "./PipelineColumn";
function PipelineColumnKeyed({ column, onCardClick }) {
    return <OriginalPipelineColumn column={column} onCardClick={onCardClick} />;
}
