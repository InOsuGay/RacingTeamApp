import React, { useState } from "react";
import ResultModal from "../modals/ResultModal";

function Results({
  data,
  loading,
  racesList,
  driversList,
  teams,
  handleCreate,
  handleDelete,
  handleUpdate,
  formData,
  setFormData
}) {

  const [showPopup, setShowPopup] = useState(false);
  const [editData, setEditData] = useState(null);

  const emptyForm = {
    race_id: "",
    driver_id: "",
    team_id: "",
    finish_position: "",
    points_earned: ""
  };

  const openCreate = () => {
    setEditData(null);
    setFormData(emptyForm);
    setShowPopup(true);
  };

  const openEdit = (r) => {
    setEditData(r);

    setFormData({
      race_id: r.race_id,
      driver_id: r.driver_id,
      team_id: r.team_id,
      finish_position: r.finish_position,
      points_earned: r.points_earned
    });

    setShowPopup(true);
  };

  return (
    <div>

      {/* HEADER */}
      <div className="page-header">
        <div>
          <div className="page-title">Results</div>
          <div className="page-subtitle">{data?.length || 0} results</div>
        </div>

        <button className="add-btn" onClick={openCreate}>
          + Add Record
        </button>
      </div>

      {/* TABLE */}
      <div className="card table-card">

        {loading ? (
          <div className="empty-state">Loading...</div>
        ) : (data || []).length === 0 ? (
          <div className="empty-state">
            <h3>No results found</h3>
          </div>
        ) : (
          <table className="table-modern">
            <thead>
              <tr>
                <th>Race</th>
                <th>Team</th>
                <th>Driver</th>
                <th>Position</th>
                <th>Points</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {(data || []).map((r) => (
                <tr key={r.result_id}>
                  <td>{r.race_name}</td>
                  <td>{r.team_name}</td>
                  <td>{r.first_name} {r.last_name}</td>
                  <td>P{r.finish_position}</td>
                  <td>{r.points_earned}</td>

                  <td>
                    <button onClick={() => openEdit(r)}>Edit</button>
                    <button onClick={() => handleDelete(r)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>

          </table>
        )}

      </div>

      {/* MODAL */}
      {showPopup && (
        <ResultModal
          onClose={() => setShowPopup(false)}
          onSubmit={(e) => {
            e.preventDefault();

            if (editData) {
              handleUpdate(editData.result_id, formData);
            } else {
              handleCreate(e); // ✅ ยังใช้ได้
            }

            setShowPopup(false);
          }}
          formData={formData}
          setFormData={setFormData}
          racesList={racesList}
          teams={teams}
          driversList={driversList}
        />
      )}

    </div>
  );
}

export default Results;