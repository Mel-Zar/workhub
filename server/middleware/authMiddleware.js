import jwt from "jsonwebtoken";

const auth = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        // Kontrollera om Authorization-header finns
        if (!authHeader) {
            return res.status(401).json({ error: "No token provided" });
        }

        // Kontrollera Bearer-format
        if (!authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ error: "Invalid token format" });
        }

        const token = authHeader.split(" ")[1];

        if (!token) {
            return res.status(401).json({ error: "No token provided" });
        }

        // Verifiera token
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET || "secret"
        );

        // ✅ Spara hela payloaden
        req.user = decoded;

        next(); // gå vidare till nästa middleware / route

    } catch (err) {
        console.error("Auth middleware error:", err);

        if (err.name === "TokenExpiredError") {
            return res.status(401).json({ error: "Token expired. Please login again." });
        }

        if (err.name === "JsonWebTokenError") {
            return res.status(401).json({ error: "Invalid token" });
        }

        // generellt fel
        return res.status(401).json({ error: "Not authorized" });
    }
};

export default auth;
