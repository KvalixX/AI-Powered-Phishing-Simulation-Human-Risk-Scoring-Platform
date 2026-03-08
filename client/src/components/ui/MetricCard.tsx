import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LucideIcon, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

interface MetricCardProps {
    title: string;
    value: string | number;
    description?: string;
    icon: LucideIcon;
    iconColor?: string;
    iconBg?: string;
    change?: number;
    changeSuffix?: string;
    changeLabel?: string;
    badge?: string;
    badgeVariant?: "default" | "success" | "warning" | "danger";
    progress?: number;
    className?: string;
}

const badgeStyles = {
    default: "text-stone-600 border-stone-200 bg-stone-50",
    success: "text-green-600 border-green-200 bg-green-50",
    warning: "text-amber-600 border-amber-200 bg-amber-50",
    danger: "text-red-600 border-red-200 bg-red-50",
};

export function MetricCard({
    title,
    value,
    description,
    icon: Icon,
    iconColor = "text-blue-600",
    iconBg = "bg-blue-100",
    change,
    changeSuffix = "%",
    badge,
    badgeVariant = "default",
    progress,
    className,
}: MetricCardProps) {
    const isPositiveChange = change !== undefined && change > 0;
    const isNegativeChange = change !== undefined && change < 0;

    return (
        <Card className={cn("border-stone-200", className)}>
            <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                    <div className={cn("p-1.5 rounded-md", iconBg)}>
                        <Icon className={cn("w-3.5 h-3.5", iconColor)} />
                    </div>
                    {badge && (
                        <Badge variant="outline" className={cn("text-[10px] px-1.5 py-0", badgeStyles[badgeVariant])}>
                            {badge}
                        </Badge>
                    )}
                    {change !== undefined && !badge && (
                        <div
                            className={cn(
                                "flex items-center gap-1 text-[10px] font-medium",
                                isPositiveChange ? "text-green-600" : isNegativeChange ? "text-red-600" : "text-stone-500"
                            )}
                        >
                            {isPositiveChange ? <TrendingUp className="w-3 h-3" /> : isNegativeChange ? <TrendingDown className="w-3 h-3" /> : <Minus className="w-3 h-3" />}
                            <span>{change > 0 ? "+" : ""}{change}{changeSuffix}</span>
                        </div>
                    )}
                </div>
                <div className="text-xl font-bold text-stone-900">{value}</div>
                <p className="text-[11px] text-stone-500 mt-0.5">{title}</p>
                {description && <p className="text-[10px] text-stone-400 mt-0.5">{description}</p>}
                {progress !== undefined && (
                    <div className="mt-2">
                        <div className="w-full bg-stone-100 rounded-full h-1">
                            <div className="bg-blue-500 h-1 rounded-full" style={{ width: `${Math.min(100, progress)}%` }} />
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
