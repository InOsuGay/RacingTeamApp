import React from "react";

function RaceModal({ setShowModal, handleCreate, formData, setFormData }) {
  return (
    <div className="popup-overlay">
      <div className="popup-box">

        <div className="modal-header">
          <h2>Create Race</h2>
          <button onClick={() => setShowModal(false)}>✕</button>
        </div>

        <form onSubmit={handleCreate} className="modal-body">

          <input
            placeholder="Race Name"
            value={formData.race_name || ""}
            onChange={e => setFormData({ ...formData, race_name: e.target.value })}
            required
          />

          <input
            placeholder="Location"
            value={formData.location || ""}
            onChange={e => setFormData({ ...formData, location: e.target.value })}
          />

          <input
            type="date"
            value={formData.race_date || ""}
            onChange={e => setFormData({ ...formData, race_date: e.target.value })}
            required
          />

          <button className="btn-primary">Create Race</button>

        </form>
      </div>
    </div>
  );
}

export default RaceModal;