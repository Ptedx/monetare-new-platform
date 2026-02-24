import { useState, useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { DragDropContext } from "@hello-pangea/dnd";
import { PipelineColumn } from "./PipelineColumn";
import { Loader2 } from "lucide-react";

const stageMapping = {
    "1. Cadastro": "1. CECAD",
    "2. Analise Tecnica": "2. GECRE",
    "2. Análise Técnica": "2. GECRE",
    "3. Analise de Credito": "3. GEOPE",
    "3. Análise de Crédito": "3. GEOPE",
    "4. Analise de Garantias": "4. GERPF/PJ/MIP/RED",
    "4. Análise de Garantias": "4. GERPF/PJ/MIP/RED",
    "5. Formalizacao": "5. GERIS",
    "5. Formalização": "5. GERIS",
    "6. Contratado": "6. CCONS",
};

const defaultColumns = [
    { id: "col-1", name: "1. CECAD", stageKey: "1. CECAD" },
    { id: "col-2", name: "2. GECRE", stageKey: "2. GECRE" },
    { id: "col-3", name: "3. GEOPE", stageKey: "3. GEOPE" },
    { id: "col-5", name: "5. GERIS", stageKey: "5. GERIS" },
    { id: "col-6", name: "6. CCONS", stageKey: "6. CCONS" },
];

const optionalColumn = { id: "col-4", name: "4. GERPF/PJ/MIP/RED", stageKey: "4. GERPF/PJ/MIP/RED" };

const formatCurrency = (value) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

function getDisplayStage(stage) {
    return stageMapping[stage] || stage;
}

function proposalToCard(proposal) {
    const rawValue = proposal.projectValue ? parseFloat(proposal.projectValue) || 0 : 0;
    const createdDate = proposal.createdAt ? new Date(proposal.createdAt) : new Date();
    const daysDiff = Math.max(0, Math.floor((new Date() - createdDate) / (1000 * 60 * 60 * 24)));

    return {
        id: String(proposal.id),
        name: proposal.name,
        value: formatCurrency(rawValue),
        rawValue,
        rating: proposal.score || "-",
        analyst: proposal.creditLine || "-",
        days: daysDiff,
        type: proposal.segment || "-",
    };
}

export function PipelineBoard({ sortConfig, onCardClick }) {
    const { data: proposals, isLoading } = useQuery({ queryKey: ["/api/proposals"] });

    const builtColumns = useMemo(() => {
        const proposalsList = proposals || [];
        const grouped = {};

        proposalsList.forEach(p => {
            const displayStage = getDisplayStage(p.stage);
            if (!grouped[displayStage]) grouped[displayStage] = [];
            grouped[displayStage].push(proposalToCard(p));
        });

        const hasOptional = grouped[optionalColumn.stageKey] && grouped[optionalColumn.stageKey].length > 0;
        const allColDefs = [...defaultColumns];
        if (hasOptional) {
            allColDefs.splice(3, 0, optionalColumn);
        }

        const result = {};
        allColDefs.forEach(colDef => {
            const cards = grouped[colDef.stageKey] || [];
            const totalValue = cards.reduce((sum, c) => sum + c.rawValue, 0);
            result[colDef.id] = {
                id: colDef.id,
                name: colDef.name,
                totalValue: formatCurrency(totalValue),
                count: cards.length,
                cards,
            };
        });

        return { columns: result, order: allColDefs.map(c => c.id) };
    }, [proposals]);

    const [columns, setColumns] = useState({});
    const [columnOrder, setColumnOrder] = useState([]);

    useEffect(() => {
        if (builtColumns.columns && Object.keys(builtColumns.columns).length > 0) {
            const sorted = JSON.parse(JSON.stringify(builtColumns.columns));

            if (sortConfig && sortConfig.key) {
                const { key, direction } = sortConfig;
                const multiplier = direction === 'asc' ? 1 : -1;

                Object.keys(sorted).forEach(colId => {
                    const col = sorted[colId];
                    if (col.cards.length > 0) {
                        let sortedCards = [...col.cards];
                        if (key === 'value') {
                            sortedCards.sort((a, b) => (a.rawValue - b.rawValue) * multiplier);
                        } else if (key === 'date') {
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

            setColumns(sorted);
            setColumnOrder(builtColumns.order);
        }
    }, [builtColumns, sortConfig]);

    const onDragEnd = (result) => {
        const { destination, source } = result;

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

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64" data-testid="pipeline-loading">
                <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
            </div>
        );
    }

    if (columnOrder.length === 0) {
        return (
            <div className="flex items-center justify-center h-64 text-gray-500" data-testid="pipeline-empty">
                Nenhuma proposta no pipeline.
            </div>
        );
    }

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <div className="flex h-full gap-6 overflow-x-auto pb-4" data-testid="pipeline-board">
                {columnOrder.map((columnId) => {
                    const column = columns[columnId];
                    if (!column) return null;
                    return (
                        <PipelineColumn
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
