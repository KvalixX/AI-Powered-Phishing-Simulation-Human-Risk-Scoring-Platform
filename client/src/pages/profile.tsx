import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";
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
import { useToast } from "@/hooks/use-toast";

// ─── Dummy Data ───────────────────────────────────────────────────────────────

const user: any = null;

const campaignHistory: any[] = [];
const trainingProgress: any[] = [];
const behaviorTimeline: any[] = [];

// ─── Component ───────────────────────────────────────────────────────────────

import { useMemo } from "react";
import { useContacts, useRiskScores, useBehavioralEvents, useTrainings, useCampaigns } from "@/hooks/useApi";
import { useLocation, useParams } from "react-router-dom";
import { useAppStore } from "@/store/useAppStore";

export default function Profile() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { currentUser } = useAppStore();
  // Attempt to read user ID from route state, else fallback to first contact
  const { id } = useParams();
  const location = useLocation();
  const stateId = id ? parseInt(id) : location.state?.userId;

  const { data: contacts = [] } = useContacts();
  const { data: riskScores = [] } = useRiskScores();
  const { data: behavioralEvents = [] } = useBehavioralEvents();
  const { data: trainings = [] } = useTrainings();
  const { data: campaigns = [] } = useCampaigns();

  const dynamicUser = useMemo(() => {
    if (contacts.length === 0) return {
        id: 0,
        name: "Chargement...",
        email: "...",
        department: "...",
        role: "...",
        riskScore: 0,
        campaigns: 0,
        clicks: 0,
        reports: 0,
        trainingsCompleted: 0,
        trainingsAssigned: 0
    };
    
    // Priority: 1. URL ID/State ID, 2. Current Authenticated User Email, 3. First contact in list
    const c = contacts.find(c => c.id === stateId) || 
              contacts.find(c => c.email === currentUser?.email) || 
              contacts[0];
    
    const rs = riskScores.find(r => r.contact_id === c.id)?.score || 50;
    
    const events = behavioralEvents.filter(e => e.contact_id === c.id);
    const uniqueCampaigns = new Set(events.map(e => e.campaign_id)).size;
    const clicks = events.filter(e => e.event_type === 'click').length;
    const reports = events.filter(e => e.event_type === 'report').length;

    const userTrainings = trainings.filter(t => t.contact_id === c.id);
    const completedTrainings = userTrainings.filter(t => t.status === 'completed').length;

    return {
      id: c.id,
      name: `${c.first_name} ${c.last_name}`,
      email: c.email,
      department: c.department || "Unknown",
      role: c.position || "Employee",
      riskScore: rs,
      campaigns: uniqueCampaigns,
      clicks,
      reports,
      trainingsCompleted: completedTrainings,
      trainingsAssigned: userTrainings.length
    };
  }, [contacts, riskScores, behavioralEvents, trainings, stateId, currentUser]);

  const riskEvolution = useMemo(() => {
    const currentScore = dynamicUser.riskScore;
    const months = ["Oct", "Nov", "Dec", "Jan", "Feb", "Mar"];
    return months.map((month, i) => ({
      month,
      score: Math.max(0, Math.min(100, currentScore + (i - 5) * (Math.random() > 0.5 ? 5 : -5)))
    }));
  }, [dynamicUser.riskScore]);

  const vulnerabilities = useMemo(() => {
    const s = dynamicUser.riskScore;
    return [
      { subject: 'Hameçonnage', A: Math.min(100, s + 10), fullMark: 100 },
      { subject: 'Malware', A: Math.max(0, s - 15), fullMark: 100 },
      { subject: 'Urgence', A: Math.min(100, s + 20), fullMark: 100 },
      { subject: 'Autorité', A: Math.max(0, s - 5), fullMark: 100 },
      { subject: 'Curiosité', A: Math.min(100, s + 5), fullMark: 100 },
    ];
  }, [dynamicUser.riskScore]);

  const dynamicCampaignHistory = useMemo(() => {
    if (behavioralEvents.length === 0 || campaigns.length === 0) return [];
    const events = behavioralEvents.filter(e => e.contact_id === dynamicUser.id);
    
    // Group events by campaign to see outcome
    const historyMap = new Map();
    events.forEach(e => {
        const c = campaigns.find(camp => camp.id === e.campaign_id);
        if (!c) return;
        const name = c.name;
        if (!historyMap.has(c.id)) {
            historyMap.set(c.id, {
                id: c.id,
                name: c.name,
                date: new Date(e.event_timestamp || Date.now()).toISOString().split('T')[0],
                clickedLink: false,
                reported: false,
                result: "ignored"
            });
        }
        const entry = historyMap.get(c.id);
        if (e.event_type === 'click' || e.event_type === 'submission') {
            entry.clickedLink = true;
            entry.result = "clicked";
        }
        if (e.event_type === 'report') {
            entry.reported = true;
            entry.result = entry.clickedLink ? "clicked" : "reported";
        }
    });

    const results = Array.from(historyMap.values());
    return results.length > 0 ? results : campaignHistory;
  }, [behavioralEvents, campaigns, dynamicUser.id]);

  const dynamicTrainingProgress = useMemo(() => {
      const userTrainings = trainings.filter(t => t.contact_id === dynamicUser.id);
      if (userTrainings.length === 0) return [];
      return userTrainings.map(t => ({
          name: t.ai_content ? "Module IA" : (t.content || "Formation"),
          progress: t.status === 'completed' ? 100 : 0,
          status: t.status === 'completed' ? "completed" : "not_started"
      }));
  }, [trainings, dynamicUser.id]);

  const dynamicBehaviorTimeline = useMemo(() => {
      const events = behavioralEvents.filter(e => e.contact_id === dynamicUser.id).map(e => {
          const c = campaigns.find(camp => camp.id === e.campaign_id);
          return {
              date: new Date(e.event_timestamp || Date.now()).toISOString().split('T')[0],
              action: e.event_type,
              campaign: c ? c.name : "Unknown",
              icon: e.event_type === 'click' ? MousePointer : e.event_type === 'report' ? CheckCircle2 : Shield,
              color: e.event_type === 'click' ? "text-red-600 bg-red-50" : "text-green-600 bg-green-50"
          };
      });
      const trainingEvents = trainings.filter(t => t.contact_id === dynamicUser.id).map(t => ({
          date: new Date(t.updated_at || Date.now()).toISOString().split('T')[0],
          action: t.status === 'completed' ? "training_completed" : "training_started",
          campaign: t.ai_content ? "Module IA" : (t.content || "Formation"),
          icon: GraduationCap,
          color: "text-blue-600 bg-blue-50"
      }));
      return [...events, ...trainingEvents].sort((a,b) => b.date.localeCompare(a.date));
  }, [behavioralEvents, trainings, campaigns, dynamicUser.id]);

  return (
    <div className="h-full overflow-y-auto p-6 custom-scrollbar">
      {/* Back */}
      <div className="flex items-center justify-between mb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate("/users")}
          className="text-stone-500 hover:text-stone-900 dark:text-stone-400 dark:hover:text-white"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour aux utilisateurs
        </Button>

        <div className="flex items-center gap-2 w-64">
          <Select 
            value={dynamicUser.id.toString()} 
            onValueChange={(val) => navigate(`/profile/${val}`)}
          >
            <SelectTrigger className="bg-white/5 border-stone-200 dark:border-stone-700 h-9">
              <div className="flex items-center gap-2">
                <Search className="w-3.5 h-3.5 text-stone-400" />
                <SelectValue placeholder="Choisir un utilisateur..." />
              </div>
            </SelectTrigger>
            <SelectContent className="max-h-[300px]">
              {contacts.map(c => (
                <SelectItem key={c.id} value={c.id.toString()}>
                  {c.first_name} {c.last_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* User Header */}
      <Card className="mb-6 border-stone-200 dark:border-stone-700 dark:bg-stone-900 overflow-hidden">
        <div className="bg-gradient-to-r from-stone-900 via-stone-800 to-stone-900 p-6">
          <div className="flex items-start gap-5">
            <Avatar className="w-16 h-16 ring-4 ring-white/20">
              <AvatarFallback className="bg-gradient-to-br from-red-500 to-orange-500 text-white text-xl font-bold">
                {dynamicUser.name.split(" ").map((n: string) => n[0]).join("")}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-3">
                    <h2 className="text-xl font-bold text-white">{dynamicUser.name}</h2>
                    <RiskBadge score={dynamicUser.riskScore} showScore={true} />
                  </div>
                  <div className="flex items-center gap-4 mt-2 text-sm text-stone-300">
                    <span className="flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5" /> {dynamicUser.email}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Building className="w-3.5 h-3.5" /> {dynamicUser.department} · {dynamicUser.role}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                </div>
              </div>
              <div className="grid grid-cols-4 gap-4 mt-5">
                {[
                  { label: "Campaigns", value: dynamicUser.campaigns, icon: Target, color: "text-blue-400" },
                  { label: "Phishing Clicks", value: dynamicUser.clicks, icon: MousePointer, color: "text-red-400" },
                  { label: "Reports Filed", value: dynamicUser.reports, icon: Shield, color: "text-green-400" },
                  { label: "Trainings", value: `${dynamicUser.trainingsCompleted}/${dynamicUser.trainingsAssigned}`, icon: GraduationCap, color: "text-purple-400" },
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
                  <RadarChart cx="50%" cy="50%" outerRadius="75%" data={vulnerabilities.length > 0 ? vulnerabilities : [{ subject: 'N/A', A: 0, fullMark: 100 }]}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11, fill: "#6b7280" }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 9, fill: "#9ca3af" }} />
                    <Radar name="Vulnerability" dataKey="A" stroke="#ef4444" fill="#ef4444" fillOpacity={0.25} />
                    <Tooltip />
                  </RadarChart>
                </ResponsiveContainer>
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
                    {dynamicCampaignHistory.map((c: any) => (
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
                {dynamicTrainingProgress.map((t: any, i: number) => (
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
                  {dynamicBehaviorTimeline.map((event, i) => {
                    const Icon: any = event.icon;
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
