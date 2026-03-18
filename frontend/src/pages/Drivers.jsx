import React, { useState } from "react";
import DriverModal from "../modals/DriverModal";

function Drivers({
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
    ? data.filter(d => myTeamIds.includes(d.team_id))
    : data;

  // 🔥 จำกัด select team
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
          <div className="page-title">Drivers</div>
          <div className="page-subtitle">
            {filteredData.length} total drivers
          </div>
        </div>

        <button
          className="add-btn"
          disabled={!canAdd}
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
            <h3>No drivers found</h3>
          </div>
        ) : (
          <table className="table-modern">
            <thead>
              <tr>
                <th>Name</th>
                <th>Number</th>
                <th>Team</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredData.map((d) => {

                const canModify =
                  role !== "user" || myTeamIds.includes(d.team_id);

                return (
                  <tr key={d.driver_id}>
                    <td>{d.first_name} {d.last_name}</td>
                    <td>{d.driver_number}</td>
                    <td>{d.team_name || "-"}</td>

                    <td>
                      {canModify && (
                        <>
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

                          <button
                            onClick={() => {
                              if (window.confirm("Delete this driver?")) {
                                handleDelete(d);
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
        <DriverModal
          onClose={() => setShowPopup(false)}
          onSubmit={(e) => {
            e.preventDefault();

            const payload = {
              ...formData,
              team_id:
                role === "user"
                  ? myTeamIds[0]   // 🔥 lock team
                  : formData.team_id
            };

            if (editData) {
              handleUpdate(editData.driver_id, payload);
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

export default Drivers;