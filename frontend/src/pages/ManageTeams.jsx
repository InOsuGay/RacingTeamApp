import React, { useState } from "react";
import Popup from "../components/Popup";

function ManageTeams({
  data,
  loading,
  handleCreate,
  handleDelete,
  handleUpdate,
  formData,
  setFormData,
  users = []
}) {

  const [showModal, setShowModal] = useState(false);
  const [editData, setEditData] = useState(null);

  const userOptions = users.filter(u => u.role === "user");

  const emptyForm = {
    name: "",
    manager_id: "",
    contact_info: ""   // 🔥 เพิ่ม
  };

  const openCreate = () => {
    setEditData(null);
    setFormData(emptyForm);
    setShowModal(true);
  };

  const openEdit = (team) => {
    setEditData(team);

    setFormData({
      name: team.team_name || team.name,
      manager_id: team.manager_id,
      contact_info: team.contact_info || ""   // 🔥 เพิ่ม
    });

    setShowModal(true);
  };

  return (
    <div>

      {/* HEADER */}
      <div className="page-header">
        <div>
          <div className="page-title">Manage Teams</div>
        </div>

        <button className="add-btn" onClick={openCreate}>
          + Add Team
        </button>
      </div>

      {/* TABLE */}
      <div className="card table-card">
        {loading ? (
          <div className="empty-state">Loading...</div>
        ) : (
          <table className="table-modern">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Manager</th>
                <th>Contact</th> {/* 🔥 เพิ่ม */}
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {(data || []).map((t) => {
                const manager = users.find(u => u.user_id === t.manager_id);

                return (
                  <tr key={t.team_id}>
                    <td>{t.team_id}</td>
                    <td>{t.team_name || t.name}</td>

                    <td>
                      {manager
                        ? manager.username || manager.name
                        : `ID: ${t.manager_id}`}
                    </td>

                    <td>{t.contact_info || "-"}</td> {/* 🔥 เพิ่ม */}

                    <td style={{ display: "flex", gap: "8px" }}>
                      <button onClick={() => openEdit(t)}>Edit</button>
                      <button onClick={() => handleDelete(t)}>Delete</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>

          </table>
        )}
      </div>

      {/* MODAL */}
      {showModal && (
        <Popup
          title={editData ? "Edit Team" : "Add Team"}
          onClose={() => setShowModal(false)}
          onSubmit={(e) => {
            e.preventDefault();

            const payload = {
              ...editData, // 🔥 กันข้อมูลหาย
              team_name: formData.name,
              manager_id: Number(formData.manager_id),
              contact_info: formData.contact_info   // 🔥 เพิ่ม
            };

            if (editData) {
              handleUpdate(editData.team_id, payload);
            } else {
              handleCreate(e);
            }

            setShowModal(false);
          }}
        >

          {/* TEAM NAME */}
          <input
            type="text"
            placeholder="Team Name"
            value={formData.name || ""}
            onChange={(e) =>
              setFormData({ ...formData, name: e.target.value })
            }
            required
          />

          {/* MANAGER */}
          <select
            value={formData.manager_id || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                manager_id: Number(e.target.value)
              })
            }
            required
          >
            <option value="">Select Manager</option>

            {userOptions.map(u => (
              <option key={u.user_id} value={u.user_id}>
                {u.username || u.name}
              </option>
            ))}
          </select>

          {/* 🔥 CONTACT INFO */}
          <input
            type="text"
            placeholder="Contact Info"
            value={formData.contact_info || ""}
            onChange={(e) =>
              setFormData({ ...formData, contact_info: e.target.value })
            }
          />

        </Popup>
      )}

    </div>
  );
}

export default ManageTeams;