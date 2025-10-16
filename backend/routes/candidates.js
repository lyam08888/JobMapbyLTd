const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const db = require('../config/database');
const { auth, adminAuth } = require('../middleware/auth');

// Get all candidates
router.get('/', (req, res) => {
    const { city, experience, tags } = req.query;
    let query = 'SELECT * FROM candidates WHERE 1=1';
    const params = [];

    if (city) {
        query += ' AND city LIKE ?';
        params.push(`%${city}%`);
    }
    if (experience) {
        query += ' AND experience = ?';
        params.push(experience);
    }
    if (tags) {
        query += ' AND tags LIKE ?';
        params.push(`%${tags}%`);
    }

    query += ' ORDER BY created_at DESC';

    db.all(query, params, (err, rows) => {
        if (err) {
            return res.status(500).json({ error: 'Error fetching candidates' });
        }

        // Parse JSON fields
        const candidates = rows.map(candidate => ({
            ...candidate,
            type: 'candidate',
            location: { lat: candidate.latitude, lon: candidate.longitude },
            tags: candidate.tags ? JSON.parse(candidate.tags) : [],
            softSkills: candidate.soft_skills ? JSON.parse(candidate.soft_skills) : [],
            education: candidate.education ? JSON.parse(candidate.education) : [],
            certifications: candidate.certifications ? JSON.parse(candidate.certifications) : [],
            background: candidate.background ? JSON.parse(candidate.background) : []
        }));

        res.json(candidates);
    });
});

// Get single candidate
router.get('/:id', (req, res) => {
    db.get('SELECT * FROM candidates WHERE id = ?', [req.params.id], (err, candidate) => {
        if (err || !candidate) {
            return res.status(404).json({ error: 'Candidate not found' });
        }

        res.json({
            ...candidate,
            type: 'candidate',
            location: { lat: candidate.latitude, lon: candidate.longitude },
            tags: candidate.tags ? JSON.parse(candidate.tags) : [],
            softSkills: candidate.soft_skills ? JSON.parse(candidate.soft_skills) : [],
            education: candidate.education ? JSON.parse(candidate.education) : [],
            certifications: candidate.certifications ? JSON.parse(candidate.certifications) : [],
            background: candidate.background ? JSON.parse(candidate.background) : []
        });
    });
});

// Create candidate
router.post('/', auth, [
    body('name').notEmpty(),
    body('title').notEmpty(),
    body('city').notEmpty(),
    body('latitude').isFloat(),
    body('longitude').isFloat(),
    body('experience').isIn(['Junior', 'Confirmé', 'Senior'])
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const {
        name, title, avatar, city, latitude, longitude,
        tags, softSkills, experience, availability,
        portfolioLink, education, certifications, background, description
    } = req.body;

    db.run(
        `INSERT INTO candidates (
            name, title, avatar, city, latitude, longitude,
            tags, soft_skills, experience, availability,
            portfolio_link, education, certifications, background,
            description, user_id
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
            name, title, avatar, city, latitude, longitude,
            JSON.stringify(tags || []),
            JSON.stringify(softSkills || []),
            experience, availability, portfolioLink,
            JSON.stringify(education || []),
            JSON.stringify(certifications || []),
            JSON.stringify(background || []),
            description, req.user.id
        ],
        function(err) {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Error creating candidate' });
            }

            // Log activity
            db.run(
                'INSERT INTO activity_log (user_id, action, entity_type, entity_id) VALUES (?, ?, ?, ?)',
                [req.user.id, 'create', 'candidate', this.lastID]
            );

            res.status(201).json({
                id: this.lastID,
                message: 'Candidate profile created successfully'
            });
        }
    );
});

// Update candidate
router.put('/:id', auth, (req, res) => {
    // First check if user owns this candidate profile or is admin
    db.get('SELECT user_id FROM candidates WHERE id = ?', [req.params.id], (err, candidate) => {
        if (err || !candidate) {
            return res.status(404).json({ error: 'Candidate not found' });
        }

        if (candidate.user_id !== req.user.id && req.user.type !== 'admin') {
            return res.status(403).json({ error: 'Not authorized' });
        }

        const {
            name, title, avatar, city, latitude, longitude,
            tags, softSkills, experience, availability,
            portfolioLink, education, certifications, background, description
        } = req.body;

        const updates = [];
        const values = [];

        if (name) { updates.push('name = ?'); values.push(name); }
        if (title) { updates.push('title = ?'); values.push(title); }
        if (avatar !== undefined) { updates.push('avatar = ?'); values.push(avatar); }
        if (city) { updates.push('city = ?'); values.push(city); }
        if (latitude) { updates.push('latitude = ?'); values.push(latitude); }
        if (longitude) { updates.push('longitude = ?'); values.push(longitude); }
        if (tags) { updates.push('tags = ?'); values.push(JSON.stringify(tags)); }
        if (softSkills) { updates.push('soft_skills = ?'); values.push(JSON.stringify(softSkills)); }
        if (experience) { updates.push('experience = ?'); values.push(experience); }
        if (availability) { updates.push('availability = ?'); values.push(availability); }
        if (portfolioLink !== undefined) { updates.push('portfolio_link = ?'); values.push(portfolioLink); }
        if (education) { updates.push('education = ?'); values.push(JSON.stringify(education)); }
        if (certifications) { updates.push('certifications = ?'); values.push(JSON.stringify(certifications)); }
        if (background) { updates.push('background = ?'); values.push(JSON.stringify(background)); }
        if (description) { updates.push('description = ?'); values.push(description); }

        updates.push('updated_at = CURRENT_TIMESTAMP');
        values.push(req.params.id);

        db.run(
            `UPDATE candidates SET ${updates.join(', ')} WHERE id = ?`,
            values,
            function(err) {
                if (err) {
                    return res.status(500).json({ error: 'Error updating candidate' });
                }

                // Log activity
                db.run(
                    'INSERT INTO activity_log (user_id, action, entity_type, entity_id) VALUES (?, ?, ?, ?)',
                    [req.user.id, 'update', 'candidate', req.params.id]
                );

                res.json({ message: 'Candidate profile updated successfully' });
            }
        );
    });
});

// Delete candidate
router.delete('/:id', auth, (req, res) => {
    // First check if user owns this candidate profile or is admin
    db.get('SELECT user_id FROM candidates WHERE id = ?', [req.params.id], (err, candidate) => {
        if (err || !candidate) {
            return res.status(404).json({ error: 'Candidate not found' });
        }

        if (candidate.user_id !== req.user.id && req.user.type !== 'admin') {
            return res.status(403).json({ error: 'Not authorized' });
        }

        db.run('DELETE FROM candidates WHERE id = ?', [req.params.id], function(err) {
            if (err) {
                return res.status(500).json({ error: 'Error deleting candidate' });
            }

            // Log activity
            db.run(
                'INSERT INTO activity_log (user_id, action, entity_type, entity_id) VALUES (?, ?, ?, ?)',
                [req.user.id, 'delete', 'candidate', req.params.id]
            );

            res.json({ message: 'Candidate profile deleted successfully' });
        });
    });
});

module.exports = router;
