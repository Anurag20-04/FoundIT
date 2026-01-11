import { useEffect, useState } from "react";
import api from "../utils/axios";
import { useAuth } from "../context/AuthContext";
import "./Profile.css";
import avatarDefault from "../assets/Portrait_Placeholder.png";

export default function Profile() {
  const { user, updateUser } = useAuth();

  const [form, setForm] = useState({
    name: "",
    phoneNumber: "",
    address: "",
  });

  const [profileImageFile, setProfileImageFile] = useState(null);
  const [profileImagePreview, setProfileImagePreview] = useState("");

  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  /* =========================
     INIT FORM FROM AUTH
  ========================= */
   useEffect(() => {
    if (!user) return;

    setForm({
      name: user.name || "",
      phoneNumber: user.phoneNumber || "",
      address: user.address || "",
    });

    setProfileImagePreview(
      user.profileImage
        ? `${BACKEND_URL}${user.profileImage}`
        : avatarDefault
    );
  }, [user]);


  /* =========================
     CLEAN OBJECT URL
  ========================= */
  useEffect(() => {
    return () => {
      if (profileImagePreview?.startsWith("blob:")) {
        URL.revokeObjectURL(profileImagePreview);
      }
    };
  }, [profileImagePreview]);

  if (!user) return null;

  /* =========================
     HANDLERS
  ========================= */
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setSuccess(false);
    setError(null);
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setProfileImageFile(file);
    setProfileImagePreview(URL.createObjectURL(file));
    setSuccess(false);
    setError(null);
  };

  /* =========================
     SAVE PROFILE
  ========================= */
  const handleSave = async () => {
    try {
      setSaving(true);
      setSuccess(false);
      setError(null);

      const formData = new FormData();
      formData.append("name", form.name || user.name);
      formData.append("phoneNumber", form.phoneNumber || user.phoneNumber);
      formData.append("address", form.address || user.address);

      if (profileImageFile) {
  formData.append("profileImage", profileImageFile); // ✅ Matches backend middleware
}

      const res = await api.put("/users/me", formData);

      updateUser(res.data.user);

      setProfileImagePreview(
        res.data.user.profileImage || avatarDefault
      );

      setSuccess(true);
      setProfileImageFile(null);

    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message ||
        "Unable to update profile. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="profile-page">
      <div className="profile-card">
        <h1>Your Profile</h1>

        <div className="avatar-section">
          <img
            src={profileImagePreview || avatarDefault}
            alt="Avatar"
            className="profile-avatar-lg"
          />

          <label className="avatar-upload-btn">
            Change Avatar
            <input
              type="file"
              accept="image/*"
              hidden
              onChange={handleImageChange}
            />
          </label>
        </div>

        <div className="profile-grid">
          <div className="profile-field">
            <label>Name</label>
            <input name="name" value={form.name} onChange={handleChange} />
          </div>

          <div className="profile-field">
            <label>Phone Number</label>
            <input
              name="phoneNumber"
              value={form.phoneNumber}
              onChange={handleChange}
            />
          </div>

          <div className="profile-field">
            <label>Address</label>
            <input
              name="address"
              value={form.address}
              onChange={handleChange}
            />
          </div>
        </div>

        {success && (
          <p className="profile-status success">
            Profile updated successfully
          </p>
        )}
        {error && (
          <p className="profile-status error">{error}</p>
        )}

        <button
          className="profile-save-btn"
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
}
