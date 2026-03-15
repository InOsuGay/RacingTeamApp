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
    first_name: '', last_name: '', driver_number: '', team_id: '',
    name: '', contact_info: '', manager_id: '',
    brand: '', model: '', car_number: '', specs: '',
    season_id: '', race_name: '', location: '', race_date: '', total_laps: '',
    race_id: '', driver_id: '', car_id: '', finish_position: '', is_fastest_lap: false, status: 'Finished', points_earned: '',
    year: '', username: '', password_hash: '', role: 'user'
  });

  const [driversList, setDriversList] = useState([]);
  const [carsList, setCarsList] = useState([]);
  const [racesList, setRacesList] = useState([]);
  const [seasonsList, setSeasonsList] = useState([]);

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
      const [teamsRes, driversRes, carsRes, racesRes, seasonsRes] = await Promise.all([
        api.getTeams(),
        api.getDrivers(),
        api.getCars(),
        api.getRaces(),
        api.getSeasons?.() || { data: { data: [] } }
      ]);

      setTeams(teamsRes.data.data);
      setDriversList(driversRes.data.data);
      setCarsList(carsRes.data.data);
      setRacesList(racesRes.data.data);
      setSeasonsList(seasonsRes.data.data || []);

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
        if (activeTab === 'Manage Users') await api.deleteUser(row.user_id);
        if (activeTab === 'Manage Seasons') await api.deleteSeason(row.season_id);
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
      if (activeTab === 'Cars') await api.addCar(formData);
      if (activeTab === 'Races') await api.addRace(formData);
      if (activeTab === 'Results') await api.addResult(formData);
      if (activeTab === 'Manage Users') await api.addUser(formData);
      if (activeTab === 'Manage Seasons') await api.addSeason(formData);
      
      setIsModalOpen(false);
      setFormData({ 
        first_name: '', last_name: '', driver_number: '', team_id: '',
        name: '', contact_info: '', manager_id: '',
        brand: '', model: '', car_number: '', specs: '',
        season_id: '', race_name: '', location: '', race_date: '', total_laps: '',
        race_id: '', driver_id: '', car_id: '', finish_position: '', is_fastest_lap: false, status: 'Finished', points_earned: '',
        year: '', username: '', password_hash: '', role: 'user'
      });
      loadTabData();
      fetchDashboardStats();
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

              {activeTab === 'Cars' && (
                <>
                  <input type="text" placeholder="Brand" value={formData.brand || ''} onChange={e => setFormData({ ...formData, brand: e.target.value })} required />
                  <input type="text" placeholder="Model" value={formData.model || ''} onChange={e => setFormData({ ...formData, model: e.target.value })} />
                  <input type="number" placeholder="Car Number" value={formData.car_number || ''} onChange={e => setFormData({ ...formData, car_number: e.target.value })} />
                  <input type="text" placeholder="Specs" value={formData.specs || ''} onChange={e => setFormData({ ...formData, specs: e.target.value })} />
                  <select value={formData.team_id || ''} onChange={e => setFormData({ ...formData, team_id: e.target.value })} required>
                    <option value="">Select Team</option>
                    {teams.map(t => <option key={t.team_id} value={t.team_id}>{t.name}</option>)}
                  </select>
                </>
              )}

              {activeTab === 'Races' && (
                <>
                  <input type="text" placeholder="Race Name" value={formData.race_name || ''} onChange={e => setFormData({ ...formData, race_name: e.target.value })} required />
                  <input type="text" placeholder="Location" value={formData.location || ''} onChange={e => setFormData({ ...formData, location: e.target.value })} />
                  <input type="date" value={formData.race_date || ''} onChange={e => setFormData({ ...formData, race_date: e.target.value })} required />
                  <input type="number" placeholder="Total Laps" value={formData.total_laps || ''} onChange={e => setFormData({ ...formData, total_laps: e.target.value })} />
                  <select value={formData.season_id || ''} onChange={e => setFormData({ ...formData, season_id: e.target.value })} required>
                    <option value="">Select Season</option>
                    {seasonsList.map(s => <option key={s.season_id} value={s.season_id}>{s.year}</option>)}
                  </select>
                </>
              )}

              {activeTab === 'Results' && (
                <>
                  <select value={formData.race_id || ''} onChange={e => setFormData({ ...formData, race_id: e.target.value })} required>
                    <option value="">Select Race</option>
                    {racesList.map(r => <option key={r.race_id} value={r.race_id}>{r.race_name}</option>)}
                  </select>
                  <select value={formData.driver_id || ''} onChange={e => setFormData({ ...formData, driver_id: e.target.value })} required>
                    <option value="">Select Driver</option>
                    {driversList.map(d => <option key={d.driver_id} value={d.driver_id}>{d.first_name} {d.last_name}</option>)}
                  </select>
                  <select value={formData.car_id || ''} onChange={e => setFormData({ ...formData, car_id: e.target.value })} required>
                    <option value="">Select Car</option>
                    {carsList.map(c => <option key={c.car_id} value={c.car_id}>{c.brand} {c.model}</option>)}
                  </select>
                  <input type="number" placeholder="Finish Position" value={formData.finish_position || ''} onChange={e => setFormData({ ...formData, finish_position: e.target.value })} required />
                  <input type="number" placeholder="Points Earned" value={formData.points_earned || ''} onChange={e => setFormData({ ...formData, points_earned: e.target.value })} />
                  <select value={formData.status || 'Finished'} onChange={e => setFormData({ ...formData, status: e.target.value })}>
                    <option value="Finished">Finished</option>
                    <option value="DNF">DNF</option>
                    <option value="DSQ">DSQ</option>
                    <option value="DNS">DNS</option>
                  </select>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem', color: 'var(--text-muted)' }}>
                    <input type="checkbox" checked={formData.is_fastest_lap || false} onChange={e => setFormData({ ...formData, is_fastest_lap: e.target.checked })} />
                    Fastest Lap
                  </label>
                </>
              )}

              {activeTab === 'Manage Seasons' && (
                <>
                  <input type="number" placeholder="Year" value={formData.year || ''} onChange={e => setFormData({ ...formData, year: e.target.value })} required />
                </>
              )}

              {activeTab === 'Manage Users' && (
                <>
                  <input type="text" placeholder="Username" value={formData.username || ''} onChange={e => setFormData({ ...formData, username: e.target.value })} required />
                  <input type="password" placeholder="Password" value={formData.password_hash || ''} onChange={e => setFormData({ ...formData, password_hash: e.target.value })} required />
                  <select value={formData.role || 'user'} onChange={e => setFormData({ ...formData, role: e.target.value })} required>
                    <option value="user">User</option>
                    <option value="manager">Manager</option>
                    <option value="admin">Admin</option>
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