import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  FileText, 
  Download, 
  Calendar,
  TrendingUp,
  TrendingDown,
  Target,
  Users,
  Shield,
  CheckCircle2,
  Clock,
  Filter,
  MoreVertical,
  Share2,
  Printer
} from "lucide-react";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts";

const typeColors = {
  executive: "bg-blue-100 text-blue-700",
  department: "bg-purple-100 text-purple-700",
  campaign: "bg-green-100 text-green-700",
  training: "bg-orange-100 text-orange-700",
  analytics: "bg-stone-100 text-stone-700"
};

const typeLabels = {
  executive: "Exécutif",
  department: "Département",
  campaign: "Campagne",
  training: "Formation",
  analytics: "Analytique"
};

import { useMemo, useState } from "react";
import { useReports, useDownloadReport, useCampaigns, useBehavioralEvents, useTrainings, useContacts, useRiskScores } from "@/hooks/useApi";
import { exportToExcel, exportToPDF, handlePrint } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export default function Reports() {
  const { toast } = useToast();
  const { data: reports = [] } = useReports();
  const downloadReport = useDownloadReport();
  const { data: campaigns = [] } = useCampaigns();
  const { data: events = [] } = useBehavioralEvents();
  const { data: trainings = [] } = useTrainings();
  const { data: contacts = [] } = useContacts();
  const { data: riskScores = [] } = useRiskScores();
  
  // Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");

  // Combine data for a comprehensive export
  const allReportsData = useMemo(() => {
    return reports.map(r => {
      const campaign = campaigns.find(c => c.id === r.campaign_id);
      return {
        ...r,
        campaign_name: campaign?.name || 'N/A',
        total_recipients: campaign?.recipients || 0,
        clicks: events.filter(e => e.campaign_id === r.campaign_id && e.event_type === 'click').length
      };
    });
  }, [reports, campaigns, events]);

  const filteredReports = useMemo(() => {
    return allReportsData.filter(report => {
      const matchesSearch = report.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = typeFilter === "all" || report.type === typeFilter;
      return matchesSearch && matchesType;
    });
  }, [allReportsData, searchQuery, typeFilter]);

  const dynamicKPIs = useMemo(() => {
    if (events.length === 0 && trainings.length === 0) return [];
    
    const clickCount = events.filter(e => e.event_type === 'click').length;
    const reportCount = events.filter(e => e.event_type === 'report').length;
    
    // Simulate some real rate, if no events pretend a low baseline
    const clickRate = events.length > 0 ? ((clickCount / events.length) * 100).toFixed(1) : "0.0";
    const reportRate = events.length > 0 ? ((reportCount / events.length) * 100).toFixed(1) : "0.0";
    
    const completedTrainings = trainings.filter(t => t.completed).length;
    const trainingRate = trainings.length > 0 ? Math.round((completedTrainings / trainings.length) * 100) : 0;
    
    const avgScore = riskScores.length > 0 ? Math.round(riskScores.reduce((acc, curr) => acc + curr.score, 0) / riskScores.length) : 0;

    return [
      { label: "Taux de clic", value: `${clickRate}%`, change: "En direct", trend: clickRate > "10" ? "up" : "down", good: clickRate <= "10" },
      { label: "Taux de signalement", value: `${reportRate}%`, change: "En direct", trend: reportRate > "15" ? "up" : "down", good: reportRate > "15" },
      { label: "Formation complétée", value: `${trainingRate}%`, change: "En direct", trend: "up", good: trainingRate > 50 },
      { label: "Score de risque", value: `${avgScore}/100`, change: "En direct", trend: avgScore > 50 ? "up" : "down", good: avgScore <= 50 },
    ];
  }, [events, trainings, riskScores]);

  const dynamicMonthlyData = useMemo(() => {
    if (events.length === 0 && campaigns.length === 0) return [];

    const monthMap = new Map();
    // Default 6 months prior
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const mStr = d.toLocaleString('fr-FR', { month: 'short' });
      const monthKey = `${d.getFullYear()}-${d.getMonth()}`;
      monthMap.set(monthKey, { month: mStr.charAt(0).toUpperCase() + mStr.slice(1), campaigns: 0, clicks: 0, reported: 0, trained: 0, dateKey: monthKey });
    }

    events.forEach(e => {
      const d = new Date(e.event_timestamp || Date.now());
      const monthKey = `${d.getFullYear()}-${d.getMonth()}`;
      if (monthMap.has(monthKey)) {
        const entry = monthMap.get(monthKey);
        if (e.event_type === 'click') entry.clicks++;
        if (e.event_type === 'report') entry.reported++;
      }
    });

    campaigns.forEach(c => {
      const d = new Date(c.started_at || Date.now());
      const monthKey = `${d.getFullYear()}-${d.getMonth()}`;
      if (monthMap.has(monthKey)) {
        monthMap.get(monthKey).campaigns++;
      }
    });

    trainings.forEach(t => {
      if (t.completed) {
        const d = new Date(t.updated_at);
        const monthKey = `${d.getFullYear()}-${d.getMonth()}`;
        if (monthMap.has(monthKey)) monthMap.get(monthKey).trained++;
      }
    });

    return Array.from(monthMap.values());
  }, [events, campaigns, trainings]);

  return (
    <div className="h-full overflow-y-auto p-6 custom-scrollbar">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-stone-900">Rapports & Analyses</h1>
          <p className="text-stone-500 mt-1">Générez et consultez des rapports détaillés sur vos campagnes</p>
        </div>
        <div className="flex gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-stone-400 w-4 h-4" />
            <Input 
              placeholder="Rechercher un rapport..." 
              className="pl-10 w-64"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-40">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les types</SelectItem>
              <SelectItem value="executive">Exécutif</SelectItem>
              <SelectItem value="department">Département</SelectItem>
              <SelectItem value="campaign">Campagne</SelectItem>
              <SelectItem value="training">Formation</SelectItem>
              <SelectItem value="analytics">Analytique</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={handlePrint}>
            <Printer className="w-4 h-4 mr-2" />
            Imprimer
          </Button>
          <Button 
            className="bg-blue-600 hover:bg-blue-700"
            onClick={() => toast({ title: "Génération en cours", description: "Votre rapport est en train d'être généré..." })}
          >
            <FileText className="w-4 h-4 mr-2" />
            Générer Rapport
          </Button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {dynamicKPIs.map((kpi, index) => (
          <Card key={index} className="border-stone-200">
            <CardContent className="p-6">
              <p className="text-sm text-stone-500 mb-2">{kpi.label}</p>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-stone-900">{kpi.value}</span>
                <span className={`text-sm flex items-center gap-1 ${kpi.good ? 'text-green-600' : 'text-red-600'}`}>
                  {kpi.trend === "up" ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  {kpi.change}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <Card className="mb-8 border-stone-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              Performance sur 6 mois
            </CardTitle>
            <div className="flex gap-2">
              <Select defaultValue="6months">
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Période" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="30days">30 jours</SelectItem>
                  <SelectItem value="3months">3 mois</SelectItem>
                  <SelectItem value="6months">6 mois</SelectItem>
                  <SelectItem value="1year">1 an</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm" onClick={() => exportToExcel(dynamicMonthlyData, "performance_6_mois")}>
                <Download className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={dynamicMonthlyData}>
              <defs>
                <linearGradient id="colorClicks" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorReported" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" stroke="#6b7280" fontSize={12} />
              <YAxis stroke="#6b7280" fontSize={12} />
              <Tooltip 
                contentStyle={{ backgroundColor: "#fff", border: "1px solid #e5e7eb", borderRadius: "8px" }}
              />
              <Legend />
              <Area 
                type="monotone" 
                dataKey="clicks" 
                name="Clics malveillants"
                stroke="#ef4444" 
                fillOpacity={1} 
                fill="url(#colorClicks)" 
                strokeWidth={2}
              />
              <Area 
                type="monotone" 
                dataKey="reported" 
                name="Emails signalés"
                stroke="#22c55e" 
                fillOpacity={1} 
                fill="url(#colorReported)" 
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="reports" className="mb-6">
        <TabsList>
          <TabsTrigger value="reports">Rapports Générés</TabsTrigger>
          <TabsTrigger value="scheduled">Planifiés</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
        </TabsList>

        <TabsContent value="reports" className="mt-6">
          <Card className="border-stone-200">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-stone-200 bg-stone-50">
                      <th className="text-left py-3 px-4 text-sm font-medium text-stone-700">Rapport</th>
                      <th className="text-center py-3 px-4 text-sm font-medium text-stone-700">Type</th>
                      <th className="text-center py-3 px-4 text-sm font-medium text-stone-700">Date</th>
                      <th className="text-center py-3 px-4 text-sm font-medium text-stone-700">Auteur</th>
                      <th className="text-center py-3 px-4 text-sm font-medium text-stone-700">Taille</th>
                      <th className="text-center py-3 px-4 text-sm font-medium text-stone-700">Statut</th>
                      <th className="text-right py-3 px-4 text-sm font-medium text-stone-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredReports.map((report) => (
                      <tr key={report.id} className="border-b border-stone-100 hover:bg-stone-50">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-100 rounded-lg">
                              <FileText className="w-4 h-4 text-blue-600" />
                            </div>
                            <div>
                              <p className="font-medium text-stone-900">{report.title}</p>
                              <p className="text-xs text-stone-500">ID: RPT-{report.id}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <Badge className={typeColors[report.type as keyof typeof typeColors]}>
                            {typeLabels[report.type as keyof typeof typeLabels]}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-center text-sm text-stone-600">
                          <div className="flex items-center justify-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {new Date(report.date).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="py-3 px-4 text-center text-sm text-stone-600">
                          {report.author?.name || 'Admin'}
                        </td>
                        <td className="py-3 px-4 text-center text-sm text-stone-600">{report.size}</td>
                        <td className="py-3 px-4 text-center">
                          {report.status === "ready" ? (
                            <Badge className="bg-green-100 text-green-700">
                              <CheckCircle2 className="w-3 h-3 mr-1" />
                              Prêt
                            </Badge>
                          ) : (
                            <Badge className="bg-amber-100 text-amber-700">
                              <Clock className="w-3 h-3 mr-1" />
                              Génération...
                            </Badge>
                          )}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              disabled={report.status !== "ready" || downloadReport.isPending}
                              onClick={() => downloadReport.mutate(report.id)}
                            >
                              <Download className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Share2 className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="scheduled" className="mt-6">
          <Card className="border-stone-200">
            <CardContent className="p-12 text-center">
              <Clock className="w-12 h-12 text-stone-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-stone-900 mb-2">Rapports Planifiés</h3>
              <p className="text-stone-500 mb-4">Planifiez des rapports récurrents pour un suivi automatique</p>
              <Button variant="outline">
                <Calendar className="w-4 h-4 mr-2" />
                Planifier un rapport
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { title: "Rapport Exécutif", desc: "Vue d'ensemble pour la direction", icon: Target },
              { title: "Analyse Département", desc: "Focus sur un département spécifique", icon: Users },
              { title: "Rapport de Campagne", desc: "Résultats d'une campagne spécifique", icon: Shield },
              { title: "Progression Formation", desc: "Suivi des formations assignées", icon: CheckCircle2 },
              { title: "Analyse Comportementale", desc: "Détail des comportements utilisateurs", icon: TrendingUp },
              { title: "Rapport de Conformité", desc: "Conformité et audit de sécurité", icon: FileText },
            ].map((template, index) => (
              <Card key={index} className="border-stone-200 hover:border-blue-300 cursor-pointer transition-colors">
                <CardContent className="p-6">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <template.icon className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-stone-900">{template.title}</h4>
                      <p className="text-sm text-stone-500 mt-1">{template.desc}</p>
                      <Button variant="link" size="sm" className="mt-2 p-0 h-auto">
                        Utiliser template
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Campaign Effectiveness */}
      <Card className="mb-8 border-stone-200">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Target className="w-5 h-5 text-green-600" />
            Efficacité des Campagnes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={dynamicMonthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" stroke="#6b7280" fontSize={12} />
              <YAxis stroke="#6b7280" fontSize={12} />
              <Tooltip 
                contentStyle={{ backgroundColor: "#fff", border: "1px solid #e5e7eb", borderRadius: "8px" }}
              />
              <Legend />
              <Bar dataKey="campaigns" name="Campagnes lancées" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="trained" name="Utilisateurs formés" fill="#10b981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Export Options */}
      <Card className="border-stone-200">
        <CardHeader>
          <CardTitle className="text-lg">Options d'Export</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Button variant="outline" className="justify-start" onClick={() => exportToPDF('app-content', 'rapport_phishing_complet')}>
              <Download className="w-4 h-4 mr-2" />
              Exporter en PDF
            </Button>
            <Button variant="outline" className="justify-start" onClick={() => exportToExcel(filteredReports, "rapports_phishing_filtres")}>
              <Download className="w-4 h-4 mr-2" />
              Exporter en Excel
            </Button>
            <Button variant="outline" className="justify-start">
              <Share2 className="w-4 h-4 mr-2" />
              Partager par Email
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
