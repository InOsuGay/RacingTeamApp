import React, { useState, useEffect } from "react";
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
  const [results, setResults] = useState([]);

  useEffect(() => {
    setResults(data);
  }, [data]);

  const emptyForm = {
    race_id: "",
    driver_id: "",
    car_id: "",
    finish_position: ""
  };

  /* Delete result */
  const handleDelete = async (id) => {

    const confirmDelete = window.confirm("Delete this result?");
    if (!confirmDelete) return;

    try {

      const res = await fetch(`http://localhost:3000/api/results/${id}`, {
        method: "DELETE"
      });

      if (!res.ok) {
        throw new Error("Delete failed");
      }

      // remove row from table
      setResults(results.filter(r => r.result_id !== id));

    } catch (error) {

      console.error("Delete error:", error);

    }
  };

  /* Button styles */
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
            {results.length} race results
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

        ) : results.length === 0 ? (

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

              {results.map((result) => (

                <tr key={result.result_id}>

                  <td>{result.race_name}</td>

                  <td>{result.team_name}</td>

                  <td>
                    {result.first_name} {result.last_name}
                  </td>

                  <td>P{result.finish_position}</td>

                  <td>{result.points_earned}</td>

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
                        onClick={() => handleDelete(result.result_id)}
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

      {/* Modal */}
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