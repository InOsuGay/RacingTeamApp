import React, { useState } from "react";
import UserModal from "../modals/UserModal";

function ManageUsers({ data, loading, handleCreate, handleDelete, formData, setFormData }) {
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  const openEdit = (user) => {
    setEditingUser(user);
    setFormData(user);
    setShowModal(true);
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Manage Users</div>
          <div className="page-subtitle">{data.length} users</div>
        </div>

        <button className="add-btn" onClick={() => {
          setEditingUser(null);
          setFormData({});
          setShowModal(true);
        }}>
          + Add User
        </button>
      </div>

      <div className="card table-card">
        {loading ? "Loading..." : (
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
              {data.map(u => (
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
        <UserModal
          setShowModal={setShowModal}
          handleCreate={handleCreate}
          formData={formData}
          setFormData={setFormData}
          editingUser={editingUser}
        />
      )}
    </div>
  );
}

export default ManageUsers;