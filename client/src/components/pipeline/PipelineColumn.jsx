import { Droppable } from "@hello-pangea/dnd";
import { PipelineCard } from "./PipelineCard";
import { MoreHorizontal } from "lucide-react";

export function PipelineColumn({ column, onCardClick }) {
    return (
        <div className="flex flex-col h-full w-[280px] flex-shrink-0">
            {/* Column Header */}
            <div className="mb-4">
                <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-medium text-gray-500">{column.name}</p>
                    <button className="text-gray-400 hover:text-gray-600">
                        <MoreHorizontal className="w-4 h-4" />
                    </button>
                </div>
                <h3 className="text-2xl font-bold text-gray-800">{column.totalValue}</h3>
                <p className="text-xs text-gray-500 mt-1">{column.count} propostas</p>
            </div>

            {/* Cards Area */}
            <div className="bg-gray-50/50 rounded-xl p-2 flex-1 border border-transparent hover:border-gray-200 transition-colors">
                <Droppable droppableId={column.id}>
                    {(provided, snapshot) => (
                        <div
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                            className={`flex flex-col gap-3 h-full min-h-[150px] transition-colors ${snapshot.isDraggingOver ? "bg-green-50/50 rounded-xl border-dashed border-2 border-green-200" : ""
                                }`}
                        >
                            {column.cards.map((card, index) => (
                                <PipelineCard
                                    key={card.id}
                                    card={card}
                                    index={index}
                                    onClick={onCardClick}
                                />
                            ))}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </div>
        </div>
    );
}
