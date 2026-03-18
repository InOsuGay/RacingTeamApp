import Popup from "../components/Popup";

function CarModal({
  onClose,
  onSubmit,
  formData,
  setFormData,
  teams
}) {
  return (
    <Popup title="Cars Registry" onClose={onClose} onSubmit={onSubmit}>

      <input
        type="text"
        placeholder="Brand"
        value={formData.brand || ""}
        onChange={(e) =>
          setFormData({ ...formData, brand: e.target.value })
        }
        required
      />

      <input
        type="text"
        placeholder="Model"
        value={formData.model || ""}
        onChange={(e) =>
          setFormData({ ...formData, model: e.target.value })
        }
      />

      <input
        type="number"
        placeholder="Car Number"
        value={formData.car_number || ""}
        onChange={(e) =>
          setFormData({ ...formData, car_number: e.target.value })
        }
      />

      <input
        type="text"
        placeholder="Specs"
        value={formData.specs || ""}
        onChange={(e) =>
          setFormData({ ...formData, specs: e.target.value })
        }
      />

      <select
        value={formData.team_id || ""}
        onChange={(e) =>
          setFormData({ ...formData, team_id: e.target.value })
        }
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

export default CarModal;