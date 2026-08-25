# ARCHITECTURE.md

> Complète `doc/ARBORESCENCE.md` (structure des dossiers, inventaire des composants, liste des fichiers longs — non répétés ici, s'y référer).
> Ce document répond à : comment les données circulent réellement dans le code, où passe la frontière serveur/client, quels contrats de données existent, et quels changements en cascade un fichier impose à d'autres.
> Généré par analyse statique du code source (lecture seule). Public cible : un système IA sans connaissance préalable du dépôt.

---

## 1. Flux de données bout en bout

### 1.1 i18n — de l'URL entrante jusqu'au texte affiché

```
Requête HTTP (ex: GET /)
  → middleware.ts                              détection locale (header Accept-Language ou bot), redirection vers /fr ou /en
  → app/[locale]/layout.tsx                     await params → { locale }, generateMetadata(locale) construit <title>/<meta>/JSON-LD Person+WebSite pour cette locale
  → app/[locale]/page.tsx                       server component, ne lit pas la locale lui-même, rend Home/Services/Projects/About/Pricing/Testimonials/Contact sans leur passer la locale en props
  → <Section>.tsx (ex: components/sections/Home/Home.tsx)   "use client", exécuté dans le navigateur
      → usePathname()                           lit l'URL courante côté client
      → currentLocale = pathname.split("/")[1] || "fr"   recalcul local, indépendant du layout serveur
      → lib/i18n.ts → getDictionary(currentLocale)        sélectionne dictionaries.fr ou dictionaries.en (import statique des deux JSON)
      → locales/fr.json | locales/en.json                 objet JS importé tel quel (resolveJsonModule)
      → t.xxx rendu directement dans le JSX
```

Points factuels notables :
- La locale n'est **jamais transmise en props** depuis `app/[locale]/layout.tsx` ou `app/[locale]/page.tsx` (composants serveur qui ont pourtant `params.locale`) vers les composants clients. Chaque composant client relit `usePathname()` et reparse lui-même le premier segment d'URL.
- `middleware.ts` est la seule couche qui lit l'en-tête HTTP `Accept-Language` ; une fois l'URL préfixée (`/fr/...` ou `/en/...`), toute détection ultérieure se fait uniquement par lecture du chemin, jamais par re-consultation du header.
- `lib/i18n.ts` importe les deux fichiers JSON (`fr` et `en`) de façon statique et inconditionnelle (`import en from "@/locales/en.json"; import fr from "@/locales/fr.json";`). Conséquence : n'importe quel composant qui importe `lib/i18n.ts` embarque les deux dictionnaires complets dans son bundle, quelle que soit la locale réellement affichée (voir section 5).
- `components/sections/LegalNotice/LegalNotice.tsx` ne suit **pas** ce flux : il ne passe pas par `lib/i18n.ts` ni par `locales/*.json`. Il définit son propre objet `content: Record<Locale, ContentTranslation>` en dur dans le composant, avec sa propre définition locale de `type Locale = "en" | "fr"` (redéfinie, pas importée de `lib/i18n.ts`).
- `components/sections/Testimonials/Testimonials.tsx` ne filtre **pas** les témoignages par langue : le tableau `testimonials` (codé en dur dans le composant) est rendu intégralement quelle que soit `currentLocale`. Chaque témoignage a un champ `lang` (`"fr"` ou `"en"`), mais ce champ sert uniquement à choisir le format de date (`toLocaleDateString("fr-FR"|"en-US", …)` dans `TestimonialCard.tsx`), pas à filtrer l'affichage. Un visiteur sur `/en` voit donc aussi le témoignage en français.

### 1.2 Formulaire de contact — de la saisie jusqu'à l'envoi du mail

```
components/sections/Contact/Contact.tsx  ("use client")
  → useState formData { name, email, message }        état local du formulaire, pré-rempli avec un message par défaut selon currentLocale
  → useState honeypot                                   champ caché anti-spam
  → handleSubmit(e)
      → si honeypot rempli → console.log("Spam detected") + return (aucune requête envoyée)
      → setStatus("sending")
      → fetch("/api/contact", { method: "POST", body: JSON.stringify(formData) })
          → app/api/contact/route.ts   → POST(request)
              → body = await request.json()
              → destructuring { name, email, message }
              → si un champ manque → NextResponse.json({error}, {status:400})
              → nodemailer.createTransport({ host: SMTP_HOST, port: SMTP_PORT, secure:true, auth:{user:SMTP_USER, pass:SMTP_PASS} })
              → transporter.sendMail({ from: "contact@christophetesconidev.com" (en dur), to: "contact@christophetesconidev.com" (en dur), replyTo: email, subject: `Nouveau message de ${name} - Portfolio`, html: gabarit HTML en dur })
              → succès → NextResponse.json({success:true})
              → exception → console.error("SMTP error", …) + NextResponse.json({error}, {status:500})
      → réponse reçue côté client
          → response.ok → setStatus("success") + reset formData (avec le message par défaut localisé)
          → sinon → setStatus("error")
      → catch (erreur réseau/fetch) → console.error("Form submission error") + setStatus("error")
      → setTimeout(() => setStatus("idle"), 5000)   quel que soit le résultat, le statut revient à "idle" après 5s
  → rendu conditionnel : t.contact.form.success / t.contact.form.error (issus de locales/{locale}.json) affichés selon `status`
```

Points factuels notables :
- Aucune validation de format d'e-mail côté client ni côté serveur au-delà de `required` HTML et d'une vérification de présence (`!name || !email || !message`) dans `route.ts`.
- L'adresse `from`/`to` de l'e-mail est codée en dur dans `app/api/contact/route.ts`, indépendante de toute variable d'environnement.
- Le mécanisme anti-spam (honeypot) est purement côté client : un bot qui poste directement sur `/api/contact` sans passer par le formulaire contourne totalement cette protection, puisque `route.ts` ne vérifie aucun champ honeypot.
- Aucun rate limiting constaté dans `route.ts`.

### 1.3 Données des projets du portfolio — du JSON jusqu'au rendu

```
locales/projects/fr.projects.json | en.projects.json     source de vérité (projectsTitle, devBadge, projects[])
  → lib/i18n.ts
      → projectsDictionaries = { fr: frProjects, en: enProjects }   import statique des deux fichiers
      → getProjectsData(locale) → projectsDictionaries[locale].projects
      → getProjectsTitle(locale) → projectsDictionaries[locale].projectsTitle
  → components/sections/Projects/projectsData.ts
      → getProjects(currentLocale)
          → appelle getProjectsData(currentLocale)
          → mappe chaque entrée JSON vers un objet typé Project { titre, description, keywords, image, github, githubCTA, liveUrl, liveCTA }
          → NOTE FACTUELLE : le champ JSON `devBadge` (au niveau racine du fichier, hors des objets `projects[]`) n'est jamais lu par ce mapping ni par aucun composant — il n'a aucun effet sur le rendu.
  → components/sections/Projects/Projects.tsx  ("use client")
      → const projects = getProjects(currentLocale)
      → construit un objet JSON-LD `ItemList`/`WebApplication` à partir de `projects` et l'injecte via <script type="application/ld+json">
      → projects.map(...) → rend un <ProjectCard project={project} .../> par projet, dans l'ordre du tableau JSON
  → components/sections/Projects/ProjectCard/ProjectCard.tsx  ("use client")
      → reçoit project en props
      → recalcule lui-même currentLocale via usePathname() (indépendamment de Projects.tsx qui le lui aurait pourtant déjà calculé)
      → const devBadge = currentLocale === "fr" ? "🚧 Projet en développement" : "🚧 Project in development"   — chaîne codée en dur dans ce fichier, sans lien avec le champ JSON `devBadge` (voir ci-dessus)
      → const isInDevelopment = !project.liveUrl || !project.github
      → si isInDevelopment → affiche le badge "en développement" au lieu des liens
      → sinon → affiche <a href={project.liveUrl}> et <a href={project.github}> avec le texte de project.liveCTA / project.githubCTA (ceux-ci viennent bien du JSON)
      → <Image src={project.image} .../>   project.image est un chemin relatif à public/ (ex: "/projects/rdf_logo.jpeg"), résolu par next/image, fichier physique attendu dans public/projects/
```

---

## 2. Frontière serveur / client

| Fichier | Rendu | Preuve dans le code |
|---|---|---|
| `app/layout.tsx` | Serveur | Pas de `"use client"`. Composant racine synchrone, exporte `metadata`. |
| `app/[locale]/layout.tsx` | Serveur (async) | Pas de `"use client"`. `async function LocaleLayout` + `await params`, `generateMetadata` async (API serveur uniquement). |
| `app/[locale]/page.tsx` | Serveur | Pas de `"use client"`. Ne fait qu'assembler des imports de composants clients, aucun hook. |
| `app/[locale]/legal-notice/page.tsx`, `mentions-legales/page.tsx` | Serveur | Pas de `"use client"`. Exportent un objet `metadata` statique (API réservée aux composants serveur). |
| `app/robots.ts`, `app/sitemap.ts` | Serveur (build-time) | Fonctions `MetadataRoute.*`, exécutées uniquement côté serveur/build par convention Next.js, pas de directive applicable. |
| `app/api/contact/route.ts` | Serveur (route handler) | Route API, toujours exécutée côté serveur par nature ; utilise `nodemailer` (module Node, incompatible navigateur). |
| `middleware.ts` | Serveur (edge) | S'exécute avant toute page, pas un composant React, n'a pas de directive `"use client"`. |
| `components/layout/Navbar/Navbar.tsx`, `Footer/Footer.tsx` | Client | `"use client"` en ligne 1 (Navbar) / ligne 1 (Footer). Utilisent `useState`, `useEffect`, `usePathname`, `useRouter`. |
| Tous les composants sous `components/sections/*/*.tsx` qui contiennent `"use client"` en tête : `Home.tsx`, `TypingQuote.tsx`, `Services.tsx`, `ServiceCard.tsx`, `Projects.tsx`, `ProjectCard.tsx`, `About.tsx`, `AboutCard.tsx`, `Pricing.tsx`, `Testimonials.tsx`, `Contact.tsx`, `LegalNotice.tsx` | Client | Directive `"use client"` explicite constatée en tête de chacun de ces fichiers. Raison : usage de `usePathname()`, `motion.*` (Motion for React, nécessite le navigateur), et/ou des hooks `useReducedMotion`/`useIsMounted` qui lisent `window.matchMedia`. |
| `components/sections/Pricing/Pricingcard/PricingCard.tsx`, `components/sections/Testimonials/TestimonialCard/TestimonialCard.tsx` | Client (par héritage de contexte, pas par directive propre) | **Aucune directive `"use client"` constatée dans ces deux fichiers.** Ils ne contiennent aucun hook ni API navigateur. Ils sont néanmoins exécutés côté client car importés exclusivement par `Pricing.tsx` et `Testimonials.tsx`, qui sont eux-mêmes `"use client"` — une fois la frontière client franchie par un ancêtre, tout import transitif s'exécute côté client, avec ou sans directive propre. |
| `hooks/useIsMounted.ts`, `hooks/useReducedMotion.ts` | Client | `"use client"` en tête des deux fichiers ; utilisent `useState`/`useEffect`/`useSyncExternalStore` et `window.matchMedia`, APIs navigateur uniquement. |
| `lib/i18n.ts`, `lib/animations.ts`, `components/sections/Projects/projectsData.ts` | Sans directive, exécutés côté client dans ce repo | Aucun de ces trois fichiers ne contient de hook ni d'API navigateur — ils pourraient s'exécuter côté serveur. Mais dans ce code, **ils ne sont importés que par des composants déjà marqués `"use client"`**, donc ils finissent dans le bundle client. Aucun composant serveur (`app/**/layout.tsx`, `page.tsx`) ne les importe. |

**Où passe la frontière, concrètement** : `app/[locale]/layout.tsx` (serveur) rend directement `<Navbar/>` et `<Footer/>` (client) dans son JSX, et `{children}` qui pointe vers `app/[locale]/page.tsx` (serveur) qui rend à son tour 7 composants clients (`Home`, `Services`, `Projects`, `About`, `Pricing`, `Testimonials`, `Contact`). La frontière serveur→client se situe donc exactement à ces deux points d'insertion ; il n'y a aucun composant serveur en dessous de ce niveau dans l'arbre.

---

## 3. Contrats de données

### 3.1 `locales/fr.json` et `locales/en.json`

Les deux fichiers doivent partager exactement la même forme (clés identiques, types identiques) puisque `lib/i18n.ts` les assigne au même objet `dictionaries` et que le code y accède sans vérifier l'existence des clés (`t.contact.form.name` etc., sans `?.` de garde sur les sous-objets, seulement sur `t` et `t.contact`/`t.services`/`t.about`/`t.pricing` au niveau racine des sections).

| Clé racine | Forme | Consommé par |
|---|---|---|
| `nav` | `{ home, projects, services, about, contact, prices: string }` | `Navbar.tsx` |
| `titleFreelance` | `string` | `Home.tsx` (titre H1, découpé en mots pour l'animation) |
| `introQuote` | `string` | `Home.tsx` → passé en props `text` à `TypingQuote.tsx` |
| `introText` | `string` | `Home.tsx` |
| `contactCTA` | `string` | `Home.tsx` (texte du bouton CTA) |
| `message` | `string` | Déclaré dans le JSON ; **aucun composant lu ne le consomme** (non trouvé dans les fichiers analysés) |
| `services` | `{ title, cta: string, services: Array<{ title, icon, description: string[] }> }` | `Services.tsx`, `ServiceCard.tsx` |
| `about` | `{ title: string, sections: Array<{ title, content: string[] }> }` | `About.tsx`, `AboutCard.tsx` |
| `testimonials` | `{ title, subtitle, platformLabel: string }` | `Testimonials.tsx` (uniquement ces 3 libellés ; les témoignages eux-mêmes ne viennent pas de ce fichier, voir 1.1) |
| `pricing` | `{ title: string, packages: Array<{ name, price, priceNote, popular?: boolean, installment?: string, features: string[] }>, maintenance?: { name, price, period, annualPrice, annualSaving, features: string[] }, notes: string[], cta: string }` | `Pricing.tsx`, `PricingCard.tsx` |
| `contact` | `{ title, subtitle: string, form: { name, namePlaceholder, email, emailPlaceholder, message, messagePlaceholder, submit, sending, success, error: string }, alternatives: { title: string, whatsapp: { title, subtitle, cta: string }, email: { title, address, cta: string } }, trust: { response, quote, location: string } }` | `Contact.tsx` |
| `footer` | `{ brand, tagline, legal, address, phone, email, quickLinks, home, services, projects, about, pricing, contact, followUs, linkedin, github, instagram, malt, whatsapp, calendly, copyright, madeWith, nextjs: string }` | `Footer.tsx` — **`footer.instagram` est présent dans les deux fichiers JSON mais n'est lu par aucun composant analysé** (`Footer.tsx` ne rend pas de lien Instagram) |

Type exporté : `Dictionary = typeof fr` (dans `lib/i18n.ts`), utilisé implicitement comme type de retour de `getDictionary()` — non ré-exporté/annoté explicitement dans les composants consommateurs (ils utilisent `const t = getDictionary(currentLocale)` sans annotation de type).

### 3.2 `locales/projects/fr.projects.json` et `en.projects.json`

| Clé | Forme | Consommé par |
|---|---|---|
| `projectsTitle` | `string` | `Projects.tsx` via `getProjectsTitle()` |
| `devBadge` | `string` | Déclaré dans le JSON, **jamais lu** (voir 1.3 — `ProjectCard.tsx` recalcule son propre texte en dur) |
| `projects` | `Array<{ titre, image, description: string[], keywords?: string[], github, githubCTA, liveUrl?, liveCTA? }>` | `projectsData.ts` (`getProjects`) → `Projects.tsx` → `ProjectCard.tsx` |

Type exporté : `Project` (dans `projectsData.ts`), consommé par `Projects.tsx` et `ProjectCard.tsx`. Un second type, `ProjectData` (exporté par `lib/i18n.ts`), a une forme quasi identique à `Project` mais **n'est importé par aucun fichier analysé** — type mort ou redondant avec `Project`.

### 3.3 Payload de la route API `/api/contact`

| Sens | Forme | Fichier |
|---|---|---|
| Requête (POST, JSON) | `{ name: string, email: string, message: string }` | Émis par `Contact.tsx` (`JSON.stringify(formData)`), lu par `route.ts` (`await request.json()`) |
| Réponse succès | `{ success: true }`, statut 200 | `route.ts` |
| Réponse erreur validation | `{ error: string }`, statut 400 (champ manquant) | `route.ts` |
| Réponse erreur serveur | `{ error: string }`, statut 500 (échec SMTP/exception) | `route.ts` |

Aucun schéma de validation (zod, yup, etc.) constaté ; la validation est un simple `if (!name || !email || !message)`.

### 3.4 Types exportés et consommateurs

| Type | Défini dans | Exporté | Importé par |
|---|---|---|---|
| `Locale` (`"fr" \| "en"`) | `lib/i18n.ts` | Oui | `Navbar.tsx`, `Footer.tsx`, `Home.tsx`, `Services.tsx`, `Projects.tsx`, `ProjectCard.tsx`, `About.tsx`, `Pricing.tsx`, `Testimonials.tsx`, `Contact.tsx`, `projectsData.ts` |
| `Dictionary` (`typeof fr`) | `lib/i18n.ts` | Oui | Aucun import direct constaté (type inféré implicitement via `getDictionary`, jamais annoté explicitement ailleurs) |
| `ProjectData` | `lib/i18n.ts` | Oui | Aucun import constaté (voir 3.2) |
| `Project` | `projectsData.ts` | Oui | `ProjectCard.tsx` |
| `Locale` (redéfinition locale, `"en" \| "fr"`) | `LegalNotice.tsx` | Non (type local au fichier) | Usage interne à `LegalNotice.tsx` uniquement — **duplique** le type `Locale` de `lib/i18n.ts` sans l'importer |
| `Service` (`{title, icon, description}`) | Redéfini indépendamment dans `Services.tsx` et `ServiceCard.tsx` | Non | Usage interne à chaque fichier |
| `Package` (forfait tarifaire) | Redéfini indépendamment dans `Pricing.tsx` et `PricingCard.tsx` | Non | Usage interne à chaque fichier |
| `AboutSection` | Redéfini indépendamment dans `About.tsx` (et implicitement utilisé sans réimport dans `AboutCard.tsx` via une interface locale identique) | Non | Usage interne |

---

## 4. Configuration et environnement

### 4.1 Variables d'environnement

| Variable | Lue dans | Obligatoire pour | Fallback constaté |
|---|---|---|---|
| `SMTP_HOST` | `app/api/contact/route.ts` | Envoi d'e-mail du formulaire de contact | Aucun (undefined → `nodemailer.createTransport` échouera à l'envoi) |
| `SMTP_PORT` | `app/api/contact/route.ts` | idem | Aucun (`Number(undefined)` → `NaN`) |
| `SMTP_USER` | `app/api/contact/route.ts` | idem | Aucun |
| `SMTP_PASS` | `app/api/contact/route.ts` | idem | Aucun |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | `components/sections/Contact/Contact.tsx` uniquement | Lien WhatsApp affiché dans la section Contact | `"33786599327"` (en dur dans `Contact.tsx`) |

Fichier `.env.local` présent à la racine du dépôt (listé par `.gitignore` sous le motif `.env*`, donc non versionné) ; son contenu n'a pas été lu par cette analyse (fichier potentiellement porteur de secrets).

**Couplage constaté** : `NEXT_PUBLIC_WHATSAPP_NUMBER` n'est lu que par `Contact.tsx`. Le même numéro (`33786599327`) est codé en dur, indépendamment de cette variable, dans `Navbar.tsx`, `Footer.tsx` (×2), `app/[locale]/layout.tsx` (JSON-LD) et `LegalNotice.tsx` (×2). Changer la variable d'environnement ne modifie donc que le lien WhatsApp de la section Contact, pas les autres occurrences du site.

### 4.2 Fichiers de configuration

| Fichier | Contrôle |
|---|---|
| `next.config.ts` | Configuration Next.js — objet `NextConfig` vide constaté, aucune option personnalisée (pas de domaines d'images distants, pas de redirections/rewrites déclaratifs, pas de headers custom) |
| `tsconfig.json` | `strict: true`, alias `@/*` → racine du projet, cible `ES2017`, résolution `bundler` |
| `eslint.config.mjs` | Règles `eslint-config-next` (`core-web-vitals` + `typescript`), ignore `.next/`, `out/`, `build/`, `next-env.d.ts` |
| `middleware.ts` (`export const config`) | `matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\..*|api).*)"]` — détermine quelles routes passent par la logique de détection/redirection de locale |
| `public/manifest.json` | Manifeste PWA (nom, icônes, couleur de thème `#1f2039`) référencé depuis `app/layout.tsx` via `<link rel="manifest">` |
| `package.json` (`scripts`) | `dev` → `next dev`, `build` → `next build`, `start` → `next start`, `lint` → `eslint` |

---

## 5. Couplages implicites

Section la plus importante de ce document : chaque ligne décrit un endroit où une modification isolée casse silencieusement un autre endroit du code, sans erreur de compilation ni avertissement runtime.

| Si vous modifiez… | … vous devez aussi modifier | Sinon | Preuve dans le code |
|---|---|---|---|
| Une clé utilisée par un composant client (`t.xxx.yyy`) | La même clé dans **les deux** `locales/fr.json` et `locales/en.json` | Le rendu de la langue qui ne définit pas la clé échoue (`undefined` affiché, ou erreur TypeScript à la compilation si les deux objets ont des formes structurellement différentes — non garanti runtime) | `lib/i18n.ts` assigne `fr` et `en` au même objet `dictionaries` sans validation de schéma |
| La hauteur visuelle de la navbar (CSS) | Les 3 occurrences indépendantes de la valeur `90` (`navbarHeight` dans `Navbar.tsx` et `Footer.tsx`, calcul de scroll) **et** `scroll-margin-top: 90px` dans `app/globals.css` **et** `padding-top: 58px` sur `html, body` dans `app/globals.css` | Le scroll vers une section via les liens de nav/footer/ancre atterrit au mauvais endroit (chevauchement ou espace vide sous la navbar) | `grep navbarHeight` → 12 occurrences dans `Navbar.tsx`/`Footer.tsx` ; `app/globals.css` lignes 24 et 39 |
| L'`id` d'un `<section id="...">` (ex. dans `Services.tsx`) | Le tableau `SECTIONS` dans `Navbar.tsx`, les `href="#..."` dans `Navbar.tsx` **et** `Footer.tsx` | Le lien de nav ne scrolle plus vers la section, et l'`IntersectionObserver` de `Navbar.tsx` ne détecte plus jamais cette section comme active | `Navbar.tsx` : `const SECTIONS = ["home","services","mesprojets","apropos","tarifs","temoignages","contact"]` doit correspondre exactement aux `id` posés sur les balises `<section>` de `Home.tsx`, `Services.tsx`, `Projects.tsx`, `About.tsx`, `Pricing.tsx`, `Testimonials.tsx`, `Contact.tsx` |
| Le nom du dossier de route `mentions-legales` ou `legal-notice` | La chaîne construite dans `Footer.tsx` : ``/${currentLocale}/${currentLocale === "fr" ? "mentions-legales" : "legal-notice"}`` | Le lien "mentions légales" du footer pointe vers une route 404 | `components/layout/Footer/Footer.tsx`, bloc `href` du lien légal |
| Le nombre ou l'ordre des `locales` supportées | `middleware.ts` (`const locales = ["fr","en"]`), `lib/i18n.ts` (`type Locale`, objets `dictionaries`/`projectsDictionaries`), `app/[locale]/layout.tsx` (`titles`/`descriptions` Records + tous les ternaires `locale === "fr" ? X : Y`), `app/sitemap.ts` (routes codées en dur), `LegalNotice.tsx` (`content: Record<Locale, ...>`), et tout ternaire `currentLocale === "fr" ? X : Y` dans `Navbar.tsx`/`Footer.tsx`/`Contact.tsx`/`Home.tsx`/`Services.tsx`/`Projects.tsx`/`Pricing.tsx` | Nouvelle langue non détectée par le middleware, ou détectée mais affichant du texte français/anglais par défaut là où un composant utilise un ternaire binaire au lieu d'un lookup | Ternaires `currentLocale === "fr" ? ... : ...` trouvés dans au moins 7 composants ; aucun de ces composants ne gère un 3ᵉ cas |
| Le type `Locale` dans `lib/i18n.ts` | Le type `Locale` **redéfini indépendamment** dans `LegalNotice.tsx` (`type Locale = "en" \| "fr"`, non importé) | Les deux définitions divergent silencieusement si l'une est mise à jour et pas l'autre (aucune erreur de compilation tant que les deux restent des unions de string literals valides) | `LegalNotice.tsx` ligne 17 vs `lib/i18n.ts` ligne 6 |
| La forme de l'objet `service` dans `locales/*.json` → `services.services[]` | L'interface `Service` dupliquée indépendamment dans `Services.tsx` **et** `ServiceCard.tsx` | Désynchronisation de types possible entre les deux fichiers (aucun import partagé) ; TypeScript ne détecte que les incompatibilités structurelles au moment de la compilation, pas les ajouts de champs non utilisés | Deux `interface Service { title, icon, description }` distinctes trouvées |
| La forme d'un `package` dans `locales/*.json` → `pricing.packages[]` | L'interface `Package` dupliquée indépendamment dans `Pricing.tsx` **et** `PricingCard.tsx` | Idem | Deux `interface Package {...}` distinctes trouvées |
| Le numéro WhatsApp | Les 6 occurrences codées en dur de `33786599327` dans `Navbar.tsx`, `Footer.tsx` (×2), `app/[locale]/layout.tsx`, `LegalNotice.tsx` (×2), **en plus** de la variable d'environnement `NEXT_PUBLIC_WHATSAPP_NUMBER` lue uniquement par `Contact.tsx` | Le lien WhatsApp de la section Contact peut afficher un numéro différent de celui de la navbar/footer/JSON-LD si la variable d'environnement est définie avec une autre valeur | Voir section 4.1 |
| Le champ `devBadge` dans `locales/projects/*.projects.json` | Rien — ce champ n'est lu par aucun code | Éditer ce champ JSON n'a aucun effet visible ; le texte réellement affiché est recalculé en dur dans `ProjectCard.tsx` selon `currentLocale` | `projectsData.ts` ne mappe pas `devBadge` ; `ProjectCard.tsx` définit sa propre constante `devBadge` |
| Le champ `footer.instagram` dans `locales/*.json` | Rien — ce champ n'est lu par aucun code | Éditer ce champ JSON n'a aucun effet visible ; `Footer.tsx` ne rend aucun lien Instagram | `grep instagram` ne retourne aucun usage dans `Footer.tsx` |
| Le champ `lang` d'un témoignage dans le tableau `testimonials` (`Testimonials.tsx`) | Rien pour le filtrage — ce champ ne contrôle que le format de date dans `TestimonialCard.tsx` | Un témoignage marqué `lang: "fr"` reste visible sur la page `/en` (et inversement) ; il n'existe aucun filtrage par locale | `Testimonials.tsx` : `testimonials.map(...)` sans filtre sur `currentLocale` |
| Une adresse postale / téléphone / e-mail réel(le) | Les blocs JSON-LD dupliqués dans `Home.tsx`, `Services.tsx` (indirectement via `areaServed`), `Projects.tsx`, `Pricing.tsx`, `Contact.tsx`, `LegalNotice.tsx`, `app/[locale]/layout.tsx` | Incohérence des données structurées schema.org (pas un plantage fonctionnel, mais un risque SEO/données trompeuses) | Coordonnées identiques copiées dans au moins 5 fichiers (voir aussi `doc/ARBORESCENCE.md` section 6) |

---

## 6. Procédures concrètes déduites du code

### 6.1 Ajouter une section à la page d'accueil

1. Créer `components/sections/<NomSection>/<NomSection>.tsx` et `<NomSection>.module.css`, en suivant le patron constaté dans les sections existantes : directive `"use client"` en tête, `usePathname()` + `currentLocale = pathname?.split("/")[1] || "fr"`, `getDictionary(currentLocale)` depuis `lib/i18n.ts`, `useReducedMotion()` + `useIsMounted()` pour calculer `shouldAnimate`, constantes de `lib/animations.ts` pour les fonctions `fadeUp`/`fadeFromLeft`/`fadeFromRight` locales, un `<section id="...">` racine.
2. Ajouter les clés de contenu de la nouvelle section dans **`locales/fr.json` et `locales/en.json`** (même forme dans les deux — voir contrat en section 3.1).
3. Importer et rendre `<NomSection/>` dans `app/[locale]/page.tsx`, à la position voulue dans la liste JSX existante.
4. Ajouter l'`id` de la nouvelle section au tableau `SECTIONS` dans `components/layout/Navbar/Navbar.tsx` (pour que l'`IntersectionObserver` la détecte comme section active).
5. Ajouter un `<Nav.Item>`/`<Nav.Link href="/${currentLocale}#id">` dans `Navbar.tsx` et un `<li><a href="...">` correspondant dans `Footer.tsx`, avec un libellé traduit (nouvelle clé dans `nav`/`footer` de `locales/*.json`, voir étape 2).
6. Si des données structurées SEO sont voulues pour cette section, construire manuellement un objet JSON-LD et l'injecter via `<script type="application/ld+json">` — aucun helper partagé n'existe pour cela dans le code actuel (chaque section réécrit son propre bloc, voir `doc/ARBORESCENCE.md` section 6).
7. Aucune modification de `app/globals.css` n'est nécessaire pour le décalage de scroll : la règle `section[id] { scroll-margin-top: 90px }` s'applique automatiquement à toute nouvelle `<section id="...">`.

### 6.2 Ajouter une langue

1. `middleware.ts` : ajouter le code de la nouvelle langue au tableau `const locales = ["fr", "en"]`.
2. `lib/i18n.ts` : étendre `export type Locale = "fr" | "en"` avec le nouveau code, importer les nouveaux fichiers JSON, ajouter une entrée dans `dictionaries` et dans `projectsDictionaries`.
3. Créer `locales/<code>.json` (même forme que `fr.json`/`en.json`, voir section 3.1) et `locales/projects/<code>.projects.json` (voir section 3.2).
4. `app/[locale]/layout.tsx` : ajouter le nouveau code aux `Record` `titles` et `descriptions` dans `generateMetadata`. **Convertir tous les ternaires binaires `locale === "fr" ? X : Y` de ce fichier** (JSON-LD `areaServed`, `openGraph.locale`, description du schema WebSite) en une structure à 3 branches ou plus — ce ne sont pas des lookups sur un objet mais des ternaires en dur qui ne gèrent que 2 cas.
5. Répéter la même conversion de ternaire dans chaque composant qui contient `currentLocale === "fr" ? X : Y` : au minimum `Navbar.tsx`, `Footer.tsx`, `Contact.tsx`, `Home.tsx`, `Services.tsx`, `Projects.tsx`, `Pricing.tsx` (textes WhatsApp, `aria-label`, chaînes de JSON-LD non issues de `locales/*.json`).
6. `LegalNotice.tsx` : ajouter une entrée pour le nouveau code dans l'objet `content: Record<Locale, ContentTranslation>` défini en dur dans ce fichier (il ne lit pas `locales/*.json`, voir section 1.1). Mettre à jour aussi le type local `type Locale = "en" | "fr"` de ce même fichier (non synchronisé automatiquement avec `lib/i18n.ts`, voir section 5).
7. `Navbar.tsx` : ajouter un nouveau `<Dropdown.Item>` dans le sélecteur de langue (`changeLanguage(newLocale)`). Non déterminé si un composant équivalent existe côté `Footer.tsx` (aucun sélecteur de langue constaté dans ce fichier).
8. `app/sitemap.ts` : ajouter manuellement les routes de la nouvelle langue (page d'accueil + page légale) au tableau `routes` — ces routes sont codées en dur, pas générées dynamiquement à partir de la liste de locales.
9. Non déterminé si un nouveau dossier de route (`app/[locale]/<page-legale-traduite>/`) est strictement nécessaire : le code actuel réutilise les deux dossiers existants (`mentions-legales`, `legal-notice`) pour fr/en via la détection de locale interne à `LegalNotice.tsx` (voir couplage en section 5, ligne "nom du dossier de route").

### 6.3 Ajouter un projet au portfolio

1. Ajouter un objet au tableau `projects` de `locales/projects/fr.projects.json`, avec les champs `titre, image, description[], keywords?[], github, githubCTA, liveUrl?, liveCTA?` (voir contrat en section 3.2).
2. Ajouter l'entrée correspondante (traduite) au tableau `projects` de `locales/projects/en.projects.json`.
3. Déposer le fichier image référencé par le champ `image` dans `public/projects/` (le chemin JSON, ex. `"/projects/nouveau-logo.png"`, est résolu tel quel par `next/image` depuis la racine `public/`).
4. Aucune modification de code n'est nécessaire : `Projects.tsx` et `ProjectCard.tsx` s'adaptent automatiquement à la longueur du tableau `projects` (mapping direct, pas de limite codée en dur constatée) et le bloc JSON-LD de `Projects.tsx` est régénéré à partir des mêmes données.
5. Si `liveUrl` ou `github` est omis (chaîne vide ou absente), `ProjectCard.tsx` affiche automatiquement le badge "en développement/in development" codé en dur au lieu des liens (`isInDevelopment = !project.liveUrl || !project.github`) — aucune configuration supplémentaire requise pour ce cas.
