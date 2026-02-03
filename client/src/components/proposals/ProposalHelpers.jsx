import { Card } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";

export function RatingCard({ title, value, color }) {
    let bgClass = "bg-[#8bd642]";
    if (color === 'green') bgClass = "bg-[#8bd642]";
    if (color === 'orange') bgClass = "bg-[#e88d46]";
    if (color === 'yellow') bgClass = "bg-[#dcd843]";

    return (
        <Card className="p-4 flex flex-col justify-between h-32 relative overflow-hidden">
            <p className="text-gray-500 text-sm font-medium z-10">{title}</p>
            <div className={`mt-auto rounded-lg ${bgClass} text-white flex items-center justify-center py-2 text-3xl font-bold shadow-sm z-10`}>
                {value}
                {title === "Rating de Garantia" && <AlertTriangle className="absolute top-2 right-2 w-5 h-5 text-white opacity-80" />}
            </div>
        </Card>
    );
}

export function DetailItem({ icon: Icon, label, value }) {
    return (
        <div className="flex items-start gap-4 mb-4">
            <div className="w-5 h-5 mt-0.5 flex-shrink-0 text-gray-300">
                <Icon className="w-full h-full" />
            </div>
            <div className="flex-1">
                <p className="text-xs text-gray-400 font-medium">{label}</p>
                <p className="text-sm font-medium text-gray-800 break-words">{value}</p>
            </div>
        </div>
    );
}

export function StatCard({ label, value, sub }) {
    return (
        <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-100">
            <p className="text-xs text-gray-400 mb-1">{label}</p>
            <p className="text-base font-bold text-gray-900">{value}</p>
            {sub && <div className="mt-1">{sub}</div>}
        </div>
    );
}

export function StatusBadge({ status }) {
    let classes = "bg-gray-100 text-gray-700";
    if (status === 'OK' || status === 'CK') classes = "bg-green-500 text-white";
    if (status === 'PENDENTE' || status === 'A VENCER' || status === 'ATENÇÃO') classes = "bg-yellow-400 text-white";
    if (status === 'VENCIDO') classes = "bg-red-500 text-white";

    return <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${classes}`}>{status}</span>;
}

export function ScoreCircle({ value, max, label, color }) {
    const size = 60;
    const strokeWidth = 5;
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const percent = (value / max);
    const offset = circumference - percent * circumference;

    let strokeColor = "#8bd642"; // green
    if (value < max * 0.4) strokeColor = "#e88d46"; // orange

    return (
        <Card className="p-4 flex flex-col items-start justify-between relative overflow-visible">
            <p className="text-xs text-gray-500 mb-2">{label}</p>
            <div className="flex items-center gap-4 w-full">
                <div className="text-2xl font-bold">
                    {value}<span className="text-xs text-gray-400 font-normal">/{max}</span>
                </div>
                <div className="ml-auto relative" style={{ width: size, height: size }}>
                    <svg className="w-full h-full transform -rotate-90">
                        <circle cx={size / 2} cy={size / 2} r={radius} stroke="#e5e7eb" strokeWidth={strokeWidth} fill="none" />
                        <circle cx={size / 2} cy={size / 2} r={radius} stroke={strokeColor} strokeWidth={strokeWidth} fill="none" strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round" />
                    </svg>
                </div>
            </div>
        </Card>
    )
}

export function TimelineStep({ label, date, status, isLast }) {
    let dotClass = "bg-gray-300";
    if (status === 'completed') dotClass = "bg-green-500";
    if (status === 'current') dotClass = "bg-[#92dc49] ring-4 ring-[#92dc49]/30";

    return (
        <div className="flex gap-4 relative">
            {!isLast && <div className="absolute left-[5px] top-3 bottom-[-20px] w-0.5 bg-gray-200"></div>}
            <div className={`w-3 h-3 rounded-full flex-shrink-0 mt-1.5 z-10 ${dotClass}`}></div>
            <div className="pb-8">
                <p className={`font-medium ${status === 'future' ? 'text-gray-400' : 'text-gray-900'}`}>{label}</p>
                {date && <p className="text-xs text-gray-400 mt-1">{date}</p>}
            </div>
        </div>
    );
}
