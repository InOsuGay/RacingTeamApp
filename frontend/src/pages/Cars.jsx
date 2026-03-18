import React, { useState } from "react";
import CarModal from "../modals/CarModal";

function Cars({
  data,
  loading,
  teams,
  handleCreate,
  handleDelete,
  handleUpdate,
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
          <div className="page-title">Cars</div>
          <div className="page-subtitle">
            {data.length} total cars
          </div>
        </div>

        <button
          className="add-btn"
          onClick={() => {
            setEditData(null);
            setFormData({});
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
        ) : data.length === 0 ? (
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
                <th>Team</th>     {/* 🔥 เพิ่ม */}
                <th>Specs</th>    {/* 🔥 เพิ่ม */}
                <th>Actions</th>  {/* 🔥 เพิ่ม */}
              </tr>
            </thead>

            <tbody>
              {data.map((c) => (
                <tr key={c.car_id}>
                  <td>{c.brand}</td>
                  <td>{c.model || "-"}</td>
                  <td>{c.car_number || "-"}</td>
                  <td>{c.team_name || "-"}</td>
                  <td>{c.specs || "-"}</td>

                  <td>
                    {/* EDIT */}
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

                    {/* DELETE */}
                    <button
                      onClick={() => {
                        if (window.confirm("Delete this car?")) {
                          handleDelete(c);
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
        <CarModal
          onClose={() => setShowPopup(false)}
          onSubmit={(e) => {
            e.preventDefault();

            if (editData) {
              handleUpdate(editData.car_id, formData); // 🔥 update
            } else {
              handleCreate(e);
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

export default Cars;