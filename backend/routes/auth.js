const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const db = require('../config/database');
const { auth } = require('../middleware/auth');

// Register
router.post('/register', [
    body('email').isEmail(),
    body('password').isLength({ min: 6 }),
    body('name').notEmpty(),
    body('type').isIn(['candidate', 'recruiter', 'employer'])
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password, name, type, company, siret } = req.body;

    try {
        // Check if user exists
        db.get('SELECT id FROM users WHERE email = ?', [email], async (err, row) => {
            if (row) {
                return res.status(400).json({ error: 'User already exists' });
            }

            // Hash password
            const hashedPassword = await bcrypt.hash(password, 10);

            // Insert user
            db.run(
                'INSERT INTO users (email, password, name, type, company, siret) VALUES (?, ?, ?, ?, ?, ?)',
                [email, hashedPassword, name, type, company, siret],
                function(err) {
                    if (err) {
                        return res.status(500).json({ error: 'Error creating user' });
                    }

                    const token = jwt.sign(
                        { id: this.lastID, email, type },
                        process.env.JWT_SECRET,
                        { expiresIn: '7d' }
                    );

                    res.status(201).json({
                        user: { id: this.lastID, email, name, type, company },
                        token
                    });
                }
            );
        });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Login
router.post('/login', [
    body('email').isEmail(),
    body('password').notEmpty()
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
        db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
            if (err || !user) {
                return res.status(400).json({ error: 'Invalid credentials' });
            }

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(400).json({ error: 'Invalid credentials' });
            }

            const token = jwt.sign(
                { id: user.id, email: user.email, type: user.type },
                process.env.JWT_SECRET,
                { expiresIn: '7d' }
            );

            res.json({
                user: {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    type: user.type,
                    company: user.company
                },
                token
            });
        });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Get current user
router.get('/me', auth, (req, res) => {
    db.get('SELECT id, email, name, type, company, siret FROM users WHERE id = ?', [req.user.id], (err, user) => {
        if (err || !user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(user);
    });
});

// Update user profile
router.put('/profile', auth, [
    body('name').optional().notEmpty(),
    body('company').optional(),
    body('siret').optional()
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { name, company, siret } = req.body;
    const updates = [];
    const values = [];

    if (name) {
        updates.push('name = ?');
        values.push(name);
    }
    if (company !== undefined) {
        updates.push('company = ?');
        values.push(company);
    }
    if (siret !== undefined) {
        updates.push('siret = ?');
        values.push(siret);
    }

    updates.push('updated_at = CURRENT_TIMESTAMP');
    values.push(req.user.id);

    db.run(
        `UPDATE users SET ${updates.join(', ')} WHERE id = ?`,
        values,
        function(err) {
            if (err) {
                return res.status(500).json({ error: 'Error updating profile' });
            }
            res.json({ message: 'Profile updated successfully' });
        }
    );
});

module.exports = router;
