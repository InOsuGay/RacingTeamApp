import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import DataTable from './components/DataTable';
import * as api from './api/racingApi';
import { Plus, X } from 'lucide-react';
import './index.css';

function App() {
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [data, setData] = useState([]);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({
    driver_name: '',
    age: '',
    nationality: '',
    team_id: ''
  });

  useEffect(() => {
    fetchTeams();
    loadTabData();
  }, [activeTab]);

  const fetchTeams = async () => {
    try {
      const res = await api.getTeams();
      setTeams(res.data);
    } catch (err) {
      console.error('Failed to fetch teams', err);
    }
  };

  const loadTabData = async () => {
    if (activeTab === 'Dashboard') return;
    setLoading(true);
    try {
      let res;
      switch (activeTab) {
        case 'Teams': res = await api.getTeams(); break;
        case 'Drivers': res = await api.getDrivers(); break;
        case 'Cars': res = await api.getCars(); break;
        case 'Races': res = await api.getRaces(); break;
        case 'Results': res = await api.getResults(); break;
      }
      setData(res.data);
    } catch (err) {
      console.error(`Error loading ${activeTab}`, err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (row) => {
    if (activeTab !== 'Drivers') return;
    if (window.confirm('Confirm permanent deletion of this record?')) {
      try {
        await api.deleteDriver(row.driver_id);
        loadTabData();
      } catch (err) {
        alert('Deletion failed: ' + err.message);
      }
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await api.addDriver(formData);
      setIsModalOpen(false);
      setFormData({ driver_name: '', age: '', nationality: '', team_id: '' });
      loadTabData();
    } catch (err) {
      alert('Creation failed: ' + err.message);
    }
  };

  const getColumns = () => {
    switch (activeTab) {
      case 'Teams':
        return [
          { header: 'ID', key: 'team_id' },
          { header: 'Team Name', key: 'team_name' },
          { header: 'Base Country', key: 'country' },
          { header: 'Manager', key: 'manager_name' },
        ];
      case 'Drivers':
        return [
          { header: 'ID', key: 'driver_id' },
          { header: 'Name', key: 'driver_name' },
          { header: 'Age', key: 'age' },
          { header: 'Nationality', render: r => <span className="badge badge-primary">{r.nationality}</span> },
          { header: 'Contracted Team', key: 'team_name' },
        ];
      case 'Cars':
        return [
          { header: 'ID', key: 'car_id' },
          { header: 'Model', key: 'model' },
          { header: 'Engine', key: 'engine_type' },
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
          { header: 'Driver', key: 'driver_name' },
          { header: 'Position', render: r => <span className={`badge ${r.position === 1 ? 'badge-success' : 'badge-primary'}`}>P{r.position}</span> },
          { header: 'Points', key: 'points' },
        ];
      default: return [];
    }
  };

  return (
    <div className="app-layout">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <div className="main-wrapper">
        <TopBar title={activeTab} />
        
        <main className="content">
          {activeTab === 'Dashboard' ? (
            <div className="dashboard-home">
              <div className="card">
                <h2>Welcome to Database Controller</h2>
                <p style={{marginTop: '1rem', color: 'var(--text-muted)'}}>Select a category from the sidebar to manage racing data records.</p>
              </div>
            </div>
          ) : (
            <div className="card">
              <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '2rem'}}>
                <div>
                  <h3 style={{fontSize: '1.1rem'}}>{activeTab} Directory</h3>
                  <span style={{fontSize: '0.8rem', color: 'var(--text-muted)'}}>{data.length} total records found</span>
                </div>
                {activeTab === 'Drivers' && (
                  <button className="btn-primary" onClick={() => setIsModalOpen(true)}>
                    <Plus size={16} /> Enroll Driver
                  </button>
                )}
              </div>

              {loading ? (
                <div style={{padding: '3rem', textAlign: 'center'}}>Syncing with MySQL...</div>
              ) : (
                <DataTable 
                  columns={getColumns()} 
                  data={data} 
                  onDelete={activeTab === 'Drivers' ? handleDelete : null} 
                />
              )}
            </div>
          )}
        </main>
      </div>

      {/* Modal Registry */}
      {isModalOpen && (
        <div className="modal-backdrop">
          <div className="modal-surface">
            <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '2rem'}}>
              <h3>Enrollment Registry</h3>
              <button onClick={() => setIsModalOpen(false)} style={{background: 'none', border: 'none', cursor: 'pointer'}}>
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleCreate}>
              <div style={{marginBottom: '1.5rem'}}>
                <label style={{display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px'}}>Full Name</label>
                <input 
                  type="text" 
                  className="search-box" style={{width: '100%'}}
                  value={formData.driver_name}
                  onChange={e => setFormData({...formData, driver_name: e.target.value})}
                  required
                />
              </div>
              <div style={{display: 'flex', gap: '1rem', marginBottom: '1.5rem'}}>
                <div style={{flex: 1}}>
                  <label style={{display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px'}}>Age</label>
                  <input 
                    type="number" 
                    className="search-box" style={{width: '100%'}}
                    value={formData.age}
                    onChange={e => setFormData({...formData, age: e.target.value})}
                  />
                </div>
                <div style={{flex: 1}}>
                  <label style={{display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px'}}>Nationality</label>
                  <input 
                    type="text" 
                    className="search-box" style={{width: '100%'}}
                    value={formData.nationality}
                    onChange={e => setFormData({...formData, nationality: e.target.value})}
                  />
                </div>
              </div>
              <div style={{marginBottom: '2rem'}}>
                <label style={{display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px'}}>Operating Team</label>
                <select 
                  className="search-box" style={{width: '100%'}}
                  value={formData.team_id}
                  onChange={e => setFormData({...formData, team_id: e.target.value})}
                  required
                >
                  <option value="">Select registry team...</option>
                  {teams.map(t => (
                    <option key={t.team_id} value={t.team_id}>{t.team_name}</option>
                  ))}
                </select>
              </div>
              <button type="submit" className="btn-primary" style={{width: '100%'}}>Commit Registry</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
