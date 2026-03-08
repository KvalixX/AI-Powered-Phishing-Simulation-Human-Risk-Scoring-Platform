import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    BarChart3,
    TrendingUp,
    PieChart as PieChartIcon,
    Activity,
    GraduationCap,
    Building,
    Download,
    Filter,
    Calendar,
    MousePointer,
    Shield,
} from "lucide-react";
import {
    LineChart,
    Line,
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";
import { HeatmapChart } from "@/components/charts/HeatmapChart";

// ─── Data ────────────────────────────────────────────────────────────────────

const clickRateOverTime = [
    { campaign: "Q4 CEO Fraud", rate: 28.5, reported: 12 },
    { campaign: "Invoice Scam", rate: 22.1, reported: 18 },
    { campaign: "MS Login", rate: 30.0, reported: 8 },
    { campaign: "Zoom Update", rate: 14.1, reported: 37.5 },
    { campaign: "IT Alert", rate: 19.3, reported: 22 },
    { campaign: "Q2 CEO Email", rate: 27.3, reported: 9.4 },
];

const riskDistribution = [
    { name: "Faible", value: 45, color: "#10b981" },
    { name: "Moyen", value: 28, color: "#eab308" },
    { name: "Élevé", value: 17, color: "#f97316" },
    { name: "Critique", value: 10, color: "#ef4444" },
];

const campaignPerformance = [
    { name: "CEO Fraud Q2", sent: 245, clicks: 67, reports: 23 },
    { name: "MS Login", sent: 150, clicks: 45, reports: 89 },
    { name: "Zoom Update", sent: 320, clicks: 45, reports: 120 },
    { name: "IT Alert", sent: 180, clicks: 35, reports: 55 },
    { name: "Invoice Scam", sent: 200, clicks: 44, reports: 36 },
];

const trainingEffectiveness = [
    { group: "Finance", before: 70, after: 42 },
    { group: "Sales", before: 78, after: 52 },
    { group: "HR", before: 62, after: 38 },
    { group: "Marketing", before: 65, after: 44 },
    { group: "IT", before: 30, after: 18 },
    { group: "Support", before: 55, after: 35 },
];

const departmentRisk = [
    { dept: "Ventes", risk: 62, users: 52, color: "#ef4444" },
    { dept: "Finance", risk: 55, users: 28, color: "#f97316" },
    { dept: "Marketing", risk: 48, users: 38, color: "#eab308" },
    { dept: "Support", risk: 44, users: 22, color: "#84cc16" },
    { dept: "RH", risk: 42, users: 32, color: "#22c55e" },
    { dept: "IT", risk: 25, users: 45, color: "#10b981" },
];

const CHART_TOOLTIP_STYLE = {
    backgroundColor: "var(--card)",
    border: "1px solid var(--border)",
    borderRadius: "8px",
    fontSize: "12px",
};

// ─── Custom Tooltip ───────────────────────────────────────────────────────────

const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null;
    return (
        <div className="bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg p-3 shadow-lg text-xs">
            <p className="font-semibold text-stone-800 dark:text-white mb-2">{label}</p>
            {payload.map((entry: any, i: number) => (
                <div key={i} className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.color }} />
                    <span className="text-stone-600 dark:text-stone-300">{entry.name}: <strong>{entry.value}{typeof entry.value === 'number' && entry.name?.includes('rate') ? '%' : ''}</strong></span>
                </div>
            ))}
        </div>
    );
};

// ─── Component ───────────────────────────────────────────────────────────────

export default function Analytics() {
    return (
        <div className="h-full overflow-y-auto p-6 custom-scrollbar">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-stone-900 dark:text-white">
                        Analytics & Statistics
                    </h1>
                    <p className="text-stone-500 dark:text-stone-400 mt-1">
                        In-depth behavioral analytics and campaign insights
                    </p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" size="sm">
                        <Calendar className="w-4 h-4 mr-2" />
                        Last 6 Months
                    </Button>
                    <Button variant="outline" size="sm">
                        <Filter className="w-4 h-4 mr-2" />
                        Filter
                    </Button>
                    <Button variant="outline" size="sm">
                        <Download className="w-4 h-4 mr-2" />
                        Export
                    </Button>
                </div>
            </div>

            {/* Summary Metric Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {[
                    { label: "Avg Click Rate", value: "23.6%", icon: MousePointer, color: "text-red-600", bg: "bg-red-100 dark:bg-red-950", badge: "↑ 3.2%", badgeCls: "text-red-600" },
                    { label: "Avg Report Rate", value: "18.2%", icon: Shield, color: "text-green-600", bg: "bg-green-100 dark:bg-green-950", badge: "↑ 5.1%", badgeCls: "text-green-600" },
                    { label: "Training Completion", value: "68%", icon: GraduationCap, color: "text-blue-600", bg: "bg-blue-100 dark:bg-blue-950", badge: "↑ 12%", badgeCls: "text-green-600" },
                    { label: "Avg Risk Score", value: "43.2", icon: Activity, color: "text-amber-600", bg: "bg-amber-100 dark:bg-amber-950", badge: "↓ 8.5%", badgeCls: "text-green-600" },
                ].map((m, i) => (
                    <Card key={i} className="border-stone-200 dark:border-stone-700 dark:bg-stone-900">
                        <CardContent className="p-5">
                            <div className="flex items-center justify-between mb-3">
                                <div className={`p-2 rounded-lg ${m.bg}`}>
                                    <m.icon className={`w-4 h-4 ${m.color}`} />
                                </div>
                                <span className={`text-xs font-medium ${m.badgeCls}`}>{m.badge}</span>
                            </div>
                            <div className="text-2xl font-bold text-stone-900 dark:text-white">{m.value}</div>
                            <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">{m.label}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* ── Row 1: Click Rate Over Time + Risk Distribution ─── */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                {/* Chart 1 – Phishing Click Rate Over Time */}
                <Card className="lg:col-span-2 border-stone-200 dark:border-stone-700 dark:bg-stone-900">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-base flex items-center gap-2 text-stone-900 dark:text-white">
                                <TrendingUp className="w-4 h-4 text-red-600" />
                                Phishing Click Rate Over Time
                            </CardTitle>
                            <Badge variant="outline" className="text-xs dark:border-stone-600 dark:text-stone-300">
                                Per Campaign
                            </Badge>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={240}>
                            <LineChart data={clickRateOverTime}>
                                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                                <XAxis dataKey="campaign" stroke="#6b7280" fontSize={10} angle={-20} tick={{ fill: "#6b7280" }} height={50} />
                                <YAxis stroke="#6b7280" fontSize={11} unit="%" />
                                <Tooltip content={<CustomTooltip />} />
                                <Legend />
                                <Line type="monotone" dataKey="rate" name="Click Rate %" stroke="#ef4444" strokeWidth={2.5} dot={{ r: 4, fill: "#ef4444" }} />
                                <Line type="monotone" dataKey="reported" name="Report Rate %" stroke="#10b981" strokeWidth={2.5} dot={{ r: 4, fill: "#10b981" }} strokeDasharray="5 3" />
                            </LineChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Chart 2 – Risk Score Distribution */}
                <Card className="border-stone-200 dark:border-stone-700 dark:bg-stone-900">
                    <CardHeader>
                        <CardTitle className="text-base flex items-center gap-2 text-stone-900 dark:text-white">
                            <PieChartIcon className="w-4 h-4 text-blue-600" />
                            Risk Distribution
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={180}>
                            <PieChart>
                                <Pie
                                    data={riskDistribution}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={50}
                                    outerRadius={75}
                                    paddingAngle={3}
                                    dataKey="value"
                                >
                                    {riskDistribution.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip formatter={(value: any) => [`${value}%`, "Users"]} />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="grid grid-cols-2 gap-2 mt-3">
                            {riskDistribution.map((item) => (
                                <div key={item.name} className="flex items-center gap-2">
                                    <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                                    <span className="text-xs text-stone-600 dark:text-stone-400">
                                        {item.name}: <strong className="text-stone-900 dark:text-white">{item.value}%</strong>
                                    </span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* ── Row 2: Campaign Performance ─── */}
            <Card className="mb-6 border-stone-200 dark:border-stone-700 dark:bg-stone-900">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-base flex items-center gap-2 text-stone-900 dark:text-white">
                            <BarChart3 className="w-4 h-4 text-blue-600" />
                            Campaign Performance
                        </CardTitle>
                        <Badge variant="outline" className="text-xs dark:border-stone-600 dark:text-stone-300">
                            Emails Sent vs Clicks vs Reports
                        </Badge>
                    </div>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={260}>
                        <BarChart data={campaignPerformance} barSize={20}>
                            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                            <XAxis dataKey="name" stroke="#6b7280" fontSize={11} />
                            <YAxis stroke="#6b7280" fontSize={11} />
                            <Tooltip content={<CustomTooltip />} />
                            <Legend />
                            <Bar dataKey="sent" name="Emails Sent" fill="#3b82f6" radius={[3, 3, 0, 0]} />
                            <Bar dataKey="clicks" name="Clicks" fill="#ef4444" radius={[3, 3, 0, 0]} />
                            <Bar dataKey="reports" name="Reported" fill="#10b981" radius={[3, 3, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            {/* ── Row 3: Heatmap ─── */}
            <Card className="mb-6 border-stone-200 dark:border-stone-700 dark:bg-stone-900">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-base flex items-center gap-2 text-stone-900 dark:text-white">
                            <Activity className="w-4 h-4 text-purple-600" />
                            User Behavior Heatmap
                        </CardTitle>
                        <Badge variant="outline" className="text-xs dark:border-stone-600 dark:text-stone-300">
                            Time of Day × Click Probability
                        </Badge>
                    </div>
                </CardHeader>
                <CardContent>
                    <HeatmapChart showHours="all" />
                </CardContent>
            </Card>

            {/* ── Row 4: Training Effectiveness + Department Risk ─── */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Chart 5 – Training Effectiveness */}
                <Card className="border-stone-200 dark:border-stone-700 dark:bg-stone-900">
                    <CardHeader>
                        <CardTitle className="text-base flex items-center gap-2 text-stone-900 dark:text-white">
                            <GraduationCap className="w-4 h-4 text-green-600" />
                            Training Effectiveness
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={240}>
                            <BarChart data={trainingEffectiveness} barSize={16}>
                                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                                <XAxis dataKey="group" stroke="#6b7280" fontSize={11} />
                                <YAxis stroke="#6b7280" fontSize={11} domain={[0, 100]} />
                                <Tooltip content={<CustomTooltip />} />
                                <Legend />
                                <Bar dataKey="before" name="Risk Score Before" fill="#f97316" radius={[3, 3, 0, 0]} />
                                <Bar dataKey="after" name="Risk Score After" fill="#22c55e" radius={[3, 3, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                        <div className="mt-3 p-3 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-lg">
                            <p className="text-xs text-green-700 dark:text-green-400 font-medium">
                                ✓ Average risk score reduction: <strong>28.4%</strong> across all trained departments
                            </p>
                        </div>
                    </CardContent>
                </Card>

                {/* Chart 6 – Department Risk Comparison */}
                <Card className="border-stone-200 dark:border-stone-700 dark:bg-stone-900">
                    <CardHeader>
                        <CardTitle className="text-base flex items-center gap-2 text-stone-900 dark:text-white">
                            <Building className="w-4 h-4 text-amber-600" />
                            Department Risk Comparison
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={240}>
                            <BarChart data={departmentRisk} layout="vertical" barSize={16}>
                                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                                <XAxis type="number" stroke="#6b7280" fontSize={11} domain={[0, 100]} />
                                <YAxis type="category" dataKey="dept" stroke="#6b7280" fontSize={11} width={65} />
                                <Tooltip content={<CustomTooltip />} />
                                <Bar dataKey="risk" name="Risk Score" radius={[0, 3, 3, 0]}>
                                    {departmentRisk.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                        <div className="mt-3 grid grid-cols-3 gap-2">
                            {departmentRisk.map((d) => (
                                <div key={d.dept} className="flex items-center gap-1.5">
                                    <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: d.color }} />
                                    <span className="text-xs text-stone-500 dark:text-stone-400 truncate">{d.dept}</span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
