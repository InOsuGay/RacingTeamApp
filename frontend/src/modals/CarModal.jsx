import Popup from "../components/Popup";

function CarModal({
  onClose,
  onSubmit,
  formData,
  setFormData,
  teams,
  role,        // 🔥 เพิ่ม
  myTeamIds    // 🔥 เพิ่ม
}) {

  const isUser = role === "user";

  return (
    <Popup title="Cars Registry" onClose={onClose} onSubmit={onSubmit}>

      {/* BRAND */}
      <input
        type="text"
        placeholder="Brand"
        value={formData.brand || ""}
        onChange={(e) =>
          setFormData({ ...formData, brand: e.target.value })
        }
        required
      />

      {/* MODEL */}
      <input
        type="text"
        placeholder="Model"
        value={formData.model || ""}
        onChange={(e) =>
          setFormData({ ...formData, model: e.target.value })
        }
      />

      {/* NUMBER */}
      <input
        type="number"
        placeholder="Car Number"
        value={formData.car_number || ""}
        onChange={(e) =>
          setFormData({ ...formData, car_number: e.target.value })
        }
      />

      {/* SPECS */}
      <input
        type="text"
        placeholder="Specs"
        value={formData.specs || ""}
        onChange={(e) =>
          setFormData({ ...formData, specs: e.target.value })
        }
      />

      {/* TEAM */}
      {isUser ? (
        // 🔥 USER → ล็อกทีม
        <select value={formData.team_id || ""} disabled>
          {teams
            .filter(t => myTeamIds.includes(t.team_id))
            .map(t => (
              <option key={t.team_id} value={t.team_id}>
                {t.team_name || t.name}
              </option>
            ))}
        </select>
      ) : (
        // 🔥 ADMIN / MANAGER
        <select
          value={formData.team_id || ""}
          onChange={(e) =>
            setFormData({
              ...formData,
              team_id: Number(e.target.value)
            })
          }
        >
          <option value="">Select Team</option>
          {teams.map((t) => (
            <option key={t.team_id} value={t.team_id}>
              {t.team_name || t.name}
            </option>
          ))}
        </select>
      )}

    </Popup>
  );
}

export default CarModal;