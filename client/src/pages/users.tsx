import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { 
  Users as UsersIcon, 
  Search, 
  Filter,
  Plus,
  UserPlus,
  Edit,
  Trash2,
  MoreVertical as ActionsIcon,
  Mail,
  Shield,
  AlertTriangle,
  CheckCircle2,
  GraduationCap,
  Target,
  TrendingUp,
  TrendingDown,
  Download,
  Printer,
  FileText
} from "lucide-react";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog";
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
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";



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

import { 
  useContacts, 
  useRiskScores, 
  useBehavioralEvents, 
  useTrainings,
  useCreateContact,
  useUpdateContact,
  useDeleteContact,
  useImportContacts
} from "@/hooks/useApi";
import { useMemo, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Contact } from "@/lib/api";
import { exportToExcel, exportToPDF, downloadUserTemplateCSV } from "@/lib/utils";
import { Upload } from "lucide-react";

export default function Users() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const importContacts = useImportContacts();
  const { data: contacts = [], isLoading: loadingContacts } = useContacts();
  const { data: riskScores = [] } = useRiskScores();
  const { data: trainings = [] } = useTrainings();
  const { data: behavioralEvents = [] } = useBehavioralEvents();

  const createContact = useCreateContact();
  const updateContact = useUpdateContact();
  const deleteContact = useDeleteContact();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  
  // Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [deptFilter, setDeptFilter] = useState("all");
  const [riskFilter, setRiskFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const [formData, setFormData] = useState<Partial<Contact>>({
    first_name: "",
    last_name: "",
    email: "",
    department: "",
    position: "",
    language: "fr"
  });

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const res = await importContacts.mutateAsync(file);
      toast({ title: "Succès", description: res.message || "Importation réussie." });
    } catch (e) {
      toast({ variant: "destructive", title: "Erreur", description: "L'importation a échoué. Assurez-vous que le format est CSV." });
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleOpenAddDialog = () => {
    setSelectedContact(null);
    setFormData({
      first_name: "",
      last_name: "",
      email: "",
      department: "",
      position: "",
      language: "fr"
    });
    setIsDialogOpen(true);
  };

  const handleOpenEditDialog = (contact: Contact) => {
    setSelectedContact(contact);
    setFormData({
      first_name: contact.first_name,
      last_name: contact.last_name,
      email: contact.email,
      department: contact.department || "",
      position: contact.position || "",
      language: contact.language || "fr"
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (selectedContact) {
        await updateContact.mutateAsync({ id: selectedContact.id, data: formData });
        toast({ title: "Succès", description: "Utilisateur mis à jour avec succès." });
      } else {
        await createContact.mutateAsync(formData);
        toast({ title: "Succès", description: "Utilisateur créé avec succès." });
      }
      setIsDialogOpen(false);
    } catch (error) {
      toast({ variant: "destructive", title: "Erreur", description: "Une erreur est survenue." });
    }
  };

  const handleDelete = async () => {
    if (!selectedContact) return;
    try {
      await deleteContact.mutateAsync(selectedContact.id);
      toast({ title: "Succès", description: "Utilisateur supprimé avec succès." });
      setIsDeleteDialogOpen(false);
    } catch (error) {
      toast({ variant: "destructive", title: "Erreur", description: "Une erreur est survenue." });
    }
  };

  const allUsersData = useMemo(() => {
    return contacts.map(c => {
      const rs = riskScores.find(r => r.contact_id === c.id)?.score || 0;
      const userEvents = behavioralEvents.filter(e => e.contact_id === c.id);
      
      const testsTaken = new Set(userEvents.map(e => e.campaign_id)).size;
      const testsFailed = userEvents.filter(e => e.event_type === 'click' || e.event_type === 'submission').length;
      const testsPassed = Math.max(0, testsTaken - testsFailed);
      
      const userTrainings = trainings.filter(t => t.contact_id === c.id).length;
      
      let lastActivity = 'N/A';
      if (userEvents.length > 0) {
        lastActivity = new Date(Math.max(...userEvents.map(e => new Date(e.event_timestamp || Date.now()).getTime()))).toISOString().split('T')[0];
      }
      
      return {
        id: c.id,
        name: `${c.first_name} ${c.last_name}`,
        email: c.email,
        avatar: (c as any).avatar,
        department: c.department || 'Non spécifié',
        role: c.position || 'Général',
        riskScore: rs,
        status: "active",
        testsTaken,
        testsFailed,
        testsPassed,
        trainingCompleted: userTrainings,
        lastActivity,
        trend: "stable" as "stable" | "up" | "down"
      };
    });
  }, [contacts, riskScores, trainings, behavioralEvents]);

  const filteredUsers = useMemo(() => {
    return allUsersData.filter(user => {
      const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           user.email.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesDept = deptFilter === "all" || user.department.toLowerCase() === deptFilter.toLowerCase();
      
      let matchesRisk = true;
      if (riskFilter !== "all") {
        if (riskFilter === "critical") matchesRisk = user.riskScore >= 70;
        else if (riskFilter === "high") matchesRisk = user.riskScore >= 50 && user.riskScore < 70;
        else if (riskFilter === "medium") matchesRisk = user.riskScore >= 30 && user.riskScore < 50;
        else if (riskFilter === "low") matchesRisk = user.riskScore < 30;
      }
      
      return matchesSearch && matchesDept && matchesRisk;
    });
  }, [allUsersData, searchQuery, deptFilter, riskFilter]);

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const dynamicUsers = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredUsers.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredUsers, currentPage]);

  const departmentStats = useMemo(() => {
    if (allUsersData.length === 0) return [];
    
    // Group users by department
    const depts = allUsersData.reduce((acc, user) => {
      if (!acc[user.department]) {
        acc[user.department] = { users: 0, scoreSum: 0 };
      }
      acc[user.department].users++;
      acc[user.department].scoreSum += user.riskScore;
      return acc;
    }, {} as Record<string, { users: number, scoreSum: number }>);
    
    const colors = ["#10b981", "#22c55e", "#f97316", "#eab308", "#ef4444", "#3b82f6", "#a855f7"];
    return Object.entries(depts).map(([dept, data], i) => ({
      dept,
      users: data.users,
      avgRisk: Math.round(data.scoreSum / data.users),
      color: colors[i % colors.length]
    }));
  }, [allUsersData]);

  const riskDistribution = useMemo(() => {
    if (allUsersData.length === 0) return [];
    
    let low = 0, medium = 0, high = 0, critical = 0;
    allUsersData.forEach(u => {
      if (u.riskScore >= 70) critical++;
      else if (u.riskScore >= 50) high++;
      else if (u.riskScore >= 30) medium++;
      else low++;
    });
    
    return [
      { name: "Faible", value: low, color: "#10b981" },
      { name: "Moyen", value: medium, color: "#eab308" },
      { name: "Élevé", value: high, color: "#f97316" },
      { name: "Critique", value: critical, color: "#ef4444" },
    ];
  }, [allUsersData]);

  const avgRiskOverall = allUsersData.length > 0 
    ? Math.round(allUsersData.reduce((sum, u) => sum + u.riskScore, 0) / allUsersData.length)
    : 0;

  const usersInTraining = allUsersData.filter(u => u.trainingCompleted > 0).length;
  const trainingRate = allUsersData.length > 0 ? Math.round((usersInTraining / allUsersData.length) * 100) : 0;
  
  const usersAtRisk = allUsersData.filter(u => u.riskScore >= 70).length;

  return (
    <div className="h-full overflow-y-auto p-6 custom-scrollbar">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-stone-900">Utilisateurs</h1>
          <p className="text-stone-500 mt-1">Gérez les utilisateurs et suivez leur exposition aux menaces</p>
        </div>
        <div className="flex gap-3">
          <input 
            type="file" 
            accept=".csv" 
            ref={fileInputRef} 
            className="hidden" 
            onChange={handleFileUpload}
          />
          <Button variant="outline" onClick={() => fileInputRef.current?.click()} disabled={importContacts.isPending}>
            <Upload className="w-4 h-4 mr-2" />
            {importContacts.isPending ? "Importation..." : "Importer CSV"}
          </Button>
          <Button variant="ghost" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50" onClick={downloadUserTemplateCSV}>
            <FileText className="w-4 h-4 mr-2" />
            Modèle CSV
          </Button>
          <Button variant="outline" onClick={() => exportToPDF('app-content', 'utilisateurs_kira')}>
            <Download className="w-4 h-4 mr-2" />
            Exporter en PDF
          </Button>
          <Button variant="outline" onClick={() => exportToExcel(filteredUsers, "utilisateurs_filtres")}>
            <Download className="w-4 h-4 mr-2" />
            Exporter en Excel
          </Button>
          <Button 
            className="bg-blue-600 hover:bg-blue-700"
            onClick={handleOpenAddDialog}
          >
            <UserPlus className="w-4 h-4 mr-2" />
            Ajouter
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="border-stone-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <UsersIcon className="w-5 h-5 text-blue-600" />
              <Badge variant="outline" className="text-green-600">Total</Badge>
            </div>
            <div className="text-2xl font-bold text-stone-900">{allUsersData.length}</div>
            <p className="text-sm text-stone-500">Utilisateurs actifs</p>
          </CardContent>
        </Card>

        <Card className="border-stone-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <Shield className="w-5 h-5 text-green-600" />
              <Badge variant="outline" className="text-green-600">{avgRiskOverall < 50 ? 'Bien' : 'Attention'}</Badge>
            </div>
            <div className="text-2xl font-bold text-stone-900">{avgRiskOverall}%</div>
            <p className="text-sm text-stone-500">Score de risque moyen</p>
          </CardContent>
        </Card>

        <Card className="border-stone-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <GraduationCap className="w-5 h-5 text-purple-600" />
              <Badge variant="outline" className="text-green-600">Couverture</Badge>
            </div>
            <div className="text-2xl font-bold text-stone-900">{trainingRate}%</div>
            <p className="text-sm text-stone-500">Taux de formation</p>
          </CardContent>
        </Card>

        <Card className="border-stone-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              <Badge variant="outline" className="text-red-600">Critique &ge; 70</Badge>
            </div>
            <div className="text-2xl font-bold text-stone-900">{usersAtRisk}</div>
            <p className="text-sm text-stone-500">Utilisateurs à risque</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card className="border-stone-200">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Target className="w-5 h-5 text-blue-600" />
              Risque par Département
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={departmentStats}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="dept" stroke="#6b7280" fontSize={12} />
                <YAxis stroke="#6b7280" fontSize={12} />
                <Tooltip 
                  contentStyle={{ backgroundColor: "#fff", border: "1px solid #e5e7eb", borderRadius: "8px" }}
                />
                <Bar dataKey="avgRisk" name="Risque moyen" radius={[4, 4, 0, 0]}>
                  {departmentStats.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-stone-200">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Shield className="w-5 h-5 text-green-600" />
              Distribution du Risque
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={riskDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {riskDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-center flex-wrap gap-3 mt-4">
              {riskDistribution.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-sm text-stone-600">{item.name}: {item.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-stone-400 w-4 h-4" />
          <Input 
            placeholder="Rechercher un utilisateur..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>
        <Select value={deptFilter} onValueChange={(val) => {
          setDeptFilter(val);
          setCurrentPage(1);
        }}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Département" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les départements</SelectItem>
            <SelectItem value="it">IT</SelectItem>
            <SelectItem value="rh">RH</SelectItem>
            <SelectItem value="finance">Finance</SelectItem>
            <SelectItem value="sales">Ventes</SelectItem>
            <SelectItem value="marketing">Marketing</SelectItem>
          </SelectContent>
        </Select>
        <Select value={riskFilter} onValueChange={(val) => {
          setRiskFilter(val);
          setCurrentPage(1);
        }}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Niveau de risque" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les risques</SelectItem>
            <SelectItem value="critical">Critique</SelectItem>
            <SelectItem value="high">Élevé</SelectItem>
            <SelectItem value="medium">Moyen</SelectItem>
            <SelectItem value="low">Faible</SelectItem>
          </SelectContent>
        </Select>
        {(searchQuery || deptFilter !== "all" || riskFilter !== "all") && (
          <Button 
            variant="ghost" 
            className="text-stone-500 hover:text-stone-900"
            onClick={() => {
              setSearchQuery("");
              setDeptFilter("all");
              setRiskFilter("all");
              setCurrentPage(1);
            }}
          >
            Réinitialiser
          </Button>
        )}
        <Button variant="outline">
          <Filter className="w-4 h-4 mr-2" />
          Plus de filtres
        </Button>
      </div>

      {/* Users Table */}
      <Card className="border-stone-200">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-stone-200 bg-stone-50">
                  <th className="text-left py-3 px-4 text-sm font-medium text-stone-700">Utilisateur</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-stone-700">Département</th>
                  <th className="text-center py-3 px-4 text-sm font-medium text-stone-700">Score</th>
                  <th className="text-center py-3 px-4 text-sm font-medium text-stone-700">Tests</th>
                  <th className="text-center py-3 px-4 text-sm font-medium text-stone-700">Formations</th>
                  <th className="text-center py-3 px-4 text-sm font-medium text-stone-700">Dernière activité</th>
                  <th className="text-center py-3 px-4 text-sm font-medium text-stone-700">Tendance</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-stone-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {(loadingContacts ? [] : dynamicUsers).map((user) => (
                  <tr key={user.id} className="border-b border-stone-100 hover:bg-stone-50">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="w-10 h-10">
                          <AvatarImage src={user.avatar} />
                          <AvatarFallback className="bg-stone-200 text-stone-700">
                            {user.name.split(" ").map(n => n[0]).join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div 
                          className="cursor-pointer hover:underline"
                          onClick={() => navigate(`/profile/${user.id}`)}
                        >
                          <p className="font-medium text-stone-900">{user.name}</p>
                          <p className="text-xs text-stone-500">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div>
                        <p className="text-sm text-stone-900">{user.department}</p>
                        <p className="text-xs text-stone-500">{user.role}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <Badge className={getRiskColor(user.riskScore)}>
                        {user.riskScore} - {getRiskLabel(user.riskScore)}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="text-sm">
                        <span className="text-stone-900 font-medium">{user.testsTaken}</span>
                        <span className="text-stone-500"> tests</span>
                      </div>
                      <div className="text-xs mt-1">
                        <span className="text-green-600">{user.testsPassed} réussis</span>
                        <span className="text-stone-400 mx-1">|</span>
                        <span className="text-red-600">{user.testsFailed} échoués</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <GraduationCap className="w-4 h-4 text-stone-400" />
                        <span className="text-sm text-stone-600">{user.trainingCompleted}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center text-sm text-stone-600">
                      {user.lastActivity}
                    </td>
                    <td className="py-3 px-4 text-center">
                      {user.trend === "up" && (
                        <div className="flex items-center justify-center gap-1 text-red-600">
                          <TrendingUp className="w-4 h-4" />
                          <span className="text-xs">↑ Risque</span>
                        </div>
                      )}
                      {user.trend === "down" && (
                        <div className="flex items-center justify-center gap-1 text-green-600">
                          <TrendingDown className="w-4 h-4" />
                          <span className="text-xs">↓ Risque</span>
                        </div>
                      )}
                      {user.trend === "stable" && (
                        <div className="flex items-center justify-center gap-1 text-stone-500">
                          <span className="text-xs">→ Stable</span>
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <ActionsIcon className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => navigate(`/profile/${user.id}`)}>
                            <UsersIcon className="w-4 h-4 mr-2" />
                            Voir le profil
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleOpenEditDialog(contacts.find(c => c.id === user.id)!)}>
                            <Edit className="w-4 h-4 mr-2" />
                            Modifier
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            className="text-red-600"
                            onClick={() => {
                              setSelectedContact(contacts.find(c => c.id === user.id)!);
                              setIsDeleteDialogOpen(true);
                            }}
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Supprimer
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-6">
        <p className="text-sm text-stone-500">
          Affichage de {filteredUsers.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} à {Math.min(currentPage * itemsPerPage, filteredUsers.length)} sur {filteredUsers.length} utilisateurs
        </p>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(prev => prev - 1)}
          >
            Précédent
          </Button>
          {[...Array(totalPages)].map((_, i) => (
            <Button 
              key={i}
              variant="outline" 
              size="sm" 
              className={currentPage === i + 1 ? "bg-stone-100" : ""}
              onClick={() => setCurrentPage(i + 1)}
            >
              {i + 1}
            </Button>
          ))}
          <Button 
            variant="outline" 
            size="sm" 
            disabled={currentPage === totalPages || totalPages === 0}
            onClick={() => setCurrentPage(prev => prev + 1)}
          >
            Suivant
          </Button>
        </div>
      </div>
      {/* CRUD Dialogs */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{selectedContact ? "Modifier l'utilisateur" : "Ajouter un utilisateur"}</DialogTitle>
            <DialogDescription>
              {selectedContact ? "Modifiez les informations de l'utilisateur ici." : "Remplissez les informations pour le nouvel utilisateur."}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="first_name">Prénom</Label>
                <Input 
                  id="first_name" 
                  value={formData.first_name} 
                  onChange={(e) => setFormData({...formData, first_name: e.target.value})}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="last_name">Nom</Label>
                <Input 
                  id="last_name" 
                  value={formData.last_name} 
                  onChange={(e) => setFormData({...formData, last_name: e.target.value})}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email" 
                value={formData.email} 
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="department">Département</Label>
              <Input 
                id="department" 
                value={formData.department || ""} 
                onChange={(e) => setFormData({...formData, department: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="position">Position / Rôle</Label>
              <Input 
                id="position" 
                value={formData.position || ""} 
                onChange={(e) => setFormData({...formData, position: e.target.value})}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="seniority">Ancienneté</Label>
                <Select 
                  value={formData.seniority || ""} 
                  onValueChange={(val) => setFormData({...formData, seniority: val})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="junior">Junior (&lt; 2 ans)</SelectItem>
                    <SelectItem value="intermediate">Intermédiaire (2-5 ans)</SelectItem>
                    <SelectItem value="senior">Senior (5+ ans)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="language">Langue</Label>
                <Select 
                  value={formData.language || "fr"} 
                  onValueChange={(val) => setFormData({...formData, language: val})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Langue" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fr">Français</SelectItem>
                    <SelectItem value="en">English</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter className="pt-4">
              <Button type="submit" disabled={createContact.isPending || updateContact.isPending}>
                {selectedContact ? "Mettre à jour" : "Ajouter"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. Cela supprimera définitivement le contact et toutes les données associées.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction 
              className="bg-red-600 hover:bg-red-700"
              onClick={handleDelete}
              disabled={deleteContact.isPending}
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
