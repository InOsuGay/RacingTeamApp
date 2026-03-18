import React, { useState } from "react";
import DriverModal from "../modals/DriverModal";

function Drivers({
  data,
  loading,
  teams,
  handleCreate,
  handleDelete,
  handleUpdate,   // 🔥 เพิ่ม
  formData,
  setFormData
}) {

  const [showPopup, setShowPopup] = useState(false);
  const [editData, setEditData] = useState(null);

  return (
    <div>

      {/* HEADER */}
      <div className="page-header">
        <div>
          <div className="page-title">Drivers</div>
          <div className="page-subtitle">
            {data.length} total drivers
          </div>
        </div>

        <button className="add-btn" onClick={() => {
          setEditData(null);   // 👉 reset
          setFormData({});
          setShowPopup(true);
        }}>
          + Add Record
        </button>
      </div>

      {/* TABLE */}
      <div className="card table-card">
        {loading ? (
          <div className="empty-state">Loading...</div>
        ) : data.length === 0 ? (
          <div className="empty-state">
            <h3>No drivers found</h3>
          </div>
        ) : (
          <table className="table-modern">
            <thead>
              <tr>
                <th>Name</th>
                <th>Number</th>
                <th>Team</th>
                <th>Actions</th> {/* 🔥 เพิ่ม */}
              </tr>
            </thead>

            <tbody>
              {data.map((d) => (
                <tr key={d.driver_id}>
                  <td>{d.first_name} {d.last_name}</td>
                  <td>{d.driver_number}</td>
                  <td>{d.team_name || "-"}</td>

                  <td>
                    {/* EDIT */}
                    <button
                      onClick={() => {
                        setEditData(d);
                        setFormData({
                          first_name: d.first_name,
                          last_name: d.last_name,
                          driver_number: d.driver_number,
                          team_id: d.team_id
                        });
                        setShowPopup(true);
                      }}
                    >
                      Edit
                    </button>

                    {/* DELETE */}
                    <button
                      onClick={() => {
                        if (window.confirm("Delete this driver?")) {
                          handleDelete(d);
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
      {showPopup && (
        <DriverModal
          onClose={() => setShowPopup(false)}
          onSubmit={(e) => {
            e.preventDefault();

            if (editData) {
              handleUpdate(editData.driver_id, formData); // 🔥 update
            } else {
              handleCreate(e); // 🔥 create
            }

            setShowPopup(false);
          }}
          formData={formData}
          setFormData={setFormData}
          teams={teams}
          isEdit={!!editData}
        />
      )}

    </div>
  );
}

export default Drivers;