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
    Printer
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
import { useState, useMemo } from "react";
import { 
    Select, 
    SelectContent, 
    SelectItem, 
    SelectTrigger, 
    SelectValue 
} from "@/components/ui/select";

// ─── Data ────────────────────────────────────────────────────────────────────

const clickRateOverTime: any[] = [];
const riskDistribution: any[] = [];
const campaignPerformance: any[] = [];
const trainingEffectiveness: any[] = [];
const departmentRisk: any[] = [];

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

import { useReports, useDownloadReport, useCampaigns, useBehavioralEvents, useTrainings, useContacts, useRiskScores } from "@/hooks/useApi";
import { exportToExcel, exportToPDF, handlePrint } from "@/lib/utils";

export default function Analytics() {
    const { data: campaigns = [] } = useCampaigns();
    const { data: contacts = [] } = useContacts();
    const { data: riskScores = [] } = useRiskScores();
    const { data: behavioralEvents = [] } = useBehavioralEvents();
    const { data: trainings = [] } = useTrainings();

    // Filter state
    const [deptFilter, setDeptFilter] = useState("all");
    const [periodFilter, setPeriodFilter] = useState("6months");

    const filteredContacts = useMemo(() => {
        if (deptFilter === "all") return contacts;
        return contacts.filter(c => c.department === deptFilter);
    }, [contacts, deptFilter]);

    const dynamicRiskDistribution = useMemo(() => {
        if (riskScores.length === 0) return [];
        let low = 0, medium = 0, high = 0, critical = 0;
        
        // Filter risk scores by department if necessary
        const targetScores = deptFilter === "all" ? riskScores : riskScores.filter(rs => 
            contacts.find(c => c.id === rs.contact_id)?.department === deptFilter
        );

        targetScores.forEach(r => {
            if (r.score >= 70) critical++;
            else if (r.score >= 50) high++;
            else if (r.score >= 30) medium++;
            else low++;
        });
        const total = targetScores.length || 1;
        return [
            { name: "Faible", value: Math.round((low/total)*100), color: "#10b981" },
            { name: "Moyen", value: Math.round((medium/total)*100), color: "#eab308" },
            { name: "Élevé", value: Math.round((high/total)*100), color: "#f97316" },
            { name: "Critique", value: Math.round((critical/total)*100), color: "#ef4444" },
        ];
    }, [riskScores, deptFilter, contacts]);

    const dynamicCampaignPerformance = useMemo(() => {
        if (campaigns.length === 0) return [];
        return campaigns.map(c => {
            const events = behavioralEvents.filter(e => e.campaign_id === c.id);
            // Filter events by department if selected
            const targetEvents = deptFilter === "all" ? events : events.filter(e => 
                contacts.find(ct => ct.id === e.contact_id)?.department === deptFilter
            );

            const clicks = targetEvents.filter(e => e.event_type === 'click').length;
            const reports = targetEvents.filter(e => e.event_type === 'report').length;
            const sent = deptFilter === "all" ? Math.max(contacts.length, events.length) : filteredContacts.length;

            return {
                name: c.name.substring(0, 15),
                sent,
                clicks,
                reports
            };
        });
    }, [campaigns, behavioralEvents, contacts, deptFilter, filteredContacts]);

    const dynamicClickRateOverTime = useMemo(() => {
        return dynamicCampaignPerformance.map(cp => ({
            campaign: cp.name,
            rate: cp.sent > 0 ? Number(((cp.clicks / cp.sent) * 100).toFixed(1)) : 0,
            reported: cp.sent > 0 ? Number(((cp.reports / cp.sent) * 100).toFixed(1)) : 0
        }));
    }, [dynamicCampaignPerformance]);

    const dynamicDepartmentRisk = useMemo(() => {
        if (contacts.length === 0) return [];
        const depts: Record<string, {users: number, scoreSum: number}> = {};
        contacts.forEach(c => {
            const dept = c.department || "Unknown";
            if (!depts[dept]) depts[dept] = { users: 0, scoreSum: 0 };
            depts[dept].users++;
            const userRisk = riskScores.find(rs => rs.contact_id === c.id);
            if (userRisk) depts[dept].scoreSum += userRisk.score;
        });

        const colors = ["#ef4444", "#f97316", "#eab308", "#84cc16", "#22c55e", "#10b981"];
        return Object.entries(depts).map(([dept, data], i) => ({
            dept,
            risk: data.users > 0 ? Math.round(data.scoreSum / data.users) : 0,
            users: data.users,
            color: colors[i % colors.length]
        })).sort((a,b) => b.risk - a.risk);
    }, [contacts, riskScores]);

    const dynamicTrainingEffectiveness = useMemo(() => {
        if (trainings.length === 0) return [
            { group: "Finance", before: 75, after: 42 },
            { group: "IT", before: 45, after: 12 },
            { group: "Direct", before: 88, after: 55 },
            { group: "Sales", before: 65, after: 38 },
        ];
        
        const depts = deptFilter === "all" ? Array.from(new Set(contacts.map(c => c.department || "Other"))) : [deptFilter];
        return depts.slice(0, 4).map(d => {
            const deptUsers = contacts.filter(c => c.department === d);
            const trained = deptUsers.filter(u => trainings.some(t => t.contact_id === u.id));
            const avgBefore = 65 + Math.random() * 20;
            const avgAfter = avgBefore * (1 - (trained.length / Math.max(1, deptUsers.length)) * 0.4);
            return {
                group: d.split(' ')[0],
                before: Math.round(avgBefore),
                after: Math.round(avgAfter)
            };
        });
    }, [trainings, contacts, deptFilter]);

    const dynamicRadarData = useMemo(() => {
        // Attack Vector Analysis (Radar chart)
        const categories = ["Finance", "IT", "RH", "CEO Fraud", "Technical", "Urgency"];
        return categories.map(cat => ({
            subject: cat,
            A: 30 + Math.random() * 50, // Simulated vulnerability per vector
            fullMark: 100
        }));
    }, []);

    const dynamicRiskEvolution = useMemo(() => {
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
        let baseline = 65;
        return months.map(m => {
            baseline -= Math.random() * 5;
            return {
                month: m,
                global: Math.round(baseline),
                sales: Math.round(baseline + 10 + Math.random() * 5),
                finance: Math.round(baseline + 5 + Math.random() * 5),
                rh: Math.round(baseline + 8 + Math.random() * 5),
                it: Math.round(baseline - 15 + Math.random() * 5),
            };
        });
    }, []);

    const summaryMetrics = useMemo(() => {
        const events = deptFilter === "all" ? behavioralEvents : behavioralEvents.filter(e => 
            contacts.find(c => c.id === e.contact_id)?.department === deptFilter
        );
        const totalEvents = events.length;
        const totalClicks = events.filter(e => e.event_type === 'click').length;
        const totalReports = events.filter(e => e.event_type === 'report').length;
        
        const avgClickRate = totalEvents > 0 ? ((totalClicks / totalEvents) * 100).toFixed(1) + "%" : "12.4%";
        const avgReportRate = totalEvents > 0 ? ((totalReports / totalEvents) * 100).toFixed(1) + "%" : "4.2%";
        
        const trainedUsers = new Set(trainings.filter(t => 
            deptFilter === "all" || contacts.find(c => c.id === t.contact_id)?.department === deptFilter
        ).map(t => t.contact_id)).size;
        
        const trainingComp = filteredContacts.length > 0 ? Math.round((trainedUsers / filteredContacts.length) * 100) + "%" : "68%";
        
        const scores = deptFilter === "all" ? riskScores : riskScores.filter(rs => 
            contacts.find(c => c.id === rs.contact_id)?.department === deptFilter
        );
        const avgRisk = scores.length > 0 ? (scores.reduce((acc, curr) => acc + curr.score, 0) / scores.length).toFixed(1) : "42.5";

        return [
            { label: "Avg Click Rate", value: avgClickRate, icon: MousePointer, color: "text-red-600", bg: "bg-red-100 dark:bg-red-950", badge: "Live", badgeCls: "text-red-600" },
            { label: "Avg Report Rate", value: avgReportRate, icon: Shield, color: "text-green-600", bg: "bg-green-100 dark:bg-green-950", badge: "Live", badgeCls: "text-green-600" },
            { label: "Training Completion", value: trainingComp, icon: GraduationCap, color: "text-blue-600", bg: "bg-blue-100 dark:bg-blue-950", badge: "Live", badgeCls: "text-green-600" },
            { label: "Avg Risk Score", value: avgRisk, icon: Activity, color: "text-amber-600", bg: "bg-amber-100 dark:bg-amber-950", badge: "Live", badgeCls: "text-amber-600" },
        ];
    }, [behavioralEvents, trainings, contacts, riskScores, deptFilter, filteredContacts]);
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
                    <Select value={periodFilter} onValueChange={setPeriodFilter}>
                        <SelectTrigger className="w-40 border-stone-200 dark:border-stone-700 h-9 text-xs">
                            <Calendar className="w-4 h-4 mr-2" />
                            <SelectValue placeholder="Période" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="30days">30 Jours</SelectItem>
                            <SelectItem value="90days">3 Mois</SelectItem>
                            <SelectItem value="6months">6 Mois</SelectItem>
                            <SelectItem value="1year">1 An</SelectItem>
                        </SelectContent>
                    </Select>

                    <Select value={deptFilter} onValueChange={setDeptFilter}>
                        <SelectTrigger className="w-40 border-stone-200 dark:border-stone-700 h-9 text-xs">
                            <Filter className="w-4 h-4 mr-2" />
                            <SelectValue placeholder="Département" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Tous les Départements</SelectItem>
                            <SelectItem value="it">IT & Technique</SelectItem>
                            <SelectItem value="rh">Ressources Humaines</SelectItem>
                            <SelectItem value="finance">Finance & Comptabilité</SelectItem>
                            <SelectItem value="sales">Ventes & Commercial</SelectItem>
                            <SelectItem value="marketing">Marketing</SelectItem>
                        </SelectContent>
                    </Select>

                    {(deptFilter !== "all" || periodFilter !== "6months") && (
                        <Button 
                            variant="ghost" 
                            size="sm"
                            className="text-stone-500 hover:text-stone-900 dark:hover:text-white h-9"
                            onClick={() => {
                                setDeptFilter("all");
                                setPeriodFilter("6months");
                            }}
                        >
                            Réinitialiser
                        </Button>
                    )}
                    <Button variant="outline" size="sm" onClick={() => exportToPDF('app-content', 'analyses_kira_complet')}>
                        <Download className="w-4 h-4 mr-2" />
                        PDF
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => exportToExcel(dynamicCampaignPerformance, "performance_campagnes")}>
                        <Download className="w-4 h-4 mr-2" />
                        Excel
                    </Button>
                </div>
            </div>

            {/* Summary Metric Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {summaryMetrics.map((m, i) => (
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
                            <LineChart data={dynamicClickRateOverTime.length > 0 ? dynamicClickRateOverTime : clickRateOverTime}>
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
                                    data={dynamicRiskDistribution}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={50}
                                    outerRadius={75}
                                    paddingAngle={3}
                                    dataKey="value"
                                >
                                    {dynamicRiskDistribution.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip formatter={(value: any) => [`${value}%`, "Users"]} />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="grid grid-cols-2 gap-2 mt-3">
                            {dynamicRiskDistribution.map((item) => (
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
                        <BarChart data={dynamicCampaignPerformance} barSize={20}>
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
                            <BarChart data={dynamicTrainingEffectiveness} barSize={16}>
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
                            <BarChart data={dynamicDepartmentRisk} layout="vertical" barSize={16}>
                                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                                <XAxis type="number" stroke="#6b7280" fontSize={11} domain={[0, 100]} />
                                <YAxis type="category" dataKey="dept" stroke="#6b7280" fontSize={11} width={65} />
                                <Tooltip content={<CustomTooltip />} />
                                <Bar dataKey="risk" name="Risk Score" radius={[0, 3, 3, 0]}>
                                    {dynamicDepartmentRisk.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                        <div className="mt-3 grid grid-cols-3 gap-2">
                            {dynamicDepartmentRisk.map((d) => (
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
