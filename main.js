/* ══════════════════════════════════════════════════════════════
   PROWER SÉCURITÉ GROUPE — main.js
   Auteur  : Prower Sécurité Groupe
   Version : 1.0.0
   ────────────────────────────────────────────────────────────
   Ce fichier contient :
     1. Configuration & initialisation EmailJS
     2. Menu mobile (hamburger)
     3. Animations au scroll (IntersectionObserver)
     4. Validation du formulaire de contact
     5. Envoi du formulaire via EmailJS
══════════════════════════════════════════════════════════════ */


/* ══════════════════════════════════════════════════════════════
   1. CONFIGURATION EMAILJS
   ────────────────────────────────────────────────────────────
   ÉTAPES D'ACTIVATION (5 minutes) :

   ÉTAPE 1 ─ Créez un compte GRATUIT sur https://www.emailjs.com
             Le plan gratuit = 200 emails/mois

   ÉTAPE 2 ─ Connectez votre Gmail
             → Dashboard → "Email Services" → "Add New Service"
             → Choisissez "Gmail"
             → Connectez le compte : jibikilayijonathan@gmail.com
             → Notez le SERVICE_ID généré (ex: "service_abc123")

   ÉTAPE 3 ─ Créez un template d'email
             → Dashboard → "Email Templates" → "Create New Template"
             → Dans le champ "To Email" : jibikilayijonathan@gmail.com
             ─────────────────────────────────────────────────────
             Sujet suggéré :
               Nouvelle demande de devis – {{service}}

             Corps suggéré :
               Bonjour,

               Vous avez reçu une nouvelle demande via Prower Sécurité Groupe.

               👤 Nom complet   : {{prenom}} {{nom}}
               📧 Email         : {{email}}
               📞 Téléphone     : {{telephone}}
               🔧 Service       : {{service}}

               💬 Message :
               {{message}}

               ─────────────────────────────────────────────
               Envoyé depuis le formulaire de contact Prower Sécurité Groupe
             ─────────────────────────────────────────────────────
             → Notez le TEMPLATE_ID généré (ex: "template_xyz789")

   ÉTAPE 4 ─ Récupérez votre clé publique
             → Dashboard → "Account" → onglet "API Keys"
             → Notez votre PUBLIC_KEY (ex: "AbCdEfGhIjKlMnOp")

   ÉTAPE 5 ─ Remplacez les 3 valeurs ci-dessous par les vôtres
══════════════════════════════════════════════════════════════ */

const EMAILJS_PUBLIC_KEY  = 'T4uY7pLWaeWt0Inxe';    // ← remplacer ici
const EMAILJS_SERVICE_ID  = 'service_y1zy0pr';    // ← remplacer ici
const EMAILJS_TEMPLATE_ID = 'template_0zygohg';   // ← remplacer ici

// Initialisation du SDK EmailJS
emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });


/* ══════════════════════════════════════════════════════════════
   2. MENU MOBILE (HAMBURGER)
══════════════════════════════════════════════════════════════ */

const hamburger = document.getElementById('hamburger');
const nav       = document.querySelector('.nav');

hamburger.addEventListener('click', () => {
  nav.classList.toggle('open');
  hamburger.classList.toggle('active');
});

// Fermer le menu si on clique sur un lien de navigation
document.querySelectorAll('.nav-link, .nav-cta').forEach(link => {
  link.addEventListener('click', () => {
    nav.classList.remove('open');
    hamburger.classList.remove('active');
  });
});


/* ══════════════════════════════════════════════════════════════
   3. ANIMATIONS AU SCROLL (IntersectionObserver)
══════════════════════════════════════════════════════════════ */

const scrollObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.service-card, .about-inner, .ci-item').forEach(el => {
  scrollObserver.observe(el);
});


/* ══════════════════════════════════════════════════════════════
   4. FORMULAIRE DE CONTACT — VALIDATION & ENVOI
══════════════════════════════════════════════════════════════ */

const form      = document.getElementById('contactForm');
const notif     = document.getElementById('formNotif');
const btnText   = document.getElementById('btnText');
const btnSpinner= document.getElementById('btnSpinner');
const submitBtn = document.getElementById('submitBtn');

/**
 * Affiche un message d'erreur sous un champ
 * @param {string} fieldId - id du champ (sans le préfixe "err-")
 * @param {string} msg     - texte de l'erreur
 */
function showError(fieldId, msg) {
  const errEl  = document.getElementById('err-' + fieldId);
  const inputEl = document.getElementById(fieldId);
  if (errEl)   { errEl.textContent = msg; errEl.style.display = 'block'; }
  if (inputEl) { inputEl.classList.add('input-error'); }
}

/**
 * Efface toutes les erreurs et la notification globale
 */
function clearErrors() {
  document.querySelectorAll('.field-error').forEach(el => {
    el.textContent   = '';
    el.style.display = 'none';
  });
  document.querySelectorAll('.input-error').forEach(el => {
    el.classList.remove('input-error');
  });
  notif.className   = 'form-notif';
  notif.textContent = '';
}

/**
 * Valide tous les champs obligatoires
 * @returns {boolean} true si tout est valide
 */
function validateForm() {
  let valid = true;

  const prenom  = document.getElementById('prenom').value.trim();
  const nom     = document.getElementById('nom').value.trim();
  const email   = document.getElementById('email').value.trim();
  const service = document.getElementById('service').value;
  const message = document.getElementById('message').value.trim();

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!prenom)  { showError('prenom',  'Le prénom est requis.');           valid = false; }
  if (!nom)     { showError('nom',     'Le nom est requis.');              valid = false; }
  if (!email)   { showError('email',   "L'adresse email est requise.");    valid = false; }
  else if (!emailRegex.test(email)) {
                  showError('email',   'Adresse email invalide.');          valid = false; }
  if (!service) { showError('service', 'Veuillez sélectionner un service.'); valid = false; }
  if (!message) { showError('message', 'Le message est requis.');          valid = false; }

  return valid;
}

/**
 * Active / désactive l'état de chargement du bouton
 * @param {boolean} loading
 */
function setLoading(loading) {
  submitBtn.disabled = loading;
  btnText.hidden     = loading;
  btnSpinner.hidden  = !loading;
}

/**
 * Affiche la notification globale (succès / erreur / avertissement)
 * @param {'success'|'error'|'warn'} type
 * @param {string} msg
 */
function showNotif(type, msg) {
  notif.className   = 'form-notif form-notif--' + type;
  notif.textContent = msg;
  notif.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

/* ─── Soumission du formulaire ─── */
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  clearErrors();

  if (!validateForm()) return;

  setLoading(true);

  const templateParams = {
    prenom:    document.getElementById('prenom').value.trim(),
    nom:       document.getElementById('nom').value.trim(),
    email:     document.getElementById('email').value.trim(),
    telephone: document.getElementById('telephone').value.trim() || 'Non renseigné',
    service:   document.getElementById('service').value,
    message:   document.getElementById('message').value.trim(),
  };

  try {
    await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams);
    showNotif('success', '✅ Votre demande a bien été envoyée ! Nous vous répondrons dans les 24h.');
    form.reset();
  } catch (err) {
    console.error('EmailJS error :', err);

    if (EMAILJS_PUBLIC_KEY === 'VOTRE_PUBLIC_KEY') {
      showNotif('warn',
        "⚙️ Formulaire non encore configuré. " +
        "Ouvrez main.js et remplacez les 3 clés EmailJS en haut du fichier."
      );
    } else {
      showNotif('error',
        '❌ Une erreur est survenue lors de l\'envoi. ' +
        'Veuillez réessayer ou nous appeler directement.'
      );
    }
  } finally {
    setLoading(false);
  }
});

/* ─── Effacement des erreurs à la saisie ─── */
['prenom', 'nom', 'email', 'service', 'message'].forEach(id => {
  const el = document.getElementById(id);
  if (!el) return;
  el.addEventListener('input', () => {
    const errEl = document.getElementById('err-' + id);
    if (errEl) { errEl.textContent = ''; errEl.style.display = 'none'; }
    el.classList.remove('input-error');
  });
});
