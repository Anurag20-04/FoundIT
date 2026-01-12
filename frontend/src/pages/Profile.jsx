import { useEffect, useState } from "react";
import api from "../utils/axios";
import { useAuth } from "../context/AuthContext";
import "./Profile.css";
import avatarDefault from "../assets/Portrait_Placeholder.png";

const BACKEND_URL = import.meta.env.VITE_API_URL || "";

/* =========================
   IMAGE RESOLVER
========================= */
const resolveImage = (img) => {
  if (!img) return avatarDefault;
  if (img.startsWith("http")) return img;
  return `${BACKEND_URL}${img}`;
};

/* =========================
   PHONE VALIDATION (INDIA)
========================= */
const isValidIndianPhone = (phone) => {
  if (!phone) return true; // optional
  return /^[6-9]\d{9}$/.test(phone);
};

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
     REPORTED ITEMS
  ========================= */
  const [myItems, setMyItems] = useState([]);
  const [itemsLoading, setItemsLoading] = useState(true);

  /* =========================
     INIT FROM AUTH
  ========================= */
  useEffect(() => {
    if (!user) return;

    setForm({
      name: user.name || "",
      phoneNumber: user.phoneNumber || "",
      address: user.address || "",
    });

    setProfileImagePreview(resolveImage(user.profileImage));
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

  /* =========================
     FETCH MY ITEMS
  ========================= */
  useEffect(() => {
    if (!user) return;

    const fetchMyItems = async () => {
      try {
        const res = await api.get("/users/me/items");

        setMyItems(res.data.data || []);
      } catch (err) {
        console.error("Fetch my items failed", err);
      } finally {
        setItemsLoading(false);
      }
    };

    fetchMyItems();
  }, [user]);

  if (!user) return null;

  /* =========================
     HANDLERS
  ========================= */
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "phoneNumber") {
      if (!/^\d*$/.test(value)) return; // only numbers
      if (value.length > 10) return;   // hard limit
    }

    setForm({ ...form, [name]: value });
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

      if (!isValidIndianPhone(form.phoneNumber)) {
        setSaving(false);
        return setError("Enter a valid 10-digit Indian mobile number");
      }

      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("phoneNumber", form.phoneNumber || "");
      formData.append("address", form.address || "");

      if (profileImageFile) {
        formData.append("profileImage", profileImageFile);
      }

      const res = await api.put("/users/me", formData);

      updateUser(res.data.user);

      setProfileImagePreview(
        resolveImage(res.data.user.profileImage) + `?t=${Date.now()}`
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

  /* =========================
     DELETE ITEM
  ========================= */
  const handleDeleteItem = async (id) => {
    if (!window.confirm("Mark this item as resolved and remove it?")) return;

    try {
      await api.delete(`/users/me/items/${id}`);

      setMyItems(prev => prev.filter(i => i._id !== id));
    } catch (err) {
      console.error("Delete item failed", err);
      alert("Unable to remove item");
    }
  };

  /* =========================
     UI
  ========================= */
  return (
    <div className="profile-page">
      <div className="profile-card">
        <h1>Your Profile</h1>

        {/* ---------- AVATAR ---------- */}
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

        {/* ---------- FORM ---------- */}
        <div className="profile-grid">
          <div className="profile-field">
            <label>Name</label>
            <input name="name" value={form.name} onChange={handleChange} />
          </div>

          <div className="profile-field">
            <label>Phone Number</label>
            <input
              name="phoneNumber"
              placeholder="10-digit mobile number"
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

        {/* ---------- MY ITEMS ---------- */}
        <div className="profile-items-section">
          <h2>My Reported Items</h2>

          {itemsLoading ? (
            <p className="muted">Loading your items…</p>
          ) : myItems.length === 0 ? (
            <p className="muted">You have not reported any items yet.</p>
          ) : (
            <div className="my-items-grid">
              {myItems.map(item => (
                <div key={item._id} className="my-item-card">
                  <img
                    src={resolveImage(item.images?.[0])}
                    alt=""
                  />
                  <div className="my-item-info">
                    <h4>{item.title}</h4>
                    <p>{item.itemType} · {item.category}</p>
                    <button
                      className="remove-item-btn"
                      onClick={() => handleDeleteItem(item._id)}
                    >
                      Mark as resolved
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
