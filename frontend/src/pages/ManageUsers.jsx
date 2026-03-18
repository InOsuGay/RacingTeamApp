import React, { useState } from "react";
import Popup from "../components/Popup";

function ManageUsers({
  data,
  loading,
  handleCreate,
  handleDelete,
  handleUpdate,
  formData,
  setFormData
}) {

  const [showModal, setShowModal] = useState(false);
  const [editData, setEditData] = useState(null);

  const emptyForm = {
    username: "",
    password: "",
    role: "user"
  };

  const openCreate = () => {
    setEditData(null);
    setFormData(emptyForm);
    setShowModal(true);
  };

  const openEdit = (u) => {
    setEditData(u);
    setFormData({
      user_id: u.user_id,
      username: u.username,
      role: u.role,
      password: ""
    });
    setShowModal(true);
  };

  return (
    <div>

      <div className="page-header">
        <div>
          <div className="page-title">Manage Users</div>
        </div>

        <button className="add-btn" onClick={openCreate}>
          + Add User
        </button>
      </div>

      <div className="card table-card">
        {loading ? (
          <div className="empty-state">Loading...</div>
        ) : (
          <table className="table-modern">
            <thead>
              <tr>
                <th>ID</th>
                <th>Username</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {data.map((u) => (
                <tr key={u.user_id}>
                  <td>{u.user_id}</td>
                  <td>{u.username}</td>
                  <td>{u.role}</td>

                  <td>
                    <button onClick={() => openEdit(u)}>Edit</button>
                    <button onClick={() => handleDelete(u)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showModal && (
        <Popup
          title={editData ? "Edit User" : "Add User"}
          onClose={() => setShowModal(false)}
          onSubmit={(e) => {
            e.preventDefault();

            if (editData) {
              handleUpdate(editData.user_id, formData); // 🔥 FIX ตรงนี้
            } else {
              handleCreate(e);
            }

            setShowModal(false);
          }}
        >

          <input
            type="text"
            placeholder="Username"
            value={formData.username || ""}
            onChange={(e) =>
              setFormData({ ...formData, username: e.target.value })
            }
            required
          />

          <input
            type="password"
            placeholder="Password (leave blank if no change)"
            value={formData.password || ""}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
          />

          <select
            value={formData.role || "user"}
            onChange={(e) =>
              setFormData({ ...formData, role: e.target.value })
            }
          >
            <option value="admin">admin</option>
            <option value="manager">manager</option>
            <option value="user">user</option>
          </select>

        </Popup>
      )}

    </div>
  );
}

export default ManageUsers;