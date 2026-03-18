import React, { useState } from "react";
import Popup from "../components/Popup";

function Races({
  data,
  loading,
  handleCreate,
  handleDelete,
  handleUpdate,
  formData,
  setFormData,
  seasons = []
}) {

  const [showModal, setShowModal] = useState(false);
  const [editData, setEditData] = useState(null);

  const emptyForm = {
    race_name: "",
    location: "",
    race_date: "",
    total_laps: "",
    season_id: ""
  };

  const openCreate = () => {
    setEditData(null);
    setFormData(emptyForm);
    setShowModal(true);
  };

  const openEdit = (r) => {
    setEditData(r);

    setFormData({
      race_name: r.race_name,
      location: r.location,
      race_date: r.race_date?.split("T")[0], // 🔥 fix date
      total_laps: r.total_laps,
      season_id: r.season_id
    });

    setShowModal(true);
  };

  return (
    <div>

      {/* HEADER */}
      <div className="page-header">
        <div>
          <div className="page-title">Races</div>
          <div className="page-subtitle">{data.length} races</div>
        </div>

        <button className="add-btn" onClick={openCreate}>
          + Add Race
        </button>
      </div>

      {/* TABLE */}
      <div className="card table-card">
        {loading ? (
          <div className="empty-state">Loading...</div>
        ) : data.length === 0 ? (
          <div className="empty-state">
            <h3>No races found</h3>
          </div>
        ) : (
          <table className="table-modern">
            <thead>
              <tr>
                <th>Name</th>
                <th>Location</th>
                <th>Date</th>
                <th>Laps</th>
                <th>Season</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {data.map((r) => (
                <tr key={r.race_id}>
                  <td>{r.race_name}</td>
                  <td>{r.location || "-"}</td>

                  <td>
                    {r.race_date
                      ? new Date(r.race_date).toLocaleDateString()
                      : "-"}
                  </td>

                  <td>{r.total_laps || "-"}</td>
                  <td>{r.season_year || "-"}</td>

                  <td style={{ display: "flex", gap: "8px" }}>
                    <button onClick={() => openEdit(r)}>Edit</button>

                    <button
                      onClick={() => {
                        if (window.confirm("Delete this race?")) {
                          handleDelete(r);
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
          title={editData ? "Edit Race" : "Add Race"}
          onClose={() => setShowModal(false)}
          onSubmit={(e) => {
            e.preventDefault();

            const payload = {
              ...editData, // 🔥 กันข้อมูลหาย
              race_name: formData.race_name,
              location: formData.location,
              race_date: formData.race_date,
              total_laps: Number(formData.total_laps),
              season_id: Number(formData.season_id)
            };

            if (editData) {
              handleUpdate(editData.race_id, payload);
            } else {
              handleCreate(e);
            }

            setShowModal(false);
          }}
        >

          {/* NAME */}
          <input
            type="text"
            placeholder="Race Name"
            value={formData.race_name || ""}
            onChange={(e) =>
              setFormData({ ...formData, race_name: e.target.value })
            }
            required
          />

          {/* LOCATION */}
          <input
            type="text"
            placeholder="Location"
            value={formData.location || ""}
            onChange={(e) =>
              setFormData({ ...formData, location: e.target.value })
            }
          />

          {/* DATE */}
          <input
            type="date"
            value={formData.race_date || ""}
            onChange={(e) =>
              setFormData({ ...formData, race_date: e.target.value })
            }
          />

          {/* LAPS */}
          <input
            type="number"
            placeholder="Total Laps"
            value={formData.total_laps || ""}
            onChange={(e) =>
              setFormData({ ...formData, total_laps: e.target.value })
            }
          />

          {/* SEASON */}
          <select
            value={formData.season_id || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                season_id: Number(e.target.value)
              })
            }
            required
          >
            <option value="">Select Season</option>
            {seasons.map((s) => (
              <option key={s.season_id} value={s.season_id}>
                {s.year}
              </option>
            ))}
          </select>

        </Popup>
      )}

    </div>
  );
}

export default Races;