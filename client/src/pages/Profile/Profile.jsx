import { useState, useContext } from "react";
import { toast } from "react-toastify";
import { AuthContext } from "../../context/AuthContext/AuthContext";
import { authService } from "../../services/authService";
import "./Profile.scss"

function capitalizeFirst(value) {
    if (!value) return "";
    return value.charAt(0).toUpperCase() + value.slice(1);
}

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
                    <p>Är du säker på att du vill uppdatera profilen?</p>
                    <button
                        onClick={async () => {
                            closeToast();
                            setLoading(true);

                            try {
                                const payload = {
                                    name: capitalizeFirst(name),
                                    email: email.toLowerCase(),
                                };

                                if (newPassword) {
                                    payload.currentPassword = currentPassword;
                                    payload.newPassword = newPassword;
                                }

                                const data = await authService.updateProfile(payload);

                                if (data.accessToken) {
                                    localStorage.setItem("accessToken", data.accessToken);
                                }

                                setUser(data.user);

                                toast.success("Profil uppdaterad ✅");
                                setInitialName(name);
                                setInitialEmail(email);
                                setCurrentPassword("");
                                setNewPassword("");
                            } catch (err) {
                                toast.error(err.message || "Serverfel vid uppdatering");
                            } finally {
                                setLoading(false);
                            }
                        }}
                    >
                        Ja
                    </button>
                    <button onClick={closeToast}>Avbryt</button>
                </div>
            ),
            { autoClose: false }
        );
    }

    function handleDeleteAccount() {
        if (!deletePassword) {
            toast.error("Lösenord krävs för att radera konto");
            return;
        }

        toast.error(
            ({ closeToast }) => (
                <div>
                    <p>⚠️ Är du säker på att du vill radera kontot?</p>
                    <button
                        onClick={async () => {
                            closeToast();
                            setLoading(true);

                            try {
                                await authService.deleteAccount(deletePassword);
                                toast.success("Kontot raderat");
                                localStorage.clear();
                                setTimeout(() => (window.location.href = "/login"), 1000);
                            } catch (err) {
                                toast.error(err.message || "Serverfel vid radering");
                            } finally {
                                setLoading(false);
                            }
                        }}
                    >
                        Ja, radera
                    </button>
                    <button onClick={closeToast}>Avbryt</button>
                </div>
            ),
            { autoClose: false }
        );
    }

    const hasChanges =
        name !== initialName || email !== initialEmail || newPassword.length > 0;

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
                                onChange={e => setName(capitalizeFirst(e.target.value))}
                                placeholder="Name"
                            />
                        </div>

                        <div className="input-group">
                            <label>Email</label>
                            <input
                                value={email}
                                onChange={e => setEmail(e.target.value.toLowerCase())}
                                placeholder="Email"
                            />
                        </div>
                    </div>

                    <div className="form-section">
                        <h4>Change Password</h4>

                        <div className="input-group">
                            <label>New Password</label>
                            <input
                                type={showNewPassword ? "text" : "password"}
                                value={newPassword}
                                onChange={e => setNewPassword(e.target.value)}
                                placeholder="New password"
                            />
                        </div>

                        <div className="checkbox-row">
                            <input
                                type="checkbox"
                                checked={showNewPassword}
                                onChange={() => setShowNewPassword(!showNewPassword)}
                            />
                            <span>Show password</span>
                        </div>
                    </div>

                    <div className="form-section">
                        <h4>Confirm Identity</h4>

                        <div className="input-group">
                            <label>Current Password</label>
                            <input
                                type={showCurrentPassword ? "text" : "password"}
                                value={currentPassword}
                                onChange={e => setCurrentPassword(e.target.value)}
                                required={newPassword.length > 0}
                                placeholder="Current password"
                            />
                        </div>

                        <div className="checkbox-row">
                            <input
                                type="checkbox"
                                checked={showCurrentPassword}
                                onChange={() => setShowCurrentPassword(!showCurrentPassword)}
                            />
                            <span>Show password</span>
                        </div>
                    </div>

                    <button
                        className="primary-button"
                        disabled={!hasChanges || loading}
                    >
                        {loading ? "Saving..." : "Save changes"}
                    </button>

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
                        <input
                            type={showDeletePassword ? "text" : "password"}
                            value={deletePassword}
                            onChange={e => setDeletePassword(e.target.value)}
                            placeholder="Password"
                        />
                    </div>

                    <div className="checkbox-row">
                        <input
                            type="checkbox"
                            checked={showDeletePassword}
                            onChange={() => setShowDeletePassword(!showDeletePassword)}
                        />
                        <span>Show password</span>
                    </div>

                    <button
                        type="button"
                        className="danger-button"
                        disabled={loading}
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
