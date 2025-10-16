require('dotenv').config();
const bcrypt = require('bcryptjs');
const db = require('./config/database');

async function seed() {
    console.log('Seeding database...');

    // Wait for database to be ready
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Create admin user
    const adminPassword = await bcrypt.hash('admin123', 10);
    db.run(
        'INSERT OR IGNORE INTO users (id, email, password, name, type) VALUES (?, ?, ?, ?, ?)',
        [1, 'admin@jobmap.com', adminPassword, 'Admin User', 'admin'],
        (err) => {
            if (err) console.error('Error creating admin:', err);
            else console.log('✓ Admin user created');
        }
    );

    // Create test recruiter
    const recruiterPassword = await bcrypt.hash('password', 10);
    db.run(
        'INSERT OR IGNORE INTO users (id, email, password, name, type, company) VALUES (?, ?, ?, ?, ?, ?)',
        [2, 'recruteur@jobmap.com', recruiterPassword, 'Recruteur Test', 'recruiter', 'Tech Solutions Inc.'],
        (err) => {
            if (err) console.error('Error creating recruiter:', err);
            else console.log('✓ Test recruiter created');
        }
    );

    // BTP Jobs data - Real French construction companies across all France
    const jobs = [
        // VINCI Construction - Leader mondial du BTP
        { title: 'Chef de Chantier Gros Œuvre', company: 'VINCI Construction', logo: 'https://placehold.co/100x100/e74c3c/ffffff?text=VINCI', companyDescription: 'Leader mondial de la construction et des concessions', industry: 'BTP', city: 'Paris', lat: 48.8566, lon: 2.3522, description: 'Pilotez des chantiers d\'envergure en gros œuvre. Management d\'équipes et gestion budgétaire.', tags: JSON.stringify(['Gros Œuvre', 'Management', 'Planning', 'Sécurité']), softSkills: JSON.stringify(['Leadership', 'Organisation', 'Rigueur']), experience: 'Confirmé', salary: 45000, contract: 'CDI', workArrangement: 'Sur site', userId: 2 },
        { title: 'Ingénieur Travaux VRD', company: 'VINCI Construction', logo: 'https://placehold.co/100x100/e74c3c/ffffff?text=VINCI', companyDescription: 'Leader mondial de la construction et des concessions', industry: 'BTP', city: 'Lyon', lat: 45.7640, lon: 4.8357, description: 'Réalisez des travaux de voirie et réseaux divers. Expertise technique et coordination.', tags: JSON.stringify(['VRD', 'Terrassement', 'Réseaux', 'AutoCAD']), softSkills: JSON.stringify(['Technique', 'Coordination', 'Autonomie']), experience: 'Confirmé', salary: 48000, contract: 'CDI', workArrangement: 'Sur site', userId: 2 },
        { title: 'Conducteur de Travaux TCE', company: 'VINCI Construction', logo: 'https://placehold.co/100x100/e74c3c/ffffff?text=VINCI', companyDescription: 'Leader mondial de la construction et des concessions', industry: 'BTP', city: 'Marseille', lat: 43.2965, lon: 5.3698, description: 'Coordination de tous les corps d\'état. Projets tertiaires et résidentiels haut de gamme.', tags: JSON.stringify(['TCE', 'Coordination', 'Budget', 'Planning']), softSkills: JSON.stringify(['Management', 'Négociation', 'Diplomatie']), experience: 'Senior', salary: 55000, contract: 'CDI', workArrangement: 'Sur site', userId: 2 },
        
        // BOUYGUES Construction
        { title: 'Ingénieur Structure Béton', company: 'Bouygues Construction', logo: 'https://placehold.co/100x100/2ecc71/ffffff?text=BOUYGUES', companyDescription: 'Acteur majeur du BTP avec expertise en construction durable', industry: 'BTP', city: 'Nantes', lat: 47.2184, lon: -1.5536, description: 'Conception et calcul de structures béton pour bâtiments exceptionnels.', tags: JSON.stringify(['Béton Armé', 'Robot Structural', 'Eurocodes', 'BIM']), softSkills: JSON.stringify(['Analyse', 'Rigueur', 'Innovation']), experience: 'Confirmé', salary: 52000, contract: 'CDI', workArrangement: 'Hybride', userId: 2 },
        { title: 'Chef de Projet Construction', company: 'Bouygues Construction', logo: 'https://placehold.co/100x100/2ecc71/ffffff?text=BOUYGUES', companyDescription: 'Acteur majeur du BTP avec expertise en construction durable', industry: 'BTP', city: 'Toulouse', lat: 43.6047, lon: 1.4442, description: 'Pilotage de projets de construction neuve et réhabilitation.', tags: JSON.stringify(['Gestion de Projet', 'Budget', 'Planning', 'Qualité']), softSkills: JSON.stringify(['Leadership', 'Communication', 'Décision']), experience: 'Senior', salary: 60000, contract: 'CDI', workArrangement: 'Sur site', userId: 2 },
        { title: 'Métreur Tous Corps d\'État', company: 'Bouygues Construction', logo: 'https://placehold.co/100x100/2ecc71/ffffff?text=BOUYGUES', companyDescription: 'Acteur majeur du BTP avec expertise en construction durable', industry: 'BTP', city: 'Bordeaux', lat: 44.8378, lon: -0.5792, description: 'Études de prix et métrés pour projets TCE.', tags: JSON.stringify(['Métrés', 'Chiffrage', 'DPGF', 'Excel']), softSkills: JSON.stringify(['Précision', 'Analyse', 'Méthode']), experience: 'Confirmé', salary: 42000, contract: 'CDI', workArrangement: 'Hybride', userId: 2 },
        
        // EIFFAGE Construction
        { title: 'Conducteur de Travaux Bâtiment', company: 'Eiffage Construction', logo: 'https://placehold.co/100x100/3498db/ffffff?text=EIFFAGE', companyDescription: 'Groupe de construction et concessions, expert en bâtiment', industry: 'BTP', city: 'Lille', lat: 50.6292, lon: 3.0573, description: 'Direction de chantiers bâtiment. Gestion complète de A à Z.', tags: JSON.stringify(['Bâtiment', 'Management', 'Technique', 'Commercial']), softSkills: JSON.stringify(['Polyvalence', 'Réactivité', 'Leadership']), experience: 'Confirmé', salary: 50000, contract: 'CDI', workArrangement: 'Sur site', userId: 2 },
        { title: 'Ingénieur Méthodes BTP', company: 'Eiffage Construction', logo: 'https://placehold.co/100x100/3498db/ffffff?text=EIFFAGE', companyDescription: 'Groupe de construction et concessions, expert en bâtiment', industry: 'BTP', city: 'Strasbourg', lat: 48.5734, lon: 7.7521, description: 'Optimisation des méthodes de construction et productivité.', tags: JSON.stringify(['Méthodes', 'Lean Construction', 'Planning', 'Optimisation']), softSkills: JSON.stringify(['Analyse', 'Innovation', 'Pédagogie']), experience: 'Confirmé', salary: 47000, contract: 'CDI', workArrangement: 'Hybride', userId: 2 },
        { title: 'Chargé d\'Affaires BTP', company: 'Eiffage Construction', logo: 'https://placehold.co/100x100/3498db/ffffff?text=EIFFAGE', companyDescription: 'Groupe de construction et concessions, expert en bâtiment', industry: 'BTP', city: 'Rennes', lat: 48.1173, lon: -1.6778, description: 'Développement commercial et suivi de projets BTP.', tags: JSON.stringify(['Commercial', 'Technique', 'Négociation', 'Gestion']), softSkills: JSON.stringify(['Relationnel', 'Persuasion', 'Ténacité']), experience: 'Confirmé', salary: 48000, contract: 'CDI', workArrangement: 'Sur site', userId: 2 },
        
        // SPIE Batignolles
        { title: 'Ingénieur Génie Civil', company: 'SPIE Batignolles', logo: 'https://placehold.co/100x100/9b59b6/ffffff?text=SPIE', companyDescription: 'Spécialiste en travaux publics et génie civil', industry: 'BTP', city: 'Grenoble', lat: 45.1885, lon: 5.7245, description: 'Conception d\'ouvrages d\'art et infrastructures.', tags: JSON.stringify(['Génie Civil', 'Ouvrages d\'Art', 'Calcul', 'Ponts']), softSkills: JSON.stringify(['Rigueur', 'Technique', 'Innovation']), experience: 'Senior', salary: 58000, contract: 'CDI', workArrangement: 'Hybride', userId: 2 },
        { title: 'Chef de Chantier TP', company: 'SPIE Batignolles', logo: 'https://placehold.co/100x100/9b59b6/ffffff?text=SPIE', companyDescription: 'Spécialiste en travaux publics et génie civil', industry: 'BTP', city: 'Montpellier', lat: 43.6108, lon: 3.8767, description: 'Gestion de chantiers de travaux publics et infrastructures.', tags: JSON.stringify(['Travaux Publics', 'Terrassement', 'Management', 'Sécurité']), softSkills: JSON.stringify(['Leadership', 'Rigueur', 'Résistance au stress']), experience: 'Confirmé', salary: 46000, contract: 'CDI', workArrangement: 'Sur site', userId: 2 },
        
        // EGIS (Bureau d\'études)
        { title: 'Ingénieur Études Structure', company: 'EGIS', logo: 'https://placehold.co/100x100/f39c12/ffffff?text=EGIS', companyDescription: 'Bureau d\'études international en ingénierie', industry: 'Bureau d\'Études', city: 'Paris', lat: 48.8566, lon: 2.3522, description: 'Études de structures complexes. Projets d\'envergure internationale.', tags: JSON.stringify(['Structure', 'Revit Structure', 'Calculs', 'BIM']), softSkills: JSON.stringify(['Analyse', 'Créativité', 'Rigueur']), experience: 'Confirmé', salary: 50000, contract: 'CDI', workArrangement: 'Hybride', userId: 2 },
        { title: 'Projeteur BIM Revit', company: 'EGIS', logo: 'https://placehold.co/100x100/f39c12/ffffff?text=EGIS', companyDescription: 'Bureau d\'études international en ingénierie', industry: 'Bureau d\'Études', city: 'Lyon', lat: 45.7640, lon: 4.8357, description: 'Modélisation BIM pour projets d\'infrastructure.', tags: JSON.stringify(['Revit', 'BIM', 'Navisworks', 'AutoCAD']), softSkills: JSON.stringify(['Précision', 'Collaboration', 'Adaptabilité']), experience: 'Confirmé', salary: 42000, contract: 'CDI', workArrangement: 'Hybride', userId: 2 },
        { title: 'Ingénieur Fluides CVC', company: 'EGIS', logo: 'https://placehold.co/100x100/f39c12/ffffff?text=EGIS', companyDescription: 'Bureau d\'études international en ingénierie', industry: 'Bureau d\'Études', city: 'Nice', lat: 43.7102, lon: 7.2620, description: 'Conception des systèmes CVC pour bâtiments tertiaires.', tags: JSON.stringify(['CVC', 'Thermique', 'Fluides', 'Pleiades']), softSkills: JSON.stringify(['Analyse', 'Technique', 'Innovation']), experience: 'Confirmé', salary: 46000, contract: 'CDI', workArrangement: 'Hybride', userId: 2 },
        
        // ARTELIA (Bureau d\'études)
        { title: 'BIM Manager', company: 'ARTELIA', logo: 'https://placehold.co/100x100/16a085/ffffff?text=ARTELIA', companyDescription: 'Bureau d\'études et conseil en ingénierie', industry: 'Bureau d\'Études', city: 'Paris', lat: 48.8566, lon: 2.3522, description: 'Coordination BIM de projets complexes. Formation et accompagnement.', tags: JSON.stringify(['BIM', 'Revit', 'Navisworks', 'Management']), softSkills: JSON.stringify(['Coordination', 'Pédagogie', 'Leadership']), experience: 'Senior', salary: 60000, contract: 'CDI', workArrangement: 'Hybride', userId: 2 },
        { title: 'Ingénieur VRD', company: 'ARTELIA', logo: 'https://placehold.co/100x100/16a085/ffffff?text=ARTELIA', companyDescription: 'Bureau d\'études et conseil en ingénierie', industry: 'Bureau d\'Études', city: 'Nantes', lat: 47.2184, lon: -1.5536, description: 'Conception de voirie et réseaux pour aménagements urbains.', tags: JSON.stringify(['VRD', 'Voirie', 'Assainissement', 'Covadis']), softSkills: JSON.stringify(['Technique', 'Autonomie', 'Créativité']), experience: 'Confirmé', salary: 45000, contract: 'CDI', workArrangement: 'Hybride', userId: 2 },
        
        // SETEC (Bureau d\'études)
        { title: 'Ingénieur Calcul Béton Armé', company: 'SETEC', logo: 'https://placehold.co/100x100/e67e22/ffffff?text=SETEC', companyDescription: 'Bureau d\'études techniques pluridisciplinaire', industry: 'Bureau d\'Études', city: 'Paris', lat: 48.8566, lon: 2.3522, description: 'Calculs de structures béton pour projets exceptionnels.', tags: JSON.stringify(['Béton Armé', 'Eurocodes', 'Robot', 'Calcul']), softSkills: JSON.stringify(['Rigueur', 'Analyse', 'Créativité']), experience: 'Senior', salary: 56000, contract: 'CDI', workArrangement: 'Hybride', userId: 2 },
        { title: 'Chef de Projet Études', company: 'SETEC', logo: 'https://placehold.co/100x100/e67e22/ffffff?text=SETEC', companyDescription: 'Bureau d\'études techniques pluridisciplinaire', industry: 'Bureau d\'Études', city: 'Lyon', lat: 45.7640, lon: 4.8357, description: 'Pilotage d\'études techniques TCE.', tags: JSON.stringify(['Gestion de Projet', 'Études', 'Coordination', 'Technique']), softSkills: JSON.stringify(['Management', 'Organisation', 'Communication']), experience: 'Senior', salary: 58000, contract: 'CDI', workArrangement: 'Hybride', userId: 2 },
        
        // NGE (Nouvelle Génération d\'Entrepreneurs)
        { title: 'Conducteur de Travaux Routes', company: 'NGE', logo: 'https://placehold.co/100x100/34495e/ffffff?text=NGE', companyDescription: 'Spécialiste des travaux routiers et d\'aménagement', industry: 'BTP', city: 'Caen', lat: 49.1829, lon: -0.3707, description: 'Réalisation de chantiers routiers et d\'aménagements.', tags: JSON.stringify(['Routes', 'Terrassement', 'VRD', 'Management']), softSkills: JSON.stringify(['Leadership', 'Rigueur', 'Adaptabilité']), experience: 'Confirmé', salary: 47000, contract: 'CDI', workArrangement: 'Sur site', userId: 2 },
        { title: 'Ingénieur Travaux Ouvrages d\'Art', company: 'NGE', logo: 'https://placehold.co/100x100/34495e/ffffff?text=NGE', companyDescription: 'Spécialiste des travaux routiers et d\'aménagement', industry: 'BTP', city: 'Toulouse', lat: 43.6047, lon: 1.4442, description: 'Réalisation d\'ouvrages d\'art (ponts, viaducs).', tags: JSON.stringify(['Ouvrages d\'Art', 'Génie Civil', 'Technique', 'Gestion']), softSkills: JSON.stringify(['Rigueur', 'Technique', 'Management']), experience: 'Senior', salary: 60000, contract: 'CDI', workArrangement: 'Sur site', userId: 2 },
        
        // RABOT DUTILLEUL
        { title: 'Chef de Projet Immobilier', company: 'Rabot Dutilleul', logo: 'https://placehold.co/100x100/c0392b/ffffff?text=RD', companyDescription: 'Groupe familial spécialisé en promotion immobilière', industry: 'BTP', city: 'Lille', lat: 50.6292, lon: 3.0573, description: 'Développement de programmes immobiliers.', tags: JSON.stringify(['Promotion', 'Immobilier', 'Gestion de Projet', 'Commercial']), softSkills: JSON.stringify(['Négociation', 'Vision', 'Relationnel']), experience: 'Confirmé', salary: 52000, contract: 'CDI', workArrangement: 'Hybride', userId: 2 },
        
        // VINCI Energies
        { title: 'Chargé d\'Études Électricité CFO-CFA', company: 'VINCI Energies', logo: 'https://placehold.co/100x100/8e44ad/ffffff?text=VE', companyDescription: 'Leader de la transformation énergétique', industry: 'BTP', city: 'Paris', lat: 48.8566, lon: 2.3522, description: 'Études électriques CFO/CFA pour bâtiments tertiaires.', tags: JSON.stringify(['Électricité', 'CFO', 'CFA', 'Caneco']), softSkills: JSON.stringify(['Rigueur', 'Technique', 'Précision']), experience: 'Confirmé', salary: 45000, contract: 'CDI', workArrangement: 'Hybride', userId: 2 },
        { title: 'Chef de Projet CVC', company: 'VINCI Energies', logo: 'https://placehold.co/100x100/8e44ad/ffffff?text=VE', companyDescription: 'Leader de la transformation énergétique', industry: 'BTP', city: 'Marseille', lat: 43.2965, lon: 5.3698, description: 'Pilotage de projets de chauffage, ventilation et climatisation.', tags: JSON.stringify(['CVC', 'Climatisation', 'Thermique', 'Gestion']), softSkills: JSON.stringify(['Management', 'Technique', 'Organisation']), experience: 'Confirmé', salary: 50000, contract: 'CDI', workArrangement: 'Hybride', userId: 2 },
        
        // SOPREMA (Étanchéité et isolation)
        { title: 'Technico-Commercial Étanchéité', company: 'SOPREMA', logo: 'https://placehold.co/100x100/27ae60/ffffff?text=SOPREMA', companyDescription: 'Leader mondial de l\'étanchéité et de l\'isolation', industry: 'BTP', city: 'Strasbourg', lat: 48.5734, lon: 7.7521, description: 'Développement commercial et prescription de solutions d\'étanchéité.', tags: JSON.stringify(['Étanchéité', 'Commercial', 'Technique', 'Prescription']), softSkills: JSON.stringify(['Relationnel', 'Persuasion', 'Technique']), experience: 'Confirmé', salary: 48000, contract: 'CDI', workArrangement: 'Sur site', userId: 2 },
        
        // COLAS (Filiale Bouygues - Routes)
        { title: 'Chef de Chantier Enrobés', company: 'COLAS', logo: 'https://placehold.co/100x100/d35400/ffffff?text=COLAS', companyDescription: 'Leader mondial de la construction routière', industry: 'BTP', city: 'Bordeaux', lat: 44.8378, lon: -0.5792, description: 'Direction de chantiers d\'enrobés et voirie.', tags: JSON.stringify(['Enrobés', 'Routes', 'Voirie', 'Management']), softSkills: JSON.stringify(['Leadership', 'Technique', 'Rigueur']), experience: 'Confirmé', salary: 44000, contract: 'CDI', workArrangement: 'Sur site', userId: 2 },
        { title: 'Ingénieur Laboratoire Matériaux', company: 'COLAS', logo: 'https://placehold.co/100x100/d35400/ffffff?text=COLAS', companyDescription: 'Leader mondial de la construction routière', industry: 'BTP', city: 'Lyon', lat: 45.7640, lon: 4.8357, description: 'Contrôle qualité des matériaux routiers.', tags: JSON.stringify(['Matériaux', 'Laboratoire', 'Contrôle Qualité', 'Enrobés']), softSkills: JSON.stringify(['Rigueur', 'Analyse', 'Méthode']), experience: 'Confirmé', salary: 42000, contract: 'CDI', workArrangement: 'Sur site', userId: 2 },
        
        // Smaller cities and additional positions
        { title: 'Maçon Qualifié', company: 'Entreprise Dupont BTP', logo: 'https://placehold.co/100x100/95a5a6/ffffff?text=DUPONT', companyDescription: 'Entreprise artisanale de maçonnerie générale', industry: 'BTP', city: 'Tours', lat: 47.3941, lon: 0.6848, description: 'Réalisation de travaux de maçonnerie traditionnelle et contemporaine.', tags: JSON.stringify(['Maçonnerie', 'Gros Œuvre', 'Traditionnel', 'Rénovation']), softSkills: JSON.stringify(['Manuel', 'Précision', 'Travail d\'équipe']), experience: 'Confirmé', salary: 32000, contract: 'CDI', workArrangement: 'Sur site', userId: 2 },
        { title: 'Chef d\'Équipe Électricité', company: 'Élec Services', logo: 'https://placehold.co/100x100/f39c12/ffffff?text=ES', companyDescription: 'Entreprise d\'électricité tous courants', industry: 'BTP', city: 'Clermont-Ferrand', lat: 45.7797, lon: 3.0863, description: 'Encadrement d\'équipes sur chantiers d\'électricité.', tags: JSON.stringify(['Électricité', 'Management', 'Installation', 'Dépannage']), softSkills: JSON.stringify(['Leadership', 'Pédagogie', 'Réactivité']), experience: 'Confirmé', salary: 38000, contract: 'CDI', workArrangement: 'Sur site', userId: 2 },
        { title: 'Plombier Chauffagiste', company: 'Thermo Confort', logo: 'https://placehold.co/100x100/3498db/ffffff?text=TC', companyDescription: 'Spécialiste en plomberie et chauffage', industry: 'BTP', city: 'Angers', lat: 47.4784, lon: -0.5632, description: 'Installation et maintenance de systèmes de plomberie et chauffage.', tags: JSON.stringify(['Plomberie', 'Chauffage', 'Installation', 'Dépannage']), softSkills: JSON.stringify(['Manuel', 'Autonomie', 'Service client']), experience: 'Confirmé', salary: 34000, contract: 'CDI', workArrangement: 'Sur site', userId: 2 },
        { title: 'Économiste de la Construction', company: 'Cabinet d\'Économie Martin', logo: 'https://placehold.co/100x100/16a085/ffffff?text=CEM', companyDescription: 'Cabinet spécialisé en économie de la construction', industry: 'Bureau d\'Études', city: 'Nantes', lat: 47.2184, lon: -1.5536, description: 'Études de prix et métrés pour maîtrise d\'ouvrage.', tags: JSON.stringify(['Métrés', 'Études de Prix', 'TCE', 'Estimation']), softSkills: JSON.stringify(['Précision', 'Analyse', 'Relationnel']), experience: 'Confirmé', salary: 43000, contract: 'CDI', workArrangement: 'Hybride', userId: 2 },
        { title: 'Dessinateur Projeteur Bâtiment', company: 'Bureau Technique du Languedoc', logo: 'https://placehold.co/100x100/9b59b6/ffffff?text=BTL', companyDescription: 'Bureau d\'études techniques régional', industry: 'Bureau d\'Études', city: 'Montpellier', lat: 43.6108, lon: 3.8767, description: 'Plans d\'exécution et permis de construire.', tags: JSON.stringify(['AutoCAD', 'Revit', 'Plans', 'Permis de Construire']), softSkills: JSON.stringify(['Précision', 'Créativité', 'Rigueur']), experience: 'Junior', salary: 32000, contract: 'CDI', workArrangement: 'Hybride', userId: 2 },
        { title: 'Géomètre Topographe', company: 'Topogéo Services', logo: 'https://placehold.co/100x100/e74c3c/ffffff?text=TGS', companyDescription: 'Cabinet de géomètres experts', industry: 'Bureau d\'Études', city: 'Grenoble', lat: 45.1885, lon: 5.7245, description: 'Relevés topographiques et implantations de chantiers.', tags: JSON.stringify(['Topographie', 'GPS', 'Station Totale', 'Implantation']), softSkills: JSON.stringify(['Précision', 'Autonomie', 'Terrain']), experience: 'Confirmé', salary: 38000, contract: 'CDI', workArrangement: 'Sur site', userId: 2 },
        { title: 'Responsable QHSE', company: 'VINCI Construction', logo: 'https://placehold.co/100x100/e74c3c/ffffff?text=VINCI', companyDescription: 'Leader mondial de la construction et des concessions', industry: 'BTP', city: 'Paris', lat: 48.8566, lon: 2.3522, description: 'Management de la qualité, hygiène, sécurité et environnement.', tags: JSON.stringify(['QHSE', 'Sécurité', 'ISO', 'Management']), softSkills: JSON.stringify(['Rigueur', 'Pédagogie', 'Communication']), experience: 'Senior', salary: 55000, contract: 'CDI', workArrangement: 'Sur site', userId: 2 },
        { title: 'Coordinateur SPS', company: 'SPS Conseil', logo: 'https://placehold.co/100x100/c0392b/ffffff?text=SPS', companyDescription: 'Cabinet spécialisé en coordination SPS', industry: 'Bureau d\'Études', city: 'Lille', lat: 50.6292, lon: 3.0573, description: 'Coordination sécurité et protection de la santé.', tags: JSON.stringify(['SPS', 'Sécurité', 'Coordination', 'Prévention']), softSkills: JSON.stringify(['Rigueur', 'Communication', 'Autorité']), experience: 'Confirmé', salary: 45000, contract: 'CDI', workArrangement: 'Sur site', userId: 2 },
        { title: 'Ingénieur Béton Préfabriqué', company: 'KP1', logo: 'https://placehold.co/100x100/2c3e50/ffffff?text=KP1', companyDescription: 'Spécialiste du béton préfabriqué', industry: 'BTP', city: 'Le Havre', lat: 49.4938, lon: 0.1079, description: 'Conception et suivi de production d\'éléments préfabriqués.', tags: JSON.stringify(['Béton', 'Préfabrication', 'Production', 'Technique']), softSkills: JSON.stringify(['Rigueur', 'Organisation', 'Technique']), experience: 'Confirmé', salary: 48000, contract: 'CDI', workArrangement: 'Sur site', userId: 2 },
        { title: 'Architecte DPLG', company: 'Atelier d\'Architecture Moderne', logo: 'https://placehold.co/100x100/1abc9c/ffffff?text=AAM', companyDescription: 'Agence d\'architecture primée', industry: 'Bureau d\'Études', city: 'Paris', lat: 48.8566, lon: 2.3522, description: 'Conception architecturale de projets contemporains.', tags: JSON.stringify(['Architecture', 'ArchiCAD', 'BIM', 'Conception']), softSkills: JSON.stringify(['Créativité', 'Vision', 'Communication']), experience: 'Confirmé', salary: 48000, contract: 'CDI', workArrangement: 'Hybride', userId: 2 }
    ];

    for (const job of jobs) {
        db.run(
            `INSERT INTO jobs (
                title, company, logo, company_description, industry, city,
                latitude, longitude, description, tags, soft_skills,
                experience, salary, contract, work_arrangement, user_id
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                job.title, job.company, job.logo, job.companyDescription,
                job.industry, job.city, job.lat, job.lon,
                job.description, job.tags, job.softSkills,
                job.experience, job.salary, job.contract,
                job.workArrangement, job.userId
            ],
            (err) => {
                if (err) console.error('Error creating job:', err);
            }
        );
    }
    console.log('✓ Sample jobs created');

    // BTP Candidates data - across all France
    const candidates = [
        {
            name: 'Pierre Durand',
            title: 'Conducteur de Travaux TCE',
            avatar: 'https://placehold.co/100x100/e74c3c/ffffff?text=PD',
            city: 'Paris',
            lat: 48.8566,
            lon: 2.3522,
            tags: JSON.stringify(['TCE', 'Gestion de Chantier', 'Budget', 'Planning']),
            softSkills: JSON.stringify(['Leadership', 'Organisation', 'Négociation']),
            experience: 'Senior',
            availability: 'Immédiate',
            description: '12 ans d\'expérience en conduite de travaux TCE sur projets tertiaires et résidentiels.',
            education: JSON.stringify([{year: '2008-2011', degree: 'Ingénieur Génie Civil', school: 'ESTP Paris'}]),
            certifications: JSON.stringify(['Habilitation Électrique', 'AIPR']),
            background: JSON.stringify([
                {year: '2015-2024', role: 'Conducteur de Travaux', company: 'VINCI Construction'},
                {year: '2011-2015', role: 'Chef de Chantier', company: 'Bouygues Construction'}
            ])
        },
        {
            name: 'Marie Lefevre',
            title: 'Ingénieure Structure Béton',
            avatar: 'https://placehold.co/100x100/2ecc71/ffffff?text=ML',
            city: 'Lyon',
            lat: 45.7640,
            lon: 4.8357,
            tags: JSON.stringify(['Béton Armé', 'Robot Structural', 'Eurocodes', 'Calcul']),
            softSkills: JSON.stringify(['Rigueur', 'Analyse', 'Créativité']),
            experience: 'Confirmé',
            availability: 'Sous 1 mois',
            description: '7 ans en calcul de structures béton pour projets exceptionnels.',
            education: JSON.stringify([{year: '2014-2017', degree: 'Master Génie Civil', school: 'INSA Lyon'}]),
            certifications: JSON.stringify(['Eurocodes Béton', 'Robot Structural Analysis']),
            background: JSON.stringify([
                {year: '2019-2024', role: 'Ingénieure Structure', company: 'EGIS'},
                {year: '2017-2019', role: 'Ingénieure Études', company: 'SETEC'}
            ])
        },
        {
            name: 'Thomas Bernard',
            title: 'Chef de Chantier Gros Œuvre',
            avatar: 'https://placehold.co/100x100/3498db/ffffff?text=TB',
            city: 'Marseille',
            lat: 43.2965,
            lon: 5.3698,
            tags: JSON.stringify(['Gros Œuvre', 'Management', 'Sécurité', 'Planning']),
            softSkills: JSON.stringify(['Leadership', 'Rigueur', 'Communication']),
            experience: 'Confirmé',
            availability: 'Immédiate',
            description: '8 ans de gestion de chantiers gros œuvre jusqu\'à 50 personnes.',
            education: JSON.stringify([{year: '2013-2016', degree: 'Licence Pro BTP', school: 'IUT Marseille'}]),
            certifications: JSON.stringify(['SST', 'CACES R372', 'AIPR']),
            background: JSON.stringify([
                {year: '2018-2024', role: 'Chef de Chantier', company: 'Eiffage Construction'},
                {year: '2016-2018', role: 'Chef d\'Équipe', company: 'Entreprise locale'}
            ])
        },
        {
            name: 'Sophie Moreau',
            title: 'BIM Manager',
            avatar: 'https://placehold.co/100x100/9b59b6/ffffff?text=SM',
            city: 'Nantes',
            lat: 47.2184,
            lon: -1.5536,
            tags: JSON.stringify(['BIM', 'Revit', 'Navisworks', 'Coordination']),
            softSkills: JSON.stringify(['Coordination', 'Pédagogie', 'Innovation']),
            experience: 'Confirmé',
            availability: 'Sous 2 mois',
            description: '6 ans en coordination BIM de projets complexes.',
            education: JSON.stringify([{year: '2015-2018', degree: 'Master BIM', school: 'École des Ponts ParisTech'}]),
            certifications: JSON.stringify(['Revit Architecture Certified', 'BIM Manager Certified']),
            background: JSON.stringify([
                {year: '2020-2024', role: 'BIM Manager', company: 'ARTELIA'},
                {year: '2018-2020', role: 'Projeteur BIM', company: 'EGIS'}
            ])
        },
        {
            name: 'Julien Petit',
            title: 'Ingénieur Travaux VRD',
            avatar: 'https://placehold.co/100x100/f39c12/ffffff?text=JP',
            city: 'Toulouse',
            lat: 43.6047,
            lon: 1.4442,
            tags: JSON.stringify(['VRD', 'Terrassement', 'Réseaux', 'Voirie']),
            softSkills: JSON.stringify(['Technique', 'Autonomie', 'Management']),
            experience: 'Confirmé',
            availability: 'Immédiate',
            description: '9 ans en réalisation de travaux de voirie et réseaux divers.',
            education: JSON.stringify([{year: '2012-2015', degree: 'Ingénieur Travaux Publics', school: 'ESTP'}]),
            certifications: JSON.stringify(['AIPR Concepteur', 'Autocad Civil 3D']),
            background: JSON.stringify([
                {year: '2017-2024', role: 'Ingénieur Travaux VRD', company: 'NGE'},
                {year: '2015-2017', role: 'Conducteur de Travaux', company: 'COLAS'}
            ])
        },
        {
            name: 'Émilie Dubois',
            title: 'Métreur TCE',
            avatar: 'https://placehold.co/100x100/16a085/ffffff?text=ED',
            city: 'Bordeaux',
            lat: 44.8378,
            lon: -0.5792,
            tags: JSON.stringify(['Métrés', 'Chiffrage', 'DPGF', 'Excel']),
            softSkills: JSON.stringify(['Précision', 'Analyse', 'Rigueur']),
            experience: 'Confirmé',
            availability: 'Sous 1 mois',
            description: '5 ans d\'expérience en métrés tous corps d\'état.',
            education: JSON.stringify([{year: '2016-2019', degree: 'Licence Pro Économie', school: 'Université Bordeaux'}]),
            certifications: JSON.stringify(['Excel Expert', 'Métrés Bâtiment']),
            background: JSON.stringify([
                {year: '2019-2024', role: 'Métreur', company: 'Bouygues Construction'},
                {year: '2019', role: 'Stage Métreur', company: 'Cabinet économiste'}
            ])
        },
        {
            name: 'Nicolas Lambert',
            title: 'Chef de Projet Bâtiment',
            avatar: 'https://placehold.co/100x100/e67e22/ffffff?text=NL',
            city: 'Lille',
            lat: 50.6292,
            lon: 3.0573,
            tags: JSON.stringify(['Gestion de Projet', 'Bâtiment', 'Budget', 'Planification']),
            softSkills: JSON.stringify(['Management', 'Communication', 'Décision']),
            experience: 'Senior',
            availability: 'Sous 3 mois',
            description: '15 ans en gestion de projets de construction et réhabilitation.',
            education: JSON.stringify([{year: '2006-2009', degree: 'Ingénieur BTP', school: 'Polytech Lille'}]),
            certifications: JSON.stringify(['PMP', 'Lean Construction']),
            background: JSON.stringify([
                {year: '2014-2024', role: 'Chef de Projet', company: 'Rabot Dutilleul'},
                {year: '2009-2014', role: 'Conducteur de Travaux', company: 'VINCI Construction'}
            ])
        },
        {
            name: 'Céline Roux',
            title: 'Projeteur BIM Revit',
            avatar: 'https://placehold.co/100x100/c0392b/ffffff?text=CR',
            city: 'Strasbourg',
            lat: 48.5734,
            lon: 7.7521,
            tags: JSON.stringify(['Revit', 'BIM', 'AutoCAD', 'Plans']),
            softSkills: JSON.stringify(['Précision', 'Créativité', 'Collaboration']),
            experience: 'Confirmé',
            availability: 'Immédiate',
            description: '6 ans en modélisation BIM pour projets d\'infrastructure.',
            education: JSON.stringify([{year: '2015-2018', degree: 'Licence Pro Génie Civil', school: 'IUT Strasbourg'}]),
            certifications: JSON.stringify(['Revit Certified', 'Navisworks']),
            background: JSON.stringify([
                {year: '2018-2024', role: 'Projeteur BIM', company: 'EGIS'},
                {year: '2018', role: 'Dessinateur', company: 'Bureau d\'études local'}
            ])
        },
        {
            name: 'Antoine Martin',
            title: 'Ingénieur Génie Civil',
            avatar: 'https://placehold.co/100x100/34495e/ffffff?text=AM',
            city: 'Grenoble',
            lat: 45.1885,
            lon: 5.7245,
            tags: JSON.stringify(['Génie Civil', 'Ouvrages d\'Art', 'Calcul', 'Ponts']),
            softSkills: JSON.stringify(['Rigueur', 'Technique', 'Innovation']),
            experience: 'Senior',
            availability: 'Sous 2 mois',
            description: '10 ans en conception d\'ouvrages d\'art exceptionnels.',
            education: JSON.stringify([{year: '2011-2014', degree: 'Ingénieur Génie Civil', school: 'Grenoble INP'}]),
            certifications: JSON.stringify(['Eurocodes Structure', 'Ponts']),
            background: JSON.stringify([
                {year: '2016-2024', role: 'Ingénieur Génie Civil', company: 'SPIE Batignolles'},
                {year: '2014-2016', role: 'Ingénieur Études', company: 'SETEC'}
            ])
        },
        {
            name: 'Laura Girard',
            title: 'Chef de Chantier TP',
            avatar: 'https://placehold.co/100x100/8e44ad/ffffff?text=LG',
            city: 'Montpellier',
            lat: 43.6108,
            lon: 3.8767,
            tags: JSON.stringify(['Travaux Publics', 'Terrassement', 'Management', 'VRD']),
            softSkills: JSON.stringify(['Leadership', 'Résistance au stress', 'Organisation']),
            experience: 'Confirmé',
            availability: 'Immédiate',
            description: '7 ans en gestion de chantiers de travaux publics.',
            education: JSON.stringify([{year: '2014-2017', degree: 'Licence Pro TP', school: 'Université Montpellier'}]),
            certifications: JSON.stringify(['CACES', 'AIPR', 'SST']),
            background: JSON.stringify([
                {year: '2019-2024', role: 'Chef de Chantier TP', company: 'SPIE Batignolles'},
                {year: '2017-2019', role: 'Chef d\'Équipe', company: 'NGE'}
            ])
        },
        {
            name: 'Maxime Rousseau',
            title: 'Ingénieur Méthodes BTP',
            avatar: 'https://placehold.co/100x100/27ae60/ffffff?text=MR',
            city: 'Rennes',
            lat: 48.1173,
            lon: -1.6778,
            tags: JSON.stringify(['Méthodes', 'Lean Construction', 'Planning', 'Optimisation']),
            softSkills: JSON.stringify(['Analyse', 'Innovation', 'Pédagogie']),
            experience: 'Confirmé',
            availability: 'Sous 1 mois',
            description: '6 ans en optimisation des processus de construction.',
            education: JSON.stringify([{year: '2015-2018', degree: 'Master Génie Civil', school: 'INSA Rennes'}]),
            certifications: JSON.stringify(['Lean Construction', 'MS Project']),
            background: JSON.stringify([
                {year: '2018-2024', role: 'Ingénieur Méthodes', company: 'Eiffage Construction'},
                {year: '2018', role: 'Stage Méthodes', company: 'VINCI'}
            ])
        },
        {
            name: 'Audrey Leroy',
            title: 'Ingénieure Fluides CVC',
            avatar: 'https://placehold.co/100x100/1abc9c/ffffff?text=AL',
            city: 'Nice',
            lat: 43.7102,
            lon: 7.2620,
            tags: JSON.stringify(['CVC', 'Thermique', 'Fluides', 'Pleiades']),
            softSkills: JSON.stringify(['Analyse', 'Technique', 'Créativité']),
            experience: 'Confirmé',
            availability: 'Sous 2 mois',
            description: '5 ans en conception de systèmes CVC pour bâtiments tertiaires.',
            education: JSON.stringify([{year: '2016-2019', degree: 'Ingénieur Énergétique', school: 'Polytech Nice'}]),
            certifications: JSON.stringify(['Pleiades Comfie', 'RT 2012']),
            background: JSON.stringify([
                {year: '2019-2024', role: 'Ingénieure CVC', company: 'EGIS'},
                {year: '2019', role: 'Stage Fluides', company: 'Bureau d\'études local'}
            ])
        },
        {
            name: 'David Blanc',
            title: 'Chargé d\'Affaires BTP',
            avatar: 'https://placehold.co/100x100/d35400/ffffff?text=DB',
            city: 'Caen',
            lat: 49.1829,
            lon: -0.3707,
            tags: JSON.stringify(['Commercial', 'Technique', 'Négociation', 'Gestion']),
            softSkills: JSON.stringify(['Relationnel', 'Persuasion', 'Ténacité']),
            experience: 'Confirmé',
            availability: 'Immédiate',
            description: '8 ans en développement commercial et suivi de projets BTP.',
            education: JSON.stringify([{year: '2013-2016', degree: 'École de Commerce', school: 'EM Normandie'}]),
            certifications: JSON.stringify(['Technique BTP', 'Commercial']),
            background: JSON.stringify([
                {year: '2018-2024', role: 'Chargé d\'Affaires', company: 'Eiffage Construction'},
                {year: '2016-2018', role: 'Commercial BTP', company: 'Entreprise régionale'}
            ])
        },
        {
            name: 'Isabelle Durand',
            title: 'Économiste de la Construction',
            avatar: 'https://placehold.co/100x100/95a5a6/ffffff?text=ID',
            city: 'Clermont-Ferrand',
            lat: 45.7797,
            lon: 3.0863,
            tags: JSON.stringify(['Métrés', 'Études de Prix', 'TCE', 'Estimation']),
            softSkills: JSON.stringify(['Précision', 'Analyse', 'Relationnel']),
            experience: 'Senior',
            availability: 'Sous 1 mois',
            description: '12 ans en économie de la construction pour maîtrise d\'ouvrage.',
            education: JSON.stringify([{year: '2009-2012', degree: 'Master Économie Construction', school: 'ESTP'}]),
            certifications: JSON.stringify(['Économiste Construction', 'Expert Métrés']),
            background: JSON.stringify([
                {year: '2015-2024', role: 'Économiste', company: 'Cabinet indépendant'},
                {year: '2012-2015', role: 'Métreur', company: 'Bureau d\'études'}
            ])
        },
        {
            name: 'Franck Mercier',
            title: 'Chef de Projet Études',
            avatar: 'https://placehold.co/100x100/2c3e50/ffffff?text=FM',
            city: 'Angers',
            lat: 47.4784,
            lon: -0.5632,
            tags: JSON.stringify(['Gestion de Projet', 'Études', 'Coordination', 'Technique']),
            softSkills: JSON.stringify(['Management', 'Organisation', 'Communication']),
            experience: 'Senior',
            availability: 'Sous 2 mois',
            description: '11 ans en pilotage d\'études techniques TCE.',
            education: JSON.stringify([{year: '2010-2013', degree: 'Ingénieur Génie Civil', school: 'ESTP'}]),
            certifications: JSON.stringify(['Chef de Projet', 'BIM']),
            background: JSON.stringify([
                {year: '2017-2024', role: 'Chef de Projet Études', company: 'SETEC'},
                {year: '2013-2017', role: 'Ingénieur Études', company: 'ARTELIA'}
            ])
        },
        {
            name: 'Caroline Simon',
            title: 'Responsable QHSE',
            avatar: 'https://placehold.co/100x100/f39c12/ffffff?text=CS',
            city: 'Tours',
            lat: 47.3941,
            lon: 0.6848,
            tags: JSON.stringify(['QHSE', 'Sécurité', 'ISO', 'Management']),
            softSkills: JSON.stringify(['Rigueur', 'Pédagogie', 'Communication']),
            experience: 'Confirmé',
            availability: 'Immédiate',
            description: '7 ans en management qualité, hygiène, sécurité et environnement.',
            education: JSON.stringify([{year: '2014-2017', degree: 'Master QHSE', school: 'Université Tours'}]),
            certifications: JSON.stringify(['ISO 9001', 'ISO 14001', 'OHSAS 18001']),
            background: JSON.stringify([
                {year: '2019-2024', role: 'Responsable QHSE', company: 'VINCI Construction'},
                {year: '2017-2019', role: 'Animateur QHSE', company: 'Bouygues'}
            ])
        },
        {
            name: 'Sébastien Faure',
            title: 'Géomètre Topographe',
            avatar: 'https://placehold.co/100x100/3498db/ffffff?text=SF',
            city: 'Le Havre',
            lat: 49.4938,
            lon: 0.1079,
            tags: JSON.stringify(['Topographie', 'GPS', 'Station Totale', 'Implantation']),
            softSkills: JSON.stringify(['Précision', 'Autonomie', 'Terrain']),
            experience: 'Confirmé',
            availability: 'Sous 1 mois',
            description: '8 ans en relevés topographiques et implantations.',
            education: JSON.stringify([{year: '2013-2016', degree: 'Licence Pro Géomètre', school: 'ESGT'}]),
            certifications: JSON.stringify(['Géomètre Expert', 'GPS RTK']),
            background: JSON.stringify([
                {year: '2016-2024', role: 'Géomètre Topographe', company: 'Cabinet de géomètres'},
                {year: '2016', role: 'Stage Topographie', company: 'Bureau d\'études'}
            ])
        },
        {
            name: 'Valérie Roussel',
            title: 'Ingénieure VRD',
            avatar: 'https://placehold.co/100x100/e74c3c/ffffff?text=VR',
            city: 'Orléans',
            lat: 47.9029,
            lon: 1.9039,
            tags: JSON.stringify(['VRD', 'Voirie', 'Assainissement', 'Covadis']),
            softSkills: JSON.stringify(['Technique', 'Autonomie', 'Créativité']),
            experience: 'Confirmé',
            availability: 'Immédiate',
            description: '6 ans en conception de voirie et réseaux divers.',
            education: JSON.stringify([{year: '2015-2018', degree: 'Master Génie Civil', school: 'Polytech Orléans'}]),
            certifications: JSON.stringify(['Covadis', 'Autocad Civil 3D']),
            background: JSON.stringify([
                {year: '2018-2024', role: 'Ingénieure VRD', company: 'ARTELIA'},
                {year: '2018', role: 'Stage VRD', company: 'Collectivité locale'}
            ])
        },
        {
            name: 'Christophe Martin',
            title: 'Coordinateur SPS',
            avatar: 'https://placehold.co/100x100/2ecc71/ffffff?text=CM',
            city: 'Dijon',
            lat: 47.3221,
            lon: 5.0415,
            tags: JSON.stringify(['SPS', 'Sécurité', 'Coordination', 'Prévention']),
            softSkills: JSON.stringify(['Rigueur', 'Communication', 'Autorité']),
            experience: 'Senior',
            availability: 'Sous 3 mois',
            description: '13 ans en coordination sécurité et protection de la santé.',
            education: JSON.stringify([{year: '2008-2011', degree: 'Master Prévention', school: 'Université Dijon'}]),
            certifications: JSON.stringify(['SPS Niveau 1', 'SPS Niveau 2', 'CSPS']),
            background: JSON.stringify([
                {year: '2013-2024', role: 'Coordinateur SPS', company: 'Cabinet SPS indépendant'},
                {year: '2011-2013', role: 'Assistant SPS', company: 'Bureau de contrôle'}
            ])
        },
        {
            name: 'Sandrine Petit',
            title: 'Dessinatrice Projeteur Bâtiment',
            avatar: 'https://placehold.co/100x100/9b59b6/ffffff?text=SP',
            city: 'Besançon',
            lat: 47.2380,
            lon: 6.0243,
            tags: JSON.stringify(['AutoCAD', 'Revit', 'Plans', 'Permis de Construire']),
            softSkills: JSON.stringify(['Précision', 'Créativité', 'Rigueur']),
            experience: 'Confirmé',
            availability: 'Immédiate',
            description: '5 ans en réalisation de plans d\'exécution et permis de construire.',
            education: JSON.stringify([{year: '2016-2019', degree: 'BTS Études et Économie', school: 'Lycée Technique Besançon'}]),
            certifications: JSON.stringify(['AutoCAD Certified', 'Revit']),
            background: JSON.stringify([
                {year: '2019-2024', role: 'Dessinatrice Projeteur', company: 'Bureau d\'études local'},
                {year: '2019', role: 'Stage Dessin', company: 'Architecte'}
            ])
        },
        {
            name: 'Philippe Garnier',
            title: 'Ingénieur Calcul Béton Armé',
            avatar: 'https://placehold.co/100x100/16a085/ffffff?text=PG',
            city: 'Reims',
            lat: 49.2583,
            lon: 4.0317,
            tags: JSON.stringify(['Béton Armé', 'Eurocodes', 'Robot', 'Calcul']),
            softSkills: JSON.stringify(['Rigueur', 'Analyse', 'Créativité']),
            experience: 'Senior',
            availability: 'Sous 2 mois',
            description: '14 ans en calculs de structures béton pour projets exceptionnels.',
            education: JSON.stringify([{year: '2007-2010', degree: 'Ingénieur Structure', school: 'ESTP'}]),
            certifications: JSON.stringify(['Eurocodes Béton', 'Robot Expert']),
            background: JSON.stringify([
                {year: '2014-2024', role: 'Ingénieur Calcul', company: 'SETEC'},
                {year: '2010-2014', role: 'Ingénieur Études', company: 'EGIS'}
            ])
        }
    ];

    for (const candidate of candidates) {
        db.run(
            `INSERT INTO candidates (
                name, title, avatar, city, latitude, longitude,
                tags, soft_skills, experience, availability,
                description, education, certifications, background
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                candidate.name, candidate.title, candidate.avatar,
                candidate.city, candidate.lat, candidate.lon,
                candidate.tags, candidate.softSkills, candidate.experience,
                candidate.availability, candidate.description,
                candidate.education, candidate.certifications, candidate.background
            ],
            (err) => {
                if (err) console.error('Error creating candidate:', err);
            }
        );
    }
    console.log('✓ Sample candidates created');

    setTimeout(() => {
        console.log('\nSeeding completed!');
        console.log('\nTest accounts:');
        console.log('  Admin: admin@jobmap.com / admin123');
        console.log('  Recruiter: recruteur@jobmap.com / password');
        process.exit(0);
    }, 1000);
}

seed();
