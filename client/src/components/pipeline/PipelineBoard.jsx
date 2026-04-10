import { useState, useEffect } from "react";
import { DragDropContext } from "@hello-pangea/dnd";
import { PipelineColumn } from "./PipelineColumn";

// Stage mapping: each column maps to a stage value stored in localStorage
const STAGES = {
    "col-1": "1. CECAD",
    "col-2": "2. GECRE",
    "col-3": "3. GEOPE",
    "col-4": "4. GERPF/PJ/MIP/RED",
    "col-5": "5. GERIS",
    "col-6": "6. CCONS",
};

const COLUMN_IDS = Object.keys(STAGES);
const PIPELINE_STAGE_VALUES = Object.values(STAGES);

const STAGE_NAMES = new Set(PIPELINE_STAGE_VALUES);

function buildColumnsFromStorage(sortConfig) {
    const storedProposals = JSON.parse(localStorage.getItem("proposals") || "[]");

    // Build column map
    const columns = {};
    COLUMN_IDS.forEach(colId => {
        columns[colId] = {
            id: colId,
            name: STAGES[colId],
            cards: [],
        };
    });

    const stageToCol = {};
    Object.entries(STAGES).forEach(([colId, stage]) => {
        stageToCol[stage] = colId;
    });

    storedProposals.forEach((p) => {
        let pStage = p.stage || "1. CECAD";
        // Backwards compat with old stage naming
        if (pStage === "1. Cadastro") pStage = "1. CECAD";

        // Skip proposals in compliance/legal or final stages (not in operational pipeline)
        const skipStages = new Set([
            "EM_ANALISE_JURIDICA", "EM_SEGURO", "SEGURO_COTADO",
            "FINALIZADA", "REPROVADA", "APROVADA"
        ]);
        if (skipStages.has(pStage)) return;

        let colId = stageToCol[pStage] || "col-1";

        const rawValue = p.rawValue || (p.value ? parseFloat(String(p.value).replace(/[^0-9.,]/g, '').replace(',', '.')) : 0);

        const dateParts = p.date ? p.date.split('/') : null;
        let daysDiff = 0;
        if (dateParts && dateParts.length === 3) {
            const createdDate = new Date(dateParts[2], dateParts[1] - 1, dateParts[0]);
            daysDiff = Math.floor((new Date() - createdDate) / (1000 * 60 * 60 * 24));
        } else if (p.createdAt) {
            daysDiff = Math.floor((new Date() - new Date(p.createdAt)) / (1000 * 60 * 60 * 24));
        }

        columns[colId].cards.push({
            id: String(p.id),
            name: p.name,
            value: p.value || "R$ 0",
            rawValue: rawValue,
            rating: p.score || "B",
            analyst: "Ag. Brasília",
            days: Math.max(daysDiff, 0),
            type: p.segment || "Rural",
            hasPendency: p.hasPendency || false,
            hasFlag: p.hasFlag || false,
            title: p.title,
            companyName: p.companyName,
            status: p.status,
            line: p.line,
            _raw: p,
        });
    });

    // Re-calculate totals & counts
    COLUMN_IDS.forEach(colId => {
        const col = columns[colId];
        const total = col.cards.reduce((sum, card) => sum + (card.rawValue || 0), 0);
        col.totalValue = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(total);
        col.count = col.cards.length;
    });

    // Apply sort
    if (sortConfig && sortConfig.key) {
        const { key, direction } = sortConfig;
        const multiplier = direction === 'asc' ? 1 : -1;

        COLUMN_IDS.forEach(colId => {
            const col = columns[colId];
            if (col.cards.length > 0) {
                let sorted = [...col.cards];
                if (key === 'value') {
                    sorted.sort((a, b) => ((a.rawValue || 0) - (b.rawValue || 0)) * multiplier);
                } else if (key === 'date') {
                    if (direction === 'desc') {
                        sorted.sort((a, b) => (a.days || 0) - (b.days || 0));
                    } else {
                        sorted.sort((a, b) => (b.days || 0) - (a.days || 0));
                    }
                } else if (key === 'priority') {
                    const ratingWeight = { 'AA': 5, 'A': 4, 'B': 3, 'C': 2, 'D': 1 };
                    sorted.sort((a, b) => ((ratingWeight[a.rating] || 0) - (ratingWeight[b.rating] || 0)) * multiplier);
                }
                col.cards = sorted;
            }
        });
    }

    return columns;
}

export function PipelineBoard({ sortConfig, onCardClick }) {
    const [columns, setColumns] = useState(() => buildColumnsFromStorage(sortConfig));

    // Re-read from localStorage when sort changes
    useEffect(() => {
        setColumns(buildColumnsFromStorage(sortConfig));
    }, [sortConfig]);

    const updateCardStageInStorage = (cardId, newStage) => {
        const stored = JSON.parse(localStorage.getItem("proposals") || "[]");
        const idx = stored.findIndex((p) => String(p.id) === String(cardId));
        if (idx !== -1) {
            stored[idx].stage = newStage;
            localStorage.setItem("proposals", JSON.stringify(stored));
        }
    };

    const onDragEnd = (result) => {
        const { destination, source, draggableId } = result;
        if (!destination) return;
        if (destination.droppableId === source.droppableId && destination.index === source.index) return;

        setColumns(prev => {
            const startCol = prev[source.droppableId];
            const finishCol = prev[destination.droppableId];

            if (startCol === finishCol) {
                const newCards = [...startCol.cards];
                const [movedCard] = newCards.splice(source.index, 1);
                newCards.splice(destination.index, 0, movedCard);
                return {
                    ...prev,
                    [startCol.id]: { ...startCol, cards: newCards },
                };
            }

            const startCards = [...startCol.cards];
            const [movedCard] = startCards.splice(source.index, 1);
            const finishCards = [...finishCol.cards];
            finishCards.splice(destination.index, 0, { ...movedCard });

            const newStage = STAGES[destination.droppableId];

            // Persist to localStorage
            updateCardStageInStorage(parseInt(draggableId, 10) || draggableId, newStage);

            const newStart = { ...startCol, cards: startCards, count: startCards.length };
            const newFinish = { ...finishCol, cards: finishCards, count: finishCards.length };

            // Recalculate totals
            newStart.totalValue = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(
                startCards.reduce((s, c) => s + (c.rawValue || 0), 0)
            );
            newFinish.totalValue = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(
                finishCards.reduce((s, c) => s + (c.rawValue || 0), 0)
            );

            return {
                ...prev,
                [newStart.id]: newStart,
                [newFinish.id]: newFinish,
            };
        });
    };

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <div className="flex h-full gap-6 overflow-x-auto pb-4">
                {COLUMN_IDS.map((columnId) => {
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

function PipelineColumnKeyed({ column, onCardClick }) {
    return <PipelineColumn column={column} onCardClick={onCardClick} />;
}
