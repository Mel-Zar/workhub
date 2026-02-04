import jwt from "jsonwebtoken";

const auth = (req, res, next) => {
    const authHeader = req.headers.authorization;

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

        req.user = decoded;
        next();

    } catch (err) {

        // ⛔ token expired = NORMAL
        if (err.name === "TokenExpiredError") {
            return res.status(401).json({ error: "Token expired" });
        }

        // ⛔ invalid token
        if (err.name === "JsonWebTokenError") {
            return res.status(401).json({ error: "Invalid token" });
        }

        // ⛔ everything else
        return res.status(401).json({ error: "Not authorized" });
    }
};

export default auth;
