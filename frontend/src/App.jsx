import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import * as api from './api/racingApi';
import Login from './Login';
import Register from "./Register";

import Dashboard from "./pages/Dashboard";
import Drivers from "./pages/Drivers";
import Cars from "./pages/Cars";
import Results from "./pages/Results";

import './index.css';

function App() {
  const [isLogin, setIsLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [role, setRole] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [searchTerm, setSearchTerm] = useState('');

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const [stats, setStats] = useState({
    teams: 0,
    drivers: 0,
    cars: 0,
    races: 0
  });

  // ================= FETCH =================
  useEffect(() => {
    if (isLogin && currentUser) {
      fetchDashboardStats();
      loadTabData();
    }
  }, [activeTab, isLogin, currentUser]);

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

    } catch (err) {
      console.error("Dashboard error:", err);
    }
  };

  const loadTabData = async () => {
    if (activeTab === 'Dashboard') return;

    setLoading(true);
    try {
      let res = { data: { data: [] } };

      if (activeTab === 'Drivers') res = await api.getDrivers();
      if (activeTab === 'Cars') res = await api.getCars();
      if (activeTab === 'Results') res = await api.getResults();

      setData(res.data.data || []);
    } catch (err) {
      console.error("Load tab error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (row) => {
    if (!window.confirm('Delete this record?')) return;

    try {
      if (activeTab === 'Drivers') await api.deleteDriver(row.driver_id);
      if (activeTab === 'Cars') await api.deleteCar(row.car_id);
      if (activeTab === 'Results') await api.deleteResult(row.result_id);

      loadTabData();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleLogout = () => {
    setIsLogin(false);
    setRole(null);
    setCurrentUser(null);
  };

  const getColumns = (tab) => {
    switch (tab) {
      case 'Drivers':
        return [
          { header: 'ID', key: 'driver_id' },
          { header: 'Name', render: r => `${r.first_name} ${r.last_name}` },
          { header: 'Number', key: 'driver_number' },
        ];
      case 'Cars':
        return [
          { header: 'ID', key: 'car_id' },
          { header: 'Brand', key: 'brand' },
          { header: 'Model', key: 'model' },
        ];
      case 'Results':
        return [
          { header: 'ID', key: 'result_id' },
          { header: 'Position', key: 'finish_position' },
          { header: 'Points', key: 'points_earned' },
        ];
      default:
        return [];
    }
  };

  const filteredData = data.filter(item =>
    Object.values(item).some(val =>
      String(val).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  // ================= LOGIN CHECK (ต้องอยู่ล่างสุดก่อน return) =================
  if (!isLogin) {
    if (showRegister) {
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

  // ================= UI =================
  return (
    <div className="app-layout">
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        allowedTabs={["Dashboard", "Drivers", "Cars", "Results"]}
        user={currentUser}
      />

      <div className="main-wrapper">
        <TopBar
          title={activeTab}
          onLogout={handleLogout}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />

        <main className="content">

          {activeTab === 'Dashboard' && (
            <Dashboard
              stats={stats}
              role={role}
              currentUser={currentUser}
            />
          )}

          {activeTab === 'Drivers' && (
            <Drivers
              data={filteredData}
              loading={loading}
              getColumns={getColumns}
              handleDelete={handleDelete}
            />
          )}

          {activeTab === 'Cars' && (
            <Cars
              data={filteredData}
              loading={loading}
              getColumns={getColumns}
              handleDelete={handleDelete}
            />
          )}

          {activeTab === 'Results' && (
            <Results
              data={filteredData}
              loading={loading}
              getColumns={getColumns}
              handleDelete={handleDelete}
            />
          )}

        </main>
      </div>
    </div>
  );
}

export default App;