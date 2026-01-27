const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ error: "No token provided" });
        }

        const token = authHeader.split(" ")[1]; // "Bearer <token>"
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret");

        // Lagra användarens ID på requesten
        req.user = { id: decoded.id };

        next();
    } catch (err) {
        console.error("Auth middleware error:", err);
        res.status(401).json({ error: "Token not valid" });
    }
};

module.exports = auth;
