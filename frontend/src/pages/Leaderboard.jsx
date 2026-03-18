import React from "react";

function Leaderboard({ data }) {

  // 🔥 รวมคะแนน
  const leaderboard = Object.values(
    data.reduce((acc, r) => {
      const key = r.driver_id;

      if (!acc[key]) {
        acc[key] = {
          driver: `${r.first_name} ${r.last_name}`,
          points: 0,
          wins: 0
        };
      }

      acc[key].points += r.points_earned || 0;

      if (r.finish_position === 1) {
        acc[key].wins += 1;
      }

      return acc;
    }, {})
  ).sort((a, b) => b.points - a.points);

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Leaderboard</div>
          <div className="page-subtitle">Driver standings</div>
        </div>
      </div>

      <div className="card table-card">
        <table className="table-modern">
          <thead>
            <tr>
              <th>#</th>
              <th>Driver</th>
              <th>Points</th>
              <th>Wins</th>
            </tr>
          </thead>

          <tbody>
            {leaderboard.map((d, i) => (
              <tr key={i}>
                <td>{i + 1}</td>
                <td>{d.driver}</td>
                <td>{d.points}</td>
                <td>{d.wins}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Leaderboard;