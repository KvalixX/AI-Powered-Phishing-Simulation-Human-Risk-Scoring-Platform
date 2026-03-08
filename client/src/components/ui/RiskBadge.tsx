import { Badge } from "@/components/ui/badge";
import { ShieldCheck, ShieldAlert, ShieldOff, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

interface RiskBadgeProps {
    score: number;
    showScore?: boolean;
    size?: "sm" | "md" | "lg";
    className?: string;
}

export type RiskLevel = "Low" | "Medium" | "High" | "Critical";

export function getRiskLevel(score: number): RiskLevel {
    if (score >= 75) return "Critical";
    if (score >= 50) return "High";
    if (score >= 25) return "Medium";
    return "Low";
}

export function getRiskConfig(level: RiskLevel) {
    switch (level) {
        case "Critical":
            return { label: "Critical", labelFr: "Critique", icon: ShieldOff, className: "bg-red-100 text-red-700 border-red-200", dotColor: "bg-red-500" };
        case "High":
            return { label: "High", labelFr: "Élevé", icon: ShieldAlert, className: "bg-orange-100 text-orange-700 border-orange-200", dotColor: "bg-orange-500" };
        case "Medium":
            return { label: "Medium", labelFr: "Moyen", icon: Zap, className: "bg-yellow-100 text-yellow-700 border-yellow-200", dotColor: "bg-yellow-500" };
        case "Low":
        default:
            return { label: "Low", labelFr: "Faible", icon: ShieldCheck, className: "bg-green-100 text-green-700 border-green-200", dotColor: "bg-green-500" };
    }
}

export function RiskBadge({ score, showScore = true, size = "md", className }: RiskBadgeProps) {
    const level = getRiskLevel(score);
    const config = getRiskConfig(level);
    const Icon = config.icon;

    const sizeClasses = {
        sm: "text-[9px] px-1.5 py-0",
        md: "text-[10px] px-2 py-0.5",
        lg: "text-xs px-2.5 py-1",
    };

    return (
        <Badge className={cn("flex items-center gap-1 font-medium border", config.className, sizeClasses[size], className)}>
            <Icon className="w-2.5 h-2.5" />
            {config.labelFr}
            {showScore && <span className="ml-0.5 opacity-70">({score})</span>}
        </Badge>
    );
}
