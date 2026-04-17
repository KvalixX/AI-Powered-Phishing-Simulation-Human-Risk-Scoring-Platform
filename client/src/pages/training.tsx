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
  Printer,
  Eye
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

// Static modules removed to focus on AI-driven email training
const trainingModules: any[] = [];

export default function Training() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showAssignDialog, setShowAssignDialog] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedTrainingId, setSelectedTrainingId] = useState<number | null>(null);
  const [viewingTraining, setViewingTraining] = useState<any>(null);

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
      const content = t.ai_content || t.content; // Compatibility with both fields
      return {
        id: t.id,
        user: c ? `${c.first_name} ${c.last_name}` : "Inconnu",
        email: c ? c.email : "N/A",
        module: "Sensibilisation Cyber (IA)",
        assigned: t.created_at ? new Date(t.created_at).toISOString().split('T')[0] : "N/A",
        due: t.created_at ? new Date(new Date(t.created_at).getTime() + 7*24*60*60*1000).toISOString().split('T')[0] : "N/A",
        progress: t.status === 'completed' ? 100 : (content ? 50 : 0),
        status: t.status || 'not_started',
        priority: (t.status === 'completed') ? "low" : "high",
        content: content,
        isAiGenerated: content && content.includes('<h')
      };
    }).sort((a,b) => (a.status === 'completed' ? 1 : -1)).slice(0, 10);
  }, [trainings, contacts]);

  const dynamicLearningStats = useMemo(() => {
    const totalTrainings = trainings.length;
    // Count as completed only if status is explicitly 'completed'
    const completedCount = trainings.filter(t => t.status === 'completed').length;
    const completionRate = totalTrainings > 0 ? Math.round((completedCount / totalTrainings) * 100) : 0;
    // Users who have finished their training
    const certifiedUserIds = new Set(trainings.filter(t => t.status === 'completed').map(t => t.contact_id));

    return [
      { label: "Taux de complétion", value: completionRate, displayValue: `${completionRate}%`, target: 80, targetDisplay: "80%" },
      { label: "Délivrés (IA)", value: trainings.filter(t => t.ai_content || t.content).length, displayValue: trainings.filter(t => t.ai_content || t.content).length, target: totalTrainings, targetDisplay: totalTrainings },
      { label: "En attente de lecture", value: trainings.filter(t => t.status !== 'completed').length, displayValue: trainings.filter(t => t.status !== 'completed').length, target: totalTrainings, targetDisplay: totalTrainings },
      { label: "Utilisateurs Certifiés", value: certifiedUserIds.size, displayValue: certifiedUserIds.size, target: contacts.length || 0, targetDisplay: contacts.length || 0 },
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
          <p className="text-stone-500 mt-1 flex items-center gap-2">
            Modules de formation personnalisés envoyés par Gmail aux utilisateurs vulnérables
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
              <Mail className="w-3 h-3 mr-1" /> Automatisé
            </Badge>
          </p>
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
                <span className="text-2xl font-bold text-stone-900">{stat.displayValue}</span>
                <span className="text-sm text-stone-400">/ {stat.targetDisplay}</span>
              </div>
              <Progress 
                value={Number(stat.target) > 0 ? (Number(stat.value) / Number(stat.target)) * 100 : 0} 
                className="mt-3 h-2" 
              />
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-stone-200">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Mail className="w-5 h-5 text-blue-600" />
                Dernières Formations Envoyées par Email
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
                      <th className="text-center py-3 px-4 text-sm font-medium text-stone-700">Statut</th>
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
                          <div className="flex items-center justify-center gap-2">
                            {training.status === 'completed' ? (
                              <Badge className="bg-green-100 text-green-700">
                                <CheckCircle2 className="w-3 h-3 mr-1" />
                                Terminé
                              </Badge>
                            ) : (
                              <Badge className="bg-blue-100 text-blue-700">
                                <Clock className="w-3 h-3 mr-1" />
                                Envoyé / En attente
                              </Badge>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex justify-end gap-2">
                            {training.isAiGenerated && (
                              <Button 
                                size="sm" 
                                variant="ghost" 
                                className="text-blue-600"
                                onClick={() => setViewingTraining(training)}
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                            )}
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
                          </div>
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

      <Dialog open={!!viewingTraining} onOpenChange={(open) => !open && setViewingTraining(null)}>
        <DialogContent className="max-w-3xl max-h-[85vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Mail className="w-5 h-5 text-blue-600" />
              Contenu de la Formation envoyée
            </DialogTitle>
            <DialogDescription>
              Voici l'article de formation généré par l'IA et envoyé à {viewingTraining?.user}
            </DialogDescription>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto mt-4 p-6 bg-stone-50 border border-stone-200 rounded-lg">
            <div 
              className="prose prose-stone max-w-none"
              dangerouslySetInnerHTML={{ __html: viewingTraining?.content }}
            />
          </div>
          <div className="flex justify-end mt-4">
            <Button onClick={() => setViewingTraining(null)}>Fermer</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
