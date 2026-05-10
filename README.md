# AI-Powered Phishing Simulation & Human Risk Scoring Platform

[![Laravel](https://img.shields.io/badge/Laravel-FF2D20?style=for-the-badge&logo=laravel&logoColor=white)](https://laravel.com)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

Une plateforme professionnelle de simulation de phishing alimentée par l'intelligence artificielle pour évaluer, mesurer et améliorer la posture de cybersécurité des organisations.

---

## 🇫🇷 Description du Projet
Cette plateforme permet de simuler des attaques de phishing sophistiquées en utilisant l'IA pour générer des contenus réalistes. Elle calcule un score de risque humain basé sur les interactions des utilisateurs et propose des formations adaptées.

### Fonctionnalités Clés
- **Dashboard IA**: Visualisation des métriques de risque et insights prédictifs.
- **Campagnes Dynamiques**: Création d'emails de phishing personnalisés via OpenAI.
- **Analyse du Risque**: Scoring dynamique par utilisateur et département.
- **Modules de Formation**: Contenu pédagogique ciblé selon les vulnérabilités détectées.

---

## 🚀 Getting Started (English Guide)

Follow these steps to set up the project locally.

### Prerequisites
- **PHP** >= 8.2 & **Composer**
- **Node.js** & **npm**
- **MySQL** Database
- **OpenAI API Key** (for AI features)

### 1. Repository Setup
```bash
git clone https://github.com/KvalixX/AI-Powered-Phishing-Simulation-Human-Risk-Scoring-Platform.git
cd AI-Powered-Phishing-Simulation-Human-Risk-Scoring-Platform
```

### 2. Backend Setup (Laravel)
```bash
cd backend
composer install
copy .env.example .env
```

Then run:
```bash
php artisan key:generate
php artisan migrate --seed
php artisan serve
```
The API will be available at `http://localhost:8000`.

### 3. Frontend Setup (React)
```bash
cd ../client
npm install
npm run dev
```
The application will be available at `http://localhost:5173`.

---

## 📂 Project Structure
- `backend/`: Laravel 11 API (Controllers, Models, Migrations).
- `client/`: React + TypeScript frontend (Vite, Tailwind, Shadcn/UI).
- `server/`: Additional server-side utilities (if any).

## 🛡 Security Note
This platform is for **educational and authorized security testing purposes only**. Improper use is strictly prohibited.

---
© 2024 - Developed for Academic and Professional Cybersecurity Demonstrations.
