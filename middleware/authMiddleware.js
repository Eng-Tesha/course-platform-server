const jwt = require('jsonwebtoken');

// ─── PROTECT ROUTE (must be logged in) ──────────────────
exports.protect = (req, res, next) => {
  try {
    // 1. Get token from request header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No token, access denied' });
    }

    // 2. Extract the token (remove "Bearer " from the start)
    const token = authHeader.split(' ')[1];

    // 3. Verify the token using your JWT secret
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 4. Attach the user info to the request
    req.user = decoded;

    // 5. Move on to the next function
    next();

  } catch (error) {
    res.status(401).json({ message: 'Token is invalid or expired' });
  }
};

// ─── ADMIN ONLY ──────────────────────────────────────────
exports.adminOnly = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access only' });
  }
  next();
};