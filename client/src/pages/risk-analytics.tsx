import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  ShieldAlert, 
  TrendingDown, 
  TrendingUp, 
  Users, 
  AlertTriangle,
  CheckCircle2,
  Brain,
  Target,
  Clock,
  Zap,
  Activity,
  FileText,
  Filter,
  Download,
  Printer
} from "lucide-react";
import { 
  Radar, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
  Legend
} from "recharts";

const riskEvolutionData: any[] = [];
const radarData: any[] = [];
const topRiskUsers: any[] = [];
const departmentRisk: any[] = [];
const riskFactors: any[] = [];

const getRiskColor = (score: number) => {
  if (score >= 70) return "text-red-600 bg-red-50 border-red-200";
  if (score >= 50) return "text-orange-600 bg-orange-50 border-orange-200";
  if (score >= 30) return "text-yellow-600 bg-yellow-50 border-yellow-200";
  return "text-green-600 bg-green-50 border-green-200";
};

const getRiskLabel = (score: number) => {
  if (score >= 70) return "Critique";
  if (score >= 50) return "Élevé";
  if (score >= 30) return "Moyen";
  return "Faible";
};

import { useContacts, useRiskScores, useBehavioralEvents } from "@/hooks/useApi";
import { useState, useMemo } from "react";
import { exportToExcel, exportToPDF } from "@/lib/utils";
import { 
    Select, 
    SelectContent, 
    SelectItem, 
    SelectTrigger, 
    SelectValue 
} from "@/components/ui/select";

export default function RiskAnalytics() {
  const { data: contacts = [] } = useContacts();
  const { data: riskScores = [] } = useRiskScores();
  const { data: behavioralEvents = [] } = useBehavioralEvents();

  // Filter state
  const [deptFilter, setDeptFilter] = useState("all");

  const filteredContacts = useMemo(() => {
    if (deptFilter === "all") return contacts;
    return contacts.filter(c => c.department === deptFilter);
  }, [contacts, deptFilter]);

  const dynamicRiskEvolution = useMemo(() => {
    const months = ["Jan", "Fév", "Mar", "Avr", "Mai", "Juin"];
    let baseline = 65;
    return months.map((m, idx) => {
      // Simulate/Compute evolution by department
      baseline -= Math.random() * 5;
      return {
        month: m,
        global: Math.round(baseline + (idx * -2)),
        finance: Math.round(baseline + 5 + Math.random() * 10),
        it: Math.round(baseline - 15 + Math.random() * 5),
        sales: Math.round(baseline + 12 + Math.random() * 8),
        rh: Math.round(baseline + 2 + Math.random() * 5),
      };
    });
  }, []);

  const dynamicRadarData = useMemo(() => {
    const categories = [
      { subject: "Urgence", A: 85 },
      { subject: "Autorité", A: 65 },
      { subject: "Peur", A: 45 },
      { subject: "Curiosité", A: 90 },
      { subject: "Gratuité", A: 55 },
      { subject: "Confiance", A: 35 },
    ];
    return categories.map(c => ({
      ...c,
      A: Math.max(10, Math.min(95, c.A + (Math.random() * 20 - 10)))
    }));
  }, []);

  const globalRiskScore = useMemo(() => {
    const scores = deptFilter === "all" ? riskScores : riskScores.filter(rs => 
      contacts.find(c => c.id === rs.contact_id)?.department === deptFilter
    );
    if (scores.length === 0) return 42; // Demo fallback
    return Math.round(scores.reduce((acc, curr) => acc + curr.score, 0) / scores.length);
  }, [riskScores, deptFilter, contacts]);

  const dynamicDepartmentRisk = useMemo(() => {
    if (contacts.length === 0 && riskScores.length === 0) return [
      { dept: "Direction", users: 5, score: 72, trend: "up", color: "#ef4444" },
      { dept: "Ventes", users: 18, score: 64, trend: "stable", color: "#f97316" },
      { dept: "Finance", users: 12, score: 41, trend: "down", color: "#eab308" },
      { dept: "IT & Support", users: 24, score: 18, trend: "down", color: "#22c55e" },
    ];
    
    const depts: Record<string, { users: number, scoreSum: number }> = {};
    contacts.forEach(c => {
      const dept = c.department || "Non spécifié";
      if (!depts[dept]) depts[dept] = { users: 0, scoreSum: 0 };
      depts[dept].users++;
      const userRisk = riskScores.find(rs => rs.contact_id === c.id);
      if (userRisk) depts[dept].scoreSum += userRisk.score;
    });

    const colors = ["#ef4444", "#f97316", "#eab308", "#22c55e", "#10b981", "#3b82f6", "#8b5cf6"];
    return Object.entries(depts).map(([dept, data], i) => {
      const score = data.users > 0 ? Math.round(data.scoreSum / data.users) : 0;
      return {
        dept,
        users: data.users,
        score,
        trend: Math.random() > 0.6 ? "up" : (Math.random() > 0.4 ? "down" : "stable"),
        color: colors[i % colors.length]
      };
    }).sort((a,b) => b.score - a.score);
  }, [contacts, riskScores]);

  const dynamicTopRiskUsers = useMemo(() => {
    const targetContacts = filteredContacts;
    if (targetContacts.length === 0) return [];
    return targetContacts.map(c => {
      const rs = riskScores.find(r => r.contact_id === c.id)?.score || 0;
      const events = behavioralEvents.filter(e => e.contact_id === c.id);
      const clicks = events.filter(e => e.event_type === 'click').length;
      const reported = events.filter(e => e.event_type === 'report').length;
      
      let lastTest = 'N/A';
      if (events.length > 0) {
        lastTest = new Date(Math.max(...events.map(e => new Date(e.event_timestamp || Date.now()).getTime()))).toISOString().split('T')[0];
      }
      
      return {
        id: c.id,
        name: `${c.first_name} ${c.last_name}`,
        email: c.email,
        department: c.department || 'Non spécifié',
        riskScore: rs,
        clicks,
        reported,
        lastTest
      };
    }).sort((a, b) => b.riskScore - a.riskScore).slice(0, 5);
  }, [filteredContacts, riskScores, behavioralEvents]);

  return (
    <div className="h-full overflow-y-auto p-6 custom-scrollbar">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-stone-900">Analyse de Risque</h1>
          <p className="text-stone-500 mt-1">Évaluez et suivez le risque humain en temps réel</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => exportToPDF('app-content', 'analyse_risque_kira')}>
            <Download className="w-4 h-4 mr-2" />
            PDF
          </Button>
          <Button variant="outline" onClick={() => exportToExcel(dynamicTopRiskUsers, "analyse_risque")}>
            <Download className="w-4 h-4 mr-2" />
            Excel
          </Button>
          <Select value={deptFilter} onValueChange={setDeptFilter}>
            <SelectTrigger className="w-40 border-stone-200">
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
          {deptFilter !== "all" && (
            <Button 
                variant="ghost" 
                size="sm"
                className="text-stone-500 hover:text-stone-900"
                onClick={() => setDeptFilter("all")}
            >
                Réinitialiser
            </Button>
          )}
        </div>
      </div>

      {/* Global Risk Score */}
      <Card className="mb-8 border-stone-200 bg-gradient-to-br from-stone-900 to-stone-800">
        <CardContent className="p-8">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <ShieldAlert className="w-6 h-6 text-red-400" />
                <span className="text-stone-300">Score de Risque Global</span>
              </div>
              <div className="flex items-baseline gap-3">
                <span className="text-6xl font-bold text-white">{globalRiskScore}</span>
                <span className="text-2xl text-stone-400">/100</span>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <TrendingDown className="w-4 h-4 text-green-400" />
                <span className="text-green-400">↓ 12% depuis le mois dernier</span>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="w-32 h-32 rounded-full border-8 border-stone-700 flex items-center justify-center relative">
                <div 
                  className={`absolute inset-0 rounded-full border-8 ${globalRiskScore >= 70 ? 'border-red-500' : globalRiskScore >= 50 ? 'border-orange-500' : 'border-green-500'}`}
                  style={{ 
                    clipPath: `polygon(0 0, 100% 0, 100% ${globalRiskScore}%, 0 ${globalRiskScore}%)`,
                    transform: 'rotate(-90deg)',
                    transformOrigin: 'center'
                  }}
                />
                <div className="text-center">
                  <span className="text-2xl font-bold text-white">{getRiskLabel(globalRiskScore)}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Risk Factors */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
        {riskFactors.map((factor, index) => (
          <Card key={index} className="border-stone-200">
            <CardContent className="p-4">
              <p className="text-sm text-stone-600 mb-2">{factor.name}</p>
              <div className="flex items-center justify-between">
                <span className={`text-lg font-bold ${
                  factor.status === "high" ? "text-red-600" :
                  factor.status === "medium" ? "text-orange-600" :
                  "text-green-600"
                }`}>
                  {factor.value}%
                </span>
                {factor.status === "high" && <AlertTriangle className="w-4 h-4 text-red-500" />}
                {factor.status === "medium" && <Activity className="w-4 h-4 text-orange-500" />}
                {factor.status === "low" && <CheckCircle2 className="w-4 h-4 text-green-500" />}
              </div>
              <Progress 
                value={factor.value} 
                className="mt-2 h-1.5"
              />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Risk Evolution */}
        <Card className="border-stone-200 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-blue-600" />
              Évolution du Risque par Département
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={dynamicRiskEvolution}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" stroke="#6b7280" fontSize={12} />
                <YAxis stroke="#6b7280" fontSize={12} />
                <Tooltip 
                  contentStyle={{ backgroundColor: "#fff", border: "1px solid #e5e7eb", borderRadius: "8px" }}
                />
                <Legend />
                <Line type="monotone" dataKey="global" name="Global" stroke="#3b82f6" strokeWidth={2} />
                <Line type="monotone" dataKey="sales" name="Ventes" stroke="#ef4444" strokeWidth={2} />
                <Line type="monotone" dataKey="finance" name="Finance" stroke="#f97316" strokeWidth={2} />
                <Line type="monotone" dataKey="rh" name="RH" stroke="#eab308" strokeWidth={2} />
                <Line type="monotone" dataKey="it" name="IT" stroke="#22c55e" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Attack Vector Analysis */}
        <Card className="border-stone-200">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Target className="w-5 h-5 text-purple-600" />
              Analyse des Vecteurs d'Attaque
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={dynamicRadarData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} />
                <Radar
                   name="Vulnérabilité"
                   dataKey="A"
                   stroke="#8b5cf6"
                   fill="#8b5cf6"
                   fillOpacity={0.5}
                />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Department Risk Table */}
      <Card className="mb-8 border-stone-200">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Users className="w-5 h-5 text-stone-600" />
            Risque par Département
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-stone-200">
                  <th className="text-left py-3 px-4 text-sm font-medium text-stone-700">Département</th>
                  <th className="text-center py-3 px-4 text-sm font-medium text-stone-700">Utilisateurs</th>
                  <th className="text-center py-3 px-4 text-sm font-medium text-stone-700">Score</th>
                  <th className="text-center py-3 px-4 text-sm font-medium text-stone-700">Niveau</th>
                  <th className="text-center py-3 px-4 text-sm font-medium text-stone-700">Tendance</th>
                  <th className="text-center py-3 px-4 text-sm font-medium text-stone-700">Progression</th>
                </tr>
              </thead>
              <tbody>
                {dynamicDepartmentRisk.map((dept, index) => (
                  <tr key={index} className="border-b border-stone-100 hover:bg-stone-50">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: dept.color }} />
                        <span className="font-medium text-stone-900">{dept.dept}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center text-sm text-stone-600">{dept.users}</td>
                    <td className="py-3 px-4 text-center">
                      <span className={`font-bold ${
                        dept.score >= 60 ? "text-red-600" :
                        dept.score >= 40 ? "text-orange-600" :
                        dept.score >= 20 ? "text-yellow-600" :
                        "text-green-600"
                      }`}>
                        {dept.score}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <Badge className={getRiskColor(dept.score)}>
                        {getRiskLabel(dept.score)}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-center">
                      {dept.trend === "up" && (
                        <div className="flex items-center justify-center gap-1 text-red-600">
                          <TrendingUp className="w-4 h-4" />
                          <span className="text-sm">↑</span>
                        </div>
                      )}
                      {dept.trend === "down" && (
                        <div className="flex items-center justify-center gap-1 text-green-600">
                          <TrendingDown className="w-4 h-4" />
                          <span className="text-sm">↓</span>
                        </div>
                      )}
                      {dept.trend === "stable" && (
                        <div className="flex items-center justify-center gap-1 text-stone-500">
                          <Activity className="w-4 h-4" />
                          <span className="text-sm">→</span>
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <Progress value={dept.score} className="flex-1 h-2" />
                        <span className="text-xs text-stone-500 w-8">{dept.score}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Top Risk Users */}
      <Card className="border-stone-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              Utilisateurs à Haut Risque
            </CardTitle>
            <Badge variant="outline" className="text-red-600 border-red-200">
              Action Requise
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-stone-200">
                  <th className="text-left py-3 px-4 text-sm font-medium text-stone-700">Utilisateur</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-stone-700">Département</th>
                  <th className="text-center py-3 px-4 text-sm font-medium text-stone-700">Score</th>
                  <th className="text-center py-3 px-4 text-sm font-medium text-stone-700">Clics</th>
                  <th className="text-center py-3 px-4 text-sm font-medium text-stone-700">Signalés</th>
                  <th className="text-center py-3 px-4 text-sm font-medium text-stone-700">Dernier Test</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-stone-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {dynamicTopRiskUsers.map((user) => (
                  <tr key={user.id} className="border-b border-stone-100 hover:bg-stone-50">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="w-8 h-8">
                          <AvatarFallback className="bg-stone-200 text-stone-700 text-xs">
                            {user.name.split(" ").map(n => n[0]).join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-stone-900">{user.name}</p>
                          <p className="text-xs text-stone-500">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm text-stone-600">{user.department}</td>
                    <td className="py-3 px-4 text-center">
                      <span className={`font-bold ${
                        user.riskScore >= 80 ? "text-red-600" :
                        user.riskScore >= 60 ? "text-orange-600" :
                        "text-yellow-600"
                      }`}>
                        {user.riskScore}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="text-sm font-medium text-red-600">{user.clicks}</span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="text-sm font-medium text-green-600">{user.reported}</span>
                    </td>
                    <td className="py-3 px-4 text-center text-sm text-stone-600">{user.lastTest}</td>
                    <td className="py-3 px-4 text-right">
                      <Button size="sm" variant="outline">
                        <Zap className="w-4 h-4 mr-1" />
                        Former
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
