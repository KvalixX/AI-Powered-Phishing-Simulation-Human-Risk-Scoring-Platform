import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { 
  Users as UsersIcon, 
  Search, 
  Filter,
  MoreVertical,
  Mail,
  Shield,
  AlertTriangle,
  CheckCircle2,
  GraduationCap,
  Target,
  TrendingUp,
  TrendingDown,
  Download,
  Plus,
  UserPlus
} from "lucide-react";
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

const users = [
  { 
    id: 1, 
    name: "Sophie Martin", 
    email: "sophie.martin@company.com",
    department: "Ventes",
    role: "Manager",
    riskScore: 85,
    status: "active",
    testsTaken: 8,
    testsFailed: 5,
    testsPassed: 3,
    trainingCompleted: 2,
    lastActivity: "2024-06-10",
    trend: "up"
  },
  { 
    id: 2, 
    name: "Pierre Durand", 
    email: "pierre.durand@company.com",
    department: "Finance",
    role: "Analyste",
    riskScore: 78,
    status: "active",
    testsTaken: 6,
    testsFailed: 4,
    testsPassed: 2,
    trainingCompleted: 1,
    lastActivity: "2024-06-08",
    trend: "stable"
  },
  { 
    id: 3, 
    name: "Marie Lefebvre", 
    email: "marie.lefebvre@company.com",
    department: "RH",
    role: "Responsable",
    riskScore: 72,
    status: "active",
    testsTaken: 7,
    testsFailed: 4,
    testsPassed: 3,
    trainingCompleted: 3,
    lastActivity: "2024-06-05",
    trend: "down"
  },
  { 
    id: 4, 
    name: "Lucas Bernard", 
    email: "lucas.bernard@company.com",
    department: "Ventes",
    role: "Commercial",
    riskScore: 68,
    status: "active",
    testsTaken: 5,
    testsFailed: 3,
    testsPassed: 2,
    trainingCompleted: 1,
    lastActivity: "2024-06-03",
    trend: "down"
  },
  { 
    id: 5, 
    name: "Emma Petit", 
    email: "emma.petit@company.com",
    department: "IT",
    role: "Développeur",
    riskScore: 25,
    status: "active",
    testsTaken: 10,
    testsFailed: 1,
    testsPassed: 9,
    trainingCompleted: 8,
    lastActivity: "2024-06-12",
    trend: "down"
  },
  { 
    id: 6, 
    name: "Jean Dupont", 
    email: "jean.dupont@company.com",
    department: "Finance",
    role: "Contrôleur",
    riskScore: 45,
    status: "active",
    testsTaken: 8,
    testsFailed: 3,
    testsPassed: 5,
    trainingCompleted: 6,
    lastActivity: "2024-06-11",
    trend: "down"
  },
  { 
    id: 7, 
    name: "Claire Moreau", 
    email: "claire.moreau@company.com",
    department: "RH",
    role: "Recruteur",
    riskScore: 52,
    status: "active",
    testsTaken: 6,
    testsFailed: 2,
    testsPassed: 4,
    trainingCompleted: 5,
    lastActivity: "2024-06-09",
    trend: "stable"
  },
  { 
    id: 8, 
    name: "Alexandre Roux", 
    email: "alexandre.roux@company.com",
    department: "IT",
    role: "Admin",
    riskScore: 15,
    status: "active",
    testsTaken: 12,
    testsFailed: 0,
    testsPassed: 12,
    trainingCompleted: 10,
    lastActivity: "2024-06-12",
    trend: "stable"
  },
];

const departmentStats = [
  { dept: "IT", users: 45, avgRisk: 20, color: "#10b981" },
  { dept: "RH", users: 32, avgRisk: 47, color: "#22c55e" },
  { dept: "Finance", users: 28, avgRisk: 52, color: "#f97316" },
  { dept: "Marketing", users: 38, avgRisk: 48, color: "#eab308" },
  { dept: "Ventes", users: 52, avgRisk: 65, color: "#ef4444" },
];

const riskDistribution = [
  { name: "Faible", value: 45, color: "#10b981" },
  { name: "Moyen", value: 30, color: "#eab308" },
  { name: "Élevé", value: 15, color: "#f97316" },
  { name: "Critique", value: 10, color: "#ef4444" },
];

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

export default function Users() {
  return (
    <div className="h-full overflow-y-auto p-6 custom-scrollbar">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-stone-900">Utilisateurs</h1>
          <p className="text-stone-500 mt-1">Gérez les utilisateurs et suivez leur exposition aux menaces</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Exporter
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700">
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
              <Badge variant="outline" className="text-green-600">+5 ce mois</Badge>
            </div>
            <div className="text-2xl font-bold text-stone-900">195</div>
            <p className="text-sm text-stone-500">Utilisateurs actifs</p>
          </CardContent>
        </Card>

        <Card className="border-stone-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <Shield className="w-5 h-5 text-green-600" />
              <Badge variant="outline" className="text-green-600">Bien</Badge>
            </div>
            <div className="text-2xl font-bold text-stone-900">42%</div>
            <p className="text-sm text-stone-500">Score de risque moyen</p>
          </CardContent>
        </Card>

        <Card className="border-stone-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <GraduationCap className="w-5 h-5 text-purple-600" />
              <Badge variant="outline" className="text-green-600">↑ 12%</Badge>
            </div>
            <div className="text-2xl font-bold text-stone-900">68%</div>
            <p className="text-sm text-stone-500">Taux de formation</p>
          </CardContent>
        </Card>

        <Card className="border-stone-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              <Badge variant="outline" className="text-red-600">Action</Badge>
            </div>
            <div className="text-2xl font-bold text-stone-900">12</div>
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
          />
        </div>
        <Select defaultValue="all">
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Département" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous</SelectItem>
            <SelectItem value="it">IT</SelectItem>
            <SelectItem value="rh">RH</SelectItem>
            <SelectItem value="finance">Finance</SelectItem>
            <SelectItem value="sales">Ventes</SelectItem>
            <SelectItem value="marketing">Marketing</SelectItem>
          </SelectContent>
        </Select>
        <Select defaultValue="all">
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Niveau de risque" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous</SelectItem>
            <SelectItem value="critical">Critique</SelectItem>
            <SelectItem value="high">Élevé</SelectItem>
            <SelectItem value="medium">Moyen</SelectItem>
            <SelectItem value="low">Faible</SelectItem>
          </SelectContent>
        </Select>
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
                {users.map((user) => (
                  <tr key={user.id} className="border-b border-stone-100 hover:bg-stone-50">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="w-10 h-10">
                          <AvatarFallback className="bg-stone-200 text-stone-700">
                            {user.name.split(" ").map(n => n[0]).join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
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
                      <Button variant="ghost" size="sm">
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

      {/* Pagination */}
      <div className="flex items-center justify-between mt-6">
        <p className="text-sm text-stone-500">Affichage de 1 à 8 sur 195 utilisateurs</p>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" disabled>Précédent</Button>
          <Button variant="outline" size="sm" className="bg-stone-100">1</Button>
          <Button variant="outline" size="sm">2</Button>
          <Button variant="outline" size="sm">3</Button>
          <span className="px-2 py-1">...</span>
          <Button variant="outline" size="sm">25</Button>
          <Button variant="outline" size="sm">Suivant</Button>
        </div>
      </div>
    </div>
  );
}
