const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { auth, adminAuth } = require('../middleware/auth');

// All admin routes require authentication and admin privileges
router.use(auth);
router.use(adminAuth);

// Get statistics
router.get('/stats', (req, res) => {
    const stats = {};

    db.get('SELECT COUNT(*) as count FROM users', (err, result) => {
        stats.totalUsers = result?.count || 0;

        db.get('SELECT COUNT(*) as count FROM jobs', (err, result) => {
            stats.totalJobs = result?.count || 0;

            db.get('SELECT COUNT(*) as count FROM candidates', (err, result) => {
                stats.totalCandidates = result?.count || 0;

                db.get('SELECT COUNT(*) as count FROM applications', (err, result) => {
                    stats.totalApplications = result?.count || 0;

                    db.get('SELECT COUNT(*) as count FROM users WHERE created_at >= date("now", "-30 days")', (err, result) => {
                        stats.newUsersThisMonth = result?.count || 0;

                        res.json(stats);
                    });
                });
            });
        });
    });
});

// Get all users
router.get('/users', (req, res) => {
    const { type, page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;

    let query = 'SELECT id, email, name, type, company, siret, created_at, updated_at FROM users WHERE 1=1';
    const params = [];

    if (type) {
        query += ' AND type = ?';
        params.push(type);
    }

    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), offset);

    db.all(query, params, (err, users) => {
        if (err) {
            return res.status(500).json({ error: 'Error fetching users' });
        }

        db.get('SELECT COUNT(*) as count FROM users', (err, result) => {
            res.json({
                users,
                total: result?.count || 0,
                page: parseInt(page),
                limit: parseInt(limit)
            });
        });
    });
});

// Get single user details
router.get('/users/:id', (req, res) => {
    db.get(
        'SELECT id, email, name, type, company, siret, created_at, updated_at FROM users WHERE id = ?',
        [req.params.id],
        (err, user) => {
            if (err || !user) {
                return res.status(404).json({ error: 'User not found' });
            }
            res.json(user);
        }
    );
});

// Update user
router.put('/users/:id', (req, res) => {
    const { name, type, company, siret } = req.body;
    const updates = [];
    const values = [];

    if (name) { updates.push('name = ?'); values.push(name); }
    if (type) { updates.push('type = ?'); values.push(type); }
    if (company !== undefined) { updates.push('company = ?'); values.push(company); }
    if (siret !== undefined) { updates.push('siret = ?'); values.push(siret); }

    updates.push('updated_at = CURRENT_TIMESTAMP');
    values.push(req.params.id);

    db.run(
        `UPDATE users SET ${updates.join(', ')} WHERE id = ?`,
        values,
        function(err) {
            if (err) {
                return res.status(500).json({ error: 'Error updating user' });
            }

            // Log activity
            db.run(
                'INSERT INTO activity_log (user_id, action, entity_type, entity_id) VALUES (?, ?, ?, ?)',
                [req.user.id, 'admin_update', 'user', req.params.id]
            );

            res.json({ message: 'User updated successfully' });
        }
    );
});

// Delete user
router.delete('/users/:id', (req, res) => {
    // Prevent deleting own account
    if (req.user.id === parseInt(req.params.id)) {
        return res.status(400).json({ error: 'Cannot delete your own account' });
    }

    db.run('DELETE FROM users WHERE id = ?', [req.params.id], function(err) {
        if (err) {
            return res.status(500).json({ error: 'Error deleting user' });
        }

        // Log activity
        db.run(
            'INSERT INTO activity_log (user_id, action, entity_type, entity_id) VALUES (?, ?, ?, ?)',
            [req.user.id, 'admin_delete', 'user', req.params.id]
        );

        res.json({ message: 'User deleted successfully' });
    });
});

// Get activity logs
router.get('/logs', (req, res) => {
    const { page = 1, limit = 50 } = req.query;
    const offset = (page - 1) * limit;

    db.all(
        `SELECT l.*, u.name as user_name, u.email as user_email
         FROM activity_log l
         LEFT JOIN users u ON l.user_id = u.id
         ORDER BY l.created_at DESC
         LIMIT ? OFFSET ?`,
        [parseInt(limit), offset],
        (err, logs) => {
            if (err) {
                return res.status(500).json({ error: 'Error fetching logs' });
            }

            db.get('SELECT COUNT(*) as count FROM activity_log', (err, result) => {
                res.json({
                    logs,
                    total: result?.count || 0,
                    page: parseInt(page),
                    limit: parseInt(limit)
                });
            });
        }
    );
});

// Get all jobs (admin view)
router.get('/jobs', (req, res) => {
    const { page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;

    db.all(
        `SELECT j.*, u.name as creator_name, u.email as creator_email
         FROM jobs j
         LEFT JOIN users u ON j.user_id = u.id
         ORDER BY j.created_at DESC
         LIMIT ? OFFSET ?`,
        [parseInt(limit), offset],
        (err, jobs) => {
            if (err) {
                return res.status(500).json({ error: 'Error fetching jobs' });
            }

            db.get('SELECT COUNT(*) as count FROM jobs', (err, result) => {
                res.json({
                    jobs: jobs.map(job => ({
                        ...job,
                        tags: job.tags ? JSON.parse(job.tags) : [],
                        softSkills: job.soft_skills ? JSON.parse(job.soft_skills) : []
                    })),
                    total: result?.count || 0,
                    page: parseInt(page),
                    limit: parseInt(limit)
                });
            });
        }
    );
});

// Get all candidates (admin view)
router.get('/candidates', (req, res) => {
    const { page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;

    db.all(
        `SELECT c.*, u.name as creator_name, u.email as creator_email
         FROM candidates c
         LEFT JOIN users u ON c.user_id = u.id
         ORDER BY c.created_at DESC
         LIMIT ? OFFSET ?`,
        [parseInt(limit), offset],
        (err, candidates) => {
            if (err) {
                return res.status(500).json({ error: 'Error fetching candidates' });
            }

            db.get('SELECT COUNT(*) as count FROM candidates', (err, result) => {
                res.json({
                    candidates: candidates.map(candidate => ({
                        ...candidate,
                        tags: candidate.tags ? JSON.parse(candidate.tags) : [],
                        softSkills: candidate.soft_skills ? JSON.parse(candidate.soft_skills) : []
                    })),
                    total: result?.count || 0,
                    page: parseInt(page),
                    limit: parseInt(limit)
                });
            });
        }
    );
});

// Get all applications
router.get('/applications', (req, res) => {
    const { page = 1, limit = 20, status } = req.query;
    const offset = (page - 1) * limit;

    let query = `
        SELECT a.*, 
               c.name as candidate_name, c.title as candidate_title,
               j.title as job_title, j.company as job_company
        FROM applications a
        LEFT JOIN candidates c ON a.candidate_id = c.id
        LEFT JOIN jobs j ON a.job_id = j.id
        WHERE 1=1
    `;
    const params = [];

    if (status) {
        query += ' AND a.status = ?';
        params.push(status);
    }

    query += ' ORDER BY a.created_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), offset);

    db.all(query, params, (err, applications) => {
        if (err) {
            return res.status(500).json({ error: 'Error fetching applications' });
        }

        db.get('SELECT COUNT(*) as count FROM applications', (err, result) => {
            res.json({
                applications,
                total: result?.count || 0,
                page: parseInt(page),
                limit: parseInt(limit)
            });
        });
    });
});

// Moderate content (approve/reject)
router.post('/moderate', (req, res) => {
    const { entityType, entityId, action } = req.body;

    if (!['job', 'candidate'].includes(entityType)) {
        return res.status(400).json({ error: 'Invalid entity type' });
    }

    const table = entityType === 'job' ? 'jobs' : 'candidates';
    
    // Log moderation action
    db.run(
        'INSERT INTO activity_log (user_id, action, entity_type, entity_id, details) VALUES (?, ?, ?, ?, ?)',
        [req.user.id, 'moderate', entityType, entityId, action],
        (err) => {
            if (err) {
                return res.status(500).json({ error: 'Error logging moderation' });
            }
            res.json({ message: 'Moderation action recorded' });
        }
    );
});

module.exports = router;
