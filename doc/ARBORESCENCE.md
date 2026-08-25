# ARBORESCENCE.md

> Carte technique du dépôt `portfolio_v2`, générée par analyse statique du code source (lecture seule).
> Public cible : un système IA sans connaissance préalable du dépôt.
> Périmètre ignoré : `node_modules`, `.next`, `.git`, `.vercel`.

---

## 1. Stack et conventions détectées

Constats faits uniquement sur la base de `package.json`, `tsconfig.json`, `eslint.config.mjs` et le code source.

| Aspect | Constat |
|---|---|
| Framework | Next.js `16.0.10`, App Router (dossier `app/`) |
| Langage | TypeScript `^5`, `strict: true` (voir `tsconfig.json`) |
| Runtime UI | React `19.2.0` / React DOM `19.2.0` |
| Gestionnaire de paquets | `package-lock.json` présent → npm. Aucun `pnpm-lock.yaml` / `yarn.lock` détecté. |
| Node | `v22.19.0` détecté dans l'environnement d'exécution local (aucun `.nvmrc` / champ `engines` dans `package.json` ne fixe de version) |
| Styling | Mix de deux approches : (1) Bootstrap 5 via `bootswatch` (thème "lux", `bootswatch/dist/lux/bootstrap.min.css` importé dans `app/[locale]/layout.tsx`) + `react-bootstrap` pour certains composants (`Navbar`, `Dropdown`, `Nav`, `Container`) ; (2) CSS Modules (`*.module.css`) colocalisés par composant pour le style spécifique de chaque section. `app/globals.css` (68 lignes) pour les styles globaux. |
| Icônes | `bootstrap-icons` (classes `bi bi-*`, chargées aussi via un `<link>` CDN jsDelivr dans `app/layout.tsx`) et `react-icons` (import `react-icons/fa`, ex. `FaGlobe`, `FaWhatsapp`) |
| Animations | `motion` (`^12.38.0`, package "Motion for React", importé via `motion/react`) |
| i18n (déclaré) | `next-intl` `^4.5.5` est présent dans `package.json` |
| i18n (réellement utilisé) | **`next-intl` n'est importé nulle part dans le code source** (recherche exhaustive sans résultat). L'i18n effective est un système fait main : détection de locale via `middleware.ts` (redirection d'URL `/fr` ou `/en`), puis lecture de dictionnaires JSON statiques via `lib/i18n.ts` (`getDictionary`, `getProjectsData`). La locale courante est déduite à l'exécution en parsant `usePathname().split("/")[1]` dans chaque composant client, pas via un contexte React partagé. |
| Emailing | `nodemailer` `^8.0.5` utilisé dans `app/api/contact/route.ts` (SMTP). `resend` `^6.5.2` est déclaré en dépendance mais **aucun import de `resend` trouvé dans le code** — dépendance déclarée mais non utilisée, ou remplacée par `nodemailer` sans nettoyage du `package.json`. |
| Lint | ESLint 9, config plate (`eslint.config.mjs`) basée sur `eslint-config-next` (`core-web-vitals` + `typescript`) |
| Alias d'import | `@/*` → racine du projet (`tsconfig.json`, `paths`) |
| SEO structuré | JSON-LD (schema.org) injecté en inline (`<script type="application/ld+json">`) dans plusieurs composants (voir section 6) |

---

## 2. Arborescence des dossiers

```
.
├── app/                    Routing Next.js (App Router)
│   ├── [locale]/           Routes dynamiques préfixées par la langue (fr|en)
│   │   ├── legal-notice/       Route EN des mentions légales
│   │   └── mentions-legales/   Route FR des mentions légales
│   └── api/
│       └── contact/        Route API POST (envoi d'e-mail via SMTP)
├── components/
│   ├── layout/              Composants d'ossature de page (persistants sur toutes les routes)
│   │   ├── Navbar/
│   │   └── Footer/
│   └── sections/            Composants correspondant chacun à une section de la page d'accueil (une section = un <section id="...">)
│       ├── Home/                 Section hero (titre, citation animée, CTA)
│       ├── Services/             Section liste de services (accordéon)
│       │   └── ServiceCard/          Sous-composant carte individuelle
│       ├── Projects/             Section portfolio de projets (accordéon)
│       │   └── ProjectCard/          Sous-composant carte individuelle
│       ├── About/                Section "à propos" (photo + cartes accordéon)
│       │   └── AboutCard/            Sous-composant carte individuelle
│       ├── Pricing/              Section tarifs (grille de forfaits + maintenance)
│       │   └── Pricingcard/          Sous-composant carte tarif (nom en minuscule, seule exception de casse du repo)
│       ├── Testimonials/         Section témoignages clients
│       │   └── TestimonialCard/      Sous-composant carte témoignage
│       ├── Contact/               Section formulaire de contact + alternatives (WhatsApp, e-mail)
│       ├── LegalNotice/          Contenu de la page mentions légales / legal notice
│       └── Animations/           Composant d'animation transverse (effet machine à écrire)
├── hooks/                   Hooks React réutilisables (2 fichiers)
├── lib/                     Logique non-UI partagée (dictionnaires i18n, constantes d'animation)
├── locales/                 Dictionnaires de traduction JSON (source de vérité du texte du site)
│   └── projects/                Dictionnaires JSON dédiés aux données des projets du portfolio
├── public/                  Assets statiques servis à la racine (images, logos, manifest)
│   └── projects/                 Logos/captures des projets affichés dans la section Projects
└── (racine)                 Configuration du projet : next.config.ts, tsconfig.json, eslint.config.mjs, middleware.ts, package.json
```

---

## 3. Inventaire des composants

Convention de lecture : "Consomme" liste uniquement les hooks personnalisés, fichiers de locale/données et modules CSS importés directement (pas les hooks React natifs `useState`/`useEffect`/`useRef`, ni les libs génériques comme `motion` ou `next/navigation`).

| Chemin | Rôle (une phrase) | Consomme |
|---|---|---|
| `components/layout/Navbar/Navbar.tsx` | Barre de navigation fixe avec ancres de scroll, sélecteur de langue et lien WhatsApp. | `lib/i18n.ts` (`getDictionary`), `Navbar.module.css` |
| `components/layout/Footer/Footer.tsx` | Pied de page avec liens rapides, réseaux sociaux, adresse et copyright. | `lib/i18n.ts` (`getDictionary`), `Footer.module.css` |
| `components/sections/Home/Home.tsx` | Section hero : titre animé mot par mot, citation à effet machine à écrire, CTA vers le contact. | `hooks/useReducedMotion.ts`, `hooks/useIsMounted.ts`, `lib/animations.ts`, `lib/i18n.ts` (`getDictionary`), `Home.module.css`, composant `TypingQuote` |
| `components/sections/Animations/TypingQuote.tsx` | Effet visuel de frappe de texte caractère par caractère, boucle et curseur clignotant. | `Home.module.css` (réutilise le module CSS du composant parent `Home`, n'a pas de module CSS propre) |
| `components/sections/Services/Services.tsx` | Liste des services proposés sous forme d'accordéon, injecte un schema.org `ItemList`. | `hooks/useReducedMotion.ts`, `hooks/useIsMounted.ts`, `lib/animations.ts`, `lib/i18n.ts` (`getDictionary`), `Services.module.css`, composant `ServiceCard` |
| `components/sections/Services/ServiceCard/ServiceCard.tsx` | Carte accordéon d'un service unique (ouverture/fermeture par hauteur max animée en JS). | `ServiceCard.module.css` |
| `components/sections/Projects/Projects.tsx` | Grille de projets du portfolio sous forme d'accordéon, injecte un schema.org `ItemList` (WebApplication). | `hooks/useReducedMotion.ts`, `hooks/useIsMounted.ts`, `lib/animations.ts`, `lib/i18n.ts` (`getProjectsTitle`), `projectsData.ts` (`getProjects`), `Projects.module.css`, composant `ProjectCard` |
| `components/sections/Projects/ProjectCard/ProjectCard.tsx` | Carte accordéon d'un projet (image, description, liens live/GitHub ou badge "en développement"). | `projectsData.ts` (type `Project`), `lib/i18n.ts` (type `Locale`), `ProjectCard.module.css` |
| `components/sections/Projects/projectsData.ts` | Adaptateur qui transforme les données JSON de `locales/projects/*.json` en objets typés `Project`. | `lib/i18n.ts` (`getProjectsData`, type `Locale`) |
| `components/sections/About/About.tsx` | Section "à propos" : photo + liste de cartes accordéon générées depuis le dictionnaire de traduction. | `hooks/useReducedMotion.ts`, `hooks/useIsMounted.ts`, `lib/animations.ts`, `lib/i18n.ts` (`getDictionary`), `About.module.css`, composant `AboutCard` |
| `components/sections/About/AboutCard/AboutCard.tsx` | Carte accordéon d'une sous-section "à propos" (même mécanique d'ouverture que `ServiceCard`/`ProjectCard`). | `AboutCard.module.css` |
| `components/sections/Pricing/Pricing.tsx` | Grille de forfaits tarifaires + carte de maintenance optionnelle, injecte un schema.org `OfferCatalog`. | `hooks/useReducedMotion.ts`, `hooks/useIsMounted.ts`, `lib/animations.ts`, `lib/i18n.ts` (`getDictionary`), `Pricing.module.css`, composant `PricingCard` |
| `components/sections/Pricing/Pricingcard/PricingCard.tsx` | Carte d'un forfait tarifaire unique (nom, prix, features), pas d'accordéon contrairement aux autres cartes du repo. | `PricingCard.module.css` |
| `components/sections/Testimonials/Testimonials.tsx` | Section témoignages clients ; **les données des témoignages sont codées en dur dans le composant** (tableau `testimonials`), pas dans un fichier JSON de `locales/`, contrairement aux autres sections. | `hooks/useReducedMotion.ts`, `hooks/useIsMounted.ts`, `lib/animations.ts`, `lib/i18n.ts` (`getDictionary`, uniquement pour les libellés `title`/`subtitle`/`platformLabel`), `Testimonials.module.css`, composant `TestimonialCard` |
| `components/sections/Testimonials/TestimonialCard/TestimonialCard.tsx` | Affiche un témoignage individuel (étoiles, texte, auteur, date localisée). | `../Testimonials.module.css` (n'a pas de module CSS propre, importe celui du dossier parent) |
| `components/sections/Contact/Contact.tsx` | Formulaire de contact (avec honeypot anti-spam) + cartes WhatsApp/e-mail, injecte un schema.org `ContactPage`. | `hooks/useReducedMotion.ts`, `hooks/useIsMounted.ts`, `lib/animations.ts`, `lib/i18n.ts` (`getDictionary`), `Contact.module.css`, route API `/api/contact` (fetch côté client) |
| `components/sections/LegalNotice/LegalNotice.tsx` | Contenu de la page mentions légales/legal notice ; **définit son propre dictionnaire de traduction en dur dans le composant** (objet `content: Record<Locale, ContentTranslation>`), sans passer par `locales/*.json` ni `lib/i18n.ts`. | `hooks/useReducedMotion.ts`, `hooks/useIsMounted.ts`, `lib/animations.ts`, `LegalNotice.module.css` |

---

## 4. Points d'entrée et routage

### Structure App Router

```
app/
├── layout.tsx                        Root layout global (html/body, favicon, manifest, meta theme-color, <link> CDN bootstrap-icons). Locale HTML fixée à "fr" en dur (lang="fr").
├── globals.css                       Styles CSS globaux
├── robots.ts                         Génère /robots.txt (MetadataRoute.Robots) — autorise "/", bloque "/api/" et "/_next/"
├── sitemap.ts                        Génère /sitemap.xml (MetadataRoute.Sitemap) — routes en dur : /fr, /en, /fr/mentions-legales, /en/legal-notice
├── api/
│   └── contact/
│       └── route.ts                  POST /api/contact — envoi d'e-mail via nodemailer/SMTP, validation minimale (champs requis), pas de rate limiting visible
└── [locale]/
    ├── layout.tsx                    Layout de section locale : injecte Navbar + Footer, generateMetadata dynamique par locale (fr/en), 2 blocs JSON-LD (Person, WebSite)
    ├── page.tsx                      Page d'accueil (route /[locale]) — assemble les 7 sections dans l'ordre : Home, Services, Projects, About, Pricing, Testimonials, Contact
    ├── legal-notice/
    │   └── page.tsx                  Route /en/legal-notice (et /fr/legal-notice) — rend <LegalNotice/>, metadata statique en anglais
    └── mentions-legales/
        └── page.tsx                  Route /fr/mentions-legales (et /en/mentions-legales) — rend <LegalNotice/>, metadata statique en français
```

Remarque factuelle : `legal-notice` et `mentions-legales` sont deux dossiers de route distincts qui rendent le **même composant** `<LegalNotice/>` avec un objet `metadata` différent ; le composant lui-même détermine la langue affichée via `usePathname()`, indépendamment du segment de route utilisé pour y accéder (donc `/en/mentions-legales` et `/fr/legal-notice` sont accessibles et rendent respectivement l'anglais et le français, malgré le nom du segment).

### Middleware

`middleware.ts` (racine) — s'exécute sur toutes les routes sauf `_next/static`, `_next/image`, `favicon.ico`, fichiers avec extension, et `api` (voir `config.matcher`) :
- Locales supportées : `["fr", "en"]`, défaut `"fr"`.
- Si le chemin contient déjà une locale (`/fr/...` ou `/en/...`), laisse passer.
- Si le chemin est `/` : détecte si le user-agent est un bot connu (liste en dur de ~20 crawlers) → redirige toujours vers `/fr` (SEO) ; sinon détecte la langue via l'en-tête `Accept-Language` → redirige vers `/fr` ou `/en`.
- Sinon (chemin sans locale, ex. `/mentions-legales`) : préfixe la locale détectée et redirige.

### Routes API

| Route | Méthode | Rôle |
|---|---|---|
| `/api/contact` | `POST` | Reçoit `{name, email, message}`, envoie un e-mail via SMTP (nodemailer), retourne `{success:true}` ou une erreur JSON. Variables d'environnement attendues : `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS` (non déterminé si elles sont définies dans un `.env` — aucun fichier `.env*` trouvé dans le périmètre analysé). |

### Layouts

Deux niveaux de layout imbriqués : `app/layout.tsx` (racine, HTML/body/tags globaux) → `app/[locale]/layout.tsx` (Navbar + Footer + métadonnées SEO dynamiques + JSON-LD Person/WebSite).

---

## 5. Conventions de nommage et de structure observées

- **Organisation dossier/composant** : chaque composant "section" ou "layout" vit dans son propre dossier sous `components/sections/<Nom>/` ou `components/layout/<Nom>/`, avec son fichier `<Nom>.tsx` et son `<Nom>.module.css` colocalisés. Les sous-composants (cartes) sont dans un sous-dossier du composant parent (ex. `Services/ServiceCard/`, `Projects/ProjectCard/`, `About/AboutCard/`, `Pricing/Pricingcard/`, `Testimonials/TestimonialCard/`).
- **Casse des dossiers de sous-composants** : `PascalCase` partout (`ServiceCard`, `ProjectCard`, `AboutCard`, `TestimonialCard`) sauf `Pricing/Pricingcard/` qui est en casse mixte non standard (`Pricingcard`, pas `PricingCard`) — seule exception relevée dans le repo.
- **Nommage des modules CSS** : un fichier `<NomDuComposant>.module.css` par composant, avec le même nom que le composant React (`Navbar.tsx` → `Navbar.module.css`). Deux exceptions constatées : `TypingQuote.tsx` et `TestimonialCard.tsx` n'ont pas de module CSS propre et importent celui du composant parent (`Home.module.css`, `../Testimonials.module.css`).
- **Emplacement des types** : pas de dossier `types/` centralisé. Les interfaces/types sont définis localement dans le fichier qui les utilise en premier (ex. `interface Service` redéfinie identiquement dans `Services.tsx` et `ServiceCard.tsx` — voir section 6), sauf `Project` qui est exporté depuis `projectsData.ts` et réimporté par `Projects.tsx`/`ProjectCard.tsx`, et `Locale`/`Dictionary`/`ProjectData` exportés depuis `lib/i18n.ts`.
- **Locale courante côté client** : aucun contexte React ni provider ; chaque composant client recalcule indépendamment `const currentLocale = (pathname?.split("/")[1] || "fr") as Locale` à partir de `usePathname()`. Ce pattern est répété à l'identique dans au moins 9 composants (`Navbar`, `Footer`, `Home`, `Services`, `Projects`, `ProjectCard`, `About`, `Pricing`, `Testimonials`, `Contact`, `LegalNotice`).
- **Directive `"use client"`** : présente en tête de tous les composants de `components/` qui utilisent des hooks ou des animations ; absente des fichiers `app/*.ts(x)` de type route handler/metadata (`layout.tsx` racine excepté qui reste composant serveur), `robots.ts`, `sitemap.ts`, `route.ts`.
- **Fichiers de données JSON** : convention `<lang>.json` pour les dictionnaires principaux (`locales/en.json`, `locales/fr.json`) et `<lang>.projects.json` pour les données de projets (`locales/projects/en.projects.json`).
- **En-tête de fichier en commentaire** : certains fichiers commencent par un commentaire `// chemin/relatif/du/fichier.tsx` reproduisant leur propre chemin (ex. `Navbar.tsx`, `Contact.tsx`, `Home.tsx`, `Services.tsx`, `About.tsx`, `Pricing.tsx`, `Testimonials.tsx`, `Animations/TypingQuote.tsx`, `hooks/useReducedMotion.ts`, `lib/animations.ts`) ; d'autres fichiers du même type n'en ont pas (`Footer.tsx`, `ProjectCard.tsx`, `AboutCard.tsx`, `ServiceCard.tsx`, `PricingCard.tsx`, `TestimonialCard.tsx`, `LegalNotice.tsx`) — convention appliquée de façon incohérente.

---

## 6. Zones sensibles (constat factuel, sans correctif proposé)

### Fichiers dépassant 300 lignes

| Fichier | Lignes |
|---|---|
| `components/sections/Contact/Contact.tsx` | 380 |
| `components/layout/Navbar/Navbar.tsx` | 363 |
| `components/layout/Footer/Footer.tsx` | 355 |
| `components/sections/LegalNotice/LegalNotice.tsx` | 330 |
| `app/[locale]/layout.tsx` | 232 |

(Aucun autre fichier `.ts`/`.tsx` du périmètre analysé ne dépasse 300 lignes ; `components/sections/Home/Home.tsx` en compte 221.)

### Duplications visibles

- **Détection de locale** : logique `pathname?.split("/")[1] || "fr"` dupliquée à l'identique dans au moins 9 fichiers (voir section 5).
- **Décalage de scroll pour la navbar fixe** : la valeur en dur `navbarHeight = 90` et le bloc de calcul `getBoundingClientRect().top + window.pageYOffset - navbarHeight` apparaissent 12 fois au total dans `Navbar.tsx` et `Footer.tsx`.
- **Fonction `scrollToContact`** (récupère `document.getElementById("contact")` puis `scrollIntoView`) redéfinie indépendamment dans `Home.tsx`, `Services.tsx` et `Pricing.tsx`.
- **Texte du message WhatsApp pré-rempli** (`"Bonjour, je souhaite discuter d'un projet web."` / version anglaise) dupliqué en dur dans `Navbar.tsx`, `Footer.tsx` (×2) et `Contact.tsx`.
- **Pattern accordéon** (état `openIndex`/`isOpen`, `useRef` + `useEffect` qui fixe `el.style.maxHeight` manuellement) réimplémenté séparément et à l'identique dans `ServiceCard.tsx`, `ProjectCard.tsx` et `AboutCard.tsx`, sans hook ni composant partagé.
- **Interface `Service { title, icon, description }`** redéfinie séparément (mais identiquement) dans `Services.tsx` et `ServiceCard.tsx` plutôt qu'exportée d'un seul endroit.
- **Interface `Package`** (forfait tarifaire) redéfinie séparément dans `Pricing.tsx` et `PricingCard.tsx`.
- **Blocs JSON-LD schema.org** : chaque section (`Home`, `Services`, `Projects`, `Pricing`, `Contact`, `LegalNotice`, `app/[locale]/layout.tsx`) construit indépendamment son propre objet schema.org avec des champs `areaServed`/`address`/coordonnées de contact répétés (adresse postale, numéro de téléphone, e-mail) copiés-collés à l'identique dans au moins 5 fichiers.
- **Mécanisme `shouldAnimate = isMounted && !reducedMotion` + fonctions `fadeUp`/`fadeFromLeft`/`fadeFromRight`** : le même triplet de valeurs d'easing/durée/translation (`lib/animations.ts`) et la même forme de fonction `fadeUp(delay)` sont réécrits localement dans chaque section (`Home`, `Services`, `Projects`, `About`, `Pricing`, `Testimonials`, `Contact`, `LegalNotice`) plutôt que factorisés en un hook ou composant wrapper commun.
- **`public/og-image.jpg`** et **`public/og-image copie.jpg`** : deux fichiers de taille identique (52757 octets), probable copie de sauvegarde laissée dans les assets publics.
- **Dépendance `resend`** déclarée dans `package.json` sans aucun import dans le code (l'envoi d'e-mail réel passe par `nodemailer`).
- **Dépendance `next-intl`** déclarée dans `package.json` sans aucun import dans le code (l'i18n réelle est faite main via `middleware.ts` + `lib/i18n.ts`).

### Dépendances circulaires

Aucune dépendance circulaire entre modules constatée dans les imports lus (les sous-composants importent depuis leur parent immédiat ou depuis `lib/`/`hooks/`, jamais l'inverse). Non vérifié par un outil d'analyse de graphe de dépendances automatisé — constat basé sur lecture manuelle des imports de chaque fichier listé en section 3.
