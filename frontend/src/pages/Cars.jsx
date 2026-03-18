import React, { useState } from "react";
import CarModal from "../modals/CarModal";

function Cars({
  data,
  loading,
  teams,
  handleCreate,
  formData,
  setFormData
}) {

  const [showPopup, setShowPopup] = useState(false);

  return (
    <div>

      {/* HEADER */}
      <div className="page-header">
        <div>
          <div className="page-title">Cars</div>
          <div className="page-subtitle">
            {data.length} total cars
          </div>
        </div>

        {/* ✅ ปุ่ม Add */}
        <button className="add-btn" onClick={() => setShowPopup(true)}>
          + Add Record
        </button>
      </div>

      {/* TABLE */}
      <div className="card table-card">
        {loading ? (
          <div className="empty-state">Loading...</div>
        ) : data.length === 0 ? (
          <div className="empty-state">
            <h3>No cars found</h3>
          </div>
        ) : (
          <table className="table-modern">
            <thead>
              <tr>
                <th>ID</th>
                <th>Brand</th>
                <th>Model</th>
                <th>Number</th>
              </tr>
            </thead>
            <tbody>
              {data.map((c) => (
                <tr key={c.car_id}>
                  <td>{c.car_id}</td>
                  <td>{c.brand}</td>
                  <td>{c.model}</td>
                  <td>{c.car_number}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* ✅ POPUP */}
      {showPopup && (
        <CarModal
          onClose={() => setShowPopup(false)}
          onSubmit={(e) => {
            e.preventDefault();
            handleCreate(e);
            setShowPopup(false);
          }}
          formData={formData}
          setFormData={setFormData}
          teams={teams}
        />
      )}

    </div>
  );
}

export default Cars;