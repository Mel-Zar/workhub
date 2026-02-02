import jwt from "jsonwebtoken";

const auth = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ error: "No token" });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
        return res.status(401).json({ error: "No token" });
    }

    try {
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET || "secret"
        );

        req.user = { id: decoded.id };
        next();

    } catch (err) {

        // ✅ INGEN console.error här
        if (err.name === "TokenExpiredError") {
            return res.status(401).json({ error: "expired" });
        }

        return res.status(401).json({ error: "invalid" });
    }
};

export default auth;
