const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { auth } = require('../middleware/auth');

router.use(auth);

// Get user favorites
router.get('/', (req, res) => {
    db.all(
        `SELECT f.*, 
                j.title as job_title, j.company, j.city as job_city,
                c.name as candidate_name, c.title as candidate_title, c.city as candidate_city
         FROM favorites f
         LEFT JOIN jobs j ON f.item_type = 'job' AND f.item_id = j.id
         LEFT JOIN candidates c ON f.item_type = 'candidate' AND f.item_id = c.id
         WHERE f.user_id = ?
         ORDER BY f.created_at DESC`,
        [req.user.id],
        (err, favorites) => {
            if (err) {
                return res.status(500).json({ error: 'Error fetching favorites' });
            }
            res.json(favorites);
        }
    );
});

// Add favorite
router.post('/', (req, res) => {
    const { itemId, itemType } = req.body;

    if (!['job', 'candidate'].includes(itemType)) {
        return res.status(400).json({ error: 'Invalid item type' });
    }

    // Check if already favorited
    db.get(
        'SELECT id FROM favorites WHERE user_id = ? AND item_id = ? AND item_type = ?',
        [req.user.id, itemId, itemType],
        (err, existing) => {
            if (existing) {
                return res.status(400).json({ error: 'Already in favorites' });
            }

            db.run(
                'INSERT INTO favorites (user_id, item_id, item_type) VALUES (?, ?, ?)',
                [req.user.id, itemId, itemType],
                function(err) {
                    if (err) {
                        return res.status(500).json({ error: 'Error adding favorite' });
                    }
                    res.status(201).json({ id: this.lastID, message: 'Added to favorites' });
                }
            );
        }
    );
});

// Remove favorite
router.delete('/:id', (req, res) => {
    db.run(
        'DELETE FROM favorites WHERE id = ? AND user_id = ?',
        [req.params.id, req.user.id],
        function(err) {
            if (err) {
                return res.status(500).json({ error: 'Error removing favorite' });
            }
            if (this.changes === 0) {
                return res.status(404).json({ error: 'Favorite not found' });
            }
            res.json({ message: 'Removed from favorites' });
        }
    );
});

// Remove favorite by item
router.delete('/item/:itemType/:itemId', (req, res) => {
    db.run(
        'DELETE FROM favorites WHERE user_id = ? AND item_id = ? AND item_type = ?',
        [req.user.id, req.params.itemId, req.params.itemType],
        function(err) {
            if (err) {
                return res.status(500).json({ error: 'Error removing favorite' });
            }
            res.json({ message: 'Removed from favorites' });
        }
    );
});

module.exports = router;
