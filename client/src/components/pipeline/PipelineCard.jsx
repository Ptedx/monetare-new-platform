import { Draggable } from "@hello-pangea/dnd";
import { Flag, Clock, Building, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function PipelineCard({ card, index, onClick }) {
    const getRatingColor = (rating) => {
        switch (rating) {
            case 'AA': return 'bg-green-500 text-white';
            case 'A': return 'bg-green-400 text-white';
            case 'B': return 'bg-yellow-400 text-white';
            case 'C': return 'bg-orange-400 text-white';
            case 'D': return 'bg-red-500 text-white';
            default: return 'bg-gray-200 text-gray-700';
        }
    };

    return (
        <Draggable draggableId={card.id} index={index}>
            {(provided, snapshot) => (
                <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    onClick={() => onClick(card)}
                    className={`bg-white rounded-xl p-4 shadow-sm border border-gray-100 group hover:shadow-md transition-all cursor-pointer ${snapshot.isDragging ? "shadow-lg rotate-2" : ""
                        }`}
                >
                    {/* Header: Name and Flag */}
                    <div className="flex items-start justify-between mb-3">
                        <h4 className="font-semibold text-gray-800 text-sm leading-tight max-w-[85%]">
                            {card.name}
                        </h4>
                        {card.hasFlag && <Flag className="w-4 h-4 text-orange-400 flex-shrink-0" />}
                    </div>

                    {/* Value and Rating */}
                    <div className="flex items-center gap-2 mb-4">
                        <span className="text-base font-bold text-gray-900">{card.value}</span>
                        <span
                            className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${getRatingColor(card.rating)}`}
                        >
                            {card.rating}
                        </span>
                    </div>

                    {/* Metadata Tags */}
                    <div className="flex flex-wrap gap-2 mb-3">
                        <Badge variant="secondary" className="bg-gray-100 text-gray-600 font-normal hover:bg-gray-200 gap-1 px-2 py-0.5 h-6">
                            <Building className="w-3 h-3" />
                            {card.analyst}
                        </Badge>
                        <Badge variant="secondary" className={`bg-green-50 text-green-700 font-normal hover:bg-green-100 gap-1 px-2 py-0.5 h-6 ${card.days > 10 ? 'bg-orange-50 text-orange-700' : ''}`}>
                            <Clock className="w-3 h-3" />
                            {card.days} dias
                        </Badge>
                    </div>

                    {/* Footer: Type and Pendency */}
                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-50">
                        <Badge variant="outline" className="border-gray-200 text-gray-500 font-normal text-xs px-2 py-0.5 h-6 rounded-md">
                            {card.type}
                        </Badge>
                        {card.hasPendency && (
                            <div className="flex items-center gap-1 text-xs text-red-500 bg-red-50 px-2 py-1 rounded-md font-medium">
                                <Flag className="w-3 h-3 fill-red-500" />
                                <span>2 pendências</span>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </Draggable>
    );
}
