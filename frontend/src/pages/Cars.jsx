import React from "react";

function Cars({ data, loading }) {
  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Cars</div>
          <div className="page-subtitle">
            {data.length} total cars
          </div>
        </div>
      </div>

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
    </div>
  );
}

export default Cars;