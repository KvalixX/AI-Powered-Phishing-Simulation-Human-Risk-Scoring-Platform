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
  Download,
  Filter
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

const riskEvolutionData = [
  { month: "Jan", global: 65, it: 30, finance: 70, rh: 55, sales: 80 },
  { month: "Fév", global: 58, it: 28, finance: 65, rh: 50, sales: 75 },
  { month: "Mar", global: 52, it: 25, finance: 60, rh: 45, sales: 70 },
  { month: "Avr", global: 48, it: 22, finance: 55, rh: 42, sales: 65 },
  { month: "Mai", global: 42, it: 20, finance: 50, rh: 38, sales: 60 },
  { month: "Juin", global: 38, it: 18, finance: 45, rh: 35, sales: 55 },
];

const radarData = [
  { subject: 'Email Phishing', A: 45, fullMark: 100 },
  { subject: 'Social Eng.', A: 60, fullMark: 100 },
  { subject: 'Malware', A: 30, fullMark: 100 },
  { subject: 'Credential', A: 55, fullMark: 100 },
  { subject: 'Urgency', A: 40, fullMark: 100 },
  { subject: 'Pretexting', A: 50, fullMark: 100 },
];

const topRiskUsers = [
  { id: 1, name: "Sophie Martin", email: "sophie.martin@company.com", department: "Ventes", riskScore: 85, clicks: 12, reported: 2, lastTest: "2024-06-10" },
  { id: 2, name: "Pierre Durand", email: "pierre.durand@company.com", department: "Finance", riskScore: 78, clicks: 9, reported: 1, lastTest: "2024-06-08" },
  { id: 3, name: "Marie Lefebvre", email: "marie.lefebvre@company.com", department: "RH", riskScore: 72, clicks: 8, reported: 3, lastTest: "2024-06-05" },
  { id: 4, name: "Lucas Bernard", email: "lucas.bernard@company.com", department: "Ventes", riskScore: 68, clicks: 7, reported: 1, lastTest: "2024-06-03" },
  { id: 5, name: "Emma Petit", email: "emma.petit@company.com", department: "Marketing", riskScore: 65, clicks: 6, reported: 4, lastTest: "2024-06-01" },
];

const departmentRisk = [
  { dept: "Ventes", score: 62, users: 52, trend: "up", color: "#ef4444" },
  { dept: "Finance", score: 55, users: 28, trend: "down", color: "#f97316" },
  { dept: "Marketing", score: 48, users: 38, trend: "down", color: "#eab308" },
  { dept: "RH", score: 42, users: 32, trend: "stable", color: "#22c55e" },
  { dept: "IT", score: 25, users: 45, trend: "down", color: "#10b981" },
];

const riskFactors = [
  { name: "Fréquence de clic", value: 45, status: "medium" },
  { name: "Délai de réaction", value: 72, status: "high" },
  { name: "Signalement", value: 35, status: "low" },
  { name: "Connaissance", value: 58, status: "medium" },
  { name: "Exposition", value: 65, status: "high" },
];

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

export default function RiskAnalytics() {
  return (
    <div className="h-full overflow-y-auto p-6 custom-scrollbar">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-stone-900">Analyse de Risque</h1>
          <p className="text-stone-500 mt-1">Évaluez et suivez le risque humain en temps réel</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            Filtrer
          </Button>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Exporter
          </Button>
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
                <span className="text-6xl font-bold text-white">38</span>
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
                  className="absolute inset-0 rounded-full border-8 border-green-500"
                  style={{ 
                    clipPath: `polygon(0 0, 100% 0, 100% ${38}%, 0 ${38}%)`,
                    transform: 'rotate(-90deg)',
                    transformOrigin: 'center'
                  }}
                />
                <div className="text-center">
                  <span className="text-2xl font-bold text-white">Faible</span>
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
        <Card className="border-stone-200">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              Évolution du Risque par Département
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={riskEvolutionData}>
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
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} />
                <Radar
                  name="Vulnérabilité"
                  dataKey="A"
                  stroke="#3b82f6"
                  fill="#3b82f6"
                  fillOpacity={0.3}
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
                {departmentRisk.map((dept, index) => (
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
                {topRiskUsers.map((user) => (
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
