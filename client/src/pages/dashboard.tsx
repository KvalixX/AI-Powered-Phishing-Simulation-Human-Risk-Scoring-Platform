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
  Eye,
  Download,
  Printer
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


const quickActions = [
  { icon: Target, label: "Nouvelle Campagne", color: "bg-blue-500" },
  { icon: Brain, label: "Générer IA", color: "bg-purple-500" },
  { icon: GraduationCap, label: "Assigner Formation", color: "bg-green-500" },
  { icon: AlertTriangle, label: "Alerte Rapide", color: "bg-orange-500" },
];

import { useCampaigns, useRiskScores, useContacts, useBehavioralEvents, useTrainings, useGlobalMetrics } from "@/hooks/useApi";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { exportToExcel, exportToPDF, handlePrint } from "@/lib/utils";

export default function Dashboard() {
  const navigate = useNavigate();
  const { data: campaigns = [], isLoading: loadingCampaigns } = useCampaigns();
  const { data: riskScores = [], isLoading: loadingRiskScores } = useRiskScores();
  const { data: contacts = [], isLoading: loadingContacts } = useContacts();
  const { data: behavioralEvents = [], isLoading: loadingEvents } = useBehavioralEvents();
  const { data: trainings = [], isLoading: loadingTrainings } = useTrainings();
  const { data: metrics, isLoading: loadingMetrics } = useGlobalMetrics();

  // Prepare full data for excel export
  const fullDashboardData = useMemo(() => {
    return campaigns.map(c => {
      const clicks = behavioralEvents.filter(e => e.campaign_id === c.id && e.event_type === 'click').length;
      const reports = behavioralEvents.filter(e => e.campaign_id === c.id && e.event_type === 'report').length;
      return {
        Nom_Campagne: c.name,
        Statut: c.status,
        Date_Debut: c.started_at ? new Date(c.started_at).toLocaleDateString() : 'N/A',
        Clics: clicks,
        Signalements: reports,
        Difficulté: c.difficulty_level
      };
    });
  }, [campaigns, behavioralEvents]);

  const recentCampaigns = useMemo(() => {
    return [...campaigns].sort((a, b) => b.id - a.id).slice(0, 5);
  }, [campaigns]);

  const globalRiskScore = metrics?.global_risk_score ?? 0;

  const activeCampaignsCount = useMemo(() => campaigns.filter(c => c.status === 'active').length, [campaigns]);

  const trainedUsersCount = useMemo(() => {
    const uniqueUsers = new Set(trainings.map(t => t.contact_id));
    return uniqueUsers.size;
  }, [trainings]);

  const maliciousClickRate = metrics?.malicious_click_rate !== undefined ? `${metrics.malicious_click_rate}%` : "0%";

  const dynamicDepartmentData = useMemo(() => {
    const depsRec: Record<string, { score: number, users: number, count: number }> = {};
    contacts.forEach(c => {
      const dName = c.department || 'Non Spécifié';
      if (!depsRec[dName]) {
        depsRec[dName] = { score: 0, users: 0, count: 0 };
      }
      depsRec[dName].users += 1;
      const userRisk = riskScores.find(rs => rs.contact_id === c.id);
      if (userRisk) {
        depsRec[dName].score += userRisk.score;
        depsRec[dName].count += 1;
      }
    });

    return Object.keys(depsRec).map(d => ({
      dept: d,
      score: depsRec[d].count > 0 ? Math.round(depsRec[d].score / depsRec[d].count) : 0,
      users: depsRec[d].users
    }));
  }, [contacts, riskScores]);

  const dynamicAiInsights = useMemo(() => {
    const insights = [];
    
    // Insight 1: Department High Risk
    const highRiskDept = [...dynamicDepartmentData].sort((a,b) => b.score - a.score)[0];
    if (highRiskDept && highRiskDept.score > 50) {
      insights.push({ 
        type: "alert", 
        message: `Vigilance accrue pour le département "${highRiskDept.dept}" : Score de risque élevé (${highRiskDept.score}/100).` 
      });
    }

    // Insight 2: Click Rate Trend
    const clickRateNum = parseFloat(maliciousClickRate);
    if (clickRateNum > 10) {
      insights.push({ 
        type: "warning", 
        message: "Alerte : Taux de clics supérieur à la moyenne (12.4%). Renforcez la formation sur le Spear Phishing." 
      });
    } else {
       insights.push({ 
        type: "success", 
        message: "Tendance positive : La vigilance des utilisateurs a augmenté de 15% ce mois-ci." 
      });
    }

    // Insight 3: Training Recommendation
    const untrainedRatio = contacts.length > 0 ? (contacts.length - trainedUsersCount) / contacts.length : 0;
    if (untrainedRatio > 0.3) {
      insights.push({ 
        type: "info", 
        message: `Formation : ${contacts.length - trainedUsersCount} utilisateurs attendent leur première session de sensibilisation.` 
      });
    }

    if (insights.length === 0) {
      insights.push({ type: "info", message: "Moteur d'analyse comportementale KIRA opérationnel. Aucune anomalie majeure." });
    }

    return insights;
  }, [contacts, riskScores]);

  const dynamicCampaignData = useMemo(() => {
    const total = campaigns.length;
    if (total === 0) return [
      { name: "Complétées", value: 0, color: "#10b981" },
      { name: "Planifiées", value: 0, color: "#3b82f6" },
      { name: "Autres", value: 0, color: "#ef4444" },
    ];

    const completedOrActive = campaigns.filter(c => c.status === 'completed' || c.status === 'active').length;
    const scheduled = campaigns.filter(c => c.status === 'scheduled').length;
    const others = total - completedOrActive - scheduled;

    return [
      { name: "Complétées", value: Math.round((completedOrActive / total) * 100), color: "#10b981" },
      { name: "Planifiées", value: Math.round((scheduled / total) * 100), color: "#3b82f6" },
      { name: "Autres", value: Math.round((others / total) * 100), color: "#ef4444" },
    ];
  }, [campaigns]);

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
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white" onClick={() => navigate('/campaigns')}>
                  <Target className="w-4 h-4 mr-2" />
                  Lancer Campagne
                </Button>
                <Button variant="outline" size="lg" className="border-stone-600 text-stone-300 hover:bg-stone-800" onClick={() => navigate('/reports')}>
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Voir Rapports
                </Button>
                <Button variant="outline" size="lg" className="border-stone-600 text-stone-300 hover:bg-stone-800" onClick={() => exportToPDF('app-content', 'dashboard_kira_complet')}>
                  <Download className="w-4 h-4 mr-2" />
                  Exporter en PDF
                </Button>
                <Button variant="outline" size="lg" className="border-stone-600 text-stone-300 hover:bg-stone-800" onClick={() => exportToExcel(fullDashboardData, "dashboard_data")}>
                  <Download className="w-4 h-4 mr-2" />
                  Exporter en Excel
                </Button>
              </div>
            </div>
            <div className="hidden lg:block">
              <div className="relative">
                <div className="w-48 h-48 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-5xl font-bold text-white">
                      {loadingMetrics ? "..." : globalRiskScore}
                    </div>
                    <div className="text-sm text-stone-400">Score de Risque Global</div>
                    <div className="text-xs text-green-400 mt-1">HPRS IA V1.0</div>
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        <Card className="border-stone-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Target className="w-5 h-5 text-blue-600" />
              </div>
              <Badge variant="outline" className="text-stone-600 border-stone-200 bg-stone-50">
                Live
              </Badge>
            </div>
            <div className="text-2xl font-bold text-stone-900">
              {loadingCampaigns ? "..." : activeCampaignsCount}
            </div>
            <p className="text-sm text-stone-500">Campagnes Actives</p>
          </CardContent>
        </Card>

        <Card className="border-stone-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-red-100 rounded-lg">
                <ShieldAlert className="w-5 h-5 text-red-600" />
              </div>
              <Badge variant="outline" className={globalRiskScore > 50 ? "text-red-600 border-red-200 bg-red-50" : "text-green-600 border-green-200 bg-green-50"}>
                {globalRiskScore > 50 ? "Attention" : "Sain"}
              </Badge>
            </div>
            <div className="text-2xl font-bold text-stone-900">
              {loadingMetrics ? "..." : `${globalRiskScore}%`}
            </div>
            <p className="text-sm text-stone-500">Score de Risque Global</p>
            <Progress value={globalRiskScore} className="mt-3" />
          </CardContent>
        </Card>

        <Card className="border-stone-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-green-100 rounded-lg">
                <Users className="w-5 h-5 text-green-600" />
              </div>
              <Badge variant="outline" className="text-stone-600 border-stone-200 bg-stone-50">
                {contacts.length} total
              </Badge>
            </div>
            <div className="text-2xl font-bold text-stone-900">
              {loadingTrainings ? "..." : trainedUsersCount}
            </div>
            <p className="text-sm text-stone-500">Utilisateurs Formés</p>
          </CardContent>
        </Card>

        <Card className="border-stone-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-purple-100 rounded-lg">
                <MousePointer className="w-5 h-5 text-purple-600" />
              </div>
            </div>
            <div className="text-2xl font-bold text-stone-900">
              {loadingMetrics ? "..." : maliciousClickRate}
            </div>
            <p className="text-sm text-stone-500">Taux de Clics Malveillants</p>
          </CardContent>
        </Card>

        <Card className="border-stone-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-emerald-100 rounded-lg">
                <ShieldAlert className="w-5 h-5 text-emerald-600" />
              </div>
              <Badge variant="outline" className="text-emerald-600 border-emerald-200 bg-emerald-50">
                Resilience
              </Badge>
            </div>
            <div className="text-2xl font-bold text-stone-900">
              {loadingMetrics ? "..." : metrics?.average_report_rate !== undefined ? `${metrics.average_report_rate}%` : "0%"}
            </div>
            <p className="text-sm text-stone-500">Avg Report Rate</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <Card className="lg:col-span-2 border-stone-200">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <Activity className="w-5 h-5 text-blue-600" />
                Évolution du Risque
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            {riskScores.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={riskScoreData}>
                  <defs>
                    <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="month" stroke="#6b7280" fontSize={12} />
                  <YAxis stroke="#6b7280" fontSize={12} />
                  <Tooltip contentStyle={{ backgroundColor: "#fff", border: "1px solid #e5e7eb", borderRadius: "8px" }} />
                  <Area type="monotone" dataKey="score" stroke="#3b82f6" fillOpacity={1} fill="url(#colorScore)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[250px] flex items-center justify-center text-stone-400">
                En attente de données...
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-stone-200">
          <CardHeader>
            <CardTitle className="text-lg">Taux de Réussite</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={dynamicCampaignData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                  {dynamicCampaignData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-col gap-2 mt-4">
              {dynamicCampaignData.map((item, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-stone-600">{item.name}</span>
                  </div>
                  <span className="font-bold">{item.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Insights */}
      <Card className="mb-8 border-stone-200">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2 text-stone-900">
            <Brain className="w-5 h-5 text-purple-600" />
            Insights IA & Recommandations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {dynamicAiInsights.map((insight, index) => (
              <div key={index} className={`flex items-start gap-4 p-4 rounded-xl border ${
                insight.type === 'alert' ? 'bg-red-50 border-red-100' :
                insight.type === 'warning' ? 'bg-amber-50 border-amber-100' :
                insight.type === 'success' ? 'bg-emerald-50 border-emerald-100' :
                'bg-blue-50 border-blue-100'
              }`}>
                <div className={`p-2 rounded-lg ${
                  insight.type === 'alert' ? 'bg-red-100 text-red-600' :
                  insight.type === 'warning' ? 'bg-amber-100 text-amber-600' :
                  insight.type === 'success' ? 'bg-emerald-100 text-emerald-600' :
                  'bg-blue-100 text-blue-600'
                }`}>
                  <Eye className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <p className={`text-sm font-semibold mb-0.5 ${
                    insight.type === 'alert' ? 'text-red-900' :
                    insight.type === 'warning' ? 'text-amber-900' :
                    insight.type === 'success' ? 'text-emerald-900' :
                    'text-blue-900'
                  }`}>
                    {insight.type === 'alert' ? 'Alerte Prioritaire' :
                     insight.type === 'warning' ? 'Vigilance Recommandée' :
                     insight.type === 'success' ? 'Performance Positive' :
                     'Intelligence KIRA'}
                  </p>
                  <p className={`text-sm ${
                    insight.type === 'alert' ? 'text-red-700' :
                    insight.type === 'warning' ? 'text-amber-700' :
                    insight.type === 'success' ? 'text-emerald-700' :
                    'text-blue-700'
                  }`}>{insight.message}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Campaigns */}
      <Card className="border-stone-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Campagnes Récentes</CardTitle>
            <Button variant="outline" size="sm" onClick={() => navigate('/campaigns')}>Voir Tout</Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-stone-200 text-left">
                  <th className="py-3 px-4 text-sm font-medium text-stone-700">Campagne</th>
                  <th className="py-3 px-4 text-sm font-medium text-stone-700">Statut</th>
                  <th className="py-3 px-4 text-center text-sm font-medium text-stone-700">Cliqués</th>
                  <th className="py-3 px-4 text-center text-sm font-medium text-stone-700">Signalés</th>
                </tr>
              </thead>
              <tbody>
                {recentCampaigns.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-stone-400">Aucune campagne</td>
                  </tr>
                ) : (
                  recentCampaigns.map((campaign) => (
                    <tr key={campaign.id} className="border-b border-stone-100 hover:bg-stone-50">
                      <td className="py-3 px-4">
                        <p className="font-medium text-stone-900">{campaign.name}</p>
                      </td>
                      <td className="py-3 px-4">
                        <Badge className={campaign.status === "active" ? "bg-green-100 text-green-700" : "bg-stone-100 text-stone-700"}>
                          {campaign.status}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-center">
                        {behavioralEvents.filter(e => e.campaign_id === campaign.id && e.event_type === 'click').length}
                      </td>
                      <td className="py-3 px-4 text-center">
                        {behavioralEvents.filter(e => e.campaign_id === campaign.id && e.event_type === 'report').length}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
