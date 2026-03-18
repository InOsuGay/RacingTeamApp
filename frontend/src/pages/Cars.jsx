import React, { useState } from "react";
import CarModal from "../modals/CarModal";

function Cars({
  data,
  loading,
  teams,
  myTeamIds = [],   // 🔥 เพิ่ม
  role,             // 🔥 เพิ่ม
  handleCreate,
  handleDelete,
  handleUpdate,
  formData,
  setFormData
}) {

  const [showPopup, setShowPopup] = useState(false);
  const [editData, setEditData] = useState(null);

  // 🔥 filter ตาม role
  const filteredData = role === "user"
    ? data.filter(c => myTeamIds.includes(c.team_id))
    : data;

  // 🔥 จำกัด team select
  const teamOptions = role === "user"
    ? teams.filter(t => myTeamIds.includes(t.team_id))
    : teams;

  // 🔥 เช็ค add ได้ไหม
  const canAdd = role !== "user" || myTeamIds.length > 0;

  return (
    <div>

      {/* HEADER */}
      <div className="page-header">
        <div>
          <div className="page-title">Cars</div>
          <div className="page-subtitle">
            {filteredData.length} total cars
          </div>
        </div>

        <button
          className="add-btn"
          disabled={!canAdd}   // 🔥 disable
          onClick={() => {
            setEditData(null);

            setFormData({
              team_id: role === "user" ? myTeamIds[0] : ""
            });

            setShowPopup(true);
          }}
        >
          + Add Record
        </button>
      </div>

      {/* TABLE */}
      <div className="card table-card">
        {loading ? (
          <div className="empty-state">Loading...</div>
        ) : filteredData.length === 0 ? (
          <div className="empty-state">
            <h3>No cars found</h3>
          </div>
        ) : (
          <table className="table-modern">
            <thead>
              <tr>
                <th>Brand</th>
                <th>Model</th>
                <th>Number</th>
                <th>Team</th>
                <th>Specs</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredData.map((c) => {
                const canModify =
                  role !== "user" || myTeamIds.includes(c.team_id);

                return (
                  <tr key={c.car_id}>
                    <td>{c.brand}</td>
                    <td>{c.model || "-"}</td>
                    <td>{c.car_number || "-"}</td>
                    <td>{c.team_name || "-"}</td>
                    <td>{c.specs || "-"}</td>

                    <td>
                      {canModify && (
                        <>
                          <button
                            onClick={() => {
                              setEditData(c);
                              setFormData({
                                brand: c.brand,
                                model: c.model,
                                car_number: c.car_number,
                                specs: c.specs,
                                team_id: c.team_id
                              });
                              setShowPopup(true);
                            }}
                          >
                            Edit
                          </button>

                          <button
                            onClick={() => {
                              if (window.confirm("Delete this car?")) {
                                handleDelete(c);
                              }
                            }}
                          >
                            Delete
                          </button>
                        </>
                      )}
                    </td>

                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* MODAL */}
      {showPopup && (
        <CarModal
          onClose={() => setShowPopup(false)}
          onSubmit={(e) => {
            e.preventDefault();

            const payload = {
              ...formData,
              team_id:
                role === "user"
                  ? myTeamIds[0] // 🔥 lock team
                  : formData.team_id
            };

            if (editData) {
              handleUpdate(editData.car_id, payload);
            } else {
              handleCreate(e);
            }

            setShowPopup(false);
          }}
          formData={formData}
          setFormData={setFormData}
          teams={teamOptions}   // 🔥 จำกัด dropdown
          isEdit={!!editData}
          role={role}
          myTeamIds={myTeamIds}
        />
      )}

    </div>
  );
}

export default Cars;