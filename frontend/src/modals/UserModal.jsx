import React from "react";

function UserModal({ setShowModal, handleCreate, formData, setFormData, editingUser }) {
  return (
    <div className="popup-overlay">
      <div className="popup-box">

        <div className="modal-header">
          <h2>{editingUser ? "Edit User" : "Create User"}</h2>
          <button onClick={() => setShowModal(false)}>✕</button>
        </div>

        <form onSubmit={handleCreate} className="modal-body">

          <input
            type="text"
            placeholder="Username"
            value={formData.username || ""}
            onChange={(e) =>
              setFormData({ ...formData, username: e.target.value })
            }
            required
          />

          {!editingUser && (
            <input
              type="password"
              placeholder="Password"
              value={formData.password_hash || ""}
              onChange={(e) =>
                setFormData({ ...formData, password_hash: e.target.value })
              }
              required
            />
          )}

          <select
            value={formData.role || "user"}
            onChange={(e) =>
              setFormData({ ...formData, role: e.target.value })
            }
          >
            <option value="user">Team</option>
            <option value="manager">Manager</option>
            <option value="admin">Admin</option>
          </select>

          <button className="btn-primary">
            {editingUser ? "Update" : "Create"}
          </button>

        </form>
      </div>
    </div>
  );
}

export default UserModal;