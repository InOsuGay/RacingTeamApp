function Dashboard({ stats, role, currentUser }) {
  return (
    <div className="dashboard-view">
      <div className="card welcome-card" style={{ marginBottom: '2.5rem', borderLeft: '4px solid var(--primary)' }}>
        <h2>Control Panel Overview</h2>
        <p>
          Authenticated as <strong>{role}</strong>
        </p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>{stats.teams}</h3>
          <p>Racing Teams</p>
        </div>
        <div className="stat-card">
          <h3>{stats.drivers}</h3>
          <p>Drivers</p>
        </div>
        <div className="stat-card">
          <h3>{stats.cars}</h3>
          <p>Cars</p>
        </div>
        <div className="stat-card">
          <h3>{stats.races}</h3>
          <p>Races</p>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;