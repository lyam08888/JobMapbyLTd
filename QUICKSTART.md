# 🚀 QUICK START GUIDE

Bienvenue sur JobMap by LTd ! Voici comment démarrer en 2 minutes.

## Installation Express ⚡

```bash
# 1. Installer les dépendances
npm install

# 2. Initialiser la base de données avec des données d'exemple
npm run seed

# 3. Démarrer l'application
npm start
```

✅ C'est tout ! Ouvrez http://localhost:3000 dans votre navigateur.

## 👤 Se connecter

Utilisez un de ces comptes de test :

### Administrateur (tous les pouvoirs)
- Email: `admin@jobmap.com`
- Mot de passe: `admin123`

### Recruteur (poster des offres)
- Email: `recruteur@jobmap.com`
- Mot de passe: `password`

## 🎯 Que faire ensuite ?

### En tant qu'utilisateur normal :
1. **Explorez la carte** - Cliquez sur les marqueurs pour voir les détails
2. **Utilisez les filtres** - Affinez votre recherche par ville, secteur, expérience
3. **Créez un compte** - Menu utilisateur (en bas à gauche) → Créer un compte
4. **Ajoutez des favoris** - Cliquez sur le cœur sur les offres intéressantes

### En tant que recruteur :
1. **Connectez-vous** avec le compte recruteur
2. **Postez une offre** - Menu utilisateur → "Poster une offre"
3. **Gérez vos offres** - Modifiez ou supprimez vos publications

### En tant qu'administrateur :
1. **Connectez-vous** avec le compte admin
2. **Ouvrez le Mode Admin** - Menu utilisateur → "Mode Admin"
3. **Gérez tout** - Utilisateurs, emplois, candidats, consultez les logs

## 🔍 Fonctionnalités principales

- 🗺️ **Carte interactive** avec clustering des marqueurs
- 🔍 **Recherche avancée** (ville, secteur, expérience, salaire, distance)
- 📍 **Géolocalisation** - Trouvez les emplois près de vous
- 🚗 **Itinéraires** - Calculez votre trajet vers un emploi
- ❤️ **Favoris** - Sauvegardez vos offres préférées
- 🌙 **Mode sombre** - Basculez entre thème clair et sombre
- 🛡️ **Mode Admin** - Dashboard complet pour les administrateurs

## 📚 Documentation complète

- **README.md** - Documentation complète du projet
- **INTEGRATION.md** - Comment intégrer le frontend avec l'API
- **DEPLOYMENT.md** - Comment déployer en production
- **PROJECT_SUMMARY.md** - Résumé des fonctionnalités

## ⚙️ Configuration

Le fichier `.env` contient la configuration :

```env
PORT=3000                           # Port du serveur
JWT_SECRET=your-secret-key          # Clé secrète JWT (changez en production!)
NODE_ENV=development                # Environment
DB_PATH=./backend/database.sqlite   # Chemin de la base de données
```

## 🆘 Problèmes ?

### Le serveur ne démarre pas
```bash
# Vérifiez que le port 3000 est libre
lsof -i :3000

# Installez à nouveau les dépendances
rm -rf node_modules package-lock.json
npm install
```

### Erreur de base de données
```bash
# Réinitialisez la base de données
rm backend/database.sqlite
npm run seed
```

### Mot de passe oublié
Les comptes de test sont réinitialisés à chaque `npm run seed`

## 🎓 Tutoriel rapide

1. **Démarrez** l'application : `npm start`
2. **Ouvrez** http://localhost:3000
3. **Attendez** que la carte se charge
4. **Cliquez** sur un marqueur bleu (emploi) ou violet (candidat)
5. **Explorez** les détails dans la popup
6. **Filtrez** avec les contrôles à droite
7. **Connectez-vous** pour plus de fonctionnalités
8. **Essayez le mode admin** avec le compte admin

## 💡 Conseils

- **Utilisez les filtres** pour trouver exactement ce que vous cherchez
- **Activez la géolocalisation** pour voir les emplois près de vous
- **Sauvegardez vos recherches** avec le bouton bookmark
- **Testez le calcul d'itinéraire** vers les emplois
- **Explorez le mode admin** pour voir toutes les fonctionnalités

## 🎉 Amusez-vous bien !

L'application est maintenant complète avec :
- ✅ Backend API professionnel
- ✅ Base de données persistante
- ✅ Authentification sécurisée
- ✅ Mode administrateur
- ✅ CRUD complet
- ✅ Prête pour la production

---

**Besoin d'aide ?** Consultez README.md ou créez une issue sur GitHub.
