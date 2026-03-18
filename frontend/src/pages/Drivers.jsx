import React from "react";

function Drivers({ data, loading }) {
  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Drivers</div>
          <div className="page-subtitle">
            {data.length} total drivers
          </div>
        </div>
      </div>

      <div className="card table-card">
        {loading ? (
          <div className="empty-state">Loading...</div>
        ) : data.length === 0 ? (
          <div className="empty-state">
            <h3>No drivers found</h3>
            <p>Start by adding a new driver</p>
          </div>
        ) : (
          <table className="table-modern">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Number</th>
              </tr>
            </thead>
            <tbody>
              {data.map((d) => (
                <tr key={d.driver_id}>
                  <td>{d.driver_id}</td>
                  <td>{d.first_name} {d.last_name}</td>
                  <td>{d.driver_number}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default Drivers;