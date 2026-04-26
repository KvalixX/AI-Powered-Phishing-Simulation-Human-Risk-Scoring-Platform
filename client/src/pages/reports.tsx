import { useMemo, useState, useRef, useEffect } from "react";
import { 
  useReports, 
  useDownloadReport, 
  useDeleteReport, 
  useCreateReport, 
  useCampaigns, 
  useBehavioralEvents, 
  useTrainings, 
  useContacts, 
  useRiskScores 
} from "@/hooks/useApi";
import { exportToExcel, exportToPDF, handlePrint } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
  Printer,
  Building,
  Search,
  Plus,
  AlertCircle,
  Trash2
} from "lucide-react";
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
  analytics: "bg-stone-100 text-stone-700",
  complet: "bg-indigo-600 text-white font-bold"
};

const typeLabels = {
  executive: "Exécutif",
  department: "Département",
  campaign: "Campagne",
  training: "Formation",
  analytics: "Analytique",
  complet: "Rapport Complet"
};

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

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
  const [deptFilter, setDeptFilter] = useState("all");
  const [periodFilter, setPeriodFilter] = useState("6months");

  // Selection & Pagination State
  const [selectedReports, setSelectedReports] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  // Create Report Modal State
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newReport, setNewReport] = useState({ title: "", type: "executive" });
  
  // Delete Confirmation State
  const [reportToDelete, setReportToDelete] = useState<number | null>(null);
  const [isBulkDeleteAlertOpen, setIsBulkDeleteAlertOpen] = useState(false);
  const [isDeleteAllAlertOpen, setIsDeleteAllAlertOpen] = useState(false);

  const createReport = useCreateReport();
  const deleteReport = useDeleteReport();

  const uniqueDepartments = useMemo(() => {
    const depts = new Set<string>();
    contacts.forEach(c => {
      if (c.department) depts.add(c.department);
    });
    return Array.from(depts).sort();
  }, [contacts]);

  const isWithinPeriod = (dateStr: string | null | undefined) => {
    if (!dateStr) return false;
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = diffMs / (1000 * 60 * 60 * 24);

    if (periodFilter === "30days") return diffDays <= 30;
    if (periodFilter === "90days") return diffDays <= 90;
    if (periodFilter === "6months") return diffDays <= 180;
    if (periodFilter === "1year") return diffDays <= 365;
    return true;
  };

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
      const matchesPeriod = isWithinPeriod(report.date);
      const matchesDept = deptFilter === "all" || report.title.toLowerCase().includes(deptFilter.toLowerCase());
      
      return matchesSearch && matchesPeriod && matchesDept;
    });
  }, [allReportsData, searchQuery, deptFilter, periodFilter]);

  // Pagination logic
  const totalPages = Math.ceil(filteredReports.length / pageSize);
  const paginatedReports = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredReports.slice(start, start + pageSize);
  }, [filteredReports, currentPage, pageSize]);

  // Reset pagination on filter change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, deptFilter, periodFilter]);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedReports(paginatedReports.map(r => r.id));
    } else {
      setSelectedReports([]);
    }
  };

  const handleSelectOne = (id: number, checked: boolean) => {
    if (checked) {
      setSelectedReports(prev => [...prev, id]);
    } else {
      setSelectedReports(prev => prev.filter(item => item !== id));
    }
  };

  const handleBulkDelete = async () => {
    try {
      toast({ title: "Suppression", description: `Suppression de ${selectedReports.length} rapports...` });
      await Promise.all(selectedReports.map(id => deleteReport.mutateAsync(id)));
      setSelectedReports([]);
      setIsBulkDeleteAlertOpen(false);
      toast({ title: "Succès", description: "Les rapports ont été supprimés." });
    } catch (error) {
      toast({ title: "Erreur", description: "Échec de la suppression groupée.", variant: "destructive" });
    }
  };

  const handleDeleteAll = async () => {
    try {
      toast({ title: "Suppression", description: "Suppression de tous les rapports..." });
      await Promise.all(reports.map(r => deleteReport.mutateAsync(r.id)));
      setIsDeleteAllAlertOpen(false);
      toast({ title: "Succès", description: "Tous les rapports ont été supprimés." });
    } catch (error) {
      toast({ title: "Erreur", description: "Échec de la suppression globale.", variant: "destructive" });
    }
  };

  const handleCreateReport = async () => {
    if (!newReport.title) {
      toast({ title: "Erreur", description: "Veuillez donner un titre au rapport", variant: "destructive" });
      return;
    }

    // Calculate estimated PDF size based on real data volume
    const estimatedBytes =
      220_000 +                          // base template
      campaigns.length * 2_500 +         // ~2.5 KB per campaign row
      events.length * 600 +              // ~0.6 KB per event
      contacts.length * 1_200 +          // ~1.2 KB per contact row
      trainings.length * 700 +           // ~0.7 KB per training
      riskScores.length * 500 +          // ~0.5 KB per risk score
      reports.length * 400;              // ~0.4 KB per report row

    const formatSize = (bytes: number) => {
      if (bytes >= 1_000_000) return (bytes / 1_000_000).toFixed(1) + " MB";
      return Math.round(bytes / 1_000) + " KB";
    };

    try {
      await createReport.mutateAsync({
        title: newReport.title,
        type: "complet",
        date: new Date().toISOString(),
        status: "Généré",
        size: formatSize(estimatedBytes),
        file_path: "ai_summary_available"
      });
      setIsDialogOpen(false);
      setNewReport({ title: "", type: "executive" });
      toast({ title: "Succès", description: "Le rapport a été généré avec succès" });
    } catch (error) {
      toast({ title: "Erreur", description: "Échec de la génération du rapport", variant: "destructive" });
    }
  };

  const reportRef = useRef<HTMLDivElement>(null);
  const [activeReportForExport, setActiveReportForExport] = useState<any>(null);

  const handleDownloadRealPDF = async (report: any) => {
    setActiveReportForExport(report);
    
    // Give it a small timeout to render the hidden content
    setTimeout(async () => {
      if (reportRef.current) {
        toast({ title: "Exportation", description: "Préparation du document PDF..." });
        await exportToPDF('report-template-container', `Rapport_${report.title.replace(/\s+/g, '_')}`);
        setActiveReportForExport(null);
      }
    }, 500);
  };

  const dynamicKPIs = useMemo(() => {
    // Filter by department if selected
    const targetEvents = deptFilter === "all" ? events : events.filter(e => 
      contacts.find(c => c.id === e.contact_id)?.department === deptFilter
    );
    const targetTrainings = deptFilter === "all" ? trainings : trainings.filter(t => 
      contacts.find(c => c.id === t.contact_id)?.department === deptFilter
    );
    const targetRiskScores = deptFilter === "all" ? riskScores : riskScores.filter(rs => 
      contacts.find(c => c.id === rs.contact_id)?.department === deptFilter
    );

    if (targetEvents.length === 0 && targetTrainings.length === 0) return [
      { label: "Taux de clic", value: `0%`, change: "En direct", trend: "down", good: true },
      { label: "Taux de signalement", value: `0%`, change: "En direct", trend: "up", good: true },
      { label: "Formation complétée", value: `0%`, change: "En direct", trend: "up", good: false },
      { label: "Score de risque", value: `0/100`, change: "En direct", trend: "down", good: true },
    ];
    
    const clickCount = targetEvents.filter(e => e.event_type === 'click').length;
    const reportCount = targetEvents.filter(e => e.event_type === 'report').length;
    
    const clickRate = targetEvents.length > 0 ? ((clickCount / targetEvents.length) * 100).toFixed(1) : "0.0";
    const reportRate = targetEvents.length > 0 ? ((reportCount / targetEvents.length) * 100).toFixed(1) : "0.0";
    
    const completedTrainings = targetTrainings.filter(t => t.status === 'completed').length;
    const trainingRate = targetTrainings.length > 0 ? Math.round((completedTrainings / targetTrainings.length) * 100) : 0;
    
    const avgScore = targetRiskScores.length > 0 ? Math.round(targetRiskScores.reduce((acc, curr) => acc + curr.score, 0) / targetRiskScores.length) : 0;

    return [
      { label: "Taux de clic", value: `${clickRate}%`, change: "En direct", trend: clickRate > "10" ? "up" : "down", good: clickRate <= "10" },
      { label: "Taux de signalement", value: `${reportRate}%`, change: "En direct", trend: reportRate > "15" ? "up" : "down", good: reportRate > "15" },
      { label: "Formation complétée", value: `${trainingRate}%`, change: "En direct", trend: "up", good: trainingRate > 50 },
      { label: "Score de risque", value: `${avgScore}/100`, change: "En direct", trend: avgScore > 50 ? "up" : "down", good: avgScore <= 50 },
    ];
  }, [events, trainings, riskScores, contacts, deptFilter, periodFilter]);

  const dynamicMonthlyData = useMemo(() => {
    const filteredEvents = events.filter(e => isWithinPeriod(e.event_timestamp));
    const filteredCampaigns = campaigns.filter(c => isWithinPeriod(c.started_at));
    const filteredTrainings = trainings.filter(t => isWithinPeriod(t.updated_at || t.created_at));

    // Department filtering
    const targetEvents = deptFilter === "all" ? filteredEvents : filteredEvents.filter(e => 
      contacts.find(c => c.id === e.contact_id)?.department === deptFilter
    );
    const targetCampaigns = deptFilter === "all" ? filteredCampaigns : filteredCampaigns.filter(c => 
      c.target_departments?.includes(deptFilter) || true // Simplified check
    );
    const targetTrainings = deptFilter === "all" ? filteredTrainings : filteredTrainings.filter(t => 
      contacts.find(c => c.id === t.contact_id)?.department === deptFilter
    );

    if (targetEvents.length === 0 && targetCampaigns.length === 0) return [];

    const monthMap = new Map();
    // Determine how many months to show based on period
    let monthCount = 6;
    if (periodFilter === "30days") monthCount = 1;
    if (periodFilter === "90days") monthCount = 3;
    if (periodFilter === "1year") monthCount = 12;

    for (let i = monthCount - 1; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const mStr = d.toLocaleString('fr-FR', { month: 'short' });
      const monthKey = `${d.getFullYear()}-${d.getMonth()}`;
      monthMap.set(monthKey, { month: mStr.charAt(0).toUpperCase() + mStr.slice(1), campaigns: 0, clicks: 0, reported: 0, trained: 0, dateKey: monthKey });
    }

    targetEvents.forEach(e => {
      const d = new Date(e.event_timestamp || Date.now());
      const monthKey = `${d.getFullYear()}-${d.getMonth()}`;
      if (monthMap.has(monthKey)) {
        const entry = monthMap.get(monthKey);
        if (e.event_type === 'click') entry.clicks++;
        if (e.event_type === 'report') entry.reported++;
      }
    });

    targetCampaigns.forEach(c => {
      const d = new Date(c.started_at || Date.now());
      const monthKey = `${d.getFullYear()}-${d.getMonth()}`;
      if (monthMap.has(monthKey)) {
        monthMap.get(monthKey).campaigns++;
      }
    });

    targetTrainings.forEach(t => {
      if (t.completed) {
        const d = new Date(t.updated_at);
        const monthKey = `${d.getFullYear()}-${d.getMonth()}`;
        if (monthMap.has(monthKey)) monthMap.get(monthKey).trained++;
      }
    });

    return Array.from(monthMap.values());
  }, [events, campaigns, trainings, contacts, deptFilter, periodFilter]);

  return (
    <div id="app-content" className="h-full overflow-y-auto p-6 custom-scrollbar">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-stone-900">Rapports & Analyses</h1>
          <p className="text-stone-500 mt-1">Générez et consultez des rapports détaillés sur vos campagnes</p>
        </div>
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex gap-2 items-center flex-1 w-full">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
              <Input 
                placeholder="Rechercher un rapport..." 
                className="pl-9 border-stone-200"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <div className="flex gap-3">
            <Select value={deptFilter} onValueChange={setDeptFilter}>
              <SelectTrigger className="w-40">
                <Building className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Département" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les Départements</SelectItem>
                {uniqueDepartments.map(dept => (
                  <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={handlePrint}>
              <Printer className="w-4 h-4 mr-2" />
              Imprimer
            </Button>


            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <FileText className="w-4 h-4 mr-2" />
                  Générer Rapport
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Générer un Rapport Complet</DialogTitle>
                  <DialogDescription>
                    Un rapport complet incluant toutes les données : campagnes, analytics, formation, risques et utilisateurs.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="title">Titre du Rapport</Label>
                    <Input 
                      id="title" 
                      placeholder="ex: Rapport Complet Q2 2025" 
                      value={newReport.title}
                      onChange={(e) => setNewReport({ ...newReport, title: e.target.value })}
                    />
                  </div>
                  <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg border border-blue-100">
                    <FileText className="w-4 h-4 text-blue-600 shrink-0" />
                    <span className="text-sm text-blue-700 font-medium">Rapport Complet — Toutes sections incluses</span>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Annuler</Button>
                  <Button onClick={handleCreateReport} disabled={createReport.isPending}>
                    {createReport.isPending ? "Génération..." : "Confirmer la Génération"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
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
              <Select value={periodFilter} onValueChange={setPeriodFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Période" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="30days">30 jours</SelectItem>
                  <SelectItem value="90days">3 mois</SelectItem>
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

      {/* Reports Table */}
      <Card className="mb-8 border-stone-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600" />
              Liste des Rapports
            </CardTitle>
            {filteredReports.length > 0 && (
              <Badge variant="secondary">{filteredReports.length} rapports trouvés</Badge>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <Card className="border-stone-200 shadow-sm overflow-hidden">
            <CardHeader className="bg-white border-b border-stone-100 py-4 px-6 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg font-semibold text-stone-900">Historique des Rapports</CardTitle>
                <CardDescription>Liste de tous les rapports générés et archivés</CardDescription>
              </div>
              {selectedReports.length > 0 && (
                <div className="flex items-center gap-4 bg-red-50 border border-red-100 py-1 px-3 rounded-lg animate-in fade-in slide-in-from-top-1">
                  <span className="text-sm font-medium text-red-700">
                    {selectedReports.length} rapport{selectedReports.length > 1 ? 's' : ''} sélectionné{selectedReports.length > 1 ? 's' : ''}
                  </span>
                  <div className="flex gap-2">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-8 text-stone-500 hover:text-stone-700"
                      onClick={() => setSelectedReports([])}
                    >
                      Annuler
                    </Button>
                    <Button 
                      variant="destructive" 
                      size="sm" 
                      className="h-8 gap-2 shadow-sm"
                      onClick={() => setIsBulkDeleteAlertOpen(true)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      Supprimer la sélection
                    </Button>
                  </div>
                </div>
              )}
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-stone-50/50 hover:bg-stone-50/50 border-b border-stone-200">
                      <TableHead className="w-[50px] pl-6">
                        <Checkbox 
                          checked={paginatedReports.length > 0 && paginatedReports.every(r => selectedReports.includes(r.id))}
                          onCheckedChange={(checked) => handleSelectAll(!!checked)}
                          aria-label="Tout sélectionner sur cette page"
                        />
                      </TableHead>
                      <TableHead className="text-stone-500 font-semibold uppercase text-xs tracking-wider">Titre</TableHead>
                      <TableHead className="text-stone-500 font-semibold uppercase text-xs tracking-wider">Date</TableHead>
                      <TableHead className="text-stone-500 font-semibold uppercase text-xs tracking-wider">Statut</TableHead>
                      <TableHead className="text-stone-500 font-semibold uppercase text-xs tracking-wider">Taille</TableHead>
                      <TableHead className="text-right text-stone-500 font-semibold uppercase text-xs tracking-wider pr-6">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedReports.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="h-32 text-center text-stone-400 italic">
                          Aucun rapport trouvé
                        </TableCell>
                      </TableRow>
                    ) : (
                      paginatedReports.map((report) => (
                        <TableRow key={report.id} className={`hover:bg-stone-50/50 transition-colors ${selectedReports.includes(report.id) ? 'bg-blue-50/30' : 'bg-white'}`}>
                          <TableCell className="pl-6">
                            <Checkbox 
                              checked={selectedReports.includes(report.id)}
                              onCheckedChange={(checked) => handleSelectOne(report.id, !!checked)}
                            />
                          </TableCell>
                          <TableCell className="font-medium text-stone-900">{report.title}</TableCell>
                          <TableCell className="text-stone-600">
                            {new Date(report.date).toLocaleDateString('fr-FR')}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <CheckCircle2 className="w-4 h-4 text-green-600" />
                              <span className="text-sm font-medium text-stone-700">{report.status}</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-stone-500 text-sm">{report.size}</TableCell>
                          <TableCell className="text-right pr-6">
                            <div className="flex justify-end gap-2">
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                onClick={() => handleDownloadRealPDF(report)}
                              >
                                <Download className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                                onClick={() => setReportToDelete(report.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
            </Table>
          </div>

          {totalPages > 1 && (
            <div className="mt-4 border-t pt-4">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious 
                      href="#" 
                      onClick={(e) => { e.preventDefault(); setCurrentPage(p => Math.max(1, p - 1)); }}
                      className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                    />
                  </PaginationItem>
                  {[...Array(totalPages)].map((_, i) => (
                    <PaginationItem key={i}>
                      <PaginationLink 
                        href="#" 
                        isActive={currentPage === i + 1}
                        onClick={(e) => { e.preventDefault(); setCurrentPage(i + 1); }}
                      >
                        {i + 1}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  <PaginationItem>
                    <PaginationNext 
                      href="#" 
                      onClick={(e) => { e.preventDefault(); setCurrentPage(p => Math.min(totalPages, p + 1)); }}
                      className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </CardContent>
      </Card>
    </CardContent>
  </Card>

      {/* Hidden Report Template for PDF Generation */}
      <div style={{ position: 'absolute', left: '-9999px', top: '-9999px' }}>
        <div id="report-template-container" ref={reportRef} className="p-10 bg-white text-stone-900 w-[900px] font-sans">
          {activeReportForExport && (() => {
            // ─── Computed real data ───────────────────────────────────────
            const totalCampaigns = campaigns.length;
            const activeCampaigns = campaigns.filter(c => c.status === 'active').length;
            const completedCampaigns = campaigns.filter(c => c.status === 'completed').length;
            const totalClicks = events.filter(e => e.event_type === 'click').length;
            const totalReported = events.filter(e => e.event_type === 'report').length;
            const totalIgnored = events.filter(e => e.event_type === 'ignore').length;
            const clickRate = events.length > 0 ? Math.round((totalClicks / events.length) * 100) : 0;
            const reportRate = events.length > 0 ? Math.round((totalReported / events.length) * 100) : 0;
            const totalContacts = contacts.length;
            const completedTrainings = trainings.filter((t: any) => t.status === 'completed').length;
            const trainingRate = trainings.length > 0 ? Math.round((completedTrainings / trainings.length) * 100) : 0;
            const avgRisk = riskScores.length > 0
              ? Math.round(riskScores.reduce((s, r) => s + r.score, 0) / riskScores.length)
              : 0;
            const highRiskCount = riskScores.filter(r => r.level === 'élevé' || r.level === 'critique').length;

            // Dept breakdown
            const deptMap = new Map<string, { clicks: number; reported: number; total: number }>();
            contacts.forEach(c => {
              if (!c.department) return;
              if (!deptMap.has(c.department)) deptMap.set(c.department, { clicks: 0, reported: 0, total: 0 });
              deptMap.get(c.department)!.total++;
            });
            events.forEach(e => {
              const contact = contacts.find(c => c.id === e.contact_id);
              if (!contact?.department) return;
              const entry = deptMap.get(contact.department);
              if (!entry) return;
              if (e.event_type === 'click') entry.clicks++;
              if (e.event_type === 'report') entry.reported++;
            });
            const deptRows = Array.from(deptMap.entries())
              .map(([name, d]) => ({ name, ...d, clickRate: d.total > 0 ? Math.round((d.clicks / d.total) * 100) : 0 }))
              .sort((a, b) => b.clickRate - a.clickRate);

            // Top risk users
            const topRiskUsers = [...contacts]
              .map(c => ({ ...c, riskScore: riskScores.find(r => r.contact_id === c.id)?.score ?? 0 }))
              .sort((a, b) => b.riskScore - a.riskScore)
              .slice(0, 8);

            return (
              <>
                {/* ── HEADER ─────────────────────────────────── */}
                <div className="flex justify-between items-start mb-8 pb-6 border-b-2 border-blue-700">
                  <div>
                    <div className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-1">Plateforme KIRA AI</div>
                    <h1 className="text-3xl font-black text-blue-900 uppercase tracking-tight">Rapport Complet de Sécurité</h1>
                    <p className="text-stone-500 text-sm mt-1">{activeReportForExport.title}</p>
                  </div>
                  <div className="text-right text-sm">
                    <div className="font-bold text-stone-800">{new Date(activeReportForExport.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
                    <div className="text-stone-400">ID #{activeReportForExport.id} • CONFIDENTIEL</div>
                  </div>
                </div>

                {/* ── GLOBAL KPIs ─────────────────────────────── */}
                <div className="grid grid-cols-5 gap-3 mb-8">
                  {[
                    { label: 'Campagnes', value: totalCampaigns, color: 'bg-blue-50 border-blue-200', text: 'text-blue-800' },
                    { label: 'Taux de Clic', value: clickRate + '%', color: 'bg-red-50 border-red-200', text: 'text-red-800' },
                    { label: 'Signalements', value: reportRate + '%', color: 'bg-green-50 border-green-200', text: 'text-green-800' },
                    { label: 'Formation', value: trainingRate + '%', color: 'bg-purple-50 border-purple-200', text: 'text-purple-800' },
                    { label: 'Score Risque Moy.', value: avgRisk + '/100', color: 'bg-orange-50 border-orange-200', text: 'text-orange-800' },
                  ].map((kpi, i) => (
                    <div key={i} className={`p-3 rounded-lg border ${kpi.color} text-center`}>
                      <div className="text-[10px] uppercase font-bold text-stone-500 mb-1">{kpi.label}</div>
                      <div className={`text-xl font-black ${kpi.text}`}>{kpi.value}</div>
                    </div>
                  ))}
                </div>

                {/* ── SECTION 1 : CAMPAGNES ───────────────────── */}
                <div className="mb-8">
                  <h2 className="text-base font-black text-blue-900 uppercase tracking-widest border-b border-blue-200 pb-1 mb-4 flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-600 rounded-sm" /> 1. Campagnes de Phishing
                  </h2>
                  <div className="grid grid-cols-3 gap-3 mb-4">
                    <div className="bg-stone-50 border border-stone-200 rounded p-3 text-center">
                      <div className="text-stone-500 text-[10px] uppercase font-semibold">Total</div>
                      <div className="text-2xl font-black text-stone-800">{totalCampaigns}</div>
                    </div>
                    <div className="bg-green-50 border border-green-200 rounded p-3 text-center">
                      <div className="text-green-600 text-[10px] uppercase font-semibold">Actives</div>
                      <div className="text-2xl font-black text-green-800">{activeCampaigns}</div>
                    </div>
                    <div className="bg-blue-50 border border-blue-200 rounded p-3 text-center">
                      <div className="text-blue-600 text-[10px] uppercase font-semibold">Terminées</div>
                      <div className="text-2xl font-black text-blue-800">{completedCampaigns}</div>
                    </div>
                  </div>
                  <table className="w-full text-xs border-collapse">
                    <thead>
                      <tr className="bg-stone-100">
                        <th className="text-left p-2 border border-stone-200 font-semibold">Nom</th>
                        <th className="p-2 border border-stone-200 font-semibold">Statut</th>
                        <th className="p-2 border border-stone-200 font-semibold">Difficulté</th>
                        <th className="p-2 border border-stone-200 font-semibold">Démarrage</th>
                      </tr>
                    </thead>
                    <tbody>
                      {campaigns.slice(0, 10).map((c, i) => (
                        <tr key={c.id} className={i % 2 === 0 ? 'bg-white' : 'bg-stone-50'}>
                          <td className="p-2 border border-stone-200 font-medium">{c.name}</td>
                          <td className="p-2 border border-stone-200 text-center">{c.status}</td>
                          <td className="p-2 border border-stone-200 text-center">{c.difficulty_level}</td>
                          <td className="p-2 border border-stone-200 text-center">{c.started_at ? new Date(c.started_at).toLocaleDateString('fr-FR') : '—'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* ── SECTION 2 : COMPORTEMENT ────────────────── */}
                <div className="mb-8">
                  <h2 className="text-base font-black text-blue-900 uppercase tracking-widest border-b border-blue-200 pb-1 mb-4 flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-600 rounded-sm" /> 2. Analyse Comportementale
                  </h2>
                  <div className="grid grid-cols-4 gap-3">
                    {[
                      { label: 'Clics malveillants', value: totalClicks, color: 'text-red-700' },
                      { label: 'Emails signalés', value: totalReported, color: 'text-green-700' },
                      { label: 'Ignorés', value: totalIgnored, color: 'text-stone-600' },
                      { label: 'Taux de clic', value: clickRate + '%', color: 'text-orange-700' },
                    ].map((s, i) => (
                      <div key={i} className="bg-stone-50 border border-stone-200 rounded p-3 text-center">
                        <div className="text-[10px] uppercase text-stone-500 font-semibold mb-1">{s.label}</div>
                        <div className={`text-xl font-black ${s.color}`}>{s.value}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* ── SECTION 3 : RISQUE PAR DÉPARTEMENT ─────── */}
                <div className="mb-8">
                  <h2 className="text-base font-black text-blue-900 uppercase tracking-widest border-b border-blue-200 pb-1 mb-4 flex items-center gap-2">
                    <div className="w-3 h-3 bg-purple-600 rounded-sm" /> 3. Risque par Département
                  </h2>
                  {deptRows.length > 0 ? (
                    <table className="w-full text-xs border-collapse">
                      <thead>
                        <tr className="bg-stone-100">
                          <th className="text-left p-2 border border-stone-200 font-semibold">Département</th>
                          <th className="p-2 border border-stone-200 font-semibold">Utilisateurs</th>
                          <th className="p-2 border border-stone-200 font-semibold">Clics</th>
                          <th className="p-2 border border-stone-200 font-semibold">Signalements</th>
                          <th className="p-2 border border-stone-200 font-semibold">Taux Clic</th>
                        </tr>
                      </thead>
                      <tbody>
                        {deptRows.map((d, i) => (
                          <tr key={d.name} className={i % 2 === 0 ? 'bg-white' : 'bg-stone-50'}>
                            <td className="p-2 border border-stone-200 font-medium">{d.name}</td>
                            <td className="p-2 border border-stone-200 text-center">{d.total}</td>
                            <td className="p-2 border border-stone-200 text-center text-red-600 font-semibold">{d.clicks}</td>
                            <td className="p-2 border border-stone-200 text-center text-green-600 font-semibold">{d.reported}</td>
                            <td className="p-2 border border-stone-200 text-center">
                              <span className={`font-bold ${d.clickRate > 40 ? 'text-red-600' : d.clickRate > 20 ? 'text-orange-500' : 'text-green-600'}`}>{d.clickRate}%</span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <p className="text-stone-400 text-sm italic">Aucune donnée de département disponible.</p>
                  )}
                </div>

                {/* ── SECTION 4 : FORMATION ───────────────────── */}
                <div className="mb-8">
                  <h2 className="text-base font-black text-blue-900 uppercase tracking-widest border-b border-blue-200 pb-1 mb-4 flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-600 rounded-sm" /> 4. Formation & Sensibilisation
                  </h2>
                  <div className="grid grid-cols-3 gap-3 mb-4">
                    {[
                      { label: 'Total formations', value: trainings.length },
                      { label: 'Complétées', value: completedTrainings },
                      { label: 'Taux complétion', value: trainingRate + '%' },
                    ].map((s, i) => (
                      <div key={i} className="bg-stone-50 border border-stone-200 rounded p-3 text-center">
                        <div className="text-[10px] uppercase text-stone-500 font-semibold mb-1">{s.label}</div>
                        <div className="text-xl font-black text-green-800">{s.value}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* ── SECTION 5 : UTILISATEURS À RISQUE ──────── */}
                <div className="mb-8">
                  <h2 className="text-base font-black text-blue-900 uppercase tracking-widest border-b border-blue-200 pb-1 mb-4 flex items-center gap-2">
                    <div className="w-3 h-3 bg-orange-500 rounded-sm" /> 5. Top Utilisateurs à Risque
                  </h2>
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <div className="bg-orange-50 border border-orange-200 rounded p-3 text-center">
                      <div className="text-[10px] uppercase text-stone-500 font-semibold">Score moyen</div>
                      <div className="text-xl font-black text-orange-800">{avgRisk}/100</div>
                    </div>
                    <div className="bg-red-50 border border-red-200 rounded p-3 text-center">
                      <div className="text-[10px] uppercase text-stone-500 font-semibold">Risque élevé/critique</div>
                      <div className="text-xl font-black text-red-800">{highRiskCount}</div>
                    </div>
                  </div>
                  <table className="w-full text-xs border-collapse">
                    <thead>
                      <tr className="bg-stone-100">
                        <th className="text-left p-2 border border-stone-200 font-semibold">Nom</th>
                        <th className="text-left p-2 border border-stone-200 font-semibold">Département</th>
                        <th className="p-2 border border-stone-200 font-semibold">Score</th>
                        <th className="p-2 border border-stone-200 font-semibold">Niveau</th>
                      </tr>
                    </thead>
                    <tbody>
                      {topRiskUsers.map((u, i) => {
                        const rs = riskScores.find(r => r.contact_id === u.id);
                        return (
                          <tr key={u.id} className={i % 2 === 0 ? 'bg-white' : 'bg-stone-50'}>
                            <td className="p-2 border border-stone-200 font-medium">{u.first_name} {u.last_name}</td>
                            <td className="p-2 border border-stone-200">{u.department || '—'}</td>
                            <td className="p-2 border border-stone-200 text-center font-bold">{u.riskScore}</td>
                            <td className="p-2 border border-stone-200 text-center">
                              <span className={`font-bold ${rs?.level === 'critique' ? 'text-red-700' : rs?.level === 'élevé' ? 'text-orange-600' : 'text-stone-500'}`}>
                                {rs?.level || '—'}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* ── SECTION 6 : RAPPORTS GÉNÉRÉS ───────────── */}
                <div className="mb-8">
                  <h2 className="text-base font-black text-blue-900 uppercase tracking-widest border-b border-blue-200 pb-1 mb-4 flex items-center gap-2">
                    <div className="w-3 h-3 bg-stone-500 rounded-sm" /> 6. Historique des Rapports
                  </h2>
                  <table className="w-full text-xs border-collapse">
                    <thead>
                      <tr className="bg-stone-100">
                        <th className="text-left p-2 border border-stone-200 font-semibold">Titre</th>
                        <th className="p-2 border border-stone-200 font-semibold">Type</th>
                        <th className="p-2 border border-stone-200 font-semibold">Date</th>
                        <th className="p-2 border border-stone-200 font-semibold">Statut</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reports.slice(0, 10).map((r, i) => (
                        <tr key={r.id} className={i % 2 === 0 ? 'bg-white' : 'bg-stone-50'}>
                          <td className="p-2 border border-stone-200 font-medium">{r.title}</td>
                          <td className="p-2 border border-stone-200 text-center">{r.type}</td>
                          <td className="p-2 border border-stone-200 text-center">{new Date(r.date).toLocaleDateString('fr-FR')}</td>
                          <td className="p-2 border border-stone-200 text-center">{r.status}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* ── FOOTER ──────────────────────────────────── */}
                <div className="mt-10 pt-4 border-t border-stone-200 flex justify-between items-center text-[10px] text-stone-400">
                  <div>Généré par KIRA AI • {new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
                  <div className="font-bold uppercase">CONFIDENTIEL • PROPRIÉTÉ DE L'ENTREPRISE</div>
                </div>
              </>
            );
          })()}
        </div>
      </div>



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
          </div>
        </CardContent>
      </Card>
      {/* Delete Confirmation Alert Dialog */}
      <AlertDialog open={!!reportToDelete} onOpenChange={() => setReportToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Êtes-vous absolument sûr ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. Cela supprimera définitivement le rapport de nos serveurs.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction 
              onClick={async () => {
                if (reportToDelete) {
                  await deleteReport.mutateAsync(reportToDelete);
                  setReportToDelete(null);
                  toast({ title: "Supprimé", description: "Le rapport a été supprimé avec succès." });
                }
              }}
              className="bg-red-600 hover:bg-red-700"
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Bulk Delete Confirmation */}
      <AlertDialog open={isBulkDeleteAlertOpen} onOpenChange={setIsBulkDeleteAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer {selectedReports.length} rapports ?</AlertDialogTitle>
            <AlertDialogDescription>
              Vous êtes sur le point de supprimer plusieurs rapports simultanément. Cette action ne peut pas être annulée.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleBulkDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Tout supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      {/* Delete All Confirmation */}
      <AlertDialog open={isDeleteAllAlertOpen} onOpenChange={setIsDeleteAllAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-red-600 flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              Action Critique : Tout Supprimer ?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Vous êtes sur le point de supprimer <strong>l'intégralité ({reports.length})</strong> de vos rapports. 
              Cette action est définitive et ne peut pas être annulée.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteAll}
              className="bg-red-600 hover:bg-red-700"
            >
              Confirmer la suppression totale
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
