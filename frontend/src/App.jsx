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
    driver_name: '',
    age: '',
    nationality: '',
    team_id: ''
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
      return ["Dashboard", "Manage Users", "Manage Teams", "Manage Seasons", "View All Data"];
    }
    if (role === "race_manager") {
      return ["Dashboard", "Manage Races", "Enter Race Results", "View Leaderboard"];
    }
    if (role === "team_manager") {
      return ["Dashboard", "Manage Drivers", "Manage Cars", "View Team Results"];
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
      setTeams(res.data);
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
        teams: teamsRes.data.length,
        drivers: driversRes.data.length,
        cars: carsRes.data.length,
        races: racesRes.data.length
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
        // Admin Tabs
        case 'Manage Teams':
          res = await api.getTeams();
          break;
        case 'Manage Users':
          // จำเป็นต้องมี api.getUsers() ใน backend
          res = await api.getUsers?.() || { data: [] }; 
          break;
        case 'Manage Seasons':
          // จำเป็นต้องมี api.getSeasons() ใน backend
          res = await api.getSeasons?.() || { data: [] }; 
          break;
        case 'View All Data':
          res = await api.getResults(); // ปรับแต่ง API ที่ต้องการดูข้อมูลทั้งหมดได้ตามสมควร
          break;

        // Race Manager Tabs
        case 'Manage Races':
          res = await api.getRaces();
          break;
        case 'Enter Race Results':
          res = await api.getResults();
          break;
        case 'View Leaderboard':
          // จำเป็นต้องมี api.getLeaderboard() ใน backend
          res = await api.getLeaderboard?.() || { data: [] }; 
          break;

        // Team Manager Tabs
        case 'Manage Drivers':
          res = await api.getDrivers();
          break;
        case 'Manage Cars':
          res = await api.getCars();
          break;
        case 'View Team Results':
          res = await api.getResults(); // อาจจะต้องส่ง team_id ไปกรองข้อมูลใน backend ด้วย
          break;
        
        default:
          res = { data: [] };
      }

      setData(res.data);
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
        if (activeTab === 'Manage Drivers') await api.deleteDriver(row.driver_id);
        // เพิ่มเงื่อนไขลบสำหรับ Tab อื่นๆ เช่น Manage Cars, Manage Teams ได้ที่นี่
        loadTabData();
      } catch (err) {
        alert('Deletion failed: ' + err.message);
      }
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      if (activeTab === 'Manage Drivers') {
        await api.addDriver(formData);
      }
      // รองรับการเพิ่มข้อมูลจาก Tab อื่นๆ
      
      setIsModalOpen(false);
      setFormData({ driver_name: '', age: '', nationality: '', team_id: '' });
      loadTabData();
    } catch (err) {
      alert('Creation failed: ' + err.message);
    }
  };

  //  แมปคอลัมน์ของตารางให้ตรงกับ Tab ปัจจุบัน
  const getColumns = () => {
    switch (activeTab) {
      case 'Manage Teams':
        return [
          { header: 'ID', key: 'team_id' },
          { header: 'Team Name', key: 'team_name' },
          { header: 'Base Country', key: 'country' },
          { header: 'Manager', key: 'manager_name' },
        ];
      case 'Manage Drivers':
        return [
          { header: 'ID', key: 'driver_id' },
          { header: 'Name', key: 'driver_name' },
          { header: 'Age', key: 'age' },
          { header: 'Nationality', render: r => <span className="badge badge-primary">{r.nationality}</span> },
          { header: 'Contracted Team', key: 'team_name' },
        ];
      case 'Manage Cars':
        return [
          { header: 'ID', key: 'car_id' },
          { header: 'Model', key: 'model' },
          { header: 'Engine', key: 'engine_type' },
          { header: 'Operator', key: 'team_name' },
        ];
      case 'Manage Races':
        return [
          { header: 'ID', key: 'race_id' },
          { header: 'Event', key: 'race_name' },
          { header: 'Location', key: 'location' },
          { header: 'Date', render: r => new Date(r.race_date).toLocaleDateString() },
        ];
      case 'Enter Race Results':
      case 'View Team Results':
      case 'View All Data':
        return [
          { header: 'ID', key: 'result_id' },
          { header: 'Event', key: 'race_name' },
          { header: 'Driver', key: 'driver_name' },
          { header: 'Position', render: r => <span className={`badge ${r.position === 1 ? 'badge-success' : 'badge-primary'}`}>P{r.position}</span> },
          { header: 'Points', key: 'points' },
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
  const canCreate = ['Manage Drivers', 'Manage Teams', 'Manage Races', 'Manage Cars', 'Manage Users', 'Manage Seasons', 'Enter Race Results'].includes(activeTab);

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
              {activeTab === 'Manage Drivers' && (
                <>
                  <input
                    type="text"
                    placeholder="Driver Name"
                    value={formData.driver_name}
                    onChange={e => setFormData({ ...formData, driver_name: e.target.value })}
                    required
                  />
                  <input
                    type="number"
                    placeholder="Age"
                    value={formData.age}
                    onChange={e => setFormData({ ...formData, age: e.target.value })}
                  />
                  <input
                    type="text"
                    placeholder="Nationality"
                    value={formData.nationality}
                    onChange={e => setFormData({ ...formData, nationality: e.target.value })}
                  />
                  <select
                    value={formData.team_id}
                    onChange={e => setFormData({ ...formData, team_id: e.target.value })}
                    required
                  >
                    <option value="">Select Team</option>
                    {teams.map(t => (
                      <option key={t.team_id} value={t.team_id}>
                        {t.team_name}
                      </option>
                    ))}
                  </select>
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