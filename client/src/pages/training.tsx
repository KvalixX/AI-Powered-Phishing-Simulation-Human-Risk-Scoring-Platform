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
  Eye,
  Search
} from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
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
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

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

  const filteredTrainings = useMemo(() => {
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
        isAiGenerated: content && content.includes('<h'),
        email_opened_at: t.email_opened_at,
        /** Pixel d’ouverture ou clic sur « J’ai compris » (API track/training). */
        recipientHasOpenedMail: Boolean(t.email_opened_at) || t.status === 'completed',
      };
    })
    .filter(t => 
      t.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.module.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a,b) => (a.status === 'completed' ? 1 : -1));
  }, [trainings, contacts, searchTerm]);

  const totalPages = Math.ceil(filteredTrainings.length / itemsPerPage);
  const dynamicAssignedTrainings = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredTrainings.slice(start, start + itemsPerPage);
  }, [filteredTrainings, currentPage]);

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
      { label: "En attente d’ouverture du mail", value: trainings.filter(t => t.status !== 'completed' && !t.email_opened_at).length, displayValue: trainings.filter(t => t.status !== 'completed' && !t.email_opened_at).length, target: totalTrainings, targetDisplay: totalTrainings },
    ];
  }, [trainings, contacts]);



  const trainingStatusBadge = (status: string, emailOpenedAt: string | null | undefined) => {
    if (status === 'completed') {
      return (
        <Badge className="bg-green-100 text-green-700">
          <CheckCircle2 className="w-3 h-3 mr-1" />
          Mail consulté — terminé
        </Badge>
      );
    }
    if (emailOpenedAt || status === 'in_progress') {
      return (
        <Badge className="bg-blue-100 text-blue-800">
          <Eye className="w-3 h-3 mr-1" />
          Mail ouvert — à valider
        </Badge>
      );
    }
    return (
      <Badge className="bg-stone-200 text-stone-700">
        <Mail className="w-3 h-3 mr-1" />
        Envoyé — non consulté
      </Badge>
    );
  };

  return (
    <TooltipProvider delayDuration={200}>
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

        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {dynamicLearningStats.map((stat, index) => (
          <Card key={index} className="border-stone-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-stone-500">{stat.label}</span>
                {index === 0 && <BookOpen className="w-4 h-4 text-blue-600" />}
                {index === 1 && <Trophy className="w-4 h-4 text-yellow-600" />}
                {index === 2 && <Clock className="w-4 h-4 text-stone-400" />}
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

      <div className="space-y-6">
        <div className="space-y-6">
          <Card className="border-stone-200">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Mail className="w-5 h-5 text-blue-600" />
                  <CardTitle className="text-lg">Dernières Formations Envoyées par Email</CardTitle>
                </div>
                <div className="relative w-64">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-stone-400" />
                  <Input
                    placeholder="Rechercher..."
                    className="pl-9 h-9"
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setCurrentPage(1);
                    }}
                  />
                </div>
              </div>
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
                            {trainingStatusBadge(training.status, training.email_opened_at)}
                          </div>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex justify-end gap-2">
                            {training.isAiGenerated && training.recipientHasOpenedMail && (
                              <Button 
                                size="sm" 
                                variant="ghost" 
                                className="text-blue-600"
                                onClick={() => setViewingTraining(training)}
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                            )}
                            {training.isAiGenerated && !training.recipientHasOpenedMail && (
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <span className="inline-flex">
                                    <Button size="sm" variant="ghost" className="text-stone-400" disabled aria-label="Contenu masqué jusqu'à consultation du mail">
                                      <Lock className="w-4 h-4" />
                                    </Button>
                                  </span>
                                </TooltipTrigger>
                                <TooltipContent side="left" className="max-w-xs">
                                  Le contenu sera visible ici une fois le destinataire ouvert le mail de formation et cliqué sur le lien de confirmation.
                                </TooltipContent>
                              </Tooltip>
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

              {totalPages > 1 && (
                <div className="mt-6">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious 
                          href="#" 
                          onClick={(e) => {
                            e.preventDefault();
                            if (currentPage > 1) setCurrentPage(currentPage - 1);
                          }}
                          className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                        />
                      </PaginationItem>
                      
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                        // Logic to show only a subset of pages if there are many
                        if (
                          totalPages > 7 &&
                          page !== 1 &&
                          page !== totalPages &&
                          Math.abs(page - currentPage) > 1
                        ) {
                          if (Math.abs(page - currentPage) === 2) {
                            return (
                              <PaginationItem key={page}>
                                <PaginationEllipsis />
                              </PaginationItem>
                            );
                          }
                          return null;
                        }

                        return (
                          <PaginationItem key={page}>
                            <PaginationLink
                              href="#"
                              isActive={currentPage === page}
                              onClick={(e) => {
                                e.preventDefault();
                                setCurrentPage(page);
                              }}
                            >
                              {page}
                            </PaginationLink>
                          </PaginationItem>
                        );
                      })}

                      <PaginationItem>
                        <PaginationNext 
                          href="#" 
                          onClick={(e) => {
                            e.preventDefault();
                            if (currentPage < totalPages) setCurrentPage(currentPage + 1);
                          }}
                          className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
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
    </TooltipProvider>
  );
}
