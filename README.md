# JobMap by LTd

Une application de cartographie d'emplois interactive avec géolocalisation, système d'administration et base de données complète.

## 🌟 Fonctionnalités

### Pour tous les utilisateurs
- 🗺️ **Carte interactive** avec Leaflet.js
- 🔍 **Recherche avancée** avec filtres multiples (ville, secteur, expérience, salaire, distance)
- 📍 **Géolocalisation** pour trouver les emplois à proximité
- ❤️ **Système de favoris** pour sauvegarder les offres intéressantes
- 🚗 **Calcul d'itinéraire** avec plusieurs modes de transport
- 🌙 **Mode sombre/clair**
- 💾 **Sauvegarde des recherches**

### Pour les candidats
- 👤 **Création de profil** complet avec CV, compétences, formations
- 📧 **Postuler aux offres** directement depuis la plateforme
- 💼 **Candidatures spontanées** aux entreprises
- 📊 **Score de compatibilité** entre profil et offres

### Pour les recruteurs/employeurs
- ➕ **Poster des offres d'emploi**
- ✏️ **Gérer les offres** (modifier, supprimer)
- 👥 **Consulter les profils** des candidats
- 📈 **Tableau de bord** avec statistiques

### Pour les administrateurs
- 🛡️ **Panneau d'administration** complet
- 👤 **Gestion des utilisateurs** (CRUD)
- 📝 **Modération du contenu**
- 📊 **Statistiques globales**
- 📜 **Journaux d'activité**
- 🔍 **Vue d'ensemble** de toutes les données

## 🚀 Installation

### Prérequis
- Node.js (v14 ou supérieur)
- npm ou yarn

### Étapes d'installation

1. **Cloner le repository**
```bash
git clone https://github.com/lyam08888/JobMapbyLTd.git
cd JobMapbyLTd
```

2. **Installer les dépendances**
```bash
npm install
```

3. **Configurer l'environnement**
Créer un fichier `.env` à la racine du projet :
```env
PORT=3000
JWT_SECRET=votre-secret-jwt-tres-securise
NODE_ENV=development
DB_PATH=./backend/database.sqlite
```

4. **Initialiser la base de données**
```bash
npm run seed
```

Cette commande va :
- Créer les tables de la base de données SQLite
- Créer un compte administrateur : `admin@jobmap.com` / `admin123`
- Créer un compte recruteur : `recruteur@jobmap.com` / `password`
- Ajouter des données d'exemple (emplois, candidats)

5. **Lancer l'application**
```bash
npm start
```

L'application sera accessible sur `http://localhost:3000`

## 📁 Structure du projet

```
JobMapbyLTd/
├── backend/
│   ├── config/
│   │   └── database.js          # Configuration SQLite
│   ├── middleware/
│   │   └── auth.js              # Middleware d'authentification
│   ├── routes/
│   │   ├── admin.js             # Routes admin
│   │   ├── auth.js              # Authentification
│   │   ├── candidates.js        # Gestion candidats
│   │   ├── favorites.js         # Favoris
│   │   └── jobs.js              # Gestion offres
│   └── seed.js                  # Script de seed
├── public/
│   └── index.html               # Application frontend
├── .env                         # Variables d'environnement
├── .gitignore
├── package.json
├── server.js                    # Serveur Express
└── README.md
```

## 🔌 API Endpoints

### Authentification
- `POST /api/auth/register` - Inscription
- `POST /api/auth/login` - Connexion
- `GET /api/auth/me` - Profil utilisateur
- `PUT /api/auth/profile` - Modifier profil

### Emplois
- `GET /api/jobs` - Liste des emplois
- `GET /api/jobs/:id` - Détails d'un emploi
- `POST /api/jobs` - Créer un emploi (recruteur)
- `PUT /api/jobs/:id` - Modifier un emploi (recruteur)
- `DELETE /api/jobs/:id` - Supprimer un emploi (recruteur)

### Candidats
- `GET /api/candidates` - Liste des candidats
- `GET /api/candidates/:id` - Détails d'un candidat
- `POST /api/candidates` - Créer un profil (candidat)
- `PUT /api/candidates/:id` - Modifier un profil (candidat)
- `DELETE /api/candidates/:id` - Supprimer un profil (candidat)

### Favoris
- `GET /api/favorites` - Liste des favoris
- `POST /api/favorites` - Ajouter un favori
- `DELETE /api/favorites/:id` - Retirer un favori

### Admin (authentification admin requise)
- `GET /api/admin/stats` - Statistiques globales
- `GET /api/admin/users` - Liste des utilisateurs
- `GET /api/admin/users/:id` - Détails utilisateur
- `PUT /api/admin/users/:id` - Modifier utilisateur
- `DELETE /api/admin/users/:id` - Supprimer utilisateur
- `GET /api/admin/logs` - Journaux d'activité
- `GET /api/admin/jobs` - Liste admin des emplois
- `GET /api/admin/candidates` - Liste admin des candidats
- `GET /api/admin/applications` - Liste des candidatures
- `POST /api/admin/moderate` - Modérer du contenu

## 🔐 Sécurité

- **Authentification JWT** - Tokens sécurisés pour l'authentification
- **Mots de passe hashés** - Bcrypt avec salt rounds
- **Validation des données** - Express-validator pour toutes les entrées
- **CORS configuré** - Protection contre les requêtes non autorisées
- **Middleware d'autorisation** - Vérification des permissions par rôle

## 🗄️ Base de données

L'application utilise **SQLite** pour simplifier le déploiement. Les tables incluent :

- `users` - Comptes utilisateurs (admin, recruteur, candidat, employeur)
- `jobs` - Offres d'emploi
- `candidates` - Profils candidats
- `favorites` - Favoris des utilisateurs
- `applications` - Candidatures
- `saved_searches` - Recherches sauvegardées
- `route_history` - Historique des itinéraires
- `activity_log` - Journal d'activité pour l'admin

## 🎨 Technologies utilisées

### Frontend
- **Leaflet.js** - Cartographie interactive
- **Tailwind CSS** - Framework CSS
- **Font Awesome** - Icônes
- **Vanilla JavaScript** - Pas de framework pour la légèreté

### Backend
- **Node.js** - Runtime JavaScript
- **Express.js** - Framework web
- **SQLite3** - Base de données
- **JWT** - Authentification
- **Bcrypt** - Hashage de mots de passe
- **Express-validator** - Validation

## 👥 Comptes de test

Après avoir exécuté `npm run seed`, vous pouvez utiliser :

| Type | Email | Mot de passe |
|------|-------|--------------|
| Admin | admin@jobmap.com | admin123 |
| Recruteur | recruteur@jobmap.com | password |

## 📝 Mode d'emploi

### Utilisation basique
1. Ouvrez l'application dans votre navigateur
2. Créez un compte ou connectez-vous
3. Utilisez la carte et les filtres pour rechercher
4. Cliquez sur les marqueurs pour voir les détails

### Mode Admin
1. Connectez-vous avec le compte admin
2. Cliquez sur le menu utilisateur (en bas à gauche)
3. Sélectionnez "Mode Admin"
4. Accédez au tableau de bord administrateur

### Ajouter une offre (Recruteur)
1. Connectez-vous avec un compte recruteur
2. Menu utilisateur → "Poster une offre"
3. Remplissez le formulaire
4. L'offre apparaît immédiatement sur la carte

### Modifier/Supprimer du contenu
- **Mode normal** : Cliquez sur les détails d'une offre/profil que vous avez créé
- **Mode admin** : Accédez au panneau admin pour tout gérer

## 🔧 Développement

### Mode développement avec auto-reload
```bash
npm run dev
```

### Réinitialiser la base de données
```bash
rm backend/database.sqlite
npm run seed
```

## 📈 Améliorations futures possibles

- [ ] Upload d'images/CV
- [ ] Messagerie interne
- [ ] Notifications en temps réel
- [ ] Export PDF des profils/offres
- [ ] Statistiques avancées avec graphiques
- [ ] Recherche par compétences avec IA
- [ ] Système de matching automatique
- [ ] API REST complète avec documentation Swagger
- [ ] Tests automatisés
- [ ] Migration vers PostgreSQL pour la production

## 📄 Licence

ISC

## 👨‍💻 Auteur

LTd - JobMap Application

---

**Note** : Cette application est un projet de démonstration. En production, utilisez :
- Une base de données plus robuste (PostgreSQL, MySQL)
- Variables d'environnement sécurisées
- HTTPS
- Rate limiting
- Validation côté client et serveur renforcée
