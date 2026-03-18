import React, { useState } from "react";

function ManageTeams({ data, loading, handleCreate, handleDelete, formData, setFormData }) {
  const [showModal, setShowModal] = useState(false);

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Manage Teams</div>
        </div>
        <button className="add-btn" onClick={() => setShowModal(true)}>+ Add Team</button>
      </div>

      <div className="card table-card">
        {loading ? "Loading..." : (
          <table className="table-modern">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Manager</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.map(t => (
                <tr key={t.team_id}>
                  <td>{t.team_id}</td>
                  <td>{t.name}</td>
                  <td>{t.manager_id}</td>
                  <td>
                    <button onClick={() => handleDelete(t)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default ManageTeams;