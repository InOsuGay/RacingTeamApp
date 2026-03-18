import React, { useState } from "react";
import Popup from "../components/Popup";

function ManageSeasons({
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
    year: ""
  };

  const openCreate = () => {
    setEditData(null);
    setFormData(emptyForm);
    setShowModal(true);
  };

  const openEdit = (s) => {
    setEditData(s);

    setFormData({
      year: s.year
    });

    setShowModal(true);
  };

  return (
    <div>

      {/* HEADER */}
      <div className="page-header">
        <div>
          <div className="page-title">Manage Seasons</div>
          <div className="page-subtitle">{data.length} seasons</div>
        </div>

        <button className="add-btn" onClick={openCreate}>
          + Add Season
        </button>
      </div>

      {/* TABLE */}
      <div className="card table-card">
        {loading ? (
          <div className="empty-state">Loading...</div>
        ) : data.length === 0 ? (
          <div className="empty-state">
            <h3>No seasons found</h3>
          </div>
        ) : (
          <table className="table-modern">
            <thead>
              <tr>
                <th>ID</th>
                <th>Year</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {data.map((s) => (
                <tr key={s.season_id}>
                  <td>{s.season_id}</td>
                  <td>{s.year}</td>

                  <td style={{ display: "flex", gap: "8px" }}>
                    <button onClick={() => openEdit(s)}>Edit</button>

                    <button
                      onClick={() => {
                        if (window.confirm("Delete this season?")) {
                          handleDelete(s);
                        }
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>

          </table>
        )}
      </div>

      {/* MODAL */}
      {showModal && (
        <Popup
          title={editData ? "Edit Season" : "Add Season"}
          onClose={() => setShowModal(false)}
          onSubmit={(e) => {
            e.preventDefault();

            const payload = {
              ...editData,
              year: Number(formData.year)
            };

            if (editData) {
              handleUpdate(editData.season_id, payload);
            } else {
              handleCreate(e);
            }

            setShowModal(false);
          }}
        >

          {/* YEAR */}
          <input
            type="number"
            placeholder="Year"
            value={formData.year || ""}
            onChange={(e) =>
              setFormData({ ...formData, year: e.target.value })
            }
            required
          />

        </Popup>
      )}

    </div>
  );
}

export default ManageSeasons;