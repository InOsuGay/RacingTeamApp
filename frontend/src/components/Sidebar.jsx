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

const Sidebar = ({ activeTab, setActiveTab, allowedTabs, user }) => {
  const menuItems = [
    { name: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { name: 'Teams', icon: <Flag size={20} /> },
    { name: 'Drivers', icon: <Users size={20} /> },
    { name: 'Cars', icon: <Car size={20} /> },
    { name: 'Races', icon: <MapPin size={20} /> },
    { name: 'Results', icon: <ListOrdered size={20} /> },
    { name: 'Manage Seasons', icon: <Flag size={20} /> },
    { name: 'Manage Users', icon: <ShieldAlert size={20} /> },
  ];

  const getRoleLabel = (r) => {
    if (r === 'admin') return 'Admin';
    if (r === 'manager') return 'เจ้าของงานแข่ง';
    if (r === 'user') return 'ทีมที่มาแข่ง';
    return r;
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <span className="logo-main">RACING MANAGEMENT</span>
      </div>

      <nav className="sidebar-nav">
        <ul className="nav-menu">
          {menuItems
            .filter(item => allowedTabs.includes(item.name))
            .map((item) => (
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
          <div className="avatar">
            {user?.username ? user.username.substring(0, 2).toUpperCase() : '??'}
          </div>
          <div className="user-info">
            <span className="user-name">{user?.username || 'Unknown User'}</span>
            <span className="user-role">{getRoleLabel(user?.role)}</span>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
