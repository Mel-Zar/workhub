import multer from "multer";
import path from "path";
import fs from "fs";
import { fileTypeFromBuffer } from "file-type";

/* ================= ENSURE UPLOAD FOLDER ================= */
const uploadDir = "uploads/";

if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

/* ================= STORAGE ================= */
const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, uploadDir);
    },
    filename(req, file, cb) {
        cb(
            null,
            Date.now() +
            "-" +
            Math.round(Math.random() * 1e9) +
            path.extname(file.originalname)
        );
    }
});

/* ================= FILE FILTER ================= */
function fileFilter(req, file, cb) {
    if (
        file.mimetype === "image/jpeg" ||
        file.mimetype === "image/png" ||
        file.mimetype === "image/webp"
    ) {
        cb(null, true);
    } else {
        cb(new Error("Only images allowed"), false);
    }
}

/* ================= MULTER INSTANCE ================= */
const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
        files: 4
    }
});

/* ================= EXTRA SECURITY (MAGIC NUMBER CHECK) ================= */
export const validateUploadedFile = async (filePath) => {
    const buffer = await fs.promises.readFile(filePath);
    const type = await fileTypeFromBuffer(buffer);

    const allowed = ["image/jpeg", "image/png", "image/webp"];

    if (!type || !allowed.includes(type.mime)) {
        await fs.promises.unlink(filePath);
        throw new Error("Invalid file type detected");
    }
};

/* ================= EXPORT ================= */
export default upload;
