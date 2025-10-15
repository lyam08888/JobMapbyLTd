# Guide d'intégration Frontend-Backend

Ce document explique comment intégrer le nouveau backend API avec le frontend existant.

## Étapes d'intégration

### 1. Inclure les nouveaux fichiers JavaScript

Ajoutez ces lignes dans `public/index.html` avant la fermeture du tag `</body>` :

```html
<!-- API Client -->
<script src="/api-client.js"></script>
<!-- Admin Dashboard -->
<script src="/admin-dashboard.js"></script>
```

### 2. Initialiser l'API Client

Dans la section JavaScript de `index.html`, ajoutez au début de la fonction `initializeApp()` :

```javascript
// Initialize API Client
const api = new JobMapAPI();

// Check if user is logged in
if (api.isAuthenticated()) {
    api.getMe().then(user => {
        state.currentUser = user;
        updateAuthUI();
    }).catch(err => {
        console.error('Session expired:', err);
        api.logout();
    });
}
```

### 3. Remplacer les données statiques par des appels API

#### Charger les emplois depuis l'API

Remplacer la ligne `let data = [...]` par :

```javascript
let data = [];

async function loadData() {
    try {
        const [jobs, candidates] = await Promise.all([
            api.getJobs(),
            api.getCandidates()
        ]);
        data = [...jobs, ...candidates];
        performSearch();
    } catch (error) {
        console.error('Error loading data:', error);
        showToast('Erreur lors du chargement des données', 'error');
    }
}

// Appeler cette fonction au démarrage
loadData();
```

### 4. Mettre à jour l'authentification

Modifier les gestionnaires de formulaires de login et inscription :

```javascript
// Login
document.getElementById('login-form').addEventListener('submit', async e => {
    e.preventDefault();
    try {
        const result = await api.login({
            email: e.target.email.value,
            password: e.target.password.value
        });
        state.currentUser = result.user;
        closeAllModals();
        updateAuthUI();
        showToast('Connexion réussie !', 'success');
        loadData(); // Recharger les données
    } catch (error) {
        showToast('Erreur: ' + error.message, 'error');
    }
});

// Signup Candidate
document.getElementById('signup-candidate-form').addEventListener('submit', async e => {
    e.preventDefault();
    try {
        const result = await api.register({
            name: e.target.name.value,
            email: e.target.email.value,
            password: e.target.password.value,
            type: 'candidate'
        });
        
        // Créer le profil candidat
        await api.createCandidate({
            name: e.target.name.value,
            title: e.target.title.value,
            city: 'Paris', // Par défaut ou demander à l'utilisateur
            latitude: 48.85,
            longitude: 2.35,
            tags: e.target.tags.value.split(',').map(t => t.trim()),
            softSkills: [],
            experience: 'Junior',
            availability: 'Immédiate',
            description: 'Nouveau candidat'
        });
        
        state.currentUser = result.user;
        closeAllModals();
        updateAuthUI();
        showToast(`Bienvenue, ${result.user.name} !`, 'success');
        loadData();
    } catch (error) {
        showToast('Erreur: ' + error.message, 'error');
    }
});

// Similaire pour signup-recruiter-form et signup-employer-form
```

### 5. Mettre à jour la création d'offres

Modifier le gestionnaire de `post-job-form` :

```javascript
document.getElementById('post-job-form').addEventListener('submit', async e => {
    e.preventDefault();
    try {
        await api.createJob({
            title: e.target.title.value,
            company: e.target.company.value,
            city: e.target.city.value,
            latitude: 48.85, // Utiliser un service de géocodage
            longitude: 2.35,
            description: e.target.description.value,
            tags: e.target.tags.value.split(',').map(t => t.trim()),
            softSkills: e.target.softSkills.value.split(',').map(t => t.trim()),
            experience: e.target.experience.value,
            salary: parseInt(e.target.salary.value),
            contract: 'CDI',
            workArrangement: 'Hybride',
            industry: 'Tech'
        });
        
        closeAllModals();
        showToast('Offre publiée !', 'success');
        loadData();
    } catch (error) {
        showToast('Erreur: ' + error.message, 'error');
    }
});
```

### 6. Gérer les favoris avec l'API

Modifier la fonction `toggleFavorite()` :

```javascript
async function toggleFavorite(itemId, itemType) {
    if (!api.isAuthenticated()) {
        showToast('Connectez-vous pour ajouter aux favoris', 'warning');
        openModal('login-modal');
        return;
    }

    try {
        if (state.favorites.has(itemId)) {
            await api.removeFavoriteByItem(itemType, itemId);
            state.favorites.delete(itemId);
            showToast('Retiré des favoris', 'info');
        } else {
            await api.addFavorite(itemId, itemType);
            state.favorites.add(itemId);
            showToast('Ajouté aux favoris', 'success');
        }
        updateFavoritesUI();
    } catch (error) {
        showToast('Erreur: ' + error.message, 'error');
    }
}
```

### 7. Ajouter le Mode Admin

Dans le menu utilisateur, ajouter un bouton pour le mode admin :

```javascript
function updateAuthUI() {
    if (state.currentUser) {
        let menuItems = `
            <div class="px-4 py-3 border-b dark:border-gray-700">
                <p class="text-sm font-semibold dark:text-white">${state.currentUser.name}</p>
                <p class="text-xs text-gray-500">${state.currentUser.email}</p>
            </div>
        `;
        
        // Ajouter le mode admin pour les administrateurs
        if (state.currentUser.type === 'admin') {
            menuItems += `
                <button onclick="openAdminDashboard()" class="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white">
                    <i class="fas fa-shield-alt mr-2"></i>Mode Admin
                </button>
            `;
        }
        
        // Autres éléments du menu...
        menuItems += `
            <button onclick="showMyProfile()" class="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white">
                <i class="fas fa-user mr-2"></i>Mon Profil
            </button>
            <button onclick="logout()" class="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-red-600">
                <i class="fas fa-sign-out-alt mr-2"></i>Déconnexion
            </button>
        `;
        
        ui.userMenu.innerHTML = menuItems;
    }
}

function openAdminDashboard() {
    // Créer une modal pour le dashboard admin
    const modal = document.createElement('div');
    modal.id = 'admin-dashboard-modal';
    modal.className = 'fixed inset-0 bg-black bg-opacity-60 z-[9999] flex items-center justify-center overflow-auto';
    modal.innerHTML = `
        <div class="bg-white dark:bg-gray-900 w-full h-full overflow-auto">
            ${AdminDashboard.renderDashboard()}
        </div>
    `;
    document.body.appendChild(modal);
    
    // Charger les statistiques
    AdminDashboard.loadStats();
    AdminDashboard.showTab('users');
}

function logout() {
    api.logout();
    state.currentUser = null;
    state.favorites.clear();
    updateAuthUI();
    showToast('Déconnecté avec succès', 'info');
    location.reload(); // Recharger la page
}
```

### 8. Ajouter des fonctionnalités CRUD sur la carte

Pour permettre l'ajout/modification depuis la carte :

```javascript
// Ajouter un gestionnaire de clic droit sur la carte pour les administrateurs
map.on('contextmenu', async (e) => {
    if (!state.currentUser || state.currentUser.type !== 'admin') return;
    
    const { lat, lng } = e.latlng;
    
    const choice = confirm('Voulez-vous ajouter une offre d\'emploi à cet emplacement ?');
    if (choice) {
        // Ouvrir le formulaire de création d'offre avec les coordonnées pré-remplies
        openModal('postJob-modal');
        // Pré-remplir les coordonnées (vous devrez ajouter des champs cachés dans le formulaire)
        document.getElementById('job-latitude').value = lat;
        document.getElementById('job-longitude').value = lng;
    }
});

// Activer le drag & drop pour les administrateurs
function makeMarkerDraggable(marker, item) {
    if (state.currentUser && state.currentUser.type === 'admin') {
        marker.dragging.enable();
        
        marker.on('dragend', async (e) => {
            const newPos = e.target.getLatLng();
            try {
                if (item.type === 'job') {
                    await api.updateJob(item.id, {
                        latitude: newPos.lat,
                        longitude: newPos.lng
                    });
                } else {
                    await api.updateCandidate(item.id, {
                        latitude: newPos.lat,
                        longitude: newPos.lng
                    });
                }
                showToast('Position mise à jour', 'success');
            } catch (error) {
                showToast('Erreur: ' + error.message, 'error');
                marker.setLatLng([item.location.lat, item.location.lon]);
            }
        });
    }
}
```

## Résumé des changements

### Fichiers à modifier
1. `public/index.html` - Ajouter les includes des nouveaux scripts et intégrer l'API

### Fonctionnalités ajoutées
- ✅ Authentification JWT persistante
- ✅ Chargement dynamique depuis l'API
- ✅ CRUD complet pour jobs et candidats
- ✅ Gestion des favoris synchronisée
- ✅ Dashboard administrateur complet
- ✅ Journaux d'activité
- ✅ Statistiques en temps réel

### Points d'attention
- Les tokens JWT sont stockés dans `localStorage`
- Les sessions expirent après 7 jours
- Les administrateurs ont accès à toutes les fonctionnalités
- Les recruteurs peuvent gérer uniquement leurs propres offres
- Les candidats peuvent gérer uniquement leur profil

## Tests recommandés

1. **Test d'authentification**
   - Inscription
   - Connexion
   - Déconnexion
   - Session persistante (recharger la page)

2. **Test CRUD**
   - Créer une offre
   - Modifier une offre
   - Supprimer une offre
   - Créer un profil candidat

3. **Test Admin**
   - Se connecter en tant qu'admin
   - Accéder au dashboard
   - Consulter les statistiques
   - Gérer les utilisateurs
   - Consulter les logs

4. **Test de sécurité**
   - Tenter d'accéder à une ressource sans authentification
   - Tenter de modifier une ressource d'un autre utilisateur
   - Tenter d'accéder au dashboard admin sans être admin

## Support et débogage

Si vous rencontrez des problèmes :

1. Vérifiez la console du navigateur pour les erreurs JavaScript
2. Vérifiez la console du serveur pour les erreurs backend
3. Utilisez les outils de développement du navigateur (Network tab) pour voir les requêtes API
4. Vérifiez que le serveur est bien démarré (`npm start`)
5. Vérifiez que la base de données est initialisée (`npm run seed`)

## Prochaines étapes

- Ajouter un service de géocodage pour convertir les adresses en coordonnées
- Implémenter l'upload d'images
- Ajouter la messagerie entre recruteurs et candidats
- Améliorer la recherche avec filtres avancés
- Ajouter des graphiques dans le dashboard admin
