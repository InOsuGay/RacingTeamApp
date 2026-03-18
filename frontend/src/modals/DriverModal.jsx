import Popup from "../components/Popup";

function DriverModal({
  onClose,
  onSubmit,
  formData,
  setFormData,
  teams
}) {
  return (
    <Popup title="Drivers Registry" onClose={onClose} onSubmit={onSubmit}>

      <input
        type="text"
        placeholder="First Name"
        value={formData.first_name || ""}
        onChange={(e) =>
          setFormData({ ...formData, first_name: e.target.value })
        }
        required
      />

      <input
        type="text"
        placeholder="Last Name"
        value={formData.last_name || ""}
        onChange={(e) =>
          setFormData({ ...formData, last_name: e.target.value })
        }
        required
      />

      <input
        type="number"
        placeholder="Driver Number"
        value={formData.driver_number || ""}
        onChange={(e) =>
          setFormData({ ...formData, driver_number: e.target.value })
        }
      />

      <select
        value={formData.team_id || ""}
        onChange={(e) =>
          setFormData({ ...formData, team_id: e.target.value })
        }
        required
      >
        <option value="">Select Team</option>
        {teams.map((t) => (
          <option key={t.team_id} value={t.team_id}>
            {t.name}
          </option>
        ))}
      </select>

    </Popup>
  );
}

export default DriverModal;