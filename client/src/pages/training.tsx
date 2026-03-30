import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  GraduationCap, 
  BookOpen, 
  Play, 
  Clock,
  CheckCircle2,
  AlertTriangle,
  Brain,
  Users,
  Trophy,
  Star,
  Target,
  Zap,
  FileText,
  MoreVertical,
  Plus,
  Trash2,
  Mail,
  Lock,
  Smartphone,
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useTrainings, useCreateTraining, useDeleteTraining, useContacts, useRiskScores } from "@/hooks/useApi";
import { useToast } from "@/hooks/use-toast";
import { exportToExcel, exportToPDF } from "@/lib/utils";

const trainingModules = [
  { 
    id: 1, 
    title: "Identifier les emails de phishing", 
    description: "Apprenez à reconnaître les signes d'un email de phishing",
    category: "Email",
    duration: "15 min",
    difficulty: "Débutant",
    completion: 78,
    aiRecommended: true,
    icon: Mail
  },
  { 
    id: 2, 
    title: "Ingénierie sociale avancée", 
    description: "Comprendre les techniques de manipulation psychologique",
    category: "Social Engineering",
    duration: "25 min",
    difficulty: "Avancé",
    completion: 45,
    aiRecommended: true,
    icon: Brain
  },
  { 
    id: 3, 
    title: "Protection des credentials", 
    description: "Sécurisez vos identifiants et mots de passe",
    category: "Sécurité",
    duration: "20 min",
    difficulty: "Intermédiaire",
    completion: 92,
    aiRecommended: false,
    icon: Lock
  },
  { 
    id: 4, 
    title: "Réponse aux incidents", 
    description: "Que faire en cas de suspicion d'attaque",
    category: "Incident",
    duration: "10 min",
    difficulty: "Débutant",
    completion: 65,
    aiRecommended: false,
    icon: AlertTriangle
  },
  { 
    id: 5, 
    title: "Phishing sur mobile", 
    description: "Menaces sur smartphones et tablettes",
    category: "Mobile",
    duration: "18 min",
    difficulty: "Intermédiaire",
    completion: 34,
    aiRecommended: true,
    icon: Smartphone
  },
  { 
    id: 6, 
    title: "Simulations interactives", 
    description: "Testez vos connaissances en temps réel",
    category: "Pratique",
    duration: "30 min",
    difficulty: "Avancé",
    completion: 28,
    aiRecommended: true,
    icon: Target
  },
];

export default function Training() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showAssignDialog, setShowAssignDialog] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedTrainingId, setSelectedTrainingId] = useState<number | null>(null);

  const { data: trainings = [] } = useTrainings();
  const { data: contacts = [] } = useContacts();
  const { data: riskScores = [] } = useRiskScores();

  const createTraining = useCreateTraining();
  const deleteTraining = useDeleteTraining();

  const handleAutoAssign = async () => {
    try {
      const atRiskUsers = [...contacts]
        .map(c => ({ ...c, risk: riskScores.find(r => r.contact_id === c.id)?.score || 0 }))
        .sort((a, b) => b.risk - a.risk)
        .slice(0, 3);

      for (const user of atRiskUsers) {
        await createTraining.mutateAsync({
          contact_id: user.id,
          content: "Ingénierie sociale avancée",
          completed: false,
          score: 0
        });
      }

      toast({ title: "Succès", description: "Formations assignées aux utilisateurs à risque." });
      setShowAssignDialog(false);
    } catch (error) {
      toast({ variant: "destructive", title: "Erreur", description: "Une erreur est survenue." });
    }
  };

  const handleDelete = async () => {
    if (!selectedTrainingId) return;
    try {
      await deleteTraining.mutateAsync(selectedTrainingId);
      toast({ title: "Succès", description: "Assignation supprimée." });
      setIsDeleteDialogOpen(false);
    } catch (error) {
      toast({ variant: "destructive", title: "Erreur", description: "Une erreur est survenue." });
    }
  };

  const dynamicAssignedTrainings = useMemo(() => {
    if (trainings.length === 0) return [];
    return trainings.map(t => {
      const c = contacts.find(contact => contact.id === t.contact_id);
      return {
        id: t.id,
        user: c ? `${c.first_name} ${c.last_name}` : "Inconnu",
        email: c ? c.email : "N/A",
        module: t.content,
        assigned: t.created_at ? new Date(t.created_at).toISOString().split('T')[0] : "N/A",
        due: t.created_at ? new Date(new Date(t.created_at).getTime() + 7*24*60*60*1000).toISOString().split('T')[0] : "N/A",
        progress: t.completed ? 100 : 0,
        status: t.completed ? "completed" : "not_started",
        priority: t.completed ? "medium" : "high"
      };
    }).sort((a,b) => a.progress - b.progress).slice(0, 10);
  }, [trainings, contacts]);

  const dynamicLearningStats = useMemo(() => {
    const totalTrainings = trainings.length;
    const completed = trainings.filter(t => t.completed).length;
    const completionRate = totalTrainings > 0 ? Math.round((completed / totalTrainings) * 100) : 0;
    const certifiedUserIds = new Set(trainings.filter(t => t.completed).map(t => t.contact_id));

    return [
      { label: "Taux de complétion", value: completionRate, target: 80 },
      { label: "Score moyen", value: 0, target: 8.0 },
      { label: "Temps moyen", value: "0min", target: "15min" },
      { label: "Certifiés", value: certifiedUserIds.size, target: contacts.length || 0 },
    ];
  }, [trainings, contacts]);

  const dynamicLeaderboard = useMemo(() => {
    if (contacts.length === 0 || trainings.length === 0) return [];
    
    const userScores = contacts.map(c => {
      const userTrainings = trainings.filter(t => t.contact_id === c.id);
      const completedCount = userTrainings.filter(t => t.completed).length;
      const rs = riskScores.find(r => r.contact_id === c.id)?.score || 50;
      const score = Math.min(100, Math.max(0, 100 - rs + (completedCount * 10)));
      return {
        name: `${c.first_name} ${c.last_name}`,
        department: c.department || "Général",
        score,
        completed: completedCount
      };
    });
    
    return userScores.sort((a,b) => b.score - a.score).slice(0, 5).map((u, i) => ({...u, rank: i+1}));
  }, [contacts, trainings, riskScores]);

  return (
    <div className="h-full overflow-y-auto p-6 custom-scrollbar">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-stone-900">Formation & Sensibilisation</h1>
          <p className="text-stone-500 mt-1">Modules de formation personnalisés et auto-adaptatifs</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => exportToPDF('app-content', 'formations_kira')}>
            <Download className="w-4 h-4 mr-2" />
            PDF
          </Button>
          <Button variant="outline" onClick={() => exportToExcel(trainings, "formations")}>
            <Download className="w-4 h-4 mr-2" />
            Excel
          </Button>
          <Dialog open={showAssignDialog} onOpenChange={setShowAssignDialog}>
          <DialogTrigger asChild>
            <Button className="bg-green-600 hover:bg-green-700">
              <Plus className="w-4 h-4 mr-2" />
              Assigner Formation
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-green-600" />
                Assigner une Formation
              </DialogTitle>
              <DialogDescription>
                Sélectionnez un module et assignez-le aux utilisateurs concernés
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Brain className="w-4 h-4 text-green-600" />
                  <span className="font-medium text-green-900">Recommandation IA</span>
                </div>
                <p className="text-sm text-green-700">
                  Basé sur leur profil de risque, les utilisateurs les plus vulnérables seront ciblés.
                </p>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <Button variant="outline" onClick={() => setShowAssignDialog(false)}>
                  Annuler
                </Button>
                <Button 
                  className="bg-green-600 hover:bg-green-700"
                  onClick={handleAutoAssign}
                  disabled={createTraining.isPending}
                >
                  Assigner automatiquement
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {dynamicLearningStats.map((stat, index) => (
          <Card key={index} className="border-stone-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-stone-500">{stat.label}</span>
                {index === 0 && <BookOpen className="w-4 h-4 text-blue-600" />}
                {index === 1 && <Trophy className="w-4 h-4 text-yellow-600" />}
                {index === 2 && <Clock className="w-4 h-4 text-stone-400" />}
                {index === 3 && <CheckCircle2 className="w-4 h-4 text-green-600" />}
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-stone-900">{stat.value}</span>
                <span className="text-sm text-stone-400">/ {stat.target}</span>
              </div>
              <Progress value={(typeof stat.value === 'number' ? stat.value : 68)} className="mt-3 h-2" />
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-stone-200">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-blue-600" />
                  Modules de Formation
                </CardTitle>
                <div className="flex gap-2">
                  <Badge variant="outline" className="cursor-pointer">Tous</Badge>
                  <Badge variant="outline" className="cursor-pointer">Recommandés IA</Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {trainingModules.map((module) => (
                  <Card key={module.id} className="border-stone-200 hover:border-blue-300 transition-colors cursor-pointer">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-lg ${
                          module.difficulty === "Débutant" ? "bg-green-100" :
                          module.difficulty === "Intermédiaire" ? "bg-yellow-100" :
                          "bg-red-100"
                        }`}>
                          <module.icon className={`w-5 h-5 ${
                            module.difficulty === "Débutant" ? "text-green-600" :
                            module.difficulty === "Intermédiaire" ? "text-yellow-600" :
                            "text-red-600"
                          }`} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <div>
                              <div className="flex items-center gap-2">
                                <h4 className="font-medium text-stone-900">{module.title}</h4>
                                {module.aiRecommended && (
                                  <Badge className="bg-purple-100 text-purple-700 text-xs">
                                    <Brain className="w-3 h-3 mr-1" />
                                    IA
                                  </Badge>
                                )}
                              </div>
                              <p className="text-xs text-stone-500 mt-1 line-clamp-2">{module.description}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 mt-3 text-xs text-stone-500">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {module.duration}
                            </span>
                            <span>{module.category}</span>
                            <Badge variant="outline" className="text-xs">
                              {module.difficulty}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-stone-200">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Users className="w-5 h-5 text-stone-600" />
                Formations Assignées
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-stone-200">
                      <th className="text-left py-3 px-4 text-sm font-medium text-stone-700">Utilisateur</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-stone-700">Module</th>
                      <th className="text-center py-3 px-4 text-sm font-medium text-stone-700">Priorité</th>
                      <th className="text-center py-3 px-4 text-sm font-medium text-stone-700">Progression</th>
                      <th className="text-right py-3 px-4 text-sm font-medium text-stone-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dynamicAssignedTrainings.map((training) => (
                      <tr key={training.id} className="border-b border-stone-100 hover:bg-stone-50">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <Avatar className="w-8 h-8">
                              <AvatarFallback className="bg-stone-200 text-stone-700 text-xs">
                                {training.user.split(" ").map(n => n[0]).join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium text-stone-900">{training.user}</p>
                              <p className="text-xs text-stone-500">{training.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-sm text-stone-700">{training.module}</td>
                        <td className="py-3 px-4 text-center">
                          <Badge className={
                            training.priority === "high" ? "bg-red-100 text-red-700" :
                            "bg-yellow-100 text-yellow-700"
                          }>
                            {training.priority === "high" ? "Haute" : "Moyenne"}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <div className="flex items-center gap-2">
                            <Progress value={training.progress} className="flex-1 h-2" />
                            <span className="text-xs text-stone-500 w-10">{training.progress}%</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            className="text-red-600"
                            onClick={() => {
                              setSelectedTrainingId(training.id);
                              setIsDeleteDialogOpen(true);
                            }}
                          >
                            <Trash2 className="w-4 h-4" />
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

        <div className="space-y-6">
          <Card className="border-stone-200">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Trophy className="w-5 h-5 text-yellow-600" />
                Classement
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {dynamicLeaderboard.map((user, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 rounded-lg hover:bg-stone-50">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                      user.rank === 1 ? "bg-yellow-100 text-yellow-700" :
                      user.rank === 2 ? "bg-stone-200 text-stone-700" :
                      user.rank === 3 ? "bg-orange-100 text-orange-700" :
                      "bg-stone-100 text-stone-600"
                    }`}>
                      {user.rank}
                    </div>
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="bg-stone-200 text-stone-700 text-xs">
                        {user.name.split(" ").map(n => n[0]).join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="font-medium text-stone-900 text-sm">{user.name}</p>
                      <p className="text-xs text-stone-500">{user.department}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-stone-900">{user.score}%</p>
                      <p className="text-xs text-stone-500">{user.completed} modules</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-stone-200">
            <CardHeader>
              <CardTitle className="text-lg">Actions Rapides</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start" onClick={() => navigate('/reports')}>
                  <FileText className="w-4 h-4 mr-2" />
                  Générer rapport
                </Button>
                <Button variant="outline" className="w-full justify-start" onClick={() => navigate('/campaigns')}>
                  <Play className="w-4 h-4 mr-2" />
                  Démarrer simulation
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer l'assignation ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action retirera le module de formation de la liste de l'utilisateur.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction 
              className="bg-red-600 hover:bg-red-700"
              onClick={handleDelete}
              disabled={deleteTraining.isPending}
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
