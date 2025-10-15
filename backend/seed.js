require('dotenv').config();
const bcrypt = require('bcryptjs');
const db = require('./config/database');

async function seed() {
    console.log('Seeding database...');

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

    // Sample jobs data
    const jobs = [
        {
            title: 'Développeur Full-Stack',
            company: 'Tech Solutions Inc.',
            logo: 'https://placehold.co/100x100/3b82f6/ffffff?text=TSI',
            companyDescription: 'Leader en solutions logicielles B2B',
            industry: 'Tech',
            city: 'Marseille',
            lat: 43.2965,
            lon: 5.3698,
            description: 'Rejoignez notre équipe agile pour construire des applications web innovantes.',
            tags: JSON.stringify(['React', 'Node.js', 'TypeScript', 'SQL']),
            softSkills: JSON.stringify(['Travail d\'équipe', 'Communication', 'Créativité']),
            experience: 'Confirmé',
            salary: 65000,
            contract: 'CDI',
            workArrangement: 'Hybride',
            userId: 2
        },
        {
            title: 'Data Scientist Senior',
            company: 'DataCorp',
            logo: 'https://placehold.co/100x100/10b981/ffffff?text=DC',
            companyDescription: 'Transformons les données en décisions stratégiques',
            industry: 'Data',
            city: 'Dijon',
            lat: 47.3221,
            lon: 5.0415,
            description: 'Expert en Machine Learning pour développer des modèles prédictifs.',
            tags: JSON.stringify(['Python', 'Machine Learning', 'TensorFlow']),
            softSkills: JSON.stringify(['Analyse critique', 'Résolution de problèmes']),
            experience: 'Senior',
            salary: 85000,
            contract: 'CDI',
            workArrangement: 'Télétravail',
            userId: 2
        },
        {
            title: 'Designer UI/UX Junior',
            company: 'Creative Minds',
            logo: 'https://placehold.co/100x100/ec4899/ffffff?text=CM',
            companyDescription: 'Agence de design primée',
            industry: 'Design',
            city: 'Lyon',
            lat: 45.7578,
            lon: 4.8320,
            description: 'Créez des interfaces intuitives et mémorables.',
            tags: JSON.stringify(['Figma', 'Adobe XD', 'User Research']),
            softSkills: JSON.stringify(['Créativité', 'Empathie', 'Collaboration']),
            experience: 'Junior',
            salary: 42000,
            contract: 'CDD',
            workArrangement: 'Sur site',
            userId: 2
        }
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

    // Sample candidates
    const candidates = [
        {
            name: 'Jean Dupont',
            title: 'Développeur Backend',
            avatar: 'https://placehold.co/100x100/7c3aed/ffffff?text=JD',
            city: 'Paris',
            lat: 48.8534,
            lon: 2.3488,
            tags: JSON.stringify(['Java', 'Spring', 'SQL']),
            softSkills: JSON.stringify(['Autonomie', 'Rigueur', 'Communication']),
            experience: 'Senior',
            availability: 'Immédiate',
            description: '8 ans d\'expérience dans le secteur financier.',
            education: JSON.stringify([{year: '2008-2011', degree: 'Master Informatique', school: 'Université Paris-Saclay'}]),
            certifications: JSON.stringify(['Oracle Java Certified', 'Spring Professional']),
            background: JSON.stringify([
                {year: '2015-2023', role: 'Développeur Senior', company: 'Banque Générale'},
                {year: '2012-2015', role: 'Développeur Java', company: 'Soft Services'}
            ])
        },
        {
            name: 'Alice Martin',
            title: 'Chef de Projet Digital',
            avatar: 'https://placehold.co/100x100/f59e0b/ffffff?text=AM',
            city: 'Lyon',
            lat: 45.7640,
            lon: 4.8357,
            tags: JSON.stringify(['Agile', 'Scrum', 'Gestion']),
            softSkills: JSON.stringify(['Leadership', 'Organisation', 'Communication']),
            experience: 'Confirmé',
            availability: 'Sous 1 mois',
            description: '5 ans d\'expérience, certifiée Scrum Master.',
            education: JSON.stringify([{year: '2013-2016', degree: 'Master Management Digital', school: 'EM Lyon'}]),
            certifications: JSON.stringify(['Scrum Master Certified', 'PMP']),
            background: JSON.stringify([
                {year: '2018-2023', role: 'Product Owner', company: 'WebAgency Lyon'},
                {year: '2016-2018', role: 'Assistante Chef de Projet', company: 'Digital Corp'}
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
