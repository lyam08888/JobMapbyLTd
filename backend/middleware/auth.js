const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        
        if (!token) {
            return res.status(401).json({ error: 'Authentication required' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ error: 'Invalid token' });
    }
};

const adminAuth = (req, res, next) => {
    if (req.user && req.user.type === 'admin') {
        next();
    } else {
        res.status(403).json({ error: 'Admin access required' });
    }
};

const recruiterAuth = (req, res, next) => {
    if (req.user && (req.user.type === 'recruiter' || req.user.type === 'employer' || req.user.type === 'admin')) {
        next();
    } else {
        res.status(403).json({ error: 'Recruiter access required' });
    }
};

module.exports = { auth, adminAuth, recruiterAuth };
