import { cn } from "@/lib/utils";

const HOURS = Array.from({ length: 24 }, (_, i) => {
    if (i === 0) return "12am";
    if (i < 12) return `${i}am`;
    if (i === 12) return "12pm";
    return `${i - 12}pm`;
});

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const generateHeatmapData = () => {
    return DAYS.map((_, dayIdx) =>
        HOURS.map((_, hourIdx) => {
            const isWeekend = dayIdx >= 5;
            const isBusinessHour = hourIdx >= 9 && hourIdx <= 17;
            const isLunchHour = hourIdx >= 12 && hourIdx <= 13;
            const isEarlyMorning = hourIdx >= 7 && hourIdx <= 9;
            let base = isWeekend ? 5 : isBusinessHour ? 30 : isEarlyMorning ? 20 : 5;
            if (isLunchHour && !isWeekend) base += 15;
            if (dayIdx === 1) base += 10;
            if (dayIdx === 3) base += 8;
            const noise = Math.floor(Math.random() * 20) - 10;
            return Math.max(0, Math.min(100, base + noise));
        })
    );
};

const heatmapData = generateHeatmapData();

function getColor(value: number): string {
    if (value >= 70) return "bg-red-500";
    if (value >= 50) return "bg-orange-400";
    if (value >= 30) return "bg-yellow-400";
    if (value >= 15) return "bg-lime-400";
    return "bg-stone-100";
}

interface HeatmapChartProps {
    className?: string;
    showHours?: "all" | "business";
}

export function HeatmapChart({ className, showHours = "all" }: HeatmapChartProps) {
    const hourRange = showHours === "business"
        ? HOURS.slice(6, 20).map((h, i) => ({ label: h, idx: i + 6 }))
        : HOURS.map((h, i) => ({ label: h, idx: i }));

    return (
        <div className={cn("w-full overflow-x-auto", className)}>
            <div className="flex items-center gap-2 mb-3 justify-end">
                <span className="text-[10px] text-stone-400">Click Probability:</span>
                <div className="flex items-center gap-0.5">
                    {["bg-stone-100", "bg-lime-400", "bg-yellow-400", "bg-orange-400", "bg-red-500"].map((cls, i) => (
                        <div key={i} className={cn("w-3 h-2.5 rounded-sm", cls)} />
                    ))}
                </div>
                <span className="text-[10px] text-stone-400">Low → High</span>
            </div>

            <div className="min-w-[560px]">
                <div className="flex mb-1">
                    <div className="w-10 shrink-0" />
                    {hourRange.map(({ label, idx }) => (
                        <div key={idx} className="flex-1 text-center text-[8px] text-stone-400" style={{ minWidth: "22px" }}>
                            {idx % 4 === 0 ? label : ""}
                        </div>
                    ))}
                </div>

                {DAYS.map((day, dayIdx) => (
                    <div key={day} className="flex mb-0.5 items-center">
                        <div className="w-10 shrink-0 text-[10px] text-stone-500 pr-1 text-right">{day}</div>
                        {hourRange.map(({ idx: hourIdx }) => {
                            const value = heatmapData[dayIdx][hourIdx];
                            return (
                                <div key={hourIdx} className="flex-1 mx-px" style={{ minWidth: "22px" }}
                                    title={`${DAYS[dayIdx]} ${HOURS[hourIdx]}: ${value}%`}>
                                    <div
                                        className={cn("w-full h-4 rounded-sm hover:ring-1 hover:ring-stone-400 cursor-pointer", getColor(value))}
                                        style={{ opacity: Math.max(0.15, value / 100) }}
                                    />
                                </div>
                            );
                        })}
                    </div>
                ))}
            </div>

            <p className="text-[10px] text-stone-400 mt-2 text-center">Hover to see click probability by time</p>
        </div>
    );
}
