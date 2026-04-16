import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Target, Plus, Search, Filter, Play, Pause, RotateCcw, Trash2,
  Edit3, MoreVertical as ActionsIcon, Calendar, Users, Mail,
  MousePointer, CheckCircle2, Clock, Brain, Wand2, Sparkles,
  FileText, Download, Eye, Lock, Zap, Rocket
} from "lucide-react";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
  AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { useState, useMemo, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { exportToExcel, exportToPDF } from "@/lib/utils";

import {
  useCampaigns, useCreateCampaign, useUpdateCampaign, useDeleteCampaign,
  usePauseCampaign, useResumeCampaign, useEmailTemplates, useDepartments,
  useGeneratePhishingTemplate, useContacts, useLaunchCampaign
} from "@/hooks/useApi";
import { Campaign } from "@/lib/api";

// ── Attack types (email-focused) ──────────────────────────────────────────────
const EMAIL_ATTACK_TYPES = [
  { value: "credential_harvesting", label: "🔑 Credential Harvesting", desc: "Vol d'identifiants via faux portail" },
  { value: "spear_phishing",        label: "🎯 Spear Phishing Ciblé",  desc: "Email personnalisé ciblant une personne" },
  { value: "ceo_fraud",             label: "👑 Fraude au Président (BEC)", desc: "Usurpation du PDG pour virement urgent" },
  { value: "fake_invoice",          label: "🧾 Fausse Facture Fournisseur", desc: "Validation urgente d'une facture" },
  { value: "it_password_reset",     label: "💻 Réinitialisation Mot de Passe IT", desc: "Expiration de mot de passe réseau" },
  { value: "payroll_update",        label: "💰 Mise à Jour Bulletin de Paie", desc: "Anomalie détectée sur la paie" },
  { value: "fake_delivery",         label: "📦 Faux Colis / Livraison", desc: "Frais de douane pour colis bloqué" },
  { value: "microsoft_365",         label: "🪟 Alerte Microsoft 365",  desc: "Connexion suspecte sur compte Microsoft" },
  { value: "google_workspace",      label: "🔵 Alerte Google Workspace", desc: "Suspension de compte Google imminente" },
  { value: "gift_card",             label: "🎁 Escroquerie Cartes Cadeaux", desc: "Récompense RH via carte cadeau" },
  { value: "vpn_access",            label: "🔐 Accès VPN Compromis",   desc: "Reconfiguration VPN requise" },
  { value: "shared_document",       label: "📄 Document Partagé",       desc: "Fichier partagé SharePoint/Drive" },
  { value: "social_engineering",    label: "🛠️ Social Engineering IT",  desc: "Intervention technique à distance" },
];

const difficultyColors = {
  facile:   "bg-green-100 text-green-700 border-green-200",
  moyen:    "bg-yellow-100 text-yellow-700 border-yellow-200",
  difficile:"bg-orange-100 text-orange-700 border-orange-200",
  expert:   "bg-red-100 text-red-700 border-red-200"
} as const;

const statusColors = {
  active:    "bg-green-100 text-green-700",
  completed: "bg-blue-100 text-blue-700",
  scheduled: "bg-amber-100 text-amber-700",
  draft:     "bg-gray-100 text-gray-700",
  paused:    "bg-orange-100 text-orange-700"
} as const;

/** Campaigns that are "launched" = read-only editing */
const LAUNCHED_STATUSES: Campaign["status"][] = ["active", "completed"];

// ── Attack template definitions (mirrors AIController.php) ───────────────────
const ATTACK_TEMPLATES: Record<string, { label: string; subject: string; lure: string; cta: string; icon: string; color: string }> = {
  credential_harvesting: { label: "Credential Harvesting", icon: "🔑", color: "#3b82f6", subject: "Action requise : vérifiez vos identifiants de connexion", lure: "votre accès au portail va être suspendu si vous ne confirmez pas vos identifiants dans les prochaines 24 heures", cta: "Vérifier mes identifiants" },
  spear_phishing:        { label: "Spear Phishing Ciblé",  icon: "🎯", color: "#7c3aed", subject: "Message personnel de votre directeur",                     lure: "j'ai besoin que vous examiniez ce document confidentiel avant la réunion de demain", cta: "Ouvrir le document sécurisé" },
  ceo_fraud:             { label: "Fraude au Président",   icon: "👑", color: "#dc2626", subject: "CONFIDENTIEL – Demande urgente du PDG",                    lure: "je suis en réunion stratégique et j'ai besoin que vous effectuiez un virement discret avant 17h", cta: "Accéder aux instructions sécurisées" },
  fake_invoice:          { label: "Fausse Facture",        icon: "🧾", color: "#d97706", subject: "Facture en attente de validation – Échéance dépassée",    lure: "une facture fournisseur est en attente de validation urgente dans votre espace comptabilité", cta: "Valider la facture" },
  it_password_reset:     { label: "Réinitialisation IT",   icon: "💻", color: "#0891b2", subject: "Votre mot de passe expire dans 2 heures – Action requise", lure: "votre mot de passe réseau expire aujourd'hui. Pour éviter la perte d'accès, veuillez le renouveler immédiatement", cta: "Renouveler mon mot de passe" },
  payroll_update:        { label: "Mise à Jour Paie",      icon: "💰", color: "#16a34a", subject: "Erreur détectée sur votre bulletin de paie",               lure: "notre service RH a détecté une anomalie sur votre bulletin de paie du mois en cours", cta: "Vérifier mon bulletin de paie" },
  fake_delivery:         { label: "Faux Colis",            icon: "📦", color: "#ea580c", subject: "Votre colis est en attente – Frais de douane requis",     lure: "un colis à votre nom est bloqué en douane. Des frais de 2,50 € sont requis pour valider la livraison", cta: "Payer les frais et recevoir mon colis" },
  microsoft_365:         { label: "Alerte Microsoft 365",  icon: "🪟", color: "#2563eb", subject: "Connexion suspecte détectée sur votre compte Microsoft",  lure: "une connexion inhabituelle a été détectée depuis Moscou, Russie. Si ce n'est pas vous, sécurisez votre compte", cta: "Sécuriser mon compte Microsoft" },
  google_workspace:      { label: "Alerte Google Workspace",icon: "🔵", color: "#1d4ed8", subject: "Votre compte Google sera désactivé – Vérification requise",lure: "votre compte Google Workspace a été signalé pour activité non-conforme. Vérifiez votre identité pour éviter la suspension", cta: "Vérifier mon identité Google" },
  gift_card:             { label: "Cartes Cadeaux",        icon: "🎁", color: "#9333ea", subject: "Félicitations ! Vous avez été sélectionné(e)",            lure: "vous avez été sélectionné(e) par le service RH pour recevoir une carte cadeau de 150 € en récompense de votre performance", cta: "Réclamer ma récompense" },
  vpn_access:            { label: "Accès VPN Compromis",   icon: "🔐", color: "#475569", subject: "Votre accès VPN a été révoqué – Reconfiguration nécessaire",lure: "suite à une mise à jour de sécurité, votre configuration VPN doit être réinitialisée pour maintenir votre accès à distance", cta: "Reconfigurer mon VPN" },
  shared_document:       { label: "Document Partagé",      icon: "📄", color: "#0369a1", subject: "Un collègue a partagé un fichier avec vous",               lure: "votre collègue a partagé un document confidentiel qui requiert votre validation avant ce soir", cta: "Consulter le document partagé" },
  social_engineering:    { label: "Social Engineering IT", icon: "🛠️", color: "#7f1d1d", subject: "Support IT : intervention requise sur votre poste",       lure: "notre équipe de sécurité a détecté un logiciel non autorisé sur votre poste de travail. Merci de nous contacter", cta: "Contacter le support IT" },
};

/**
 * Generates the phishing email HTML locally — zero API call, instant display.
 * Mirrors the PHP AIController logic.
 */
function generateEmailLocally(
  attackType: string,
  difficulty: string,
  campaignName: string,
  firstName = "Destinataire",
  lastName = "",
  department = "votre équipe",
  position = "",
  company = "votre organisation"
): { subject: string; content_html: string } {
  const tpl = ATTACK_TEMPLATES[attackType] ?? ATTACK_TEMPLATES["credential_harvesting"];
  const { icon, color, cta } = tpl;
  const lure = tpl.lure;
  const subject = campaignName ? `${tpl.subject} – ${campaignName}` : tpl.subject;

  let salutation = `Bonjour ${firstName},`;
  let urgencyBadge = "";
  let signatureExtra = "";
  let typo = "";

  if (difficulty === "facile") {
    salutation = "Bonjour cher(e) utilisateur,";
    typo = " (veuillez excusez les fautes)";
    urgencyBadge = `<span style="background:#ef4444;color:#fff;padding:2px 8px;border-radius:3px;font-size:11px;margin-left:8px;">URGENT</span>`;
  } else if (difficulty === "moyen") {
    urgencyBadge = `<span style="background:#f59e0b;color:#fff;padding:2px 8px;border-radius:3px;font-size:11px;margin-left:8px;">Action requise</span>`;
  } else if (difficulty === "difficile" && position) {
    salutation = `Bonjour ${firstName},<br><small style="color:#6b7280;">à l'attention de ${firstName} ${lastName}, ${position}</small>`;
    signatureExtra = `<p style="font-size:12px;color:#6b7280;margin-top:4px;">Ce message vous a été adressé spécifiquement car vous êtes responsable de ce dossier.</p>`;
  } else if (difficulty === "expert") {
    salutation = position
      ? `Bonjour ${firstName} ${lastName},<br><small style="color:#6b7280;">${position} – ${department}</small>`
      : `Bonjour ${firstName} ${lastName},`;
    signatureExtra = `<p style="font-size:11px;color:#9ca3af;border-top:1px solid #e5e7eb;padding-top:8px;margin-top:12px;">Ce message est confidentiel et destiné exclusivement à ${firstName} ${lastName}. Toute divulgation est interdite en vertu de la politique de sécurité interne de ${company}.</p>`;
  }

  const html = `
<div style="font-family:'Segoe UI',Arial,sans-serif;max-width:600px;margin:0 auto;border:1px solid #e5e7eb;border-radius:10px;overflow:hidden;box-shadow:0 4px 16px rgba(0,0,0,0.08);">
  <div style="background:${color};padding:20px 28px;display:flex;align-items:center;gap:12px;">
    <span style="font-size:28px;">${icon}</span>
    <div style="flex:1;">
      <div style="color:#fff;font-size:17px;font-weight:700;">${tpl.label}</div>
      <div style="color:rgba(255,255,255,0.75);font-size:12px;">noreply@${company.toLowerCase().replace(/\s/g,"-")}-secure.com</div>
    </div>
    ${urgencyBadge}
  </div>
  <div style="padding:28px;background:#ffffff;">
    <p style="margin:0 0 14px;font-size:15px;color:#111827;">${salutation}</p>
    <p style="font-size:14px;color:#374151;line-height:1.7;">
      Dans le cadre de nos procédures internes, nous vous informons que <strong>${lure}</strong>.${typo}
    </p>
    <p style="font-size:14px;color:#374151;line-height:1.7;">
      Merci de traiter cette demande en priorité. Toute action retardée pourra entraîner des conséquences sur votre accès aux systèmes.
    </p>
    <div style="text-align:center;margin:28px 0;">
      <a href="#" style="background:${color};color:#ffffff;padding:13px 32px;border-radius:6px;text-decoration:none;font-weight:600;font-size:15px;display:inline-block;">${cta} →</a>
    </div>
    ${signatureExtra}
    <hr style="border:none;border-top:1px solid #e5e7eb;margin:20px 0;">
    <p style="font-size:13px;color:#374151;margin:0;">Cordialement,<br><strong>L'équipe ${department}</strong><br><span style="color:#9ca3af;font-size:12px;">${company}</span></p>
  </div>
  <div style="background:#f9fafb;padding:14px 28px;border-top:1px solid #e5e7eb;">
    <p style="font-size:11px;color:#9ca3af;margin:0;text-align:center;">&copy; ${new Date().getFullYear()} ${company} · Simulation de phishing à des fins de formation interne${campaignName ? ` · Campagne : ${campaignName}` : ""}.</p>
  </div>
</div>`;

  return { subject, content_html: html };
}

// ────────────────────────────────────────────────────────────────────────────
export default function Campaigns() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [searchQuery,     setSearchQuery]     = useState("");
  const [selectedTab,     setSelectedTab]     = useState("all");
  const [difficultyFilter,setDifficultyFilter]= useState("all");

  // Dialog states
  const [showDialog,        setShowDialog]      = useState(false);
  const [dialogMode,        setDialogMode]      = useState<"create" | "edit" | "view">("create");
  const [selectedCampaign,  setSelectedCampaign]= useState<Campaign | null>(null);
  const [isDeleteDialogOpen,setIsDeleteDialogOpen] = useState(false);

  // Form
  const [formData,   setFormData]   = useState<Partial<Campaign>>({
    name: "", difficulty_level: "moyen", status: "draft",
    target_departments: [], target_contacts: []
  });
  const [targetMode, setTargetMode] = useState<"all"|"departments"|"contacts">("all");
  const [aiContext,  setAiContext]  = useState("");

  // AI preview state
  const [aiContent,  setAiContent]  = useState<{ subject: string; content_html: string } | null>(null);
  const [isPreviewGenerating, setIsPreviewGenerating] = useState(false);
  const [previewError, setPreviewError] = useState(false);

  // Hooks
  const { data: campaigns = [], isLoading } = useCampaigns();
  const createCampaign        = useCreateCampaign();
  const updateCampaign        = useUpdateCampaign();
  const deleteCampaign        = useDeleteCampaign();
  const pauseCampaignMutation = usePauseCampaign();
  const resumeCampaignMutation= useResumeCampaign();
  const { data: contacts = [] }  = useContacts();
  const generateAi             = useGeneratePhishingTemplate();
  const launchCampaignMutation = useLaunchCampaign();

  const isReadOnly = dialogMode === "view";

  // ── Live preview debounce ────────────────────────────────────────────────
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Auto-preview (debounced) when form fields change in edit/create mode
  useEffect(() => {
    if (isReadOnly || !showDialog) return;
    if (!formData.attack_type) return;

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setAiContent(null);
      setPreviewError(false);
    }, 300);

    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.attack_type, formData.difficulty_level, formData.name, aiContext]);

  const autoGeneratePreview = async () => {
    // In view mode we always generate (attack_type is known); in edit mode require at least one field
    if (!isReadOnly && !formData.attack_type && !formData.name && !aiContext) return;
    try {
      setIsPreviewGenerating(true);
      setPreviewError(false);
      let previewContactId = contacts[0]?.id ?? 1;
      if (targetMode === "contacts" && formData.target_contacts?.length) {
        previewContactId = parseInt(formData.target_contacts[0]);
      } else if (targetMode === "departments" && formData.target_departments?.length) {
        const rep = contacts.find(c => c.department === formData.target_departments![0]);
        if (rep) previewContactId = rep.id;
      }
      const res = await generateAi.mutateAsync({
        contact_id:    previewContactId,
        context:       aiContext,
        difficulty:    formData.difficulty_level as string,
        campaign_name: formData.name,
        attack_type:   formData.attack_type as string,
      });
      setAiContent(res);
    } catch {
      setAiContent(null);
      setPreviewError(true);
    } finally {
      setIsPreviewGenerating(false);
    }
  };

  // ── Dialog helpers ───────────────────────────────────────────────────────
  const openCreate = () => {
    setSelectedCampaign(null);
    setFormData({ name: "", difficulty_level: "moyen", status: "draft", target_departments: [], target_contacts: [] });
    setAiContent(null);
    setPreviewError(false);
    setAiContext("");
    setTargetMode("all");
    setDialogMode("create");
    setShowDialog(true);
  };

  const openEdit = (camp: Campaign) => {
    const launched = LAUNCHED_STATUSES.includes(camp.status as any);
    setSelectedCampaign(camp);
    setFormData({
      name:               camp.name,
      difficulty_level:   camp.difficulty_level,
      status:             camp.status,
      target_departments: camp.target_departments ?? [],
      target_contacts:    camp.target_contacts ?? [],
      attack_type:        camp.attack_type,
    });
    setAiContext("");
    setTargetMode("all");
    setDialogMode(launched ? "view" : "edit");

    // Generate preview instantly (local, zero API call)
    if (camp.attack_type) {
      setAiContent(null);
      setPreviewError(false);
    } else {
      setAiContent(null);
      setPreviewError(false);
    }

    setShowDialog(true);
  };

  // ── Handlers ─────────────────────────────────────────────────────────────
  const handleSubmit = async () => {
    try {
      if (selectedCampaign) {
        await updateCampaign.mutateAsync({ id: selectedCampaign.id, data: formData });
        toast({ title: "Succès", description: "Campagne mise à jour avec succès." });
      } else {
        await createCampaign.mutateAsync(formData);
        toast({ title: "Succès", description: "Campagne créée avec succès." });
      }
      setShowDialog(false);
    } catch {
      toast({ variant: "destructive", title: "Erreur", description: "Une erreur est survenue lors de l'enregistrement." });
    }
  };

  const handleDelete = async () => {
    if (!selectedCampaign) return;
    try {
      await deleteCampaign.mutateAsync(selectedCampaign.id);
      toast({ title: "Succès", description: "Campagne supprimée." });
      setIsDeleteDialogOpen(false);
    } catch {
      toast({ variant: "destructive", title: "Erreur", description: "Une erreur est survenue." });
    }
  };

  const handleStatusChange = async (campaign: Campaign, newStatus: Campaign["status"]) => {
    try {
      if (newStatus === "active") {
        // Automatically trigger launch (sends emails) when activating
        await handleLaunch(campaign);
        return;
      }

      if (newStatus === "paused") {
        await pauseCampaignMutation.mutateAsync(campaign.id);
      } else {
        await updateCampaign.mutateAsync({ id: campaign.id, data: { status: newStatus } });
      }
      toast({ title: "Succès", description: `Statut mis à jour.` });
    } catch {
      toast({ variant: "destructive", title: "Erreur", description: "Une erreur est survenue." });
    }
  };

  const handleLaunch = async (campaign: Campaign) => {
    try {
      toast({ title: "Lancement...", description: "L'IA génère les emails pour chaque cible (Gemini)..." });
      await launchCampaignMutation.mutateAsync(campaign.id);
      toast({ title: "Succès", description: "La campagne a été lancée avec succès !" });
    } catch (err: any) {
      toast({ 
        variant: "destructive", 
        title: "Erreur", 
        description: err.response?.data?.error || "Une erreur est survenue lors du lancement." 
      });
    }
  };

  const filteredCampaigns = useMemo(() => campaigns.filter(c => {
    const matchesSearch     = c.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab        = selectedTab === "all" || c.status === selectedTab;
    const matchesDifficulty = difficultyFilter === "all" || c.difficulty_level === difficultyFilter;
    return matchesSearch && matchesTab && matchesDifficulty;
  }), [campaigns, searchQuery, selectedTab, difficultyFilter]);

  const attackLabel = (val?: string) =>
    EMAIL_ATTACK_TYPES.find(t => t.value === val)?.label ?? val ?? "—";

  // ── Preview HTML ─────────────────────────────────────────────────────────
  let previewHtml = aiContent?.content_html ?? `
    <div style="font-family:Arial,sans-serif;color:#9ca3af;text-align:center;padding:60px 20px;">
      <div style="font-size:48px;margin-bottom:16px;">📧</div>
      <p style="font-size:14px;">Sélectionnez un type d'attaque et une difficulté<br>pour voir la prévisualisation de l'email ici.</p>
    </div>`;

  if (isPreviewGenerating) {
    previewHtml = `
    <div style="font-family:Arial,sans-serif;color:#9ca3af;text-align:center;padding:60px 20px;">
      <div style="font-size:48px;margin-bottom:16px;" class="animate-pulse">⏳</div>
      <p style="font-size:16px;font-weight:bold;color:#111827;">En cours de préparation d'email...</p>
      <p style="font-size:13px;margin-top:8px;">Veuillez patienter, cela peut prendre 1 à 2 minutes avec Ollama.</p>
    </div>`;
  } else if (previewError) {
    previewHtml = `
    <div style="font-family:Arial,sans-serif;color:#ef4444;text-align:center;padding:60px 20px;">
      <div style="font-size:48px;margin-bottom:16px;">❌</div>
      <p style="font-size:16px;font-weight:bold;">La génération a échoué.</p>
      <p style="font-size:13px;margin-top:8px;">L'IA n'a pas pu créer cet email. Vérifiez qu'Ollama est actif.</p>
    </div>`;
  }

  // ────────────────────────────────────────────────────────────────────────
  return (
    <div className="h-full overflow-y-auto p-6 custom-scrollbar">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-stone-900">Campagnes de Phishing</h1>
          <p className="text-stone-500 mt-1">Gérez vos campagnes de simulation et suivez les résultats</p>
        </div>
        <div className="flex gap-3 flex-wrap">
          <Button variant="outline" onClick={() => exportToPDF("app-content", "campagnes_kira")}>
            <Download className="w-4 h-4 mr-2" /> Exporter en PDF
          </Button>
          <Button variant="outline" onClick={() => exportToExcel(campaigns, "campagnes")}>
            <Download className="w-4 h-4 mr-2" /> Exporter en Excel
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
            <Button variant="ghost" className="text-stone-500 hover:text-stone-900"
              onClick={() => { setSearchQuery(""); setSelectedTab("all"); setDifficultyFilter("all"); }}>
              Réinitialiser
            </Button>
          )}
          <Button className="bg-blue-600 hover:bg-blue-700" onClick={openCreate}>
            <Plus className="w-4 h-4 mr-2" /> Nouvelle Campagne
          </Button>
        </div>
      </div>

      {/* Search */}
      <div className="flex items-center gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 w-4 h-4" />
          <Input placeholder="Rechercher une campagne..." className="pl-10"
            value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
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

      {/* Campaign list */}
      {isLoading ? (
        <div className="flex justify-center p-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600" />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredCampaigns.map(campaign => (
            <Card key={campaign.id} className="border-stone-200 hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                {/* Top row */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-blue-100">
                      <Target className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-stone-900">{campaign.name}</h3>
                        {LAUNCHED_STATUSES.includes(campaign.status as any) && (
                          <span title="Campagne lancée – lecture seule">
                            <Lock className="w-3.5 h-3.5 text-stone-400" />
                          </span>
                        )}
                      </div>
                      <div className="flex flex-wrap items-center gap-2 mt-1">
                        <Badge variant="secondary" className={statusColors[campaign.status as keyof typeof statusColors] ?? ""}>
                          {campaign.status === "active"    ? "Active"
                          : campaign.status === "completed" ? "Terminée"
                          : campaign.status === "scheduled" ? "Planifiée"
                          : campaign.status === "draft"     ? "Brouillon"
                          : "En pause"}
                        </Badge>
                        <Badge variant="outline" className={difficultyColors[campaign.difficulty_level as keyof typeof difficultyColors] ?? ""}>
                          {campaign.difficulty_level.charAt(0).toUpperCase() + campaign.difficulty_level.slice(1)}
                        </Badge>
                        {campaign.attack_type && (
                          <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200 text-[11px]">
                            {attackLabel(campaign.attack_type)}
                          </Badge>
                        )}
                        {campaign.rl_enabled && (
                          <Badge variant="outline" className="bg-indigo-50 text-indigo-700 border-indigo-200 text-[11px] flex items-center gap-1">
                            <Brain className="w-3 h-3" /> IA Adaptive
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions menu */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm"><ActionsIcon className="w-4 h-4" /></Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem onClick={() => openEdit(campaign)}>
                        <Edit3 className="w-4 h-4 mr-2" />Modifier
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleStatusChange(campaign, "active")}>
                        <Play className="w-4 h-4 mr-2" />Activer
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleStatusChange(campaign, "paused")}>
                        <Pause className="w-4 h-4 mr-2" />Pause
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-red-600"
                        onClick={() => { setSelectedCampaign(campaign); setIsDeleteDialogOpen(true); }}>
                        <Trash2 className="w-4 h-4 mr-2" />Supprimer
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {/* Stats */}
                {campaign.status !== "draft" && campaign.status !== "scheduled" && (
                  <div className="grid grid-cols-3 gap-4 mb-4 p-4 bg-stone-50 rounded-lg">
                    <div className="text-center">
                      <MousePointer className="w-4 h-4 text-stone-400 mx-auto mb-1" />
                      <div className="text-lg font-bold">{campaign.metrics?.ctr ? Math.round(campaign.metrics.ctr) + "%" : "0%"}</div>
                      <div className="text-xs text-stone-500">CTR Global</div>
                    </div>
                    <div className="text-center">
                      <Target className="w-4 h-4 text-stone-400 mx-auto mb-1" />
                      <div className="text-lg font-bold">{campaign.metrics?.precision ? Math.round(campaign.metrics.precision * 100) + "%" : "N/A"}</div>
                      <div className="text-xs text-stone-500">Précision IA</div>
                    </div>
                    <div className="text-center">
                      <Brain className="w-4 h-4 text-stone-400 mx-auto mb-1" />
                      <div className="text-lg font-bold">{campaign.metrics?.auc_roc ? campaign.metrics.auc_roc.toFixed(2) : "N/A"}</div>
                      <div className="text-xs text-stone-500">AUC-ROC</div>
                    </div>
                  </div>
                )}

                {/* Progress */}
                {campaign.status === "active" && campaign.metrics?.ctr && (
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-stone-600">CTR</span>
                      <span className="font-medium">{Math.round(campaign.metrics.ctr)}%</span>
                    </div>
                    <Progress value={campaign.metrics.ctr} className="h-2" />
                  </div>
                )}

                {/* Bottom row */}
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-3 text-stone-500">
                    <span className="flex items-center gap-1"><Users className="w-4 h-4" /> Tous</span>
                    {campaign.started_at && (
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {new Date(campaign.started_at).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    {campaign.status === "paused" && (
                      <Button variant="outline" size="sm" onClick={() => handleStatusChange(campaign, "active")}>
                        <Play className="w-4 h-4 mr-1" />Reprendre
                      </Button>
                    )}
                    {campaign.status === "completed" && (
                      <Button variant="outline" size="sm" onClick={() => handleStatusChange(campaign, "active")}>
                        <RotateCcw className="w-4 h-4 mr-1" />Relancer
                      </Button>
                    )}
                    {(campaign.status === "completed" || campaign.status === "active") && (
                      <>
                        <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700 font-medium"
                          onClick={() => openEdit(campaign)}>
                          <Eye className="w-4 h-4 mr-1" />Voir l'email
                        </Button>
                        <Button variant="ghost" size="sm" className="text-purple-600 hover:text-purple-700 font-medium"
                          onClick={() => navigate("/reports")}>
                          <FileText className="w-4 h-4 mr-1" />Voir rapport
                        </Button>
                      </>
                    )}
                    {!(campaign.status === "completed" || campaign.status === "active") && (
                      <Button variant="ghost" size="sm" onClick={() => openEdit(campaign)}>
                        <Edit3 className="w-4 h-4" />
                      </Button>
                    )}
                    <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700"
                      onClick={() => { setSelectedCampaign(campaign); setIsDeleteDialogOpen(true); }}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {filteredCampaigns.length === 0 && !isLoading && (
        <Card className="border-stone-200">
          <CardContent className="p-12 text-center">
            <Target className="w-12 h-12 text-stone-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-stone-900 mb-2">Aucune campagne trouvée</h3>
            <p className="text-stone-500 mb-4">Créez votre première campagne de simulation de phishing</p>
            <Button className="bg-blue-600 hover:bg-blue-700" onClick={openCreate}>
              <Plus className="w-4 h-4 mr-2" />Créer une Campagne
            </Button>
          </CardContent>
        </Card>
      )}

      {/* ── Campaign Dialog (Create / Edit / View) ── */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-[600px] w-full max-h-[92vh] overflow-hidden p-0 gap-0">
          {/* Dialog Header */}
          <div className="flex items-center gap-3 px-6 py-4 border-b border-stone-200 bg-gradient-to-r from-purple-50 to-blue-50">
            {isReadOnly
              ? <Eye className="w-5 h-5 text-blue-600" />
              : <Sparkles className="w-5 h-5 text-purple-600" />}
            <div>
              <DialogTitle className="text-base font-semibold">
                {dialogMode === "create" ? "Créer une Campagne IA"
                : dialogMode === "edit"  ? `Modifier : ${selectedCampaign?.name}`
                : `Visualisation : ${selectedCampaign?.name}`}
              </DialogTitle>
              <DialogDescription className="text-xs mt-0.5">
                {isReadOnly
                  ? "Consultez les détails et l'email envoyé ci-dessous."
                  : "Configurez les paramètres de votre simulation de phishing."}
              </DialogDescription>
            </div>
            {isReadOnly && (
              <Badge className="ml-auto bg-orange-100 text-orange-700 border-orange-200">
                <Lock className="w-3 h-3 mr-1" />Lecture seule
              </Badge>
            )}
          </div>

          <div className="flex flex-col h-[calc(92vh-100px)] overflow-hidden bg-white">
            <div className="flex-1 overflow-y-auto custom-scrollbar">
              <div className="p-6 space-y-6">

                {/* Campaign Name */}
                <div>
                  <label className="text-sm font-medium text-stone-700">Nom de la campagne</label>
                  <Input
                    className="mt-1" disabled={isReadOnly}
                    placeholder="Ex: Campagne CEO Fraud – Mai 2025"
                    value={formData.name ?? ""}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-1 gap-4">
                  {/* Attack type */}
                  <div>
                    <label className="text-sm font-medium text-stone-700">Type d'attaque email</label>
                    <Select
                      value={formData.attack_type ?? ""}
                      onValueChange={val => setFormData({ ...formData, attack_type: val })}
                      disabled={dialogMode === "edit" || isReadOnly}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Sélectionner un type d'attaque…" />
                      </SelectTrigger>
                      <SelectContent className="max-h-72">
                        {EMAIL_ATTACK_TYPES.map(t => (
                          <SelectItem key={t.value} value={t.value}>
                            <div>
                              <div className="font-medium text-sm">{t.label}</div>
                              <div className="text-xs text-stone-400">{t.desc}</div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Difficulty */}
                  <div>
                    <label className="text-sm font-medium text-stone-700">Difficulté</label>
                    <Select
                      value={formData.difficulty_level}
                      onValueChange={val => setFormData({ ...formData, difficulty_level: val as any })}
                      disabled={dialogMode === "edit" || isReadOnly}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Sélectionner…" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="facile">🟢 Facile – Erreurs évidentes</SelectItem>
                        <SelectItem value="moyen">🟡 Moyen – Quelques indices</SelectItem>
                        <SelectItem value="difficile">🟠 Difficile – Spear Phishing</SelectItem>
                        <SelectItem value="expert">🔴 Expert – Extrêmement réaliste</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Target Selection */}
                {dialogMode === "create" && (
                  <div className="space-y-3">
                    <label className="text-sm font-medium text-stone-700">Sélection des cibles</label>
                    <Select value={targetMode} onValueChange={(v: any) => setTargetMode(v)}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Mode de ciblage" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tous les utilisateurs ({contacts.length})</SelectItem>
                        <SelectItem value="departments">Par Département</SelectItem>
                        <SelectItem value="contacts">Par Utilisateur Individuel</SelectItem>
                      </SelectContent>
                    </Select>

                    {targetMode === "departments" && (
                      <div className="bg-stone-50 p-3 rounded-lg border border-stone-200">
                        <label className="text-xs font-medium text-stone-600 mb-2 block">Départements cibles :</label>
                        <div className="grid grid-cols-2 gap-1.5 max-h-36 overflow-y-auto custom-scrollbar">
                          {Array.from(new Set(contacts.map(c => c.department).filter(Boolean))).map(depName => (
                            <label key={depName} className="flex items-center gap-2 cursor-pointer text-sm text-stone-600 hover:text-stone-900">
                              <input type="checkbox"
                                checked={(formData.target_departments ?? []).includes(depName as string)}
                                onChange={e => {
                                  const cur = formData.target_departments ?? [];
                                  setFormData({ ...formData, target_departments: e.target.checked ? [...cur, depName as string] : cur.filter(x => x !== depName) });
                                }} />
                              {depName}
                            </label>
                          ))}
                        </div>
                      </div>
                    )}

                    {targetMode === "contacts" && (
                      <div className="bg-stone-50 p-3 rounded-lg border border-stone-200">
                        <label className="text-xs font-medium text-stone-600 mb-2 block">Contacts individuels :</label>
                        <div className="grid grid-cols-1 gap-1 max-h-36 overflow-y-auto custom-scrollbar">
                          {contacts.map(c => (
                            <label key={c.id} className="flex items-center gap-2 cursor-pointer text-sm text-stone-600 hover:text-stone-900">
                              <input type="checkbox"
                                checked={(formData.target_contacts ?? []).includes(c.id.toString())}
                                onChange={e => {
                                  const cur = formData.target_contacts ?? [];
                                  setFormData({ ...formData, target_contacts: e.target.checked ? [...cur, c.id.toString()] : cur.filter(x => x !== c.id.toString()) });
                                }} />
                              <span className="truncate">{c.first_name} {c.last_name} – {c.department}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Sent Email Content Viewer (only when viewing a launched campaign) */}
                {isReadOnly && selectedCampaign?.sent_phishing_emails && selectedCampaign.sent_phishing_emails.length > 0 && (
                  <div className="space-y-4 pt-4 border-t border-stone-100">
                    <div className="flex items-center gap-2 text-stone-900 font-semibold">
                      <Mail className="w-4 h-4 text-blue-600" />
                      Email envoyé aux utilisateurs
                    </div>
                    <div className="bg-stone-50 rounded-lg border border-stone-200 overflow-hidden">
                      <div className="px-3 py-2 bg-white border-b border-stone-200">
                        <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider mr-2">Objet :</span>
                        <span className="text-sm font-semibold text-stone-800">
                          {selectedCampaign.sent_phishing_emails[0].subject}
                        </span>
                      </div>
                      <div className="p-4 max-h-[400px] overflow-y-auto bg-white">
                        <div
                          className="prose prose-sm max-w-none text-stone-800"
                          dangerouslySetInnerHTML={{ __html: selectedCampaign.sent_phishing_emails[0].content_html }}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {isReadOnly && (!selectedCampaign?.sent_phishing_emails || selectedCampaign.sent_phishing_emails.length === 0) && (
                  <div className="pt-4 border-t border-stone-100 text-center py-8 text-stone-400">
                    <Mail className="w-8 h-8 mx-auto mb-2 opacity-40" />
                    <p className="text-sm">Aucun email envoyé pour cette campagne.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-stone-200 bg-stone-50 flex gap-3 justify-end">
              <Button variant="outline" onClick={() => setShowDialog(false)}>Fermer</Button>
              {!isReadOnly && (
                <Button
                  className="bg-blue-600 hover:bg-blue-700 px-8"
                  onClick={handleSubmit}
                  disabled={createCampaign.isPending || updateCampaign.isPending}
                >
                  {selectedCampaign ? "Mettre à jour" : "Créer la campagne"}
                </Button>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer la campagne ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action supprimera toutes les statistiques et données associées à cette campagne.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction className="bg-red-600 hover:bg-red-700" onClick={handleDelete} disabled={deleteCampaign.isPending}>
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}


