<?php
/**
 * Regeneratium — traitement du formulaire de contact
 * Envoi via le relais SMTP Brevo (smtp-relay.brevo.com:587, STARTTLS).
 *
 * La boîte du domaine est hébergée chez Microsoft 365 : on ne passe donc plus
 * par Infomaniak, et on évite le SMTP Microsoft dont l'authentification
 * basique est désactivée par défaut fin décembre 2026.
 *
 * Prérequis :
 *   1. composer install                       (crée vendor/)
 *   2. config-mail.php à côté de ce fichier, protégé par la règle
 *      <Files "config-mail.php"> du .htaccess (voir config-mail.example.php)
 */

declare(strict_types=1);

// PHPMailer : via Composer si présent, sinon via les 3 fichiers déposés à la main.
if (is_file(__DIR__ . '/vendor/autoload.php')) {
    require __DIR__ . '/vendor/autoload.php';
} else {
    require __DIR__ . '/PHPMailer/src/Exception.php';
    require __DIR__ . '/PHPMailer/src/PHPMailer.php';
    require __DIR__ . '/PHPMailer/src/SMTP.php';
}

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

header('Content-Type: text/html; charset=UTF-8');

/* ── Textes selon la langue ─────────────────────────────────── */
$lang = ($_POST['lang'] ?? 'fr') === 'en' ? 'en' : 'fr';

$t = $lang === 'en'
    ? [
        'merci'   => '/en/merci.html',
        'retour'  => '/en/contact.html',
        'champs'  => 'Please fill in all required fields.',
        'erreur'  => 'Something went wrong, please try again later.',
        'titre'   => 'Message not sent',
        'lien'    => 'Back to the contact page',
        'sujet'   => 'New message from the website',
      ]
    : [
        'merci'   => '/merci.html',
        'retour'  => '/contact.html',
        'champs'  => 'Merci de remplir tous les champs obligatoires.',
        'erreur'  => 'Une erreur est survenue, merci de réessayer plus tard.',
        'titre'   => 'Message non envoyé',
        'lien'    => 'Retour à la page de contact',
        'sujet'   => 'Nouveau message depuis le site',
      ];

/** Affiche une page d'erreur minimale et arrête le script. */
function stop(string $titre, string $texte, string $retour, string $lien, int $code = 400)
{
    http_response_code($code);
    $e = fn(string $s): string => htmlspecialchars($s, ENT_QUOTES, 'UTF-8');
    echo '<!DOCTYPE html><html lang="fr"><head><meta charset="UTF-8">'
       . '<meta name="viewport" content="width=device-width,initial-scale=1">'
       . '<meta name="robots" content="noindex">'
       . '<title>' . $e($titre) . ' — Regeneratium</title>'
       . '<link rel="icon" type="image/svg+xml" href="/assets/favicon.svg">'
       . '<link rel="stylesheet" href="/style.css"></head>'
       . '<body class="subpage"><main class="error-page"><div class="error-inner">'
       . '<h1>' . $e($titre) . '</h1><p>' . $e($texte) . '</p>'
       . '<div class="error-actions"><a href="' . $e($retour) . '" class="btn-primary">'
       . $e($lien) . '</a></div>'
       . '</div></main></body></html>';
    exit;
}

/* ── Garde-fous ─────────────────────────────────────────────── */

// Seul le POST est accepté (empêche l'indexation / les appels directs).
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Location: ' . $t['retour'], true, 303);
    exit;
}

// Piège à robots : le champ doit rester vide. On répond "merci" pour ne pas
// signaler au bot qu'il a été détecté.
if (!empty($_POST['site_web'])) {
    header('Location: ' . $t['merci'], true, 303);
    exit;
}

/* ── Récupération et validation ─────────────────────────────── */

$nom     = trim((string) ($_POST['nom'] ?? ''));
$email   = filter_var(trim((string) ($_POST['email'] ?? '')), FILTER_VALIDATE_EMAIL);
$tel     = trim((string) ($_POST['tel'] ?? ''));
$message = trim((string) ($_POST['message'] ?? ''));

if ($nom === '' || $email === false || $message === '') {
    stop($t['titre'], $t['champs'], $t['retour'], $t['lien']);
}

// Longueurs raisonnables (anti-abus).
if (mb_strlen($nom) > 120 || mb_strlen($tel) > 40 || mb_strlen($message) > 5000) {
    stop($t['titre'], $t['champs'], $t['retour'], $t['lien']);
}

// Un nom ne doit jamais contenir de saut de ligne : protection contre
// l'injection d'en-têtes dans le champ Reply-To.
$nom = preg_replace('/[\r\n]+/', ' ', $nom);
$tel = preg_replace('/[\r\n]+/', ' ', $tel);

/* ── Envoi ──────────────────────────────────────────────────── */

$config = require __DIR__ . '/config-mail.php';

$mail = new PHPMailer(true);

try {
    $mail->isSMTP();
    $mail->Host       = 'smtp-relay.brevo.com';
    $mail->SMTPAuth   = true;
    $mail->Username   = $config['smtp_user'];  // e-mail de connexion Brevo
    $mail->Password   = $config['smtp_pass'];  // clé SMTP Brevo (pas une clé API)
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
    $mail->Port       = 587;
    $mail->CharSet    = 'UTF-8';
    $mail->Encoding   = 'base64';              // accents fiables chez tous les clients

    // L'expéditeur doit être un expéditeur validé dans Brevo, sinon le relais
    // refuse le message. Il est indépendant de l'identifiant de connexion.
    $mail->setFrom($config['from'], 'Formulaire Regeneratium');
    $mail->addAddress($config['dest']);
    $mail->addReplyTo($email, $nom);          // « Répondre » écrit au visiteur

    $mail->Subject = $t['sujet'] . ' — ' . $nom;
    $mail->Body    = "Nom     : $nom\n"
                   . "E-mail  : $email\n"
                   . "Tél.    : " . ($tel !== '' ? $tel : '—') . "\n"
                   . "Langue  : " . strtoupper($lang) . "\n"
                   . str_repeat('-', 46) . "\n\n"
                   . $message . "\n";

    $mail->send();

    // 303 : le rechargement de la page de remerciement ne renvoie pas le formulaire.
    header('Location: ' . $t['merci'], true, 303);
    exit;

} catch (Exception $e) {
    error_log('[contact] ' . $mail->ErrorInfo);
    stop($t['titre'], $t['erreur'], $t['retour'], $t['lien'], 500);
}
