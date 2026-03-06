import React from 'react';
import { 
  Users, 
  Flag, 
  Car, 
  LayoutDashboard, 
  MapPin, 
  ListOrdered,
  ShieldAlert
} from 'lucide-react';

const Sidebar = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    { name: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { name: 'Teams', icon: <Flag size={20} /> },
    { name: 'Drivers', icon: <Users size={20} /> },
    { name: 'Cars', icon: <Car size={20} /> },
    { name: 'Races', icon: <MapPin size={20} /> },
    { name: 'Results', icon: <ListOrdered size={20} /> },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="logo-icon">
          <ShieldAlert color="white" fill="#2563eb" size={24} />
        </div>
        <div className="logo-text-group">
          <span className="logo-main">VELOCITY</span>
          <span className="logo-sub">MANAGEMENT</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        <ul className="nav-menu">
          {menuItems.map((item) => (
            <li 
              key={item.name}
              className={`nav-item ${activeTab === item.name ? 'active' : ''}`}
              onClick={() => setActiveTab(item.name)}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.name}</span>
            </li>
          ))}
        </ul>
      </nav>

      <div className="sidebar-footer">
        <div className="user-profile">
          <div className="avatar">AD</div>
          <div className="user-info">
            <span className="user-name">Admin User</span>
            <span className="user-role">System Controller</span>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
