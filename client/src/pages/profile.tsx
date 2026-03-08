import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowLeft,
  Mail,
  Building,
  Shield,
  MousePointer,
  GraduationCap,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Activity,
  Target,
  Brain,
  TrendingDown,
  ZapIcon,
} from "lucide-react";
import {
  AreaChart,
  Area,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useNavigate } from "react-router-dom";
import { RiskBadge } from "@/components/ui/RiskBadge";

// ─── Dummy Data ───────────────────────────────────────────────────────────────

const user = {
  id: 1,
  name: "Sophie Martin",
  email: "sophie.martin@company.com",
  department: "Ventes",
  role: "Manager",
  riskScore: 72,
  campaigns: 8,
  clicks: 12,
  reports: 2,
  trainingsCompleted: 2,
  trainingsAssigned: 5,
};

const riskEvolution = [
  { month: "Jan", score: 88 },
  { month: "Fév", score: 82 },
  { month: "Mar", score: 79 },
  { month: "Avr", score: 75 },
  { month: "Mai", score: 74 },
  { month: "Juin", score: 72 },
];

const vulnerabilities = [
  { subject: "CEO Fraud", A: 85, fullMark: 100 },
  { subject: "Invoice Scam", A: 72, fullMark: 100 },
  { subject: "Credential", A: 65, fullMark: 100 },
  { subject: "Social Eng.", A: 78, fullMark: 100 },
  { subject: "Malware", A: 45, fullMark: 100 },
  { subject: "Urgency", A: 80, fullMark: 100 },
];

const campaignHistory = [
  { id: 1, name: "CEO Fraud Q2", date: "2024-06-01", clickedLink: true, reported: false, result: "clicked" },
  { id: 2, name: "MS Login Test", date: "2024-05-15", clickedLink: true, reported: false, result: "clicked" },
  { id: 3, name: "Zoom Update", date: "2024-05-01", clickedLink: false, reported: true, result: "reported" },
  { id: 4, name: "Invoice Scam", date: "2024-04-10", clickedLink: true, reported: false, result: "clicked" },
  { id: 5, name: "IT Alert", date: "2024-03-20", clickedLink: false, reported: false, result: "ignored" },
];

const trainingProgress = [
  { name: "Identifier les emails de phishing", progress: 100, status: "completed" },
  { name: "Ingénierie sociale avancée", progress: 35, status: "in_progress" },
  { name: "Protection des credentials", progress: 0, status: "not_started" },
  { name: "Réponse aux incidents", progress: 0, status: "not_started" },
  { name: "Phishing sur mobile", progress: 0, status: "not_started" },
];

const behaviorTimeline = [
  { date: "2024-06-10", action: "clicked", campaign: "CEO Fraud Q2", icon: MousePointer, color: "text-red-600 bg-red-50" },
  { date: "2024-06-08", action: "training_started", campaign: "Ingénierie sociale avancée", icon: GraduationCap, color: "text-blue-600 bg-blue-50" },
  { date: "2024-05-20", action: "reported", campaign: "Zoom Update", icon: CheckCircle2, color: "text-green-600 bg-green-50" },
  { date: "2024-05-15", action: "clicked", campaign: "MS Login Test", icon: MousePointer, color: "text-red-600 bg-red-50" },
  { date: "2024-04-15", action: "training_completed", campaign: "Identify Phishing Emails", icon: CheckCircle2, color: "text-green-600 bg-green-50" },
  { date: "2024-04-10", action: "clicked", campaign: "Invoice Scam", icon: MousePointer, color: "text-red-600 bg-red-50" },
];

// ─── Component ───────────────────────────────────────────────────────────────

export default function Profile() {
  const navigate = useNavigate();

  return (
    <div className="h-full overflow-y-auto p-6 custom-scrollbar">
      {/* Back */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => navigate(-1)}
        className="mb-6 text-stone-500 hover:text-stone-900 dark:text-stone-400 dark:hover:text-white"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back
      </Button>

      {/* User Header */}
      <Card className="mb-6 border-stone-200 dark:border-stone-700 dark:bg-stone-900 overflow-hidden">
        <div className="bg-gradient-to-r from-stone-900 via-stone-800 to-stone-900 p-6">
          <div className="flex items-start gap-5">
            <Avatar className="w-16 h-16 ring-4 ring-white/20">
              <AvatarFallback className="bg-gradient-to-br from-red-500 to-orange-500 text-white text-xl font-bold">
                {user.name.split(" ").map((n) => n[0]).join("")}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-3">
                    <h2 className="text-xl font-bold text-white">{user.name}</h2>
                    <RiskBadge score={user.riskScore} showScore={true} />
                  </div>
                  <div className="flex items-center gap-4 mt-2 text-sm text-stone-300">
                    <span className="flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5" /> {user.email}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Building className="w-3.5 h-3.5" /> {user.department} · {user.role}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="border-stone-600 text-stone-300 hover:bg-stone-700 hover:text-white">
                    <GraduationCap className="w-4 h-4 mr-1.5" />
                    Assign Training
                  </Button>
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
                    <Target className="w-4 h-4 mr-1.5" />
                    Add to Campaign
                  </Button>
                </div>
              </div>
              <div className="grid grid-cols-4 gap-4 mt-5">
                {[
                  { label: "Campaigns", value: user.campaigns, icon: Target, color: "text-blue-400" },
                  { label: "Phishing Clicks", value: user.clicks, icon: MousePointer, color: "text-red-400" },
                  { label: "Reports Filed", value: user.reports, icon: Shield, color: "text-green-400" },
                  { label: "Trainings", value: `${user.trainingsCompleted}/${user.trainingsAssigned}`, icon: GraduationCap, color: "text-purple-400" },
                ].map((stat) => (
                  <div key={stat.label} className="bg-white/5 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <stat.icon className={`w-3.5 h-3.5 ${stat.color}`} />
                      <span className="text-xs text-stone-400">{stat.label}</span>
                    </div>
                    <p className="text-lg font-bold text-white">{stat.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="overview">
        <TabsList className="mb-6 dark:bg-stone-800">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="campaigns">Campaign History</TabsTrigger>
          <TabsTrigger value="training">Training</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
        </TabsList>

        {/* Overview */}
        <TabsContent value="overview">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border-stone-200 dark:border-stone-700 dark:bg-stone-900">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2 text-stone-900 dark:text-white">
                  <Activity className="w-4 h-4 text-blue-600" />
                  Risk Score Evolution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <AreaChart data={riskEvolution}>
                    <defs>
                      <linearGradient id="riskGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="month" stroke="#6b7280" fontSize={11} />
                    <YAxis stroke="#6b7280" fontSize={11} domain={[0, 100]} />
                    <Tooltip contentStyle={{ backgroundColor: "#fff", border: "1px solid #e5e7eb", borderRadius: "8px", fontSize: "12px" }} />
                    <Area type="monotone" dataKey="score" name="Risk Score" stroke="#ef4444" fillOpacity={1} fill="url(#riskGrad)" strokeWidth={2.5} />
                  </AreaChart>
                </ResponsiveContainer>
                <div className="flex items-center gap-2 mt-3 p-2.5 bg-green-50 border border-green-200 rounded-lg">
                  <TrendingDown className="w-4 h-4 text-green-600" />
                  <span className="text-xs text-green-700">Risk decreased by <strong>16 points</strong> over 6 months</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-stone-200 dark:border-stone-700 dark:bg-stone-900">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2 text-stone-900 dark:text-white">
                  <Brain className="w-4 h-4 text-purple-600" />
                  Vulnerability Profile
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={220}>
                  <RadarChart cx="50%" cy="50%" outerRadius="75%" data={vulnerabilities}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11, fill: "#6b7280" }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 9, fill: "#9ca3af" }} />
                    <Radar name="Vulnerability" dataKey="A" stroke="#ef4444" fill="#ef4444" fillOpacity={0.25} />
                    <Tooltip />
                  </RadarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="lg:col-span-2 border-purple-200 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20 dark:border-purple-800/50 dark:bg-stone-900">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2 text-stone-900 dark:text-white">
                  <Brain className="w-4 h-4 text-purple-600" />
                  AI Risk Assessment
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { icon: AlertTriangle, color: "text-red-500", title: "Primary Risk", desc: "High susceptibility to urgency and social engineering. Clicked 5/8 campaigns in 6 months.", badge: "Urgency Attacks", badgeCls: "bg-red-100 text-red-700" },
                    { icon: ZapIcon, color: "text-amber-500", title: "Recommendation", desc: "Assign 'Advanced Social Engineering' training immediately. Follow with a CEO fraud test.", badge: "Action Required", badgeCls: "bg-amber-100 text-amber-700" },
                    { icon: CheckCircle2, color: "text-green-500", title: "Strengths", desc: "Reported the Zoom Update campaign. Shows awareness of malware distribution tactics.", badge: "Good Reporting", badgeCls: "bg-green-100 text-green-700" },
                  ].map((item, i) => {
                    const Icon = item.icon;
                    return (
                      <div key={i} className="p-4 bg-white dark:bg-stone-800 rounded-xl border border-purple-100 dark:border-stone-700">
                        <div className="flex items-center gap-2 mb-2">
                          <Icon className={`w-4 h-4 ${item.color}`} />
                          <p className="text-sm font-semibold text-stone-900 dark:text-white">{item.title}</p>
                        </div>
                        <p className="text-xs text-stone-600 dark:text-stone-400">{item.desc}</p>
                        <Badge className={`mt-2 ${item.badgeCls}`}>{item.badge}</Badge>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Campaign History */}
        <TabsContent value="campaigns">
          <Card className="border-stone-200 dark:border-stone-700 dark:bg-stone-900">
            <CardHeader>
              <CardTitle className="text-base text-stone-900 dark:text-white">Campaign Participation History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-stone-200 dark:border-stone-700">
                      {["Campaign", "Date", "Clicked Link", "Reported", "Result"].map((h) => (
                        <th key={h} className="text-left py-3 px-4 text-sm font-medium text-stone-700 dark:text-stone-300">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {campaignHistory.map((c) => (
                      <tr key={c.id} className="border-b border-stone-100 dark:border-stone-800 hover:bg-stone-50 dark:hover:bg-stone-800/50">
                        <td className="py-3 px-4 font-medium text-stone-900 dark:text-white text-sm">{c.name}</td>
                        <td className="py-3 px-4 text-sm text-stone-500 dark:text-stone-400">{c.date}</td>
                        <td className="py-3 px-4">
                          {c.clickedLink ? (
                            <span className="flex items-center gap-1 text-red-600 text-xs font-medium">
                              <MousePointer className="w-3 h-3" /> Yes
                            </span>
                          ) : <span className="text-stone-400 text-xs">No</span>}
                        </td>
                        <td className="py-3 px-4">
                          {c.reported ? (
                            <span className="flex items-center gap-1 text-green-600 text-xs font-medium">
                              <CheckCircle2 className="w-3 h-3" /> Yes
                            </span>
                          ) : <span className="text-stone-400 text-xs">No</span>}
                        </td>
                        <td className="py-3 px-4">
                          <Badge className={
                            c.result === "clicked" ? "bg-red-100 text-red-700" :
                              c.result === "reported" ? "bg-green-100 text-green-700" :
                                "bg-stone-100 text-stone-600"
                          }>
                            {c.result === "clicked" ? "Fell for it" : c.result === "reported" ? "Reported" : "Ignored"}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Training */}
        <TabsContent value="training">
          <Card className="border-stone-200 dark:border-stone-700 dark:bg-stone-900">
            <CardHeader>
              <CardTitle className="text-base text-stone-900 dark:text-white">Training Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {trainingProgress.map((t, i) => (
                  <div key={i} className="p-4 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800/50">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${t.status === "completed" ? "bg-green-100" : t.status === "in_progress" ? "bg-blue-100" : "bg-stone-100"}`}>
                          {t.status === "completed" ? <CheckCircle2 className="w-4 h-4 text-green-600" /> :
                            t.status === "in_progress" ? <Clock className="w-4 h-4 text-blue-600" /> :
                              <GraduationCap className="w-4 h-4 text-stone-400" />}
                        </div>
                        <div>
                          <p className="font-medium text-stone-900 dark:text-white text-sm">{t.name}</p>
                          <p className="text-xs text-stone-500 mt-0.5">
                            {t.status === "completed" ? "Completed" : t.status === "in_progress" ? "In Progress" : "Not Started"}
                          </p>
                        </div>
                      </div>
                      <span className="text-sm font-semibold text-stone-700 dark:text-stone-300">{t.progress}%</span>
                    </div>
                    <Progress value={t.progress} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Timeline */}
        <TabsContent value="timeline">
          <Card className="border-stone-200 dark:border-stone-700 dark:bg-stone-900">
            <CardHeader>
              <CardTitle className="text-base text-stone-900 dark:text-white">Behavior Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <div className="absolute left-5 top-0 bottom-0 w-px bg-stone-200 dark:bg-stone-700" />
                <div className="space-y-0">
                  {behaviorTimeline.map((event, i) => {
                    const Icon = event.icon;
                    return (
                      <div key={i} className="flex items-start gap-4 pb-6 relative">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center z-10 shrink-0 ${event.color} border-2 border-white dark:border-stone-900`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="flex-1 pt-2">
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="text-sm font-medium text-stone-900 dark:text-white">
                              {event.action === "clicked" ? "Clicked phishing link" :
                                event.action === "reported" ? "Reported phishing email" :
                                  event.action === "training_started" ? "Started training" : "Completed training"}
                            </p>
                            <span className="text-xs text-stone-400">• {event.date}</span>
                          </div>
                          <p className="text-xs text-stone-500 mt-0.5">
                            <strong>{event.campaign}</strong>
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
