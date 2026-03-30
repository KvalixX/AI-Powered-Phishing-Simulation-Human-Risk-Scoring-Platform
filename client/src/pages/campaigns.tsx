import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Target,
  Plus,
  Search,
  Filter,
  Play,
  Pause,
  RotateCcw,
  Trash2,
  Edit3,
  MoreVertical as ActionsIcon,
  Calendar,
  Users,
  Mail,
  MousePointer,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Brain,
  Wand2,
  Sparkles,
  FileText,
  Download,
  Printer
} from "lucide-react";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { exportToExcel, exportToPDF } from "@/lib/utils";

import { 
  useCampaigns,
  useCreateCampaign,
  useUpdateCampaign,
  useDeleteCampaign,
  usePauseCampaign,
  useResumeCampaign,
  useEmailTemplates,
  useDepartments
} from "@/hooks/useApi";
import { Campaign } from "@/lib/api";

const aiTemplates: any[] = [];

const difficultyColors = {
  easy: "bg-green-100 text-green-700",
  medium: "bg-yellow-100 text-yellow-700",
  hard: "bg-red-100 text-red-700"
};

const statusColors = {
  active: "bg-green-100 text-green-700",
  completed: "bg-blue-100 text-blue-700",
  scheduled: "bg-amber-100 text-amber-700",
  draft: "bg-gray-100 text-gray-700",
  paused: "bg-orange-100 text-orange-700"
};

export default function Campaigns() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTab, setSelectedTab] = useState("all");
  const [difficultyFilter, setDifficultyFilter] = useState("all");
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);

  const { data: campaigns = [], isLoading } = useCampaigns();
  const createCampaign = useCreateCampaign();
  const updateCampaign = useUpdateCampaign();
  const deleteCampaign = useDeleteCampaign();
  const pauseCampaignMutation = usePauseCampaign();
  const resumeCampaignMutation = useResumeCampaign();

  const { data: templates = [] } = useEmailTemplates();
  const { data: departments = [] } = useDepartments();

  const [formData, setFormData] = useState<Partial<Campaign>>({
    name: "",
    difficulty_level: "moyen",
    status: "draft"
  });

  const handleCreate = async () => {
    try {
      await createCampaign.mutateAsync(formData);
      toast({ title: "Succès", description: "Campagne créée avec succès." });
      setShowCreateDialog(false);
      setFormData({ name: "", difficulty_level: "moyen", status: "draft" });
    } catch (error) {
      toast({ variant: "destructive", title: "Erreur", description: "Une erreur est survenue." });
    }
  };

  const handleDelete = async () => {
    if (!selectedCampaign) return;
    try {
      await deleteCampaign.mutateAsync(selectedCampaign.id);
      toast({ title: "Succès", description: "Campagne supprimée avec succès." });
      setIsDeleteDialogOpen(false);
    } catch (error) {
      toast({ variant: "destructive", title: "Erreur", description: "Une erreur est survenue." });
    }
  };

  const handleStatusChange = async (campaign: Campaign, newStatus: Campaign['status']) => {
    try {
      if (newStatus === 'paused') {
        await pauseCampaignMutation.mutateAsync(campaign.id);
      } else if (newStatus === 'active' && campaign.status === 'paused') {
        await resumeCampaignMutation.mutateAsync(campaign.id);
      } else {
        await updateCampaign.mutateAsync({ id: campaign.id, data: { status: newStatus } });
      }
      toast({ title: "Succès", description: `Campagne ${newStatus}.` });
    } catch (error) {
      toast({ variant: "destructive", title: "Erreur", description: "Une erreur est survenue." });
    }
  };

  const handleSubmit = async () => {
    try {
      if (selectedCampaign) {
        await updateCampaign.mutateAsync({ id: selectedCampaign.id, data: formData });
        toast({ title: "Succès", description: "Campagne mise à jour." });
      } else {
        await createCampaign.mutateAsync(formData);
        toast({ title: "Succès", description: "Campagne créée." });
      }
      setShowCreateDialog(false);
      setSelectedCampaign(null);
      setFormData({ name: "", difficulty_level: "moyen", status: "draft" });
    } catch (error) {
      toast({ variant: "destructive", title: "Erreur", description: "Une erreur est survenue." });
    }
  };

  const filteredCampaigns = campaigns.filter(campaign => {
    const matchesSearch = campaign.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = selectedTab === "all" || campaign.status === selectedTab;
    const matchesDifficulty = difficultyFilter === "all" || campaign.difficulty_level === difficultyFilter;
    return matchesSearch && matchesTab && matchesDifficulty;
  });

  return (
    <div className="h-full overflow-y-auto p-6 custom-scrollbar">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-stone-900">Campagnes de Phishing</h1>
          <p className="text-stone-500 mt-1">Gérez vos campagnes de simulation et suivez les résultats</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => exportToPDF('app-content', 'campagnes_kira')}>
            <Download className="w-4 h-4 mr-2" />
            Exporter en PDF
          </Button>
          <Button variant="outline" onClick={() => exportToExcel(campaigns, "campagnes")}>
            <Download className="w-4 h-4 mr-2" />
            Exporter en Excel
          </Button>
          <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
            <SelectTrigger className="w-40">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Difficulté" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes les difficultés</SelectItem>
              <SelectItem value="facile">Facile</SelectItem>
              <SelectItem value="moyen">Moyen</SelectItem>
              <SelectItem value="difficile">Difficile</SelectItem>
              <SelectItem value="expert">Expert</SelectItem>
            </SelectContent>
          </Select>
          {(searchQuery || selectedTab !== "all" || difficultyFilter !== "all") && (
            <Button 
              variant="ghost" 
              className="text-stone-500 hover:text-stone-900"
              onClick={() => {
                setSearchQuery("");
                setSelectedTab("all");
                setDifficultyFilter("all");
              }}
            >
              Réinitialiser
            </Button>
          )}
          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                Nouvelle Campagne
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-purple-600" />
                  {selectedCampaign ? "Modifier la Campagne" : "Créer une Campagne IA"}
                </DialogTitle>
                <DialogDescription>
                  {selectedCampaign ? "Modifiez les paramètres de votre campagne." : "Générez une campagne de phishing réaliste avec l'intelligence artificielle"}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                  <div>
                    <label className="text-sm font-medium text-stone-700">Nom de la campagne</label>
                    <Input 
                      placeholder="Ex: Campagne Email CEO - Juin 2024" 
                      className="mt-1" 
                      value={formData.name || ""}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-stone-700">Type d'attaque</label>
                      <Select>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Sélectionner..." />
                      </SelectTrigger>
                      <SelectContent>
                        {templates.map(t => (
                          <SelectItem key={t.id} value={t.id.toString()}>{t.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-stone-700">Difficulté</label>
                      <Select 
                        value={formData.difficulty_level} 
                        onValueChange={(val: any) => setFormData({...formData, difficulty_level: val})}
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Sélectionner..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="facile">Facile</SelectItem>
                          <SelectItem value="moyen">Moyen</SelectItem>
                          <SelectItem value="difficile">Difficile</SelectItem>
                          <SelectItem value="expert">Expert</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                <div>
                  <label className="text-sm font-medium text-stone-700">Groupes cibles</label>
                  <Select>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Sélectionner les groupes..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous les utilisateurs</SelectItem>
                      {departments.map(d => (
                        <SelectItem key={d.id} value={d.name}>{d.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Wand2 className="w-4 h-4 text-purple-600" />
                    <span className="font-medium text-purple-900">Génération IA</span>
                  </div>
                  <p className="text-sm text-purple-700">
                    L'IA générera un email personnalisé basé sur le contexte de votre organisation et les dernières tendances de phishing.
                  </p>
                </div>
                <div className="flex justify-end gap-3 pt-4">
                  <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                    Annuler
                  </Button>
                  <Button 
                    className="bg-purple-600 hover:bg-purple-700"
                    onClick={handleSubmit}
                    disabled={createCampaign.isPending || updateCampaign.isPending}
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                    {selectedCampaign ? "Mettre à jour" : "Générer avec IA"}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* AI Templates Section */}
      <Card className="mb-6 border-stone-200">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Brain className="w-5 h-5 text-purple-600" />
            Templates IA
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {aiTemplates.map((template) => (
              <Card key={template.id} className="border-stone-200 hover:border-purple-300 cursor-pointer transition-colors">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="w-4 h-4 text-purple-500" />
                    <Badge variant="outline" className="text-xs">{template.category}</Badge>
                  </div>
                  <h4 className="font-medium text-stone-900 text-sm">{template.name}</h4>
                  <p className="text-xs text-stone-500 mt-1 line-clamp-2">{template.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Search and Filter */}
      <div className="flex items-center gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-stone-400 w-4 h-4" />
          <Input
            placeholder="Rechercher une campagne..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="mb-6">
        <TabsList>
          <TabsTrigger value="all">Toutes</TabsTrigger>
          <TabsTrigger value="active">Actives</TabsTrigger>
          <TabsTrigger value="scheduled">Planifiées</TabsTrigger>
          <TabsTrigger value="completed">Terminées</TabsTrigger>
          <TabsTrigger value="draft">Brouillons</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Campaigns Grid */}
      {isLoading ? (
        <div className="flex justify-center p-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredCampaigns.map((campaign) => (
            <Card key={campaign.id} className="border-stone-200">
              <CardContent className="p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg bg-blue-100`}>
                      <Target className={`w-5 h-5 text-blue-600`} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-stone-900">{campaign.name}</h3>
                        {campaign.rl_enabled && (
                          <Sparkles className="w-4 h-4 text-purple-500" />
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge className={statusColors[campaign.status as keyof typeof statusColors] || statusColors.draft}>
                          {campaign.status === "active" ? "Active" :
                            campaign.status === "completed" ? "Terminée" :
                              campaign.status === "scheduled" ? "Planifiée" :
                                campaign.status === "draft" ? "Brouillon" : "En pause"}
                        </Badge>
                        <Badge className={difficultyColors[campaign.difficulty_level as keyof typeof difficultyColors] || difficultyColors.medium}>
                          {campaign.difficulty_level === "facile" ? "Facile" :
                            campaign.difficulty_level === "moyen" ? "Moyen" :
                              campaign.difficulty_level === "difficile" ? "Difficile" : "Expert"}
                        </Badge>
                        <Badge variant="outline" className="text-stone-500 ml-2">ID: {campaign.id}</Badge>
                      </div>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <ActionsIcon className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem onClick={() => {
                        setSelectedCampaign(campaign);
                        setFormData({
                          name: campaign.name,
                          difficulty_level: campaign.difficulty_level,
                          status: campaign.status
                        });
                        setShowCreateDialog(true);
                      }}>
                        <Edit3 className="w-4 h-4 mr-2" />
                        Modifier
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleStatusChange(campaign, 'active')}>
                        <Play className="w-4 h-4 mr-2" />
                        Activer
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleStatusChange(campaign, 'paused')}>
                        <Pause className="w-4 h-4 mr-2" />
                        Pause
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        className="text-red-600"
                        onClick={() => {
                          setSelectedCampaign(campaign);
                          setIsDeleteDialogOpen(true);
                        }}
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Supprimer
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {/* Stats */}
                {campaign.status !== "draft" && campaign.status !== "scheduled" && (
                  <div className="grid grid-cols-3 gap-4 mb-4 p-4 bg-stone-50 rounded-lg">
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <MousePointer className="w-4 h-4 text-stone-400" />
                      </div>
                      <div className="text-lg font-bold text-stone-900">
                        {campaign.metrics?.ctr ? Math.round(campaign.metrics.ctr) + '%' : '0%'}
                      </div>
                      <div className="text-xs text-stone-500">CTR Global</div>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <Target className="w-4 h-4 text-stone-400" />
                      </div>
                      <div className="text-lg font-bold text-stone-900">
                        {campaign.metrics?.precision ? Math.round(campaign.metrics.precision * 100) + '%' : 'N/A'}
                      </div>
                      <div className="text-xs text-stone-500">Précision IA</div>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <Brain className="w-4 h-4 text-stone-400" />
                      </div>
                      <div className="text-lg font-bold text-stone-900">
                        {campaign.metrics?.auc_roc ? (campaign.metrics.auc_roc).toFixed(2) : 'N/A'}
                      </div>
                      <div className="text-xs text-stone-500">AUC-ROC</div>
                    </div>
                  </div>
                )}

                {/* Progress */}
                {campaign.status === "active" && campaign.metrics?.ctr && (
                  <div className="mb-4">
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-stone-600">CTR (Progression)</span>
                      <span className="font-medium text-stone-900">{Math.round(campaign.metrics.ctr)}% d'ouverture/clic</span>
                    </div>
                    <Progress value={campaign.metrics.ctr} className="h-2" />
                  </div>
                )}

                {/* Target Groups & Dates */}
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1 text-stone-500">
                      <Users className="w-4 h-4" />
                      <span>Tous les destinataires</span>
                    </div>
                    {campaign.started_at && (
                      <div className="flex items-center gap-1 text-stone-500">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(campaign.started_at).toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2">
                    {campaign.status === "active" && (
                      <Button variant="outline" size="sm">
                        <Pause className="w-4 h-4 mr-1" />
                        Pause
                      </Button>
                    )}
                    {campaign.status === "paused" && (
                      <Button variant="outline" size="sm" onClick={() => handleStatusChange(campaign, 'active')}>
                        <Play className="w-4 h-4 mr-1" />
                        Reprendre
                      </Button>
                    )}
                    {campaign.status === "completed" && (
                      <Button variant="outline" size="sm" onClick={() => handleStatusChange(campaign, 'active')}>
                        <RotateCcw className="w-4 h-4 mr-1" />
                        Relancer
                      </Button>
                    )}
                    {(campaign.status === "completed" || campaign.status === "active") && (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-blue-600 hover:text-blue-700 font-medium"
                        onClick={() => navigate('/reports')}
                      >
                        <FileText className="w-4 h-4 mr-1" />
                        Voir rapport
                      </Button>
                    )}
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => {
                          setSelectedCampaign(campaign);
                          setFormData({
                            name: campaign.name,
                            difficulty_level: campaign.difficulty_level,
                            status: campaign.status
                          });
                          setShowCreateDialog(true);
                        }}
                      >
                        <Edit3 className="w-4 h-4" />
                      </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-red-600 hover:text-red-700"
                      onClick={() => {
                        setSelectedCampaign(campaign);
                        setIsDeleteDialogOpen(true);
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {filteredCampaigns.length === 0 && (
        <Card className="border-stone-200">
          <CardContent className="p-12 text-center">
            <Target className="w-12 h-12 text-stone-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-stone-900 mb-2">Aucune campagne trouvée</h3>
            <p className="text-stone-500 mb-4">Créez votre première campagne de simulation de phishing</p>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Créer une Campagne
            </Button>
          </CardContent>
        </Card>
      )}

      <DeleteDialog 
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleDelete}
        isPending={deleteCampaign.isPending}
      />
    </div>
  );
}

function DeleteDialog({ open, onOpenChange, onConfirm, isPending }: { open: boolean, onOpenChange: (open: boolean) => void, onConfirm: () => void, isPending: boolean }) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Supprimer la campagne ?</AlertDialogTitle>
          <AlertDialogDescription>
            Cette action supprimera toutes les statistiques et données associées à cette campagne.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Annuler</AlertDialogCancel>
          <AlertDialogAction 
            className="bg-red-600 hover:bg-red-700"
            onClick={onConfirm}
            disabled={isPending}
          >
            Supprimer
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
