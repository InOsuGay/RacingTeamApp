import Popup from "../components/Popup";

function ResultModal({
  onClose,
  onSubmit,
  formData,
  setFormData,
  racesList = [],
  driversList = [],
  teams = [],   // ✅ กัน undefined
}) {

  console.log("TEAMS:", teams); // 🔥 debug

  return (
    <Popup title="Results Registry" onClose={onClose} onSubmit={onSubmit}>

      {/* RACE */}
      <select
        value={formData.race_id || ""}
        onChange={(e) =>
          setFormData({ ...formData, race_id: e.target.value })
        }
      >
        <option value="">Select Race</option>

        {racesList.length === 0 ? (
          <option disabled>No races</option>
        ) : (
          racesList.map(r => (
            <option key={r.race_id} value={r.race_id}>
              {r.race_name}
            </option>
          ))
        )}
      </select>

      {/* DRIVER */}
      <select
        value={formData.driver_id || ""}
        onChange={(e) =>
          setFormData({ ...formData, driver_id: e.target.value })
        }
      >
        <option value="">Select Driver</option>

        {driversList.length === 0 ? (
          <option disabled>No drivers</option>
        ) : (
          driversList.map(d => (
            <option key={d.driver_id} value={d.driver_id}>
              {d.first_name} {d.last_name}
            </option>
          ))
        )}
      </select>

      {/* 🔥 TEAM FIX */}
      <select
        value={formData.team_id || ""}
        onChange={(e) =>
          setFormData({ ...formData, team_id: e.target.value })
        }
      >
        <option value="">Select Team</option>

        {teams.length === 0 ? (
          <option disabled>No teams found</option>
        ) : (
          teams.map((t) => (
            <option key={t.team_id} value={t.team_id}>
              {/* 🔥 รองรับทั้ง team_name และ name */}
              {t.team_name || t.name || `Team ${t.team_id}`}
            </option>
          ))
        )}
      </select>

      {/* POSITION */}
      <input
        type="number"
        placeholder="Position"
        value={formData.finish_position || ""}
        onChange={(e) =>
          setFormData({ ...formData, finish_position: e.target.value })
        }
      />

      {/* POINTS */}
      <input
        type="number"
        placeholder="Points"
        value={formData.points_earned || ""}
        onChange={(e) =>
          setFormData({ ...formData, points_earned: e.target.value })
        }
      />

    </Popup>
  );
}

export default ResultModal;