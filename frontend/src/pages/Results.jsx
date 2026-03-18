import React from "react";

function Results({ data, loading }) {
  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Results</div>
          <div className="page-subtitle">
            {data.length} race results
          </div>
        </div>
      </div>

      <div className="card table-card">
        {loading ? (
          <div className="empty-state">Loading...</div>
        ) : data.length === 0 ? (
          <div className="empty-state">
            <h3>No results found</h3>
          </div>
        ) : (
          <table className="table-modern">
            <thead>
              <tr>
                <th>Race</th>
                <th>Driver</th>
                <th>Position</th>
                <th>Points</th>
              </tr>
            </thead>
            <tbody>
              {data.map((r) => (
                <tr key={r.result_id}>
                  <td>{r.race_name}</td>
                  <td>{r.first_name} {r.last_name}</td>
                  <td>P{r.finish_position}</td>
                  <td>{r.points_earned}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default Results;