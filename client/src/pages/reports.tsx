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

const monthlyData = [
  { month: "Jan", campaigns: 8, clicks: 180, reported: 120, trained: 45 },
  { month: "Fév", campaigns: 12, clicks: 165, reported: 135, trained: 52 },
  { month: "Mar", campaigns: 10, clicks: 145, reported: 148, trained: 58 },
  { month: "Avr", campaigns: 15, clicks: 130, reported: 165, trained: 65 },
  { month: "Mai", campaigns: 18, clicks: 110, reported: 180, trained: 72 },
  { month: "Juin", campaigns: 20, clicks: 95, reported: 195, trained: 78 },
];

const reports = [
  { 
    id: 1, 
    title: "Rapport Global - Q2 2024", 
    type: "executive",
    date: "2024-06-30",
    status: "ready",
    size: "2.4 MB",
    author: "Admin"
  },
  { 
    id: 2, 
    title: "Analyse Risque Département Ventes", 
    type: "department",
    date: "2024-06-15",
    status: "ready",
    size: "1.8 MB",
    author: "Sophie Martin"
  },
  { 
    id: 3, 
    title: "Campagne Email CEO - Juin 2024", 
    type: "campaign",
    date: "2024-06-10",
    status: "ready",
    size: "3.2 MB",
    author: "Pierre Durand"
  },
  { 
    id: 4, 
    title: "Progression Formation - Semaine 24", 
    type: "training",
    date: "2024-06-17",
    status: "generating",
    size: "--",
    author: "Marie Lefebvre"
  },
  { 
    id: 5, 
    title: "Comparatif Mensuel - Mai vs Juin", 
    type: "analytics",
    date: "2024-06-01",
    status: "ready",
    size: "1.5 MB",
    author: "Lucas Bernard"
  },
];

const kpis = [
  { label: "Taux de clic", value: "14.2%", change: "-3.5%", trend: "down", good: true },
  { label: "Taux de signalement", value: "68%", change: "+12%", trend: "up", good: true },
  { label: "Formation complétée", value: "78%", change: "+8%", trend: "up", good: true },
  { label: "Score de risque", value: "38/100", change: "-12%", trend: "down", good: true },
];

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

export default function Reports() {
  return (
    <div className="h-full overflow-y-auto p-6 custom-scrollbar">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-stone-900">Rapports & Analyses</h1>
          <p className="text-stone-500 mt-1">Générez et consultez des rapports détaillés sur vos campagnes</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            Filtrer
          </Button>
          <Button variant="outline">
            <Printer className="w-4 h-4 mr-2" />
            Imprimer
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <FileText className="w-4 h-4 mr-2" />
            Générer Rapport
          </Button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {kpis.map((kpi, index) => (
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
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={monthlyData}>
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
                    {reports.map((report) => (
                      <tr key={report.id} className="border-b border-stone-100 hover:bg-stone-50">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-100 rounded-lg">
                              <FileText className="w-4 h-4 text-blue-600" />
                            </div>
                            <div>
                              <p className="font-medium text-stone-900">{report.title}</p>
                              <p className="text-xs text-stone-500">ID: RPT-{report.id.toString().padStart(4, '0')}</p>
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
                            {report.date}
                          </div>
                        </td>
                        <td className="py-3 px-4 text-center text-sm text-stone-600">{report.author}</td>
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
                              disabled={report.status !== "ready"}
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
            <BarChart data={monthlyData}>
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
            <Button variant="outline" className="justify-start">
              <Download className="w-4 h-4 mr-2" />
              Exporter en PDF
            </Button>
            <Button variant="outline" className="justify-start">
              <Download className="w-4 h-4 mr-2" />
              Exporter en Excel
            </Button>
            <Button variant="outline" className="justify-start">
              <Share2 className="w-4 h-4 mr-2" />
              Partager par Email
            </Button>
            <Button variant="outline" className="justify-start">
              <Printer className="w-4 h-4 mr-2" />
              Imprimer
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
