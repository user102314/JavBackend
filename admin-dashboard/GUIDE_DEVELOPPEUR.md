# 📖 Guide Développeur — TransGlobal Admin Dashboard
> **Date de création :** 28 Mars 2026

## 🚀 1. Aperçu Technique
* **Framework :** React 19 (Fonctionnel avec Hooks)
* **Build System :** Vite 8
* **Styling :** CSS natif (Variables CSS pour le mode clair/sombre, Flexbox, CSS Grid). Pas de Tailwind afin de garantir un contrôle granulaire au niveau du design system et des effets *glassmorphism*.
* **Routing :** React Router DOM v7 (Navigation via `<BrowserRouter>`)
* **Icônes :** SVG inline optimisés (Aucune dépendance lourde requise pour l'affichage visuel, exception pour quelques icônes `lucide-react` selon les besoins).

---

## 🏗 2. Architecture et Arborescence
Le code se situe majoritairement dans `src/`.

* **`App.jsx` :** Le composant racine du tableau de bord. C'est ici que sont définis :
    * Le State Global (`AppContext`) servant de couche gérant les états partagés transversaux (thème, popups, redirections).
    * Le Layout principal contenant la `Sidebar`, le `Topbar` et le viewport du contenu (`main`).
    * La configuration du Router (`<Routes>`).
* **`index.css` :** Fichier CSS massif agissant comme un **Design System unique**. Il contient toutes les variables esthétiques (`--bg`, `--accent`, etc.), les éléments d'UI standardisés (`.card`, `.btn`, `.badge`, `.mo` pour les modales) ainsi que toutes les animations/transitions.
* **`pages/` :** Les vues métiers :
    * `Contacts.jsx` : Tableaux de recension des mails et demandes de contact client.
    * `Offices.jsx` : Gestion CRUD de la géographie des agences. 
    * `GeneralInfo.jsx` : Champs d'inputs fixes pour gérer les métadonnées globales de l'entreprise.
    * `Sponsors.jsx` : Upload et suppression d'images pour gérer les logos de partenaires (multipart via dropzone).
    * `ContentBlocks.jsx` : Éditeur modulaire "titre/description/image" sous forme de cartes affichées en grille.

---

## 💫 3. Le Pattern du State Global (`AppContext`)
Plutôt que d'introduire des gestionnaires d'état complexes comme Redux ou Zustand pour le frontend administrateur, toute la communication Trans-composants passe par un contexte React unique défini et distribué dans `App.jsx`.

### Valeurs fournies par `AppContext` :
* `theme`, `toggleTheme` : Permet l'application automatique de la classe `<html data-theme="dark|light">`.
* `toastShow`, `toastMsg`, `toastOk`, `showToast()` : Gère l'affichage asynchrone des notifications (barre de status *Toast* gérée par TimeOut centralisé).
* `actionTrigger`, `triggerAction(payload)` : Pattern de "bus d'événements" simple pour la communication inter-composants isolée. 
  *(Exemple d'utilisation : Le `<Topbar>` émet l'évenement `triggerAction('new-block')` capté ensuite par un `useEffect` interne au sein de `ContentBlocks.jsx` pour déclencher son propre pop-up interne).*

---

## 🎨 4. Composants UI Communs (Cheat-sheet)
Pour étendre l'interface, veillez à toujours utiliser les identifiants structurels existants dans `index.css` et à éviter le *styling indéfini* :

* **Cartes :** `<div className="card">` → Enveloppe standard (effet ombres interactives).
* **Boutons :** `<button className="btn">` (Normal), `btn-p` (Bouton Principal Accent avec background dégradé/couleur vive), `btn-d` (Bouton de Destruction/Alerte Rouge), `btn-sm` (Petit bouton compact).
* **Champs de formulaire :** Englober les inputs individuels dans `<div className="fg">` (Form Group). Pour un grid split automatique sur 2 ou 3 colonnes : `<div className="fg2">` / `<div className="fg3">`.
* **Badges :** `<span className="badge">` avec les modificateurs de couleurs `bb` (bleu/info), `ba` (orange/alerte), `bg` (vert/succès), `bp` (violet/primaire), `br` (rouge/erreur).
* **Modales :** Composées de `<div className={"mo " + (isOpen ? "open" : "")}>` pour assombrir et bloquer l'écran en arrière plan avec à l'intérieur `<div className="md">` pour la configuration de la fenêtre d'action.

---

## 🔌 5. Appels Backend & Intégration Spring Boot (Prochaines étapes)
L'interface est actuellement "Mockée" (données factices avec délai simulé) afin de préparer son branchement sur des Endpoints REST. L'interface déclenche un `setTimeout` de 600ms à 1000ms afin d'afficher systématiquement de jolis **skeleton loaders** d'attente.

* **API :** Les Endpoints de Spring Boot (`GET /contacts`, `POST /sponsors`, etc.) doivent remplacer les initialisations et mises à jour de state (`setContacts`, etc.).
* **Ergodicité :** Toute suppression de relation en base de données doit déclencher un `showToast("Message", ok=boolean)` approprié.
* **CORS Config :** Puisque Vite tourne actuellement sur le port `5173` et `JavBackend` sur le port `8080`, un en-tête de configuration `@CrossOrigin` globale devra être injecté côté Java pour autoriser la réception des requêtes en cours de développement local.
