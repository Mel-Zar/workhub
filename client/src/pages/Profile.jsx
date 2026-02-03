import { useState, useContext } from "react";
import { apiFetch } from "../api/ApiFetch";
import { AuthContext } from "../context/AuthContext";

// ================= LOAD USER FROM TOKEN =================
function getUserFromToken() {
    const token = localStorage.getItem("accessToken");
    if (!token) return { name: "", email: "" };

    try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        return {
            name: payload.name || "",
            email: payload.email || ""
        };
    } catch {
        return { name: "", email: "" };
    }
}

function Profile() {

    // ✅ FROM CONTEXT
    const { updateUserName } = useContext(AuthContext);

    const user = getUserFromToken();

    const [name, setName] = useState(user.name);
    const [email, setEmail] = useState(user.email);

    const [initialName, setInitialName] = useState(user.name);
    const [initialEmail, setInitialEmail] = useState(user.email);

    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    // ================= SAVE =================
    async function handleSubmit(e) {
        e.preventDefault();

        setLoading(true);
        setError("");
        setMessage("");

        const res = await apiFetch("/api/auth/profile", {
            method: "PUT",
            body: JSON.stringify({
                name,
                email,
                currentPassword,
                newPassword
            })
        });

        const data = await res.json();

        if (!res.ok) {
            setError(data.error || "Something went wrong");
        } else {

            // ✅ SAVE NEW TOKEN
            if (data.accessToken) {
                localStorage.setItem("accessToken", data.accessToken);
            }

            // ✅ UPDATE NAVBAR INSTANTLY
            updateUserName(data.user.name);

            setMessage("Profile updated");

            setInitialName(name);
            setInitialEmail(email);
            setCurrentPassword("");
            setNewPassword("");
        }

        setLoading(false);
    }

    // ================= CHECK CHANGES =================
    const hasChanges =
        name !== initialName ||
        email !== initialEmail ||
        newPassword.length > 0;

    return (
        <div>

            <h2>Profile</h2>

            {error && <p>{error}</p>}
            {message && <p>{message}</p>}

            <form onSubmit={handleSubmit}>

                <h4>Profile info</h4>

                <input
                    placeholder="Name"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    autoComplete="name"
                />

                <input
                    placeholder="Email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    autoComplete="email"
                />

                <h4>Change password</h4>

                <input
                    type="password"
                    placeholder="New password"
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    autoComplete="new-password"
                />

                <h4>Confirm identity</h4>

                <input
                    type="password"
                    placeholder="Current password (required)"
                    value={currentPassword}
                    onChange={e => setCurrentPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                />

                <button disabled={!hasChanges || loading}>
                    {loading ? "Saving..." : "Save"}
                </button>

            </form>

        </div>
    );
}

export default Profile;
