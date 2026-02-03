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
    const [deletePassword, setDeletePassword] = useState("");

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    // ================= SAVE PROFILE =================
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

            // ✅ STORE NEW TOKEN
            if (data.accessToken) {
                localStorage.setItem("accessToken", data.accessToken);
            }

            // ✅ UPDATE NAVBAR NAME
            updateUserName(data.user.name);

            setMessage("Profile updated");

            setInitialName(name);
            setInitialEmail(email);
            setCurrentPassword("");
            setNewPassword("");
        }

        setLoading(false);
    }

    // ================= DELETE ACCOUNT =================
    async function handleDeleteAccount() {

        if (!deletePassword) {
            setError("Password required to delete account");
            return;
        }

        const confirmDelete = window.confirm(
            "This will permanently delete your account. Continue?"
        );

        if (!confirmDelete) return;

        const res = await apiFetch("/api/auth/delete", {
            method: "DELETE",
            body: JSON.stringify({
                currentPassword: deletePassword
            })
        });

        const data = await res.json();

        if (!res.ok) {
            setError(data.error || "Delete failed");
            return;
        }

        localStorage.clear();
        window.location.href = "/login";
    }

    // ================= CHECK CHANGES =================
    const hasChanges =
        name !== initialName ||
        email !== initialEmail ||
        newPassword.length > 0;

    return (
        <div>

            <h2>Profile</h2>

            {error && <p style={{ color: "red" }}>{error}</p>}
            {message && <p style={{ color: "green" }}>{message}</p>}

            {/* ================= PROFILE FORM ================= */}
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

            {/* ================= DELETE ACCOUNT ================= */}
            <hr />

            <h4>Danger zone</h4>

            <input
                type="password"
                placeholder="Confirm password to delete account"
                value={deletePassword}
                onChange={e => setDeletePassword(e.target.value)}
            />

            <button
                type="button"
                onClick={handleDeleteAccount}
            >
                Delete account
            </button>

        </div>
    );
}

export default Profile;
