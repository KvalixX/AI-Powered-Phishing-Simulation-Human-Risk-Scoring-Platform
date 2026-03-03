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
  MoreVertical,
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
  Trash2,
  Edit3
} from "lucide-react";
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
import { useState } from "react";

const campaigns = [
  { 
    id: 1, 
    name: "Campagne Q2 - Email CEO Fraud", 
    status: "active", 
    type: "Email Phishing",
    aiGenerated: true,
    sent: 245, 
    opened: 189, 
    clicked: 67, 
    reported: 23,
    startDate: "2024-06-01",
    endDate: "2024-06-15",
    targetGroups: ["Finance", "RH"],
    difficulty: "hard"
  },
  { 
    id: 2, 
    name: "Test Login Microsoft 365", 
    status: "completed", 
    type: "Credential Harvesting",
    aiGenerated: true,
    sent: 150, 
    opened: 134, 
    clicked: 45, 
    reported: 89,
    startDate: "2024-05-15",
    endDate: "2024-05-20",
    targetGroups: ["Tous"],
    difficulty: "medium"
  },
  { 
    id: 3, 
    name: "Fausse Facture Fournisseur", 
    status: "scheduled", 
    type: "Invoice Scam",
    aiGenerated: false,
    sent: 0, 
    opened: 0, 
    clicked: 0, 
    reported: 0,
    startDate: "2024-06-20",
    endDate: "2024-06-25",
    targetGroups: ["Comptabilité"],
    difficulty: "hard"
  },
  { 
    id: 4, 
    name: "Alerte Sécurité IT", 
    status: "draft", 
    type: "Urgency Scam",
    aiGenerated: true,
    sent: 0, 
    opened: 0, 
    clicked: 0, 
    reported: 0,
    startDate: "",
    endDate: "",
    targetGroups: ["IT", "Support"],
    difficulty: "easy"
  },
  { 
    id: 5, 
    name: "Mise à jour Zoom Requise", 
    status: "completed", 
    type: "Malware Distribution",
    aiGenerated: true,
    sent: 320, 
    opened: 280, 
    clicked: 45, 
    reported: 120,
    startDate: "2024-05-01",
    endDate: "2024-05-05",
    targetGroups: ["Tous"],
    difficulty: "medium"
  },
];

const aiTemplates = [
  { id: 1, name: "Email CEO", description: "Simule un email du CEO demandant une action urgente", category: "Social Engineering" },
  { id: 2, name: "Fausse Facture", description: "Email de facture de fournisseur avec pièce jointe malveillante", category: "Invoice Scam" },
  { id: 3, name: "Alerte IT", description: "Notification de problème de sécurité nécessitant une connexion", category: "Credential Harvesting" },
  { id: 4, name: "Mise à jour logiciel", description: "Fausse mise à jour d'application populaire", category: "Malware" },
  { id: 5, name: "Support technique", description: "Email du support technique demandant des informations", category: "Social Engineering" },
];

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
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTab, setSelectedTab] = useState("all");
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  const filteredCampaigns = campaigns.filter(campaign => {
    const matchesSearch = campaign.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = selectedTab === "all" || campaign.status === selectedTab;
    return matchesSearch && matchesTab;
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
          <Button variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            Filtrer
          </Button>
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
                  Créer une Campagne IA
                </DialogTitle>
                <DialogDescription>
                  Générez une campagne de phishing réaliste avec l'intelligence artificielle
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div>
                  <label className="text-sm font-medium text-stone-700">Nom de la campagne</label>
                  <Input placeholder="Ex: Campagne Email CEO - Juin 2024" className="mt-1" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-stone-700">Type d'attaque</label>
                    <Select>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Sélectionner..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="email">Email Phishing</SelectItem>
                        <SelectItem value="credential">Credential Harvesting</SelectItem>
                        <SelectItem value="invoice">Invoice Scam</SelectItem>
                        <SelectItem value="malware">Malware Distribution</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-stone-700">Difficulté</label>
                    <Select>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Sélectionner..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="easy">Facile</SelectItem>
                        <SelectItem value="medium">Moyen</SelectItem>
                        <SelectItem value="hard">Difficile</SelectItem>
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
                      <SelectItem value="finance">Finance</SelectItem>
                      <SelectItem value="rh">RH</SelectItem>
                      <SelectItem value="it">IT</SelectItem>
                      <SelectItem value="sales">Ventes</SelectItem>
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
                  <Button className="bg-purple-600 hover:bg-purple-700">
                    <Sparkles className="w-4 h-4 mr-2" />
                    Générer avec IA
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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredCampaigns.map((campaign) => (
          <Card key={campaign.id} className="border-stone-200">
            <CardContent className="p-6">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg ${
                    campaign.type === "Email Phishing" ? "bg-blue-100" :
                    campaign.type === "Credential Harvesting" ? "bg-red-100" :
                    campaign.type === "Invoice Scam" ? "bg-amber-100" :
                    "bg-purple-100"
                  }`}>
                    <Target className={`w-5 h-5 ${
                      campaign.type === "Email Phishing" ? "text-blue-600" :
                      campaign.type === "Credential Harvesting" ? "text-red-600" :
                      campaign.type === "Invoice Scam" ? "text-amber-600" :
                      "text-purple-600"
                    }`} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-stone-900">{campaign.name}</h3>
                      {campaign.aiGenerated && (
                        <Sparkles className="w-4 h-4 text-purple-500" />
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge className={statusColors[campaign.status as keyof typeof statusColors]}>
                        {campaign.status === "active" ? "Active" :
                         campaign.status === "completed" ? "Terminée" :
                         campaign.status === "scheduled" ? "Planifiée" :
                         campaign.status === "draft" ? "Brouillon" : "En pause"}
                      </Badge>
                      <Badge className={difficultyColors[campaign.difficulty as keyof typeof difficultyColors]}>
                        {campaign.difficulty === "easy" ? "Facile" :
                         campaign.difficulty === "medium" ? "Moyen" : "Difficile"}
                      </Badge>
                    </div>
                  </div>
                </div>
                <Button variant="ghost" size="sm">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </div>

              {/* Stats */}
              {campaign.status !== "draft" && campaign.status !== "scheduled" && (
                <div className="grid grid-cols-4 gap-4 mb-4 p-4 bg-stone-50 rounded-lg">
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <Mail className="w-4 h-4 text-stone-400" />
                    </div>
                    <div className="text-lg font-bold text-stone-900">{campaign.sent}</div>
                    <div className="text-xs text-stone-500">Envoyés</div>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <CheckCircle2 className="w-4 h-4 text-stone-400" />
                    </div>
                    <div className="text-lg font-bold text-stone-900">{campaign.opened}</div>
                    <div className="text-xs text-stone-500">Ouverts</div>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <MousePointer className="w-4 h-4 text-stone-400" />
                    </div>
                    <div className={`text-lg font-bold ${campaign.clicked > 50 ? 'text-red-600' : 'text-stone-900'}`}>
                      {campaign.clicked}
                    </div>
                    <div className="text-xs text-stone-500">Cliqués</div>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <AlertTriangle className="w-4 h-4 text-stone-400" />
                    </div>
                    <div className="text-lg font-bold text-green-600">{campaign.reported}</div>
                    <div className="text-xs text-stone-500">Signalés</div>
                  </div>
                </div>
              )}

              {/* Progress */}
              {campaign.status === "active" && (
                <div className="mb-4">
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-stone-600">Progression</span>
                    <span className="font-medium text-stone-900">{Math.round((campaign.clicked / campaign.sent) * 100)}% taux de clic</span>
                  </div>
                  <Progress value={(campaign.clicked / campaign.sent) * 100} className="h-2" />
                </div>
              )}

              {/* Target Groups & Dates */}
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1 text-stone-500">
                    <Users className="w-4 h-4" />
                    <span>{campaign.targetGroups.join(", ")}</span>
                  </div>
                  {campaign.startDate && (
                    <div className="flex items-center gap-1 text-stone-500">
                      <Calendar className="w-4 h-4" />
                      <span>{campaign.startDate}</span>
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
                    <Button variant="outline" size="sm">
                      <Play className="w-4 h-4 mr-1" />
                      Reprendre
                    </Button>
                  )}
                  {campaign.status === "completed" && (
                    <Button variant="outline" size="sm">
                      <RotateCcw className="w-4 h-4 mr-1" />
                      Relancer
                    </Button>
                  )}
                  <Button variant="ghost" size="sm">
                    <Edit3 className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

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
    </div>
  );
}
