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
  Plus
} from "lucide-react";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";

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

import { Mail, Lock, Smartphone } from "lucide-react";

const assignedTrainings = [
  { 
    id: 1, 
    user: "Sophie Martin", 
    email: "sophie.martin@company.com",
    module: "Ingénierie sociale avancée", 
    assigned: "2024-06-10",
    due: "2024-06-17",
    progress: 35,
    status: "in_progress",
    priority: "high"
  },
  { 
    id: 2, 
    user: "Pierre Durand", 
    email: "pierre.durand@company.com",
    module: "Identifier les emails de phishing", 
    assigned: "2024-06-08",
    due: "2024-06-15",
    progress: 0,
    status: "not_started",
    priority: "high"
  },
  { 
    id: 3, 
    user: "Marie Lefebvre", 
    email: "marie.lefebvre@company.com",
    module: "Réponse aux incidents", 
    assigned: "2024-06-05",
    due: "2024-06-12",
    progress: 100,
    status: "completed",
    priority: "medium"
  },
  { 
    id: 4, 
    user: "Lucas Bernard", 
    email: "lucas.bernard@company.com",
    module: "Protection des credentials", 
    assigned: "2024-06-03",
    due: "2024-06-10",
    progress: 78,
    status: "in_progress",
    priority: "medium"
  },
];

const learningStats = [
  { label: "Taux de complétion", value: 68, target: 80 },
  { label: "Score moyen", value: 7.2, target: 8.0 },
  { label: "Temps moyen", value: "18min", target: "15min" },
  { label: "Certifiés", value: 245, target: 300 },
];

const leaderboard = [
  { rank: 1, name: "Emma Petit", department: "IT", score: 98, completed: 12 },
  { rank: 2, name: "Jean Dupont", department: "Finance", score: 95, completed: 11 },
  { rank: 3, name: "Claire Moreau", department: "RH", score: 92, completed: 10 },
  { rank: 4, name: "Alexandre Roux", department: "IT", score: 89, completed: 10 },
  { rank: 5, name: "Julie Blanc", department: "Marketing", score: 87, completed: 9 },
];

export default function Training() {
  const [showAssignDialog, setShowAssignDialog] = useState(false);

  return (
    <div className="h-full overflow-y-auto p-6 custom-scrollbar">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-stone-900">Formation & Sensibilisation</h1>
          <p className="text-stone-500 mt-1">Modules de formation personnalisés et auto-adaptatifs</p>
        </div>
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
                  Basé sur leur profil de risque, 5 utilisateurs devraient suivre "Ingénierie sociale avancée"
                </p>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <Button variant="outline" onClick={() => setShowAssignDialog(false)}>
                  Annuler
                </Button>
                <Button className="bg-green-600 hover:bg-green-700">
                  Assigner automatiquement
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Learning Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {learningStats.map((stat, index) => (
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
        {/* Training Modules */}
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
                  <Badge variant="outline" className="cursor-pointer">Requis</Badge>
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
                          <div className="mt-3">
                            <div className="flex items-center justify-between text-xs mb-1">
                              <span className="text-stone-500">Taux de complétion</span>
                              <span className="font-medium">{module.completion}%</span>
                            </div>
                            <Progress value={module.completion} className="h-1.5" />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Assigned Trainings */}
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
                      <th className="text-center py-3 px-4 text-sm font-medium text-stone-700">Échéance</th>
                      <th className="text-center py-3 px-4 text-sm font-medium text-stone-700">Progression</th>
                      <th className="text-right py-3 px-4 text-sm font-medium text-stone-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {assignedTrainings.map((training) => (
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
                        <td className="py-3 px-4 text-center text-sm text-stone-600">
                          <div className="flex items-center justify-center gap-1">
                            <Clock className="w-3 h-3" />
                            {training.due}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <Progress value={training.progress} className="flex-1 h-2" />
                            <span className="text-xs text-stone-500 w-10">{training.progress}%</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <Button size="sm" variant="ghost">
                            <MoreVertical className="w-4 h-4" />
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

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Leaderboard */}
          <Card className="border-stone-200">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Trophy className="w-5 h-5 text-yellow-600" />
                Classement
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {leaderboard.map((user, index) => (
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

          {/* AI Recommendations */}
          <Card className="border-stone-200 bg-gradient-to-br from-purple-50 to-blue-50 border-purple-200">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Brain className="w-5 h-5 text-purple-600" />
                Recommandations IA
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="p-3 bg-white rounded-lg border border-purple-100">
                  <div className="flex items-start gap-2">
                    <Star className="w-4 h-4 text-purple-500 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-stone-900">Module prioritaire</p>
                      <p className="text-xs text-stone-500 mt-1">
                        "Ingénierie sociale avancée" pour le département Ventes
                      </p>
                    </div>
                  </div>
                </div>
                <div className="p-3 bg-white rounded-lg border border-purple-100">
                  <div className="flex items-start gap-2">
                    <Zap className="w-4 h-4 text-yellow-500 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-stone-900">Action rapide</p>
                      <p className="text-xs text-stone-500 mt-1">
                        3 utilisateurs à risque élevé n'ont pas commencé leur formation
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="border-stone-200">
            <CardHeader>
              <CardTitle className="text-lg">Actions Rapides</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  <FileText className="w-4 h-4 mr-2" />
                  Générer rapport de formation
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Play className="w-4 h-4 mr-2" />
                  Démarrer simulation
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Users className="w-4 h-4 mr-2" />
                  Voir progrès équipe
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
