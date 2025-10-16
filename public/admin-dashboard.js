// Admin Dashboard Components for JobMap
window.AdminDashboard = {
    // Initialize admin dashboard
    async init() {
        const api = new JobMapAPI();
        
        if (!api.isAuthenticated()) {
            alert('Veuillez vous connecter en tant qu\'administrateur');
            return;
        }

        try {
            const user = await api.getMe();
            if (user.type !== 'admin') {
                alert('Accès administrateur requis');
                return;
            }

            this.renderDashboard();
        } catch (error) {
            console.error('Error initializing admin dashboard:', error);
            alert('Erreur lors du chargement du tableau de bord');
        }
    },

    // Render main dashboard
    renderDashboard() {
        const content = `
            <div class="admin-dashboard p-6 space-y-6">
                <div class="flex justify-between items-center">
                    <h1 class="text-3xl font-bold dark:text-white">
                        <i class="fas fa-shield-alt mr-2"></i>Tableau de Bord Administrateur
                    </h1>
                    <button onclick="AdminDashboard.close()" class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
                        <i class="fas fa-times mr-2"></i>Fermer
                    </button>
                </div>

                <!-- Statistics Cards -->
                <div id="admin-stats" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
                        <div class="flex items-center justify-between">
                            <div>
                                <p class="text-sm text-gray-600 dark:text-gray-400">Total Utilisateurs</p>
                                <p class="text-3xl font-bold dark:text-white" id="stat-users">--</p>
                            </div>
                            <i class="fas fa-users text-4xl text-blue-500"></i>
                        </div>
                    </div>
                    <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
                        <div class="flex items-center justify-between">
                            <div>
                                <p class="text-sm text-gray-600 dark:text-gray-400">Total Emplois</p>
                                <p class="text-3xl font-bold dark:text-white" id="stat-jobs">--</p>
                            </div>
                            <i class="fas fa-briefcase text-4xl text-green-500"></i>
                        </div>
                    </div>
                    <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
                        <div class="flex items-center justify-between">
                            <div>
                                <p class="text-sm text-gray-600 dark:text-gray-400">Total Candidats</p>
                                <p class="text-3xl font-bold dark:text-white" id="stat-candidates">--</p>
                            </div>
                            <i class="fas fa-user-tie text-4xl text-purple-500"></i>
                        </div>
                    </div>
                    <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
                        <div class="flex items-center justify-between">
                            <div>
                                <p class="text-sm text-gray-600 dark:text-gray-400">Candidatures</p>
                                <p class="text-3xl font-bold dark:text-white" id="stat-applications">--</p>
                            </div>
                            <i class="fas fa-paper-plane text-4xl text-orange-500"></i>
                        </div>
                    </div>
                </div>

                <!-- Navigation Tabs -->
                <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg">
                    <div class="flex border-b border-gray-200 dark:border-gray-700">
                        <button onclick="AdminDashboard.showTab('users')" id="tab-users" class="admin-tab active px-6 py-3 font-semibold">
                            <i class="fas fa-users mr-2"></i>Utilisateurs
                        </button>
                        <button onclick="AdminDashboard.showTab('jobs')" id="tab-jobs" class="admin-tab px-6 py-3 font-semibold">
                            <i class="fas fa-briefcase mr-2"></i>Emplois
                        </button>
                        <button onclick="AdminDashboard.showTab('candidates')" id="tab-candidates" class="admin-tab px-6 py-3 font-semibold">
                            <i class="fas fa-user-tie mr-2"></i>Candidats
                        </button>
                        <button onclick="AdminDashboard.showTab('logs')" id="tab-logs" class="admin-tab px-6 py-3 font-semibold">
                            <i class="fas fa-history mr-2"></i>Journaux
                        </button>
                    </div>

                    <div id="admin-tab-content" class="p-6">
                        <!-- Tab content will be loaded here -->
                    </div>
                </div>
            </div>
        `;

        return content;
    },

    // Show specific tab
    async showTab(tabName) {
        // Update active tab
        document.querySelectorAll('.admin-tab').forEach(tab => {
            tab.classList.remove('active', 'text-blue-600', 'border-b-2', 'border-blue-600');
            tab.classList.add('text-gray-600', 'dark:text-gray-400');
        });
        
        const activeTab = document.getElementById(`tab-${tabName}`);
        if (activeTab) {
            activeTab.classList.add('active', 'text-blue-600', 'border-b-2', 'border-blue-600');
            activeTab.classList.remove('text-gray-600', 'dark:text-gray-400');
        }

        const content = document.getElementById('admin-tab-content');
        if (!content) return;

        content.innerHTML = '<div class="text-center py-8"><i class="fas fa-spinner fa-spin text-4xl text-blue-500"></i></div>';

        try {
            const api = new JobMapAPI();
            switch (tabName) {
                case 'users':
                    await this.showUsers(api);
                    break;
                case 'jobs':
                    await this.showJobs(api);
                    break;
                case 'candidates':
                    await this.showCandidates(api);
                    break;
                case 'logs':
                    await this.showLogs(api);
                    break;
            }
        } catch (error) {
            content.innerHTML = `<div class="text-center text-red-600 py-8">Erreur: ${error.message}</div>`;
        }
    },

    // Show users list
    async showUsers(api) {
        const data = await api.getUsers();
        const content = document.getElementById('admin-tab-content');
        
        const usersHTML = data.users.map(user => `
            <tr class="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                <td class="px-4 py-3">${user.id}</td>
                <td class="px-4 py-3">${user.name}</td>
                <td class="px-4 py-3">${user.email}</td>
                <td class="px-4 py-3">
                    <span class="px-2 py-1 rounded-full text-xs font-semibold
                        ${user.type === 'admin' ? 'bg-red-100 text-red-800' : 
                          user.type === 'recruiter' ? 'bg-blue-100 text-blue-800' : 
                          user.type === 'employer' ? 'bg-purple-100 text-purple-800' :
                          'bg-green-100 text-green-800'}">
                        ${user.type}
                    </span>
                </td>
                <td class="px-4 py-3">${user.company || '-'}</td>
                <td class="px-4 py-3 text-sm">${new Date(user.created_at).toLocaleDateString()}</td>
                <td class="px-4 py-3">
                    <button onclick="AdminDashboard.editUser(${user.id})" class="text-blue-600 hover:text-blue-800 mr-2">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button onclick="AdminDashboard.deleteUser(${user.id})" class="text-red-600 hover:text-red-800">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `).join('');

        content.innerHTML = `
            <div class="overflow-x-auto">
                <table class="w-full">
                    <thead class="bg-gray-100 dark:bg-gray-700">
                        <tr>
                            <th class="px-4 py-3 text-left text-xs font-semibold dark:text-white">ID</th>
                            <th class="px-4 py-3 text-left text-xs font-semibold dark:text-white">Nom</th>
                            <th class="px-4 py-3 text-left text-xs font-semibold dark:text-white">Email</th>
                            <th class="px-4 py-3 text-left text-xs font-semibold dark:text-white">Type</th>
                            <th class="px-4 py-3 text-left text-xs font-semibold dark:text-white">Entreprise</th>
                            <th class="px-4 py-3 text-left text-xs font-semibold dark:text-white">Créé le</th>
                            <th class="px-4 py-3 text-left text-xs font-semibold dark:text-white">Actions</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-200 dark:divide-gray-700 dark:text-white">
                        ${usersHTML}
                    </tbody>
                </table>
            </div>
        `;
    },

    // Show jobs list
    async showJobs(api) {
        const data = await api.getAdminJobs();
        const content = document.getElementById('admin-tab-content');
        
        const jobsHTML = data.jobs.map(job => `
            <tr class="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                <td class="px-4 py-3">${job.id}</td>
                <td class="px-4 py-3">${job.title}</td>
                <td class="px-4 py-3">${job.company}</td>
                <td class="px-4 py-3">${job.city}</td>
                <td class="px-4 py-3">${job.experience}</td>
                <td class="px-4 py-3">${job.salary ? job.salary.toLocaleString() + '€' : '-'}</td>
                <td class="px-4 py-3 text-sm">${new Date(job.created_at).toLocaleDateString()}</td>
                <td class="px-4 py-3">
                    <button onclick="AdminDashboard.viewJob(${job.id})" class="text-blue-600 hover:text-blue-800 mr-2">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button onclick="AdminDashboard.deleteJob(${job.id})" class="text-red-600 hover:text-red-800">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `).join('');

        content.innerHTML = `
            <div class="overflow-x-auto">
                <table class="w-full">
                    <thead class="bg-gray-100 dark:bg-gray-700">
                        <tr>
                            <th class="px-4 py-3 text-left text-xs font-semibold dark:text-white">ID</th>
                            <th class="px-4 py-3 text-left text-xs font-semibold dark:text-white">Titre</th>
                            <th class="px-4 py-3 text-left text-xs font-semibold dark:text-white">Entreprise</th>
                            <th class="px-4 py-3 text-left text-xs font-semibold dark:text-white">Ville</th>
                            <th class="px-4 py-3 text-left text-xs font-semibold dark:text-white">Expérience</th>
                            <th class="px-4 py-3 text-left text-xs font-semibold dark:text-white">Salaire</th>
                            <th class="px-4 py-3 text-left text-xs font-semibold dark:text-white">Créé le</th>
                            <th class="px-4 py-3 text-left text-xs font-semibold dark:text-white">Actions</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-200 dark:divide-gray-700 dark:text-white">
                        ${jobsHTML}
                    </tbody>
                </table>
            </div>
        `;
    },

    // Show candidates list
    async showCandidates(api) {
        const data = await api.getAdminCandidates();
        const content = document.getElementById('admin-tab-content');
        
        const candidatesHTML = data.candidates.map(candidate => `
            <tr class="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                <td class="px-4 py-3">${candidate.id}</td>
                <td class="px-4 py-3">${candidate.name}</td>
                <td class="px-4 py-3">${candidate.title}</td>
                <td class="px-4 py-3">${candidate.city}</td>
                <td class="px-4 py-3">${candidate.experience}</td>
                <td class="px-4 py-3">${candidate.availability}</td>
                <td class="px-4 py-3 text-sm">${new Date(candidate.created_at).toLocaleDateString()}</td>
                <td class="px-4 py-3">
                    <button onclick="AdminDashboard.viewCandidate(${candidate.id})" class="text-blue-600 hover:text-blue-800 mr-2">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button onclick="AdminDashboard.deleteCandidate(${candidate.id})" class="text-red-600 hover:text-red-800">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `).join('');

        content.innerHTML = `
            <div class="overflow-x-auto">
                <table class="w-full">
                    <thead class="bg-gray-100 dark:bg-gray-700">
                        <tr>
                            <th class="px-4 py-3 text-left text-xs font-semibold dark:text-white">ID</th>
                            <th class="px-4 py-3 text-left text-xs font-semibold dark:text-white">Nom</th>
                            <th class="px-4 py-3 text-left text-xs font-semibold dark:text-white">Titre</th>
                            <th class="px-4 py-3 text-left text-xs font-semibold dark:text-white">Ville</th>
                            <th class="px-4 py-3 text-left text-xs font-semibold dark:text-white">Expérience</th>
                            <th class="px-4 py-3 text-left text-xs font-semibold dark:text-white">Disponibilité</th>
                            <th class="px-4 py-3 text-left text-xs font-semibold dark:text-white">Créé le</th>
                            <th class="px-4 py-3 text-left text-xs font-semibold dark:text-white">Actions</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-200 dark:divide-gray-700 dark:text-white">
                        ${candidatesHTML}
                    </tbody>
                </table>
            </div>
        `;
    },

    // Show activity logs
    async showLogs(api) {
        const data = await api.getLogs({ limit: 100 });
        const content = document.getElementById('admin-tab-content');
        
        const logsHTML = data.logs.map(log => `
            <tr class="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                <td class="px-4 py-3 text-sm">${new Date(log.created_at).toLocaleString()}</td>
                <td class="px-4 py-3">${log.user_name || 'Système'}</td>
                <td class="px-4 py-3">
                    <span class="px-2 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200">
                        ${log.action}
                    </span>
                </td>
                <td class="px-4 py-3">${log.entity_type || '-'}</td>
                <td class="px-4 py-3">${log.entity_id || '-'}</td>
                <td class="px-4 py-3 text-sm">${log.details || '-'}</td>
            </tr>
        `).join('');

        content.innerHTML = `
            <div class="overflow-x-auto">
                <table class="w-full">
                    <thead class="bg-gray-100 dark:bg-gray-700">
                        <tr>
                            <th class="px-4 py-3 text-left text-xs font-semibold dark:text-white">Date</th>
                            <th class="px-4 py-3 text-left text-xs font-semibold dark:text-white">Utilisateur</th>
                            <th class="px-4 py-3 text-left text-xs font-semibold dark:text-white">Action</th>
                            <th class="px-4 py-3 text-left text-xs font-semibold dark:text-white">Type</th>
                            <th class="px-4 py-3 text-left text-xs font-semibold dark:text-white">ID</th>
                            <th class="px-4 py-3 text-left text-xs font-semibold dark:text-white">Détails</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-200 dark:divide-gray-700 dark:text-white">
                        ${logsHTML}
                    </tbody>
                </table>
            </div>
        `;
    },

    // Load statistics
    async loadStats() {
        try {
            const api = new JobMapAPI();
            const stats = await api.getStats();
            
            document.getElementById('stat-users').textContent = stats.totalUsers || 0;
            document.getElementById('stat-jobs').textContent = stats.totalJobs || 0;
            document.getElementById('stat-candidates').textContent = stats.totalCandidates || 0;
            document.getElementById('stat-applications').textContent = stats.totalApplications || 0;
        } catch (error) {
            console.error('Error loading stats:', error);
        }
    },

    // Action handlers
    async deleteUser(id) {
        if (!confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) return;
        
        try {
            const api = new JobMapAPI();
            await api.deleteUser(id);
            alert('Utilisateur supprimé avec succès');
            this.showTab('users');
        } catch (error) {
            alert('Erreur: ' + error.message);
        }
    },

    async deleteJob(id) {
        if (!confirm('Êtes-vous sûr de vouloir supprimer cette offre ?')) return;
        
        try {
            const api = new JobMapAPI();
            await api.deleteJob(id);
            alert('Offre supprimée avec succès');
            this.showTab('jobs');
        } catch (error) {
            alert('Erreur: ' + error.message);
        }
    },

    async deleteCandidate(id) {
        if (!confirm('Êtes-vous sûr de vouloir supprimer ce profil ?')) return;
        
        try {
            const api = new JobMapAPI();
            await api.deleteCandidate(id);
            alert('Profil supprimé avec succès');
            this.showTab('candidates');
        } catch (error) {
            alert('Erreur: ' + error.message);
        }
    },

    viewJob(id) {
        // Trigger the existing job details modal
        if (typeof showDetailsModal === 'function') {
            showDetailsModal(id);
        }
    },

    viewCandidate(id) {
        // Trigger the existing candidate details modal
        if (typeof showDetailsModal === 'function') {
            showDetailsModal(id);
        }
    },

    editUser(id) {
        alert('Fonction de modification à implémenter');
    },

    close() {
        const modal = document.getElementById('admin-dashboard-modal');
        if (modal) {
            modal.remove();
        }
    }
};
