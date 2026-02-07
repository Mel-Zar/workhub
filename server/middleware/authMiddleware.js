import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ error: "No token provided or invalid format" });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
        return res.status(401).json({ error: "No token provided" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret");

        // ✅ Lägg decoded info i req.user
        req.user = {
            id: decoded.id,
            name: decoded.name,
            email: decoded.email
        };

        next();
    } catch (err) {
        // ✅ Token expired → frontend kommer refresha
        if (err.name === "TokenExpiredError") {
            return res.status(401).json({ error: "Token expired" });
        }

        // ✅ Ogiltig token
        if (err.name === "JsonWebTokenError") {
            return res.status(401).json({ error: "Invalid token" });
        }

        return res.status(401).json({ error: "Not authorized" });
    }
};

export default authMiddleware;
