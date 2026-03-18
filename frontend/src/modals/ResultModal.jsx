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

      {/* Race */}
      <select
        value={formData.race_id || ""}
        onChange={(e) =>
          setFormData({ ...formData, race_id: e.target.value })
        }
      >
        <option value="">Select Race</option>
        {racesList.map((race) => (
          <option key={race.race_id} value={race.race_id}>
            {race.race_name}
          </option>
        ))}
      </select>

      {/* Driver */}
      <select
        value={formData.driver_id || ""}
        onChange={(e) =>
          setFormData({ ...formData, driver_id: e.target.value })
        }
      >
        <option value="">Select Driver</option>
        {driversList.map((driver) => (
          <option key={driver.driver_id} value={driver.driver_id}>
            {driver.first_name} {driver.last_name}
          </option>
        ))}
      </select>

      {/* Car */}
      <select
        value={formData.car_id || ""}
        onChange={(e) =>
          setFormData({ ...formData, car_id: e.target.value })
        }
      >
        <option value="">Select Car</option>
        {carsList.map((car) => (
          <option key={car.car_id} value={car.car_id}>
            {car.brand}
          </option>
        ))}
      </select>

      {/* Finish Position */}
      <select
        value={formData.finish_position || ""}
        onChange={(e) =>
          setFormData({ ...formData, finish_position: e.target.value })
        }
      >
        <option value="">Select Finish Position</option>
        {[...Array(20)].map((_, i) => (
          <option key={i + 1} value={i + 1}>
            {i + 1}
          </option>
        ))}
      </select>

    </Popup>
  );
}

export default ResultModal;