import React, { useState } from "react";
import ResultModal from "../modals/ResultModal";

function Results({
  data,
  loading,
  racesList,
  driversList,
  carsList,
  handleCreate,
  formData,
  setFormData
}) {

  const [showPopup, setShowPopup] = useState(false);

  const emptyForm = {
    race_id: "",
    driver_id: "",
    car_id: "",
    finish_position: ""
  };

  /* Button Styles */
  const editButtonStyle = {
    backgroundColor: "#2563eb",
    color: "white",
    border: "none",
    padding: "6px 14px",
    borderRadius: "6px",
    cursor: "pointer"
  };

  const deleteButtonStyle = {
    backgroundColor: "#ef4444",
    color: "white",
    border: "none",
    padding: "6px 14px",
    borderRadius: "6px",
    cursor: "pointer"
  };

  const openModal = () => {
    setFormData(emptyForm);
    setShowPopup(true);
  };

  const closeModal = () => {
    setShowPopup(false);
    setFormData(emptyForm);
  };

  return (
    <div>

      {/* Header */}
      <div className="page-header">

        <div>
          <div className="page-title">Results</div>
          <div className="page-subtitle">
            {data.length} race results
          </div>
        </div>

        <button
          className="add-btn"
          onClick={openModal}
        >
          ADD RECORD
        </button>

      </div>

      {/* Results Table */}
      <div className="card table-card">

        {loading ? (

          <div className="empty-state">
            Loading...
          </div>

        ) : data.length === 0 ? (

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

              {data.map((result) => (

                <tr key={result.result_id}>

                  <td>{result.race_name}</td>

                  <td>{result.team_name}</td>

                  <td>
                    {result.first_name} {result.last_name}
                  </td>

                  <td>P{result.finish_position}</td>

                  <td>{result.points_earned}</td>

                  {/* Action Buttons */}
                  <td>

                    <div style={{ display: "flex", gap: "10px" }}>

                      <button
                        style={editButtonStyle}
                        onClick={() =>
                          alert(`Edit result ID: ${result.result_id}`)
                        }
                      >
                        Edit
                      </button>

                      <button
                        style={deleteButtonStyle}
                        onClick={() =>
                          alert(`Delete result ID: ${result.result_id}`)
                        }
                      >
                        Delete
                      </button>

                    </div>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        )}

      </div>

      {/* Add Result Modal */}
      {showPopup && (

        <ResultModal
          onClose={closeModal}
          onSubmit={(e) => {
            e.preventDefault();
            handleCreate(e);
            closeModal();
          }}
          formData={formData}
          setFormData={setFormData}
          racesList={racesList}
          driversList={driversList}
          carsList={carsList}
        />

      )}

    </div>
  );
}

export default Results;