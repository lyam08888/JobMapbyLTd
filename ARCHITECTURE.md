# Architecture de JobMap by LTd

## Vue d'ensemble

```
┌─────────────────────────────────────────────────────────────┐
│                        Frontend (SPA)                        │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  index.html (Leaflet.js + Tailwind CSS)             │  │
│  │  - Carte interactive                                  │  │
│  │  - Interface utilisateur                             │  │
│  │  - Gestion des événements                            │  │
│  └──────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  api-client.js (API Client)                          │  │
│  │  - Communication avec le backend                      │  │
│  │  - Gestion des tokens JWT                            │  │
│  └──────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  admin-dashboard.js (Dashboard Admin)                │  │
│  │  - Interface d'administration                         │  │
│  │  - Tableaux de gestion                               │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            ▼ HTTP/HTTPS
┌─────────────────────────────────────────────────────────────┐
│                    Backend (Express.js)                      │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  server.js (Serveur principal)                       │  │
│  │  - Routing                                            │  │
│  │  - Middleware                                         │  │
│  │  - Fichiers statiques                                │  │
│  └──────────────────────────────────────────────────────┘  │
│                            ▼                                 │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Middleware d'authentification                        │  │
│  │  - Vérification JWT                                   │  │
│  │  - Contrôle d'accès par rôle                         │  │
│  └──────────────────────────────────────────────────────┘  │
│                            ▼                                 │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Routes API                                           │  │
│  │  /api/auth      - Authentification                   │  │
│  │  /api/jobs      - Gestion emplois                    │  │
│  │  /api/candidates - Gestion candidats                 │  │
│  │  /api/favorites - Gestion favoris                    │  │
│  │  /api/admin     - Administration                     │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            ▼ SQL
┌─────────────────────────────────────────────────────────────┐
│                   Base de données (SQLite)                   │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Tables                                               │  │
│  │  - users          (utilisateurs)                      │  │
│  │  - jobs           (offres d'emploi)                   │  │
│  │  - candidates     (profils candidats)                 │  │
│  │  - favorites      (favoris)                           │  │
│  │  - applications   (candidatures)                      │  │
│  │  - saved_searches (recherches sauvegardées)           │  │
│  │  - route_history  (historique itinéraires)            │  │
│  │  - activity_log   (journaux d'activité)              │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

## Flux d'authentification

```
┌─────────┐                ┌─────────┐               ┌──────────┐
│ Client  │                │  API    │               │   DB     │
└────┬────┘                └────┬────┘               └────┬─────┘
     │                          │                         │
     │ POST /api/auth/login     │                         │
     │ {email, password}        │                         │
     ├─────────────────────────>│                         │
     │                          │ SELECT user             │
     │                          ├────────────────────────>│
     │                          │<────────────────────────┤
     │                          │ Verify password         │
     │                          │ Generate JWT            │
     │ {user, token}            │                         │
     │<─────────────────────────┤                         │
     │                          │                         │
     │ GET /api/jobs            │                         │
     │ Authorization: Bearer... │                         │
     ├─────────────────────────>│                         │
     │                          │ Verify JWT              │
     │                          │ SELECT jobs             │
     │                          ├────────────────────────>│
     │                          │<────────────────────────┤
     │ {jobs: [...]}            │                         │
     │<─────────────────────────┤                         │
```

## Flux de création d'offre

```
┌───────────┐           ┌─────────┐          ┌─────────┐
│ Recruteur │           │   API   │          │   DB    │
└─────┬─────┘           └────┬────┘          └────┬────┘
      │                      │                    │
      │ POST /api/jobs       │                    │
      │ + Authorization      │                    │
      ├─────────────────────>│                    │
      │                      │ 1. Verify JWT      │
      │                      │ 2. Check role      │
      │                      │ 3. Validate data   │
      │                      │ INSERT job         │
      │                      ├───────────────────>│
      │                      │<───────────────────┤
      │                      │ Log activity       │
      │                      ├───────────────────>│
      │ {id, message}        │<───────────────────┤
      │<─────────────────────┤                    │
```

## Structure des fichiers

```
JobMapbyLTd/
│
├── 📁 backend/
│   ├── 📁 config/
│   │   └── 📄 database.js          # Configuration SQLite + schéma
│   ├── 📁 middleware/
│   │   └── 📄 auth.js              # Authentification JWT + contrôle rôle
│   ├── 📁 routes/
│   │   ├── 📄 admin.js             # Routes admin (stats, users, logs)
│   │   ├── 📄 auth.js              # Auth (login, register, profile)
│   │   ├── 📄 candidates.js        # CRUD candidats
│   │   ├── 📄 favorites.js         # Gestion favoris
│   │   └── 📄 jobs.js              # CRUD emplois
│   ├── 📄 seed.js                  # Script d'initialisation DB
│   └── 💾 database.sqlite          # Base de données (générée)
│
├── 📁 public/
│   ├── 📄 index.html               # Application frontend SPA
│   ├── 📄 api-client.js            # Client API JavaScript
│   └── 📄 admin-dashboard.js       # Interface admin
│
├── 📄 server.js                    # Serveur Express principal
├── 📄 package.json                 # Dépendances et scripts
│
├── 📄 .env                         # Variables d'environnement
├── 📄 .gitignore                   # Fichiers à ignorer
│
└── 📁 Documentation/
    ├── 📄 README.md                # Documentation principale
    ├── 📄 QUICKSTART.md            # Guide démarrage rapide
    ├── 📄 INTEGRATION.md           # Guide intégration
    ├── 📄 DEPLOYMENT.md            # Guide déploiement
    ├── 📄 PROJECT_SUMMARY.md       # Résumé projet
    └── 📄 ARCHITECTURE.md          # Ce fichier
```

## Technologies et dépendances

### Backend
- **express** (v5.1.0) - Framework web
- **sqlite3** (v5.1.7) - Base de données
- **jsonwebtoken** (v9.0.2) - Authentification JWT
- **bcryptjs** (v3.0.2) - Hash des mots de passe
- **express-validator** (v7.2.1) - Validation des données
- **cors** (v2.8.5) - Gestion CORS
- **dotenv** (v17.2.3) - Variables d'environnement

### Frontend
- **Leaflet.js** (v1.9.4) - Cartographie
- **Tailwind CSS** (v3.x) - Framework CSS
- **Font Awesome** (v6.5.1) - Icônes
- **Vanilla JavaScript** - Pas de framework

## Schéma de la base de données

```
┌─────────────────┐
│     users       │
├─────────────────┤
│ id (PK)         │
│ email           │
│ password        │
│ name            │
│ type            │◄───────────┐
│ company         │            │
│ created_at      │            │
└─────────────────┘            │
        ▲                      │
        │                      │
        │                      │
┌───────┴─────────┐    ┌───────┴─────────┐
│      jobs       │    │   candidates    │
├─────────────────┤    ├─────────────────┤
│ id (PK)         │    │ id (PK)         │
│ title           │    │ name            │
│ company         │    │ title           │
│ city            │    │ city            │
│ latitude        │    │ latitude        │
│ longitude       │    │ longitude       │
│ salary          │    │ experience      │
│ user_id (FK)    │    │ user_id (FK)    │
└─────────────────┘    └─────────────────┘
        │                      │
        │                      │
        └──────────┬───────────┘
                   │
           ┌───────▼─────────┐
           │   favorites     │
           ├─────────────────┤
           │ id (PK)         │
           │ user_id (FK)    │
           │ item_id         │
           │ item_type       │
           └─────────────────┘
```

## Sécurité

### Niveaux de sécurité

```
┌─────────────────────────────────────────────────────┐
│ Niveau 1: Transport (HTTPS en production)           │
└─────────────────────────────────────────────────────┘
                       ▼
┌─────────────────────────────────────────────────────┐
│ Niveau 2: Authentification (JWT)                    │
│ - Tokens avec expiration                            │
│ - Stockage sécurisé (localStorage)                  │
└─────────────────────────────────────────────────────┘
                       ▼
┌─────────────────────────────────────────────────────┐
│ Niveau 3: Autorisation (Contrôle par rôle)         │
│ - Admin: tous les droits                           │
│ - Recruiter: gestion emplois                        │
│ - Candidate: gestion profil                         │
└─────────────────────────────────────────────────────┘
                       ▼
┌─────────────────────────────────────────────────────┐
│ Niveau 4: Validation (Express-validator)            │
│ - Validation des entrées                            │
│ - Protection SQL injection                          │
└─────────────────────────────────────────────────────┘
                       ▼
┌─────────────────────────────────────────────────────┐
│ Niveau 5: Chiffrement (Bcrypt)                      │
│ - Hash des mots de passe                           │
│ - Salt rounds: 10                                   │
└─────────────────────────────────────────────────────┘
                       ▼
┌─────────────────────────────────────────────────────┐
│ Niveau 6: Audit (Activity Log)                      │
│ - Journalisation des actions                        │
│ - Traçabilité complète                             │
└─────────────────────────────────────────────────────┘
```

## Points d'intégration

### 1. Frontend → Backend
- HTTP/HTTPS REST API
- JSON payload
- JWT dans headers

### 2. Backend → Database
- SQLite avec requêtes paramétrées
- Connection pooling (si migration vers PostgreSQL)

### 3. Client → Authentication
- Login/Register via API
- Token JWT stocké dans localStorage
- Refresh automatique (à implémenter si besoin)

## Scalabilité

### Optimisations possibles

1. **Cache**
   - Redis pour les sessions
   - Cache des requêtes fréquentes

2. **Database**
   - Migration vers PostgreSQL
   - Indexation des colonnes fréquemment requêtées
   - Sharding si nécessaire

3. **Load Balancing**
   - Nginx reverse proxy
   - PM2 en cluster mode
   - Horizontal scaling

4. **CDN**
   - Assets statiques sur CDN
   - Cache des tiles de carte

## Monitoring

### Métriques à surveiller

- **Performance**
  - Temps de réponse API
  - Requêtes par seconde
  - Utilisation CPU/RAM

- **Erreurs**
  - Taux d'erreur 5xx
  - Erreurs d'authentification
  - Échecs de requêtes DB

- **Business**
  - Nombre d'utilisateurs actifs
  - Nombre de nouvelles offres
  - Candidatures par jour

---

**Version**: 1.0.0
**Date**: 2025-10-15
**Status**: Production Ready ✅
