import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import DataTable from './components/DataTable';
import * as api from './api/racingApi';
import Login from './Login';
import Register from "./Register";
import { Plus, X } from 'lucide-react';
import './index.css';

function App() {
  const [isLogin, setIsLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [role, setRole] = useState(null);
  const [activeTab, setActiveTab] = useState('Dashboard');

  const [data, setData] = useState([]);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    // Driver fields
    first_name: '',
    last_name: '',
    driver_number: '',
    team_id: '',
    // Team fields
    name: '',
    contact_info: '',
    manager_id: ''
  });

  //  Dashboard Stats
  const [stats, setStats] = useState({
    teams: 0,
    drivers: 0,
    cars: 0,
    races: 0
  });

  //  กำหนดสิทธิ์การมองเห็นเมนู (Tab) ตาม Role
  const getAllowedTabs = () => {
    if (role === "admin") {
      return ["Dashboard", "Teams", "Drivers", "Cars", "Races", "Results"];
    }
    if (role === "race_manager") {
      return ["Dashboard", "Races", "Results"];
    }
    if (role === "team_manager") {
      return ["Dashboard", "Drivers", "Cars", "Results"];
    }
    return ["Dashboard"];
  };

  const handleLogout = () => {
    setIsLogin(false);
    setRole(null);
    setActiveTab('Dashboard'); // Reset tab on logout
  };

  useEffect(() => {
    if (isLogin) {
      fetchTeams();
      fetchDashboardStats();
      loadTabData();
    }
  }, [activeTab, isLogin]);

  const fetchTeams = async () => {
    try {
      const res = await api.getTeams();
      setTeams(res.data.data);
    } catch (err) {
      console.error('Failed to fetch teams', err);
    }
  };

  const fetchDashboardStats = async () => {
    try {
      const [teamsRes, driversRes, carsRes, racesRes] = await Promise.all([
        api.getTeams(),
        api.getDrivers(),
        api.getCars(),
        api.getRaces()
      ]);

      setStats({
        teams: teamsRes.data.data.length,
        drivers: driversRes.data.data.length,
        cars: carsRes.data.data.length,
        races: racesRes.data.data.length
      });
    } catch(err) {
      console.error("Dashboard load failed", err);
    }
  };

  //  โหลดข้อมูลตาม Tab ที่ถูกเปลี่ยน
  const loadTabData = async () => {
    if (activeTab === 'Dashboard') return;
    setLoading(true);

    try {
      let res = { data: [] };

      switch (activeTab) {
        case 'Teams':
          res = await api.getTeams();
          break;
        case 'Drivers':
          res = await api.getDrivers();
          break;
        case 'Cars':
          res = await api.getCars();
          break;
        case 'Races':
          res = await api.getRaces();
          break;
        case 'Results':
          res = await api.getResults();
          break;
        case 'Manage Users':
          res = await api.getUsers?.() || { data: { data: [] } }; 
          break;
        case 'Manage Seasons':
          res = await api.getSeasons?.() || { data: { data: [] } }; 
          break;
        
        default:
          res = { data: { data: [] } };
      }

      setData(res.data.data || []);
    } catch (err) {
      console.error(`Error loading ${activeTab}`, err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (row) => {
    // กำหนดสิทธิ์การลบตามเมนู
    if (window.confirm('Confirm permanent deletion of this record?')) {
      try {
        if (activeTab === 'Drivers') await api.deleteDriver(row.driver_id);
        if (activeTab === 'Teams') await api.deleteTeam(row.team_id);
        if (activeTab === 'Cars') await api.deleteCar(row.car_id);
        if (activeTab === 'Races') await api.deleteRace(row.race_id);
        if (activeTab === 'Results') await api.deleteResult(row.result_id);
        // เพิ่มเงื่อนไขลบสำหรับ Tab อื่นๆ
        loadTabData();
      } catch (err) {
        alert('Deletion failed: ' + err.message);
      }
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      if (activeTab === 'Drivers') await api.addDriver(formData);
      if (activeTab === 'Teams') await api.addTeam(formData);
      // รองรับการเพิ่มข้อมูลจาก Tab อื่นๆ
      
      setIsModalOpen(false);
      setFormData({ 
        first_name: '', last_name: '', driver_number: '', team_id: '',
        name: '', contact_info: '', manager_id: ''
      });
      loadTabData();
    } catch (err) {
      alert('Creation failed: ' + err.message);
    }
  };

  //  แมปคอลัมน์ของตารางให้ตรงกับ Tab ปัจจุบัน
  const getColumns = () => {
    switch (activeTab) {
      case 'Teams':
        return [
          { header: 'ID', key: 'team_id' },
          { header: 'Team Name', key: 'name' },
          { header: 'Contact Info', key: 'contact_info' },
          { header: 'Manager', key: 'manager_name' },
        ];
      case 'Drivers':
        return [
          { header: 'ID', key: 'driver_id' },
          { header: 'Name', render: r => `${r.first_name} ${r.last_name}` },
          { header: 'Driver Number', key: 'driver_number' },
          { header: 'Contracted Team', key: 'team_name' },
        ];
      case 'Cars':
        return [
          { header: 'ID', key: 'car_id' },
          { header: 'Brand', key: 'brand' },
          { header: 'Model', key: 'model' },
          { header: 'Car Number', key: 'car_number' },
          { header: 'Specs', key: 'specs' },
          { header: 'Operator', key: 'team_name' },
        ];
      case 'Races':
        return [
          { header: 'ID', key: 'race_id' },
          { header: 'Event', key: 'race_name' },
          { header: 'Location', key: 'location' },
          { header: 'Date', render: r => new Date(r.race_date).toLocaleDateString() },
        ];
      case 'Results':
        return [
          { header: 'ID', key: 'result_id' },
          { header: 'Event', key: 'race_name' },
          { header: 'Driver', render: r => `${r.first_name} ${r.last_name}` },
          { header: 'Position', render: r => <span className={`badge ${r.finish_position === 1 ? 'badge-success' : 'badge-primary'}`}>P{r.finish_position}</span> },
          { header: 'Points', key: 'points_earned' },
        ];
      case 'Manage Seasons':
        return [
          { header: 'ID', key: 'season_id' },
          { header: 'Year', key: 'year' },
        ];
      case 'Manage Users': // ตัวอย่าง
        return [
          { header: 'ID', key: 'user_id' },
          { header: 'Username', key: 'username' },
          { header: 'Role', key: 'role' },
        ];
      default:
        return [];
    }
  };

  if (!isLogin) {
    if(showRegister){
      return <Register setShowRegister={setShowRegister} />;
    }
    return (
      <Login
        setIsLogin={setIsLogin}
        setShowRegister={setShowRegister}
        setRole={setRole}
      />
    );
  }

  // Check if we show "Add" button
  const canCreate = ['Drivers', 'Teams', 'Races', 'Cars', 'Results', 'Manage Users', 'Manage Seasons'].includes(activeTab);

  return (
    <div className="app-layout">
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        allowedTabs={getAllowedTabs()}
      />

      <div className="main-wrapper">
        <TopBar
          title={activeTab}
          onLogout={handleLogout}
        />

        <main className="content">
          {activeTab === 'Dashboard' ? (
            <div className="dashboard-home">
              <div className="stats-grid">
                <div className="stat-card">
                  <h3>{stats.teams}</h3>
                  <p>Total Teams</p>
                </div>
                <div className="stat-card">
                  <h3>{stats.drivers}</h3>
                  <p>Total Drivers</p>
                </div>
                <div className="stat-card">
                  <h3>{stats.cars}</h3>
                  <p>Total Cars</p>
                </div>
                <div className="stat-card">
                  <h3>{stats.races}</h3>
                  <p>Total Races</p>
                </div>
              </div>

              <div className="card" style={{marginTop:"20px"}}>
                <h2>Welcome to Database Controller ({role})</h2>
                <p style={{ marginTop: '1rem', color: 'var(--text-muted)' }}>
                  Select a category from the sidebar to manage racing data records based on your permissions.
                </p>
              </div>
            </div>
          ) : (
            <div className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.1rem' }}>{activeTab} Directory</h3>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    {data.length} total records found
                  </span>
                </div>

                {/* ปุ่มเพิ่มข้อมูล จะเปลี่ยนข้อความตาม Tab ที่เปิดอยู่ */}
                {canCreate && (
                  <button className="btn-primary" onClick={() => setIsModalOpen(true)}>
                    <Plus size={16} /> Add Record
                  </button>
                )}
              </div>

              {loading ? (
                <div style={{ padding: '3rem', textAlign: 'center' }}>
                  Syncing with MySQL...
                </div>
              ) : (
                <DataTable
                  columns={getColumns()}
                  data={data}
                  onDelete={handleDelete} // ส่ง handleDelete ไปจัดการในตาราง
                />
              )}
            </div>
          )}
        </main>
      </div>

      {isModalOpen && (
        <div className="modal-backdrop">
          <div className="modal-surface">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
              <h3>Enrollment Registry - {activeTab}</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreate}>
              {/* ตัวอย่าง Form (ปัจจุบันยังมีแค่โครง Driver, คุณสามารถทำเงื่อนไข if/else แบบ getColumns() สำหรับ input แต่ละ Tab ได้เลย) */}
              {activeTab === 'Drivers' && (
                <>
                  <input
                    type="text"
                    placeholder="First Name"
                    value={formData.first_name || ''}
                    onChange={e => setFormData({ ...formData, first_name: e.target.value })}
                    required
                  />
                  <input
                    type="text"
                    placeholder="Last Name"
                    value={formData.last_name || ''}
                    onChange={e => setFormData({ ...formData, last_name: e.target.value })}
                    required
                  />
                  <input
                    type="number"
                    placeholder="Driver Number"
                    value={formData.driver_number || ''}
                    onChange={e => setFormData({ ...formData, driver_number: e.target.value })}
                  />
                  <select
                    value={formData.team_id}
                    onChange={e => setFormData({ ...formData, team_id: e.target.value })}
                    required
                  >
                    <option value="">Select Team</option>
                    {teams.map(t => (
                      <option key={t.team_id} value={t.team_id}>
                        {t.name}
                      </option>
                    ))}
                  </select>
                </>
              )}

              {activeTab === 'Teams' && (
                <>
                  <input
                    type="text"
                    placeholder="Team Name"
                    value={formData.name || ''}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                  <input
                    type="text"
                    placeholder="Contact Info (Email/Phone)"
                    value={formData.contact_info || ''}
                    onChange={e => setFormData({ ...formData, contact_info: e.target.value })}
                  />
                  {role === 'admin' && (
                    <input
                      type="number"
                      placeholder="Manager ID"
                      value={formData.manager_id || ''}
                      onChange={e => setFormData({ ...formData, manager_id: e.target.value })}
                    />
                  )}
                </>
              )}
              
              <button type="submit" className="btn-primary" style={{marginTop: '1rem'}}>
                Commit Registry
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;