import React from "react";

function Races({ data, loading, handleCreate, handleDelete, formData, setFormData, seasons = [] }) {

  return (
    <div>

      <div className="page-header">
        <div>
          <div className="page-title">Races</div>
          <div className="page-subtitle">{data.length} races</div>
        </div>
      </div>

      {/* FORM */}
      <form onSubmit={handleCreate} className="card" style={{ display: "grid", gap: "10px" }}>
        
        <input
          type="text"
          placeholder="Race Name"
          value={formData.race_name || ""}
          onChange={(e) => setFormData({ ...formData, race_name: e.target.value })}
          required
        />

        <input
          type="text"
          placeholder="Location"
          value={formData.location || ""}
          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
        />

        <input
          type="date"
          value={formData.race_date || ""}
          onChange={(e) => setFormData({ ...formData, race_date: e.target.value })}
        />

        <input
          type="number"
          placeholder="Total Laps"
          value={formData.total_laps || ""}
          onChange={(e) => setFormData({ ...formData, total_laps: e.target.value })}
        />

        <select
          value={formData.season_id || ""}
          onChange={(e) => setFormData({ ...formData, season_id: e.target.value })}
          required
        >
          <option value="">Select Season</option>
          {seasons.map((s) => (
            <option key={s.season_id} value={s.season_id}>
              {s.year}
            </option>
          ))}
        </select>

        <button className="btn-primary">Add Race</button>
      </form>

      {/* TABLE */}
      <div className="card table-card">
        {loading ? (
          <div className="empty-state">Loading...</div>
        ) : data.length === 0 ? (
          <div className="empty-state">
            <h3>No races found</h3>
          </div>
        ) : (
          <table className="table-modern">
            <thead>
              <tr>
                <th>Name</th>
                <th>Location</th>
                <th>Date</th>
                <th>Laps</th>
                <th>Season</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {data.map((r) => (
                <tr key={r.race_id}>
                  <td>{r.race_name}</td>
                  <td>{r.location || "-"}</td>

                  <td>
                    {r.race_date
                      ? new Date(r.race_date).toLocaleDateString()
                      : "-"}
                  </td>

                  <td>{r.total_laps || "-"}</td>
                  <td>{r.season_year || "-"}</td>

                  <td>
                    <button
                      onClick={() => {
                        if (window.confirm("Delete this race?")) {
                          handleDelete(r);
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

    </div>
  );
}

export default Races;