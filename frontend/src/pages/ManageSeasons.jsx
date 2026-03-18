import React, { useState } from "react";

function ManageSeasons({ data, loading, handleCreate, handleDelete, formData, setFormData }) {
  const [year, setYear] = useState("");

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Manage Seasons</div>
        </div>
      </div>

      <div className="card">
        <input
          type="number"
          placeholder="Year"
          value={year}
          onChange={(e) => setYear(e.target.value)}
        />
        <button onClick={() => handleCreate({ year })}>
          Add Season
        </button>
      </div>

      <div className="card table-card">
        <table className="table-modern">
          <thead>
            <tr>
              <th>ID</th>
              <th>Year</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.map(s => (
              <tr key={s.season_id}>
                <td>{s.season_id}</td>
                <td>{s.year}</td>
                <td>
                  <button onClick={() => handleDelete(s)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ManageSeasons;