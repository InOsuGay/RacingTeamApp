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
import Races from "./pages/Races";
import Leaderboard from "./pages/Leaderboard";
import ManageUsers from "./pages/ManageUsers";
import ManageTeams from "./pages/ManageTeams";
import ManageSeasons from "./pages/ManageSeasons";

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
  const [formData, setFormData] = useState({});

  const [teams, setTeams] = useState([]);
  const [driversList, setDriversList] = useState([]);
  const [carsList, setCarsList] = useState([]);
  const [racesList, setRacesList] = useState([]);

  const [stats, setStats] = useState({
    teams: 0,
    drivers: 0,
    cars: 0,
    races: 0
  });

  // ================= ROLE =================
  const getAllowedTabs = () => {
    if (role === "admin") {
      return ["Dashboard", "Manage Users", "Manage Teams", "Manage Seasons", "Drivers", "Cars", "Races", "Leaderboard", "Results"];
    }
    if (role === "manager") {
      return ["Dashboard", "Races", "Results", "Leaderboard"];
    }
    if (role === "user") {
      return ["Dashboard", "Drivers", "Cars", "Results"];
    }
    return ["Dashboard"];
  };

  // ================= FETCH =================
  useEffect(() => {
    if (isLogin && currentUser) {
      fetchDashboardStats();
      loadTabData();
      fetchLists();
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
      console.error(err);
    }
  };

  const fetchLists = async () => {
    try {
      const [t, d, c, r] = await Promise.all([
        api.getTeams(),
        api.getDrivers(),
        api.getCars(),
        api.getRaces()
      ]);

      setTeams(t.data.data);
      setDriversList(d.data.data);
      setCarsList(c.data.data);
      setRacesList(r.data.data);
    } catch (err) {
      console.error(err);
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
      if (activeTab === 'Races') res = await api.getRaces();
      if (activeTab === 'Manage Users') res = await api.getUsers();
      if (activeTab === 'Manage Teams') res = await api.getTeams();
      if (activeTab === 'Manage Seasons') res = await api.getSeasons();

      setData(res.data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // ================= CREATE =================
  const handleCreate = async (e) => {
    e.preventDefault();

    try {
      if (activeTab === 'Drivers') await api.addDriver(formData);
      if (activeTab === 'Cars') await api.addCar(formData);
      if (activeTab === 'Results') await api.addResult(formData);
      if (activeTab === 'Races') await api.addRace(formData);
      if (activeTab === 'Manage Users') await api.addUser(formData);
      if (activeTab === 'Manage Teams') await api.addTeam(formData);
      if (activeTab === 'Manage Seasons') await api.addSeason(formData);

      setFormData({});
      loadTabData();
    } catch (err) {
      alert("Create failed: " + err.message);
    }
  };

  // ================= DELETE =================
  const handleDelete = async (row) => {
    if (!window.confirm('Delete this record?')) return;

    try {
      if (activeTab === 'Drivers') await api.deleteDriver(row.driver_id);
      if (activeTab === 'Cars') await api.deleteCar(row.car_id);
      if (activeTab === 'Results') await api.deleteResult(row.result_id);
      if (activeTab === 'Races') await api.deleteRace(row.race_id);
      if (activeTab === 'Manage Users') await api.deleteUser(row.user_id);
      if (activeTab === 'Manage Teams') await api.deleteTeam(row.team_id);
      if (activeTab === 'Manage Seasons') await api.deleteSeason(row.season_id);

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

  const filteredData = data.filter(item =>
    Object.values(item).some(val =>
      String(val).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  // ================= LOGIN =================
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
        allowedTabs={getAllowedTabs()}
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
            <Dashboard stats={stats} role={role} currentUser={currentUser} />
          )}

          {activeTab === 'Drivers' && (
            <Drivers data={filteredData} loading={loading} teams={teams} handleCreate={handleCreate} formData={formData} setFormData={setFormData} />
          )}

          {activeTab === 'Cars' && (
            <Cars data={filteredData} loading={loading} teams={teams} handleCreate={handleCreate} formData={formData} setFormData={setFormData} />
          )}

          {activeTab === 'Results' && (
            <Results data={filteredData} loading={loading} racesList={racesList} driversList={driversList} carsList={carsList} handleCreate={handleCreate} formData={formData} setFormData={setFormData} />
          )}

          {activeTab === 'Races' && (
            <Races data={filteredData} loading={loading} handleCreate={handleCreate} handleDelete={handleDelete} formData={formData} setFormData={setFormData} />
          )}

          {activeTab === 'Leaderboard' && (
            <Leaderboard data={data} />
          )}

          {activeTab === 'Manage Users' && (
            <ManageUsers data={filteredData} loading={loading} handleCreate={handleCreate} handleDelete={handleDelete} formData={formData} setFormData={setFormData} />
          )}

          {activeTab === 'Manage Teams' && (
            <ManageTeams data={filteredData} loading={loading} handleCreate={handleCreate} handleDelete={handleDelete} formData={formData} setFormData={setFormData} />
          )}

          {activeTab === 'Manage Seasons' && (
            <ManageSeasons data={filteredData} loading={loading} handleCreate={handleCreate} handleDelete={handleDelete} formData={formData} setFormData={setFormData} />
          )}

        </main>
      </div>
    </div>
  );
}

export default App;