import jwt from "jsonwebtoken";

const auth = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ error: "No token provided" });
        }

        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret");

        req.user = { id: decoded.id };
        next();
    } catch (err) {
        console.error("Auth middleware error:", err);
        res.status(401).json({ error: "Token not valid" });
    }
};

export default auth;
