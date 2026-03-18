import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import DataTable from './components/DataTable';
import * as api from './api/racingApi';
import Login from './Login';
import Register from "./Register";
import { Plus, X, Printer } from 'lucide-react';
import './index.css';

function App() {
  const [isLogin, setIsLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [role, setRole] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [searchTerm, setSearchTerm] = useState('');

  const [data, setData] = useState([]);
  const [teams, setTeams] = useState([]);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [categoriesToPrint, setCategoriesToPrint] = useState([]);
  const [printDataStore, setPrintDataStore] = useState({});
  const [loading, setLoading] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editId, setEditId] = useState(null);

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
  const [usersList, setUsersList] = useState([]);

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
      return ["Dashboard", "Teams", "Drivers", "Cars", "Races", "Results", "Manage Users", "Manage Seasons"];
    }
    if (role === "manager") {
      // manager = เจ้าของงานแข่ง (Race Owner)
      return ["Dashboard", "Teams", "Drivers", "Cars", "Races", "Results", "Manage Seasons"];
    }
    if (role === "user") {
      // user = ทีมที่มาแข่ง (Racing Team)
      return ["Dashboard", "Drivers", "Cars", "Results"];
    }
    return ["Dashboard"];
  };

  const handleLogout = () => {
    setIsLogin(false);
    setRole(null);
    setCurrentUser(null);
    setActiveTab('Dashboard'); // Reset tab on logout
  };

  useEffect(() => {
    if (isLogin && currentUser) {
      fetchTeams();
      fetchDashboardStats();
      loadTabData();
      setSearchTerm(''); 
    }
  }, [activeTab, isLogin, currentUser]);

  const fetchTeams = async () => {
    try {
      const params = role === 'user' ? { manager_id: currentUser.user_id } : {};
      const res = await api.getTeams(params);
      setTeams(res.data.data);
    } catch (err) {
      console.error('Failed to fetch teams', err);
    }
  };

  const fetchDashboardStats = async () => {
    try {
      const params = role === 'user' ? { manager_id: currentUser.user_id } : {};

      const [teamsRes, driversRes, carsRes, racesRes, seasonsRes, usersRes] = await Promise.all([
        api.getTeams(params).catch(() => ({ data: { data: [] } })),
        api.getDrivers(params).catch(() => ({ data: { data: [] } })),
        api.getCars(params).catch(() => ({ data: { data: [] } })),
        api.getRaces(params).catch(() => ({ data: { data: [] } })),
        (api.getSeasons?.() || Promise.resolve({ data: { data: [] } })).catch(() => ({ data: { data: [] } })),
        (api.getUsers?.() || Promise.resolve({ data: { data: [] } })).catch(() => ({ data: { data: [] } }))
      ]);

      const teamsData = teamsRes.data.data || [];
      const driversData = driversRes.data.data || [];
      const carsData = carsRes.data.data || [];
      const racesData = racesRes.data.data || [];

      setTeams(teamsData);
      setDriversList(driversData);
      setCarsList(carsData);
      setRacesList(racesData);
      setSeasonsList(seasonsRes.data.data || []);
      setUsersList(usersRes.data.data || []);

      setStats({
        teams: teamsData.length,
        drivers: driversData.length,
        cars: carsData.length,
        races: racesData.length
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
      const params = role === 'user' ? { manager_id: currentUser.user_id } : {};
      let res = { data: { data: [] } }; // Initialize with correct structure

      switch (activeTab) {
        case 'Teams':
          res = await api.getTeams(params);
          break;
        case 'Drivers':
          res = await api.getDrivers(params);
          break;
        case 'Cars':
          res = await api.getCars(params);
          break;
        case 'Races':
          res = await api.getRaces(params);
          break;
        case 'Results':
          res = await api.getResults(params);
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
        fetchTeams(); 
        fetchDashboardStats();
      } catch (err) {
        alert('Deletion failed: ' + err.message);
      }
    }
  };

  const handleEdit = async (row) => {
    let idFieldName = '';
    if (activeTab === 'Drivers') idFieldName = 'driver_id';
    else if (activeTab === 'Teams') idFieldName = 'team_id';
    else if (activeTab === 'Cars') idFieldName = 'car_id';
    else if (activeTab === 'Races') idFieldName = 'race_id';
    else if (activeTab === 'Results') idFieldName = 'result_id';
    else if (activeTab === 'Manage Users') idFieldName = 'user_id';
    else if (activeTab === 'Manage Seasons') idFieldName = 'season_id';

    setEditId(row[idFieldName]);
    setIsEditMode(true);
    setFormData({ ...row });
    
    if (activeTab === 'Teams') {
       try {
         const res = await api.getUsers();
         setUsersList(res.data.data || []);
       } catch (err) { console.error(err); }
    }
    setIsModalOpen(true);
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      if (isEditMode) {
        if (activeTab === 'Drivers') await api.updateDriver(editId, formData);
        if (activeTab === 'Teams') await api.updateTeam(editId, formData);
        if (activeTab === 'Cars') await api.updateCar(editId, formData);
        if (activeTab === 'Races') await api.updateRace(editId, formData);
        if (activeTab === 'Results') await api.updateResult(editId, formData);
        if (activeTab === 'Manage Users') await api.updateUser(editId, formData);
        if (activeTab === 'Manage Seasons') await api.updateSeason(editId, formData);
      } else {
        if (activeTab === 'Drivers') await api.addDriver(formData);
        if (activeTab === 'Teams') await api.addTeam(formData);
        if (activeTab === 'Cars') await api.addCar(formData);
        if (activeTab === 'Races') await api.addRace(formData);
        if (activeTab === 'Results') await api.addResult(formData);
        if (activeTab === 'Manage Users') await api.addUser(formData);
        if (activeTab === 'Manage Seasons') await api.addSeason(formData);
      }
      
      setIsModalOpen(false);
      setIsEditMode(false);
      setEditId(null);
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

  //  แมปคอลัมน์ของตารางให้ตรงกับชื่อ Tab ที่ระบุ
  const getColumns = (tabName = activeTab) => {
    switch (tabName) {
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

  const handlePrint = () => {
    window.print();
  };

  const canPrintReport = () => {
    if (role === 'admin') return true;
    if (role === 'manager' && ['Teams', 'Drivers', 'Cars', 'Races', 'Results'].includes(activeTab)) return true;
    if (role === 'user' && ['Drivers', 'Cars', 'Results'].includes(activeTab)) return true;
    return false;
  };

  const handleGlobalPrint = async () => {
    if (categoriesToPrint.length === 0) return;
    
    setLoading(true);
    const newDataStore = {};
    
    try {
      // Fetch fresh data for all selected categories
      for (const cat of categoriesToPrint) {
        let res;
        if (cat === 'Teams') res = await api.getTeams();
        if (cat === 'Drivers') res = await api.getDrivers();
        if (cat === 'Cars') res = await api.getCars();
        if (cat === 'Races') res = await api.getRaces();
        if (cat === 'Results') res = await api.getResults();
        if (cat === 'Manage Users') res = await api.getUsers();
        if (cat === 'Manage Seasons') res = await api.getSeasons();
        
        newDataStore[cat] = res.data.data;
      }
      
      setPrintDataStore(newDataStore);
      setIsPrintModalOpen(false);
      
      // Wait for UI to update with the new data before printing
      setTimeout(() => {
        window.print();
        setLoading(false);
      }, 1000);
      
    } catch (err) {
      console.error(err);
      alert('Failed to prepare report data: ' + err.message);
      setLoading(false);
    }
  };

  const toggleCategory = (cat) => {
    setCategoriesToPrint(prev => 
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
  };

  const filteredData = data.filter(item => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    return Object.values(item).some(val => 
      String(val).toLowerCase().includes(searchLower)
    );
  });

  if (!isLogin) {
    if(showRegister){
      return <Register setShowRegister={setShowRegister} />;
    }
    return (
      <Login
        setIsLogin={setIsLogin}
        setShowRegister={setShowRegister}
        setRole={setRole}
        setCurrentUser={setCurrentUser}
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
        user={currentUser}
      />

      <div className="main-wrapper">
        <TopBar
          title={activeTab}
          onLogout={handleLogout}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          onPrintClick={() => setIsPrintModalOpen(true)}
          canPrint={role === 'admin' || role === 'manager' || role === 'user'}
        />

        <main className="content">
          <div className="print-only">
            {categoriesToPrint.length > 0 ? (
              categoriesToPrint.map((cat, idx) => (
                <div key={cat} style={{ pageBreakAfter: idx === categoriesToPrint.length - 1 ? 'auto' : 'always', marginBottom: '4rem' }}>
                  <div className="print-header">
                    <div>
                      <h1 className="print-title">RACING MANAGEMENT</h1>
                      <p style={{ margin: '4px 0 0 0', color: '#64748b' }}>Project Registry & Formal Report</p>
                    </div>
                    <div style={{ textAlign: 'right', fontSize: '0.85rem' }}>
                      <div><strong>Content:</strong> {cat} Directory</div>
                      <div><strong>Issued By:</strong> {currentUser?.username} ({role})</div>
                      <div><strong>Date:</strong> {new Date().toLocaleString()}</div>
                    </div>
                  </div>
                  
                  <h2 style={{ marginBottom: '1.5rem', color: '#1e293b', borderBottom: '2px solid #e2e8f0', paddingBottom: '0.5rem' }}>
                    {cat} Detailed Registry
                  </h2>

                  <table className="formal-table">
                    <thead>
                      <tr>
                        {getColumns(cat).map(col => (
                          <th key={col.header}>{col.header}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {(printDataStore[cat] || []).map((row, rIdx) => (
                        <tr key={rIdx}>
                          {getColumns(cat).map(col => (
                            <td key={col.header}>
                              {col.render ? col.render(row) : row[col.key]}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  
                  <div style={{ marginTop: '1.5rem', fontSize: '0.75rem', color: '#94a3b8', textAlign: 'center' }}>
                    End of {cat} Report Listing
                  </div>
                </div>
              ))
            ) : (
              <div className="print-header">
                <div>
                  <h1 className="print-title">RACING MANAGEMENT</h1>
                  <p style={{ margin: '4px 0 0 0', color: '#64748b' }}>Project Registry & Formal Report</p>
                </div>
                <div style={{ textAlign: 'right', fontSize: '0.85rem' }}>
                  <div><strong>Report Type:</strong> {activeTab} Directory</div>
                  <div><strong>Generated By:</strong> {currentUser?.username} ({role})</div>
                  <div><strong>Date:</strong> {new Date().toLocaleString()}</div>
                </div>
              </div>
            )}
          </div>

          {activeTab === 'Dashboard' ? (
            <div className="dashboard-view">
              <div className="card welcome-card" style={{ marginBottom: '2.5rem', borderLeft: '4px solid var(--primary)' }}>
                <h2 style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }}>Control Panel Overview</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>
                  Authenticated as <strong>{role === 'admin' ? 'ADMIN' : role === 'manager' ? 'เจ้าของงานแข่ง' : 'ทีมที่มาแข่ง'}</strong>. Manage racing assets and operational data from the secure registry.
                </p>
              </div>

              <div className="stats-grid">
                <div className="stat-card">
                  <h3>{stats.teams}</h3>
                  <p>Racing Teams</p>
                </div>
                <div className="stat-card">
                  <h3>{stats.drivers}</h3>
                  <p>Professional Drivers</p>
                </div>
                <div className="stat-card">
                  <h3>{stats.cars}</h3>
                  <p>Racing Cars</p>
                </div>
                <div className="stat-card">
                  <h3>{stats.races}</h3>
                  <p>Season Races</p>
                </div>
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
                <div style={{ display: 'flex', gap: '1rem' }}>
                  {canCreate && (
                    <button className="btn-primary" onClick={async () => {
                      try {
                        const res = await api.getUsers();
                        setUsersList(res.data.data || []);
                      } catch (err) {
                        console.error("Failed to fetch users", err);
                      }
                      if (role === 'user' && teams.length === 1) {
                        setFormData(prev => ({ ...prev, team_id: teams[0].team_id }));
                      }
                      setIsEditMode(false);
                      setEditId(null);
                      setFormData({ 
                        first_name: '', last_name: '', driver_number: '', team_id: '',
                        name: '', contact_info: '', manager_id: '',
                        brand: '', model: '', car_number: '', specs: '',
                        season_id: '', race_name: '', location: '', race_date: '', total_laps: '',
                        race_id: '', driver_id: '', car_id: '', finish_position: '', is_fastest_lap: false, status: 'Finished', points_earned: '',
                        year: '', username: '', password_hash: '', role: 'user'
                      });
                      setIsModalOpen(true);
                    }}>
                      <Plus size={16} /> Add Record
                    </button>
                  )}
                </div>
              </div>

              {loading ? (
                <div style={{ padding: '3rem', textAlign: 'center' }}>
                  Syncing with MySQL...
                </div>
              ) : (
                <DataTable
                  columns={getColumns()}
                  data={filteredData}
                  onDelete={handleDelete}
                  onEdit={handleEdit}
                />
              )}
            </div>
          )}
        </main>
      </div>

      {isModalOpen && (
        <div className="modal-backdrop">
          <div className="modal-surface">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid var(--border)', paddingBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '700' }}>{isEditMode ? 'Modify' : 'New'} Registry Entry</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="icon-btn"
                style={{ border: 'none', background: 'none' }}
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
                  <select
                    value={formData.manager_id || ''}
                    onChange={e => setFormData({ ...formData, manager_id: e.target.value })}
                  >
                    <option value="">Select Manager (System User)</option>
                    {usersList
                      .filter(u => u.role === 'user' && (!teams.some(t => t.manager_id === u.user_id) || (isEditMode && u.user_id === formData.manager_id)))
                      .map(u => (
                        <option key={u.user_id} value={u.user_id}>
                          {u.username}
                        </option>
                      ))}
                  </select>
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
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.5rem', marginBottom: '1rem', color: 'var(--text-main)', fontWeight: '600', cursor: 'pointer' }}>
                    <input type="checkbox" checked={formData.is_fastest_lap || false} onChange={e => setFormData({ ...formData, is_fastest_lap: e.target.checked })} />
                    Earned Fastest Lap Point
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
                  <input 
                    type="password" 
                    placeholder={isEditMode ? "Leave empty to keep current password" : "Password"} 
                    value={formData.password_hash || ''} 
                    onChange={e => setFormData({ ...formData, password_hash: e.target.value })} 
                    required={!isEditMode} 
                  />
                  <select value={formData.role || 'user'} onChange={e => setFormData({ ...formData, role: e.target.value })} required>
                    <option value="user">Racing Team (User)</option>
                    <option value="manager">Race Owner (Manager)</option>
                    <option value="admin">System Admin (Admin)</option>
                  </select>
                </>
              )}
              
              <button type="submit" className="btn-primary" style={{marginTop: '1rem'}}>
                {isEditMode ? 'Save Changes' : 'Commit Registry'}
              </button>
            </form>
          </div>
        </div>
      )}
      {isPrintModalOpen && (
        <div className="modal-backdrop">
          <div className="modal-surface card" style={{ width: '500px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid var(--border)', paddingBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '700' }}>Report Configuration</h3>
              <button onClick={() => setIsPrintModalOpen(false)} style={{ border: 'none', background: 'none', cursor: 'pointer' }}><X size={20} /></button>
            </div>
            
            <p style={{ marginBottom: '1.5rem', color: 'var(--text-muted)' }}>Select the categories you wish to include in the formal report:</p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2rem' }}>
              {getAllowedTabs().filter(t => t !== 'Dashboard' && t !== 'Manage Users').map(tab => (
                <label key={tab} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '12px', background: 'var(--bg-main)', borderRadius: '10px', cursor: 'pointer' }}>
                  <input 
                    type="checkbox" 
                    checked={categoriesToPrint.includes(tab)}
                    onChange={() => toggleCategory(tab)}
                  />
                  <span style={{ fontWeight: '600' }}>{tab} Directory</span>
                </label>
              ))}
              {role === 'admin' && (
                <label style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '12px', background: 'var(--bg-main)', borderRadius: '10px', cursor: 'pointer' }}>
                  <input 
                    type="checkbox" 
                    checked={categoriesToPrint.includes('Manage Users')}
                    onChange={() => toggleCategory('Manage Users')}
                  />
                  <span style={{ fontWeight: '600' }}>User Accounts Registry</span>
                </label>
              )}
            </div>

            <button 
              className="btn-primary" 
              style={{ width: '100%', padding: '15px' }}
              onClick={handleGlobalPrint}
              disabled={categoriesToPrint.length === 0}
            >
              <Printer size={18} style={{ marginRight: '8px' }} /> Generate Formal PDF Report
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;