<?php
/**
 * Modèle de configuration SMTP (Brevo).
 *
 * À COPIER sous le nom « config-mail.php » à côté de envoi.php.
 * Le fichier est rendu inaccessible depuis le web par la règle
 * <Files "config-mail.php"> du .htaccess, et exclu de git par .gitignore.
 *
 * Ne jamais committer le vrai config-mail.php.
 */

return [
    // E-mail de connexion au compte Brevo.
    'smtp_user' => 'A_REMPLACER',

    // Clé SMTP générée dans Brevo : SMTP & API → SMTP → Générer une nouvelle
    // clé SMTP. Ni le mot de passe du compte, ni une clé API.
    'smtp_pass' => 'A_REMPLACER',

    // Expéditeur affiché — doit être un expéditeur validé dans Brevo.
    'from' => 'info@regeneratium.ch',

    // Adresse qui reçoit les messages du formulaire.
    'dest' => 'info@regeneratium.ch',
];
