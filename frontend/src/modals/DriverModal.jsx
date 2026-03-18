import Popup from "../components/Popup";

function DriverModal({
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
    <Popup title="Drivers Registry" onClose={onClose} onSubmit={onSubmit}>

      {/* FIRST NAME */}
      <input
        type="text"
        placeholder="First Name"
        value={formData.first_name || ""}
        onChange={(e) =>
          setFormData({ ...formData, first_name: e.target.value })
        }
        required
      />

      {/* LAST NAME */}
      <input
        type="text"
        placeholder="Last Name"
        value={formData.last_name || ""}
        onChange={(e) =>
          setFormData({ ...formData, last_name: e.target.value })
        }
        required
      />

      {/* NUMBER */}
      <input
        type="number"
        placeholder="Driver Number"
        value={formData.driver_number || ""}
        onChange={(e) =>
          setFormData({ ...formData, driver_number: e.target.value })
        }
      />

      {/* TEAM */}
      {isUser ? (
        // 🔥 USER → แสดงเฉพาะทีมตัวเอง (readonly)
        <select
          value={formData.team_id || ""}
          disabled
        >
          {teams
            .filter(t => myTeamIds.includes(t.team_id))
            .map(t => (
              <option key={t.team_id} value={t.team_id}>
                {t.team_name || t.name}
              </option>
            ))}
        </select>
      ) : (
        // 🔥 ADMIN / MANAGER → เลือกได้หมด
        <select
          value={formData.team_id || ""}
          onChange={(e) =>
            setFormData({
              ...formData,
              team_id: Number(e.target.value)
            })
          }
          required
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

export default DriverModal;