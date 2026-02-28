import { useState, useContext } from "react";
import { toast } from "react-toastify";
import { AuthContext } from "../../context/AuthContext/AuthContext";
import { authService } from "../../services/authService";
import jwtDecode from "jwt-decode";
import { capitalize } from "../../utils/formatters";
import "./Profile.scss";

function getUserFromToken() {
    const token = localStorage.getItem("accessToken");
    if (!token) return { name: "", email: "" };

    try {
        const payload = jwtDecode(token);
        return {
            name: payload.name || "",
            email: payload.email || ""
        };
    } catch (err) {
        console.error("Invalid token:", err);
        return { name: "", email: "" };
    }
}

function Profile() {
    const { setUser } = useContext(AuthContext);
    const user = getUserFromToken();

    const [name, setName] = useState(user.name);
    const [email, setEmail] = useState(user.email);
    const [initialName, setInitialName] = useState(user.name);
    const [initialEmail, setInitialEmail] = useState(user.email);

    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [deletePassword, setDeletePassword] = useState("");

    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showDeletePassword, setShowDeletePassword] = useState(false);

    const [loading, setLoading] = useState(false);

    function handleSubmit(e) {
        e.preventDefault();

        toast.info(
            ({ closeToast }) => (
                <div>
                    <p>Are you sure you want to update your profile?</p>
                    <button
                        onClick={async () => {
                            closeToast();
                            setLoading(true);

                            try {
                                const payload = {
                                    name: capitalize(name),
                                    email: email.trim().toLowerCase(),
                                    currentPassword,
                                };

                                if (newPassword) {
                                    payload.newPassword = newPassword;
                                }

                                const data = await authService.updateProfile(payload);

                                if (data.accessToken) {
                                    localStorage.setItem("accessToken", data.accessToken);
                                }

                                setUser(data.user);

                                toast.success("Profile updated ✅");
                                setInitialName(name);
                                setInitialEmail(email);
                                setCurrentPassword("");
                                setNewPassword("");
                            } catch (err) {
                                toast.error(err.message || "Server error during update");
                            } finally {
                                setLoading(false);
                            }
                        }}
                    >
                        Yes
                    </button>
                    <button onClick={closeToast}>Cancel</button>
                </div>
            ),
            { autoClose: false }
        );
    }

    function handleDeleteAccount() {
        if (!deletePassword) {
            toast.error("Password required to delete account");
            return;
        }

        toast.error(
            ({ closeToast }) => (
                <div>
                    <p>⚠️ Are you sure you want to delete your account?</p>
                    <button
                        onClick={async () => {
                            closeToast();
                            setLoading(true);

                            try {
                                await authService.deleteAccount(deletePassword);
                                toast.success("Account deleted");
                                localStorage.clear();
                                setTimeout(() => (window.location.href = "/login"), 1000);
                            } catch (err) {
                                toast.error(err.message || "Server error during deletion");
                            } finally {
                                setLoading(false);
                            }
                        }}
                    >
                        Yes, delete
                    </button>
                    <button onClick={closeToast}>Cancel</button>
                </div>
            ),
            { autoClose: false }
        );
    }

    const hasChanges =
        (name !== initialName || email !== initialEmail || newPassword.length > 0) && currentPassword;

    return (
        <div className="profile-page page">

            <div className="profile-card card">
                <div className="profile-header">
                    <h2>Profile Settings</h2>
                    <p>Manage your account information and security</p>
                </div>

                <form className="profile-form" onSubmit={handleSubmit}>

                    <div className="form-section">
                        <h4>Profile Information</h4>

                        <div className="input-group">
                            <label>Name</label>
                            <input
                                value={name}
                                onChange={e => setName(e.target.value)}
                                placeholder="Name"
                            />
                        </div>

                        <div className="input-group">
                            <label>Email</label>
                            <input
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                placeholder="Email"
                            />
                        </div>
                    </div>

                    <div className="section-divider" />

                    <div className="form-section">
                        <h4>Change Password</h4>

                        <div className="input-group">
                            <label>New Password</label>
                            <div className="password-field">
                                <input
                                    type={showNewPassword ? "text" : "password"}
                                    value={newPassword}
                                    onChange={e => setNewPassword(e.target.value)}
                                    placeholder="New password"
                                />
                                <button
                                    type="button"
                                    className="eye-toggle"
                                    onClick={() => setShowNewPassword(!showNewPassword)}
                                >
                                    {showNewPassword ? "🙈" : "👁"}
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="section-divider" />

                    <div className="form-section">
                        <h4>Confirm Identity</h4>

                        <div className="input-group">
                            <label>Current Password</label>
                            <div className="password-field">
                                <input
                                    type={showCurrentPassword ? "text" : "password"}
                                    value={currentPassword}
                                    onChange={e => setCurrentPassword(e.target.value)}
                                    required
                                    placeholder="Current password"
                                />
                                <button
                                    type="button"
                                    className="eye-toggle"
                                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                >
                                    {showCurrentPassword ? "🙈" : "👁"}
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="sticky-save">
                        <button
                            className="primary-button"
                            disabled={!hasChanges || loading}
                        >
                            {loading ? "Saving..." : "Save changes"}
                        </button>
                    </div>

                </form>
            </div>

            <div className="danger-zone card">
                <div className="danger-header">
                    <h4>Danger Zone</h4>
                    <p>This action cannot be undone</p>
                </div>

                <div className="form-section">

                    <div className="input-group">
                        <label>Confirm Password</label>
                        <div className="password-field">
                            <input
                                type={showDeletePassword ? "text" : "password"}
                                value={deletePassword}
                                onChange={e => setDeletePassword(e.target.value)}
                                placeholder="Password"
                            />
                            <button
                                type="button"
                                className="eye-toggle"
                                onClick={() => setShowDeletePassword(!showDeletePassword)}
                            >
                                {showDeletePassword ? "🙈" : "👁"}
                            </button>
                        </div>
                    </div>

                    <button
                        type="button"
                        className="danger-button"
                        disabled={!deletePassword || loading}
                        onClick={handleDeleteAccount}
                    >
                        Delete Account
                    </button>

                </div>
            </div>

        </div>
    );
}

export default Profile;
