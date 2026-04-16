<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Exercice de Sensibilisation KIRA</title>
    <!-- On utilise Tailwind CSS via CDN pour cette page publique isolée -->
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        body { font-family: 'Inter', sans-serif; }
    </style>
</head>
<body class="bg-stone-50 min-h-screen flex items-center justify-center p-4">
    <div class="max-w-md w-full bg-white rounded-xl shadow-lg overflow-hidden">
        <!-- Header -->
        <div class="bg-purple-600 p-6 text-center">
            <div class="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
                <svg class="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                </svg>
            </div>
            <h1 class="text-2xl font-bold text-white mb-2">Ceci était une simulation de Phishing</h1>
            <p class="text-purple-100">Ne vous inquiétez pas, vous êtes en sécurité.</p>
        </div>

        @if(isset($reported) && $reported)
        <div class="bg-green-50 border-b border-green-200 p-4 text-center">
            <p class="text-sm font-semibold text-green-800 flex items-center justify-center gap-2">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                Signalement enregistré avec succès ! Merci pour votre vigilance.
            </p>
        </div>
        @endif

        <!-- Content -->
        <div class="p-6">
            <h2 class="text-lg font-semibold text-stone-900 mb-4">Bonjour {{ $contact->first_name }},</h2>
            
            <p class="text-stone-600 mb-4 leading-relaxed">
                Vous venez de cliquer sur un lien provenant de la campagne de simulation <strong>"{{ $campaign->name }}"</strong>.
            </p>

            <div class="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
                <p class="text-sm text-red-700">
                    S'il s'agissait d'une véritable attaque, vos informations personnelles ou celles de votre entreprise auraient pu être compromises.
                </p>
            </div>

            <h3 class="font-medium text-stone-900 mb-3">Les indices que vous auriez pu remarquer :</h3>
            <ul class="space-y-2 text-sm text-stone-600 mb-6">
                <li class="flex items-start">
                    <svg class="w-5 h-5 text-red-500 mr-2 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    <span>L'adresse de l'expéditeur ne correspondait pas au domaine officiel.</span>
                </li>
                <li class="flex items-start">
                    <svg class="w-5 h-5 text-red-500 mr-2 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    <span>Le lien redirigeait vers une page suspecte (passez toujours votre souris sur les liens sans cliquer).</span>
                </li>
                <li class="flex items-start">
                    <svg class="w-5 h-5 text-red-500 mr-2 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    <span>Sentiment d'urgence injustifié dans le contenu de l'email.</span>
                </li>
            </ul>

            <div class="text-center mt-8 pt-6 border-t border-stone-100">
                <p class="text-sm text-stone-500 mb-4">Cet événement a été enregistré dans le cadre de votre programme de formation KIRA.</p>
                
                <a href="/api/track/report/{{ $campaign->id }}/{{ $contact->id }}" 
                   class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors">
                    <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                    </svg>
                    Signaler ce Phishing comme suspect
                </a>
                
                <p class="text-xs text-stone-400 mt-6 italic">Restez vigilant !</p>
            </div>
        </div>
    </div>
</body>
</html>
