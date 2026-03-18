import Popup from "../components/Popup";

function ResultModal({
  onClose,
  onSubmit,
  formData,
  setFormData,
  racesList,
  driversList,
  carsList
}) {
  return (
    <Popup title="Results Registry" onClose={onClose} onSubmit={onSubmit}>

      <select
        value={formData.race_id || ""}
        onChange={(e) =>
          setFormData({ ...formData, race_id: e.target.value })
        }
      >
        <option value="">Select Race</option>
        {racesList.map(r => (
          <option key={r.race_id} value={r.race_id}>
            {r.race_name}
          </option>
        ))}
      </select>

      <select
        value={formData.driver_id || ""}
        onChange={(e) =>
          setFormData({ ...formData, driver_id: e.target.value })
        }
      >
        <option value="">Select Driver</option>
        {driversList.map(d => (
          <option key={d.driver_id} value={d.driver_id}>
            {d.first_name} {d.last_name}
          </option>
        ))}
      </select>

      <select
        value={formData.car_id || ""}
        onChange={(e) =>
          setFormData({ ...formData, car_id: e.target.value })
        }
      >
        <option value="">Select Car</option>
        {carsList.map(c => (
          <option key={c.car_id} value={c.car_id}>
            {c.brand}
          </option>
        ))}
      </select>

      <input
        type="number"
        placeholder="Finish Position"
        value={formData.finish_position || ""}
        onChange={(e) =>
          setFormData({ ...formData, finish_position: e.target.value })
        }
      />

      <input
        type="number"
        placeholder="Points Earned"
        value={formData.points_earned || ""}
        onChange={(e) =>
          setFormData({ ...formData, points_earned: e.target.value })
        }
      />

    </Popup>
  );
}

export default ResultModal;