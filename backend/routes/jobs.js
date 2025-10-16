const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const db = require('../config/database');
const { auth, adminAuth, recruiterAuth } = require('../middleware/auth');

// Get all jobs
router.get('/', (req, res) => {
    const { city, industry, experience, contract, minSalary, maxSalary } = req.query;
    let query = 'SELECT * FROM jobs WHERE 1=1';
    const params = [];

    if (city) {
        query += ' AND city LIKE ?';
        params.push(`%${city}%`);
    }
    if (industry) {
        query += ' AND industry = ?';
        params.push(industry);
    }
    if (experience) {
        query += ' AND experience = ?';
        params.push(experience);
    }
    if (contract) {
        query += ' AND contract = ?';
        params.push(contract);
    }
    if (minSalary) {
        query += ' AND salary >= ?';
        params.push(parseInt(minSalary));
    }
    if (maxSalary) {
        query += ' AND salary <= ?';
        params.push(parseInt(maxSalary));
    }

    query += ' ORDER BY created_at DESC';

    db.all(query, params, (err, rows) => {
        if (err) {
            return res.status(500).json({ error: 'Error fetching jobs' });
        }

        // Parse JSON fields
        const jobs = rows.map(job => ({
            ...job,
            type: 'job',
            location: { lat: job.latitude, lon: job.longitude },
            tags: job.tags ? JSON.parse(job.tags) : [],
            softSkills: job.soft_skills ? JSON.parse(job.soft_skills) : [],
            acceptsSpontaneous: Boolean(job.accepts_spontaneous)
        }));

        res.json(jobs);
    });
});

// Get single job
router.get('/:id', (req, res) => {
    db.get('SELECT * FROM jobs WHERE id = ?', [req.params.id], (err, job) => {
        if (err || !job) {
            return res.status(404).json({ error: 'Job not found' });
        }

        res.json({
            ...job,
            type: 'job',
            location: { lat: job.latitude, lon: job.longitude },
            tags: job.tags ? JSON.parse(job.tags) : [],
            softSkills: job.soft_skills ? JSON.parse(job.soft_skills) : [],
            acceptsSpontaneous: Boolean(job.accepts_spontaneous)
        });
    });
});

// Create job
router.post('/', [auth, recruiterAuth], [
    body('title').notEmpty(),
    body('company').notEmpty(),
    body('city').notEmpty(),
    body('latitude').isFloat(),
    body('longitude').isFloat(),
    body('description').notEmpty(),
    body('experience').isIn(['Junior', 'Confirmé', 'Senior']),
    body('contract').isIn(['CDI', 'CDD', 'Alternance', 'Stage', 'Freelance'])
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const {
        title, company, logo, companyDescription, industry, city,
        latitude, longitude, description, tags, softSkills,
        experience, salary, contract, workArrangement, acceptsSpontaneous
    } = req.body;

    db.run(
        `INSERT INTO jobs (
            title, company, logo, company_description, industry, city,
            latitude, longitude, description, tags, soft_skills,
            experience, salary, contract, work_arrangement,
            accepts_spontaneous, user_id
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
            title, company, logo, companyDescription, industry, city,
            latitude, longitude, description,
            JSON.stringify(tags || []),
            JSON.stringify(softSkills || []),
            experience, salary, contract, workArrangement,
            acceptsSpontaneous ? 1 : 0,
            req.user.id
        ],
        function(err) {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Error creating job' });
            }

            // Log activity
            db.run(
                'INSERT INTO activity_log (user_id, action, entity_type, entity_id) VALUES (?, ?, ?, ?)',
                [req.user.id, 'create', 'job', this.lastID]
            );

            res.status(201).json({
                id: this.lastID,
                message: 'Job created successfully'
            });
        }
    );
});

// Update job
router.put('/:id', [auth, recruiterAuth], (req, res) => {
    // First check if user owns this job or is admin
    db.get('SELECT user_id FROM jobs WHERE id = ?', [req.params.id], (err, job) => {
        if (err || !job) {
            return res.status(404).json({ error: 'Job not found' });
        }

        if (job.user_id !== req.user.id && req.user.type !== 'admin') {
            return res.status(403).json({ error: 'Not authorized' });
        }

        const {
            title, company, logo, companyDescription, industry, city,
            latitude, longitude, description, tags, softSkills,
            experience, salary, contract, workArrangement, acceptsSpontaneous
        } = req.body;

        const updates = [];
        const values = [];

        if (title) { updates.push('title = ?'); values.push(title); }
        if (company) { updates.push('company = ?'); values.push(company); }
        if (logo !== undefined) { updates.push('logo = ?'); values.push(logo); }
        if (companyDescription !== undefined) { updates.push('company_description = ?'); values.push(companyDescription); }
        if (industry) { updates.push('industry = ?'); values.push(industry); }
        if (city) { updates.push('city = ?'); values.push(city); }
        if (latitude) { updates.push('latitude = ?'); values.push(latitude); }
        if (longitude) { updates.push('longitude = ?'); values.push(longitude); }
        if (description) { updates.push('description = ?'); values.push(description); }
        if (tags) { updates.push('tags = ?'); values.push(JSON.stringify(tags)); }
        if (softSkills) { updates.push('soft_skills = ?'); values.push(JSON.stringify(softSkills)); }
        if (experience) { updates.push('experience = ?'); values.push(experience); }
        if (salary !== undefined) { updates.push('salary = ?'); values.push(salary); }
        if (contract) { updates.push('contract = ?'); values.push(contract); }
        if (workArrangement) { updates.push('work_arrangement = ?'); values.push(workArrangement); }
        if (acceptsSpontaneous !== undefined) { updates.push('accepts_spontaneous = ?'); values.push(acceptsSpontaneous ? 1 : 0); }

        updates.push('updated_at = CURRENT_TIMESTAMP');
        values.push(req.params.id);

        db.run(
            `UPDATE jobs SET ${updates.join(', ')} WHERE id = ?`,
            values,
            function(err) {
                if (err) {
                    return res.status(500).json({ error: 'Error updating job' });
                }

                // Log activity
                db.run(
                    'INSERT INTO activity_log (user_id, action, entity_type, entity_id) VALUES (?, ?, ?, ?)',
                    [req.user.id, 'update', 'job', req.params.id]
                );

                res.json({ message: 'Job updated successfully' });
            }
        );
    });
});

// Delete job
router.delete('/:id', [auth, recruiterAuth], (req, res) => {
    // First check if user owns this job or is admin
    db.get('SELECT user_id FROM jobs WHERE id = ?', [req.params.id], (err, job) => {
        if (err || !job) {
            return res.status(404).json({ error: 'Job not found' });
        }

        if (job.user_id !== req.user.id && req.user.type !== 'admin') {
            return res.status(403).json({ error: 'Not authorized' });
        }

        db.run('DELETE FROM jobs WHERE id = ?', [req.params.id], function(err) {
            if (err) {
                return res.status(500).json({ error: 'Error deleting job' });
            }

            // Log activity
            db.run(
                'INSERT INTO activity_log (user_id, action, entity_type, entity_id) VALUES (?, ?, ?, ?)',
                [req.user.id, 'delete', 'job', req.params.id]
            );

            res.json({ message: 'Job deleted successfully' });
        });
    });
});

module.exports = router;
