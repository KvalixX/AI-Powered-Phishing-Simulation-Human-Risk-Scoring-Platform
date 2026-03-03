import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Target, 
  ShieldAlert, 
  Users, 
  TrendingUp, 
  Brain,
  Mail,
  MousePointer,
  GraduationCap,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Zap,
  BarChart3,
  Activity,
  Lock,
  Eye
} from "lucide-react";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend
} from "recharts";

const riskScoreData = [
  { month: "Jan", score: 65 },
  { month: "Fév", score: 58 },
  { month: "Mar", score: 52 },
  { month: "Avr", score: 48 },
  { month: "Mai", score: 42 },
  { month: "Juin", score: 38 },
];

const campaignData = [
  { name: "Réussis", value: 65, color: "#10b981" },
  { name: "Échoués", value: 35, color: "#ef4444" },
];

const departmentData = [
  { dept: "IT", score: 25, users: 45 },
  { dept: "RH", score: 42, users: 32 },
  { dept: "Finance", score: 55, users: 28 },
  { dept: "Marketing", score: 48, users: 38 },
  { dept: "Ventes", score: 62, users: 52 },
];

const recentCampaigns = [
  { id: 1, name: "Campagne Q2 - Email CEO", status: "active", sent: 245, opened: 189, clicked: 67, reported: 23 },
  { id: 2, name: "Test Login Microsoft", status: "completed", sent: 150, opened: 134, clicked: 45, reported: 89 },
  { id: 3, name: "Fausse Facture", status: "scheduled", sent: 0, opened: 0, clicked: 0, reported: 0 },
];

const aiInsights = [
  { type: "warning", message: "Le département Ventes montre une vulnérabilité accrue de 15% ce mois" },
  { type: "success", message: "Amélioration de 23% dans la détection des emails suspects" },
  { type: "info", message: "Nouveau modèle de phishing détecté: fausses mises à jour Zoom" },
];

const quickActions = [
  { icon: Target, label: "Nouvelle Campagne", color: "bg-blue-500" },
  { icon: Brain, label: "Générer IA", color: "bg-purple-500" },
  { icon: GraduationCap, label: "Assigner Formation", color: "bg-green-500" },
  { icon: AlertTriangle, label: "Alerte Rapide", color: "bg-orange-500" },
];

export default function Dashboard() {
  return (
    <div className="h-full overflow-y-auto p-6 custom-scrollbar">
      {/* Hero Section */}
      <Card className="relative mb-8 border border-stone-200 bg-gradient-to-br from-stone-900 to-stone-800 overflow-hidden">
        <div className="relative p-8">
          <div className="flex items-center justify-between">
            <div className="max-w-2xl">
              <div className="flex items-center gap-2 mb-4">
                <Brain className="w-6 h-6 text-blue-400" />
                <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">IA Générative</Badge>
              </div>
              <h1 className="text-3xl font-bold text-white mb-3">
                Simulation de Phishing Intelligente
              </h1>
              <p className="text-stone-300 text-lg mb-6 leading-relaxed">
                Évaluez le risque humain avec des campagnes réalistes générées par IA, 
                mesurez les comportements et formez automatiquement vos équipes.
              </p>
              <div className="flex gap-3">
                <Button 
                  size="lg"
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Target className="w-4 h-4 mr-2" />
                  Lancer Campagne
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  className="border-stone-600 text-stone-300 hover:bg-stone-800"
                >
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Voir Rapports
                </Button>
              </div>
            </div>
            <div className="hidden lg:block">
              <div className="relative">
                <div className="w-48 h-48 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-5xl font-bold text-white">38</div>
                    <div className="text-sm text-stone-400">Score de Risque</div>
                    <div className="text-xs text-green-400 mt-1">↓ 12% ce mois</div>
                  </div>
                </div>
                <div className="absolute -top-2 -right-2">
                  <div className="w-4 h-4 bg-green-500 rounded-full animate-pulse" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {quickActions.map((action, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow cursor-pointer border-stone-200">
            <CardContent className="p-4 flex items-center gap-3">
              <div className={`${action.color} p-3 rounded-lg`}>
                <action.icon className="w-5 h-5 text-white" />
              </div>
              <span className="font-medium text-stone-700">{action.label}</span>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="border-stone-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Target className="w-5 h-5 text-blue-600" />
              </div>
              <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">
                +3 ce mois
              </Badge>
            </div>
            <div className="text-2xl font-bold text-stone-900">12</div>
            <p className="text-sm text-stone-500">Campagnes Actives</p>
          </CardContent>
        </Card>

        <Card className="border-stone-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-red-100 rounded-lg">
                <ShieldAlert className="w-5 h-5 text-red-600" />
              </div>
              <Badge variant="outline" className="text-red-600 border-red-200 bg-red-50">
                Attention
              </Badge>
            </div>
            <div className="text-2xl font-bold text-stone-900">38%</div>
            <p className="text-sm text-stone-500">Score de Risque Global</p>
            <Progress value={38} className="mt-3" />
          </CardContent>
        </Card>

        <Card className="border-stone-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-green-100 rounded-lg">
                <Users className="w-5 h-5 text-green-600" />
              </div>
              <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">
                98% couverture
              </Badge>
            </div>
            <div className="text-2xl font-bold text-stone-900">1,247</div>
            <p className="text-sm text-stone-500">Utilisateurs Formés</p>
          </CardContent>
        </Card>

        <Card className="border-stone-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-purple-100 rounded-lg">
                <MousePointer className="w-5 h-5 text-purple-600" />
              </div>
              <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">
                ↓ 8%
              </Badge>
            </div>
            <div className="text-2xl font-bold text-stone-900">14.2%</div>
            <p className="text-sm text-stone-500">Taux de Clics Malveillants</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Risk Score Trend */}
        <Card className="lg:col-span-2 border-stone-200">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <Activity className="w-5 h-5 text-blue-600" />
                Évolution du Score de Risque
              </CardTitle>
              <Badge variant="outline">6 derniers mois</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={riskScoreData}>
                <defs>
                  <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" stroke="#6b7280" fontSize={12} />
                <YAxis stroke="#6b7280" fontSize={12} />
                <Tooltip 
                  contentStyle={{ backgroundColor: "#fff", border: "1px solid #e5e7eb", borderRadius: "8px" }}
                />
                <Area 
                  type="monotone" 
                  dataKey="score" 
                  stroke="#3b82f6" 
                  fillOpacity={1} 
                  fill="url(#colorScore)" 
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Campaign Success Rate */}
        <Card className="border-stone-200">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
              Taux de Réussite
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={campaignData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {campaignData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-center gap-4 mt-4">
              {campaignData.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-sm text-stone-600">{item.name}: {item.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Insights */}
      <Card className="mb-8 border-stone-200">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Brain className="w-5 h-5 text-purple-600" />
            Insights IA
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {aiInsights.map((insight, index) => (
              <div 
                key={index} 
                className={`flex items-start gap-3 p-3 rounded-lg ${
                  insight.type === "warning" ? "bg-amber-50 border border-amber-200" :
                  insight.type === "success" ? "bg-green-50 border border-green-200" :
                  "bg-blue-50 border border-blue-200"
                }`}
              >
                {insight.type === "warning" && <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5" />}
                {insight.type === "success" && <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5" />}
                {insight.type === "info" && <Eye className="w-5 h-5 text-blue-600 mt-0.5" />}
                <p className={`text-sm ${
                  insight.type === "warning" ? "text-amber-800" :
                  insight.type === "success" ? "text-green-800" :
                  "text-blue-800"
                }`}>
                  {insight.message}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Department Risk Analysis */}
      <Card className="mb-8 border-stone-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <Lock className="w-5 h-5 text-red-600" />
              Risque par Département
            </CardTitle>
            <Button variant="outline" size="sm">
              <TrendingUp className="w-4 h-4 mr-2" />
              Exporter
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={departmentData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="dept" stroke="#6b7280" fontSize={12} />
              <YAxis stroke="#6b7280" fontSize={12} />
              <Tooltip 
                contentStyle={{ backgroundColor: "#fff", border: "1px solid #e5e7eb", borderRadius: "8px" }}
              />
              <Legend />
              <Bar dataKey="score" name="Score de Risque" fill="#ef4444" radius={[4, 4, 0, 0]} />
              <Bar dataKey="users" name="Utilisateurs" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Recent Campaigns */}
      <Card className="mb-8 border-stone-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <Mail className="w-5 h-5 text-blue-600" />
              Campagnes Récentes
            </CardTitle>
            <Button variant="outline" size="sm">Voir Tout</Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-stone-200">
                  <th className="text-left py-3 px-4 text-sm font-medium text-stone-700">Campagne</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-stone-700">Statut</th>
                  <th className="text-center py-3 px-4 text-sm font-medium text-stone-700">Envoyés</th>
                  <th className="text-center py-3 px-4 text-sm font-medium text-stone-700">Ouverts</th>
                  <th className="text-center py-3 px-4 text-sm font-medium text-stone-700">Cliqués</th>
                  <th className="text-center py-3 px-4 text-sm font-medium text-stone-700">Signalés</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-stone-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {recentCampaigns.map((campaign) => (
                  <tr key={campaign.id} className="border-b border-stone-100 hover:bg-stone-50">
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-medium text-stone-900">{campaign.name}</p>
                        <p className="text-xs text-stone-500">ID: #{campaign.id.toString().padStart(4, '0')}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <Badge 
                        className={
                          campaign.status === "active" ? "bg-green-100 text-green-700" :
                          campaign.status === "completed" ? "bg-blue-100 text-blue-700" :
                          "bg-amber-100 text-amber-700"
                        }
                      >
                        {campaign.status === "active" ? "Active" :
                         campaign.status === "completed" ? "Terminée" : "Planifiée"}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-center text-sm text-stone-600">{campaign.sent}</td>
                    <td className="py-3 px-4 text-center text-sm text-stone-600">{campaign.opened}</td>
                    <td className="py-3 px-4 text-center">
                      <span className={`text-sm font-medium ${campaign.clicked > 50 ? 'text-red-600' : 'text-stone-600'}`}>
                        {campaign.clicked}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="text-sm font-medium text-green-600">{campaign.reported}</span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Button variant="ghost" size="sm">Détails</Button>
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

