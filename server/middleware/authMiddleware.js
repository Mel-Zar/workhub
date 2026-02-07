import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {

    const authHeader = req.headers.authorization;

    console.log("🔐 Auth header:", authHeader);

    if (!authHeader) {
        return res.status(401).json({ error: "No token provided" });
    }

    if (!authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ error: "Invalid token format" });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
        return res.status(401).json({ error: "No token provided" });
    }

    try {
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET || "secret"
        );

        // ✅ force id format
        req.user = {
            id: decoded.id,
            name: decoded.name,
            email: decoded.email
        };

        next();

    } catch (err) {

        if (err.name === "TokenExpiredError") {
            return res.status(401).json({ error: "Token expired" });
        }

        if (err.name === "JsonWebTokenError") {
            return res.status(401).json({ error: "Invalid token" });
        }

        return res.status(401).json({ error: "Not authorized" });
    }
};

export default authMiddleware;
