import React, { useState } from "react";

function Leaderboard({ data }) {
  const [selectedRace, setSelectedRace] = useState("");

  // 🔥 ดึง race list ไม่ซ้ำ
  const races = [...new Set(data.map(r => r.race_name))];

  // 🔥 filter ตาม race
  const filtered = selectedRace
    ? data.filter(r => r.race_name === selectedRace)
    : data;

  // 🔥 รวมคะแนน + ทีม
  const leaderboard = Object.values(
    filtered.reduce((acc, r) => {
      const key = r.driver_id;

      if (!acc[key]) {
        acc[key] = {
          driver: `${r.first_name} ${r.last_name}`,
          team: r.team_name || "Unknown",
          points: 0
        };
      }

      acc[key].points += r.points_earned || 0;

      return acc;
    }, {})
  ).sort((a, b) => b.points - a.points);

  return (
    <div>
      {/* HEADER */}
      <div className="page-header">
        <div>
          <div className="page-title">Leaderboard</div>
          <div className="page-subtitle">Race standings</div>
        </div>

        {/* 🔥 DROPDOWN */}
        <select
          value={selectedRace}
          onChange={(e) => setSelectedRace(e.target.value)}
        >
          {races.map((race, i) => (
            <option key={i} value={race}>
              {race}
            </option>
          ))}
        </select>
      </div>

      {/* TABLE */}
      <div className="card table-card">
        <table className="table-modern">
          <thead>
            <tr>
              <th>#</th>
              <th>Driver</th>
              <th>Team</th>
              <th>Points</th>
            </tr>
          </thead>

          <tbody>
            {leaderboard.map((d, i) => (
              <tr key={i}>
                <td>{i + 1}</td>
                <td>{d.driver}</td>
                <td>{d.team}</td>
                <td>{d.points}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Leaderboard;