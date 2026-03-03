# AI-Powered Phishing Simulation & Human Risk Scoring Platform

Une plateforme professionnelle de simulation de phishing alimentée par l'intelligence artificielle pour évaluer, mesurer et améliorer la posture de cybersécurité des organisations.

## Contexte

Les attaques de phishing constituent aujourd'hui l'un des principaux vecteurs de compromission des systèmes d'information. Malgré l'existence de solutions techniques avancées, le facteur humain demeure le maillon le plus vulnérable.

## Objectifs

- **Simuler** des campagnes de phishing réalistes via l'IA générative
- **Évaluer** le comportement des utilisateurs face aux attaques simulées
- **Calculer** un score de risque humain dynamique
- **Proposer** des formations personnalisées automatisées
- **Fournir** une plateforme visuelle professionnelle adaptée aux démonstrations académiques et industrielles

## Fonctionnalités

### Dashboard Principal
- Vue d'ensemble des métriques clés (score de risque, campagnes actives, taux de formation)
- Graphiques d'évolution du risque sur 6 mois
- Insights IA avec alertes et recommandations
- Analyse du risque par département
- Tableau de bord des campagnes récentes

### Gestion des Campagnes
- Création de campagnes de phishing simulées
- Templates IA pré-configurés (Email CEO, Fausse Facture, Alert IT, etc.)
- Suivi en temps réel (envoyés, ouverts, cliqués, signalés)
- Gestion des statuts (active, planifiée, terminée, brouillon)
- Difficulté ajustable (facile, moyen, difficile)

### Analyse de Risque
- Score de risque global et individuel
- Analyse par département
- Identification des utilisateurs à haut risque
- Analyse radar des vecteurs d'attaque
- Facteurs de risque détaillés
- Recommandations de formation automatiques

### Formation & Sensibilisation
- Modules de formation personnalisés
- Recommandations IA basées sur le profil de risque
- Suivi des formations assignées
- Classement des utilisateurs
- Taux de complétion et scores

### Gestion des Utilisateurs
- Base de données complète des utilisateurs
- Profils de risque individuels
- Historique des tests et formations
- Tendances de comportement
- Filtres par département et niveau de risque

### Rapports & Analytics
- KPIs de performance en temps réel
- Graphiques d'efficacité des campagnes
- Templates de rapports (exécutif, département, campagne)
- Export PDF, Excel
- Planification de rapports récurrents

## Stack Technique

- **Frontend**: React + TypeScript + Vite
- **UI Framework**: Tailwind CSS + shadcn/ui
- **Visualisation**: Recharts
- **Icons**: Lucide React
- **State Management**: React Query
- **Routing**: React Router DOM

## Installation

```bash
# Cloner le repository
git clone https://github.com/KvalixX/AI-Powered-Phishing-Simulation-Human-Risk-Scoring-Platform.git

# Accéder au dossier client
cd AI-Powered-Phishing-Simulation-Human-Risk-Scoring-Platform/client

# Installer les dépendances
npm install

# Démarrer le serveur de développement
npm run dev
```

## Structure du Projet

```
client/
├── src/
│   ├── components/
│   │   ├── ui/          # Composants shadcn/ui
│   │   ├── dashboard/   # Composants du dashboard
│   │   └── layout/      # Sidebar, Footer
│   ├── pages/
│   │   ├── dashboard.tsx      # Vue d'ensemble
│   │   ├── campaigns.tsx      # Gestion des campagnes
│   │   ├── risk-analytics.tsx # Analyse de risque
│   │   ├── training.tsx       # Formation
│   │   ├── users.tsx          # Gestion utilisateurs
│   │   └── reports.tsx        # Rapports
│   ├── lib/
│   │   └── utils.ts     # Fonctions utilitaires
│   └── App.tsx          # Configuration des routes
├── public/
│   └── images/          # Assets
└── package.json
```

## Pages de l'Application

| Page | Route | Description |
|------|-------|-------------|
| Dashboard | `/` | Vue d'ensemble avec métriques clés |
| Campagnes | `/campaigns` | Création et gestion des campagnes |
| Analyse de Risque | `/risk-analytics` | Scoring et analyse du risque humain |
| Formation | `/training` | Modules de formation personnalisés |
| Utilisateurs | `/users` | Gestion des utilisateurs |
| Rapports | `/reports` | Génération et export de rapports |
| Connexion | `/auth/sign-in` | Page de connexion |
| Inscription | `/auth/sign-up` | Page d'inscription |

## Fonctionnalités IA

- **Génération de campagnes**: L'IA crée des emails de phishing réalistes adaptés au contexte de l'organisation
- **Recommandations personnalisées**: Suggestions de formation basées sur le profil de risque de chaque utilisateur
- **Insights prédictifs**: Détection des tendances et alertes sur les vulnérabilités émergentes
- **Scoring dynamique**: Algorithme évolutif prenant en compte le comportement et les progrès

## Captures d'écran

*À ajouter: captures d'écran des principales pages*

## Contribution

Ce projet est développé dans le cadre d'un projet académique/professionnel.

## Licence

© 2024 - Projet de Simulation de Phishing IA. Tous droits réservés.

## Auteur

Développé pour démonstrations académiques et industrielles.

---

**Note**: Cette plateforme est destinée à des fins éducatives et de sensibilisation à la sécurité. Elle doit être utilisée de manière éthique et responsable.
