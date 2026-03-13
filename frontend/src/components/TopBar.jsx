import React from 'react';
import { Bell, Search, Settings, LogOut } from 'lucide-react';

const TopBar = ({ title, onLogout }) => {
  return (
    <header className="topbar">
      <div className="topbar-left">
        <h1 className="topbar-title">{title} Management</h1>
      </div>
      
      <div className="topbar-right">
        <div className="search-box">
          <Search size={18} />
          <input type="text" placeholder="Global search..." />
        </div>
        
        <button className="icon-btn">
          <Bell size={20} />
          <span className="badge-dot"></span>
        </button>
        
        <button className="icon-btn">
          <Settings size={20} />
        </button>

        {/* ปุ่ม Log Out - แยกให้ชัดเจนกว่าไอคอนเล็ก ๆ */}
        <button 
          className="btn-logout"
          onClick={onLogout}
          title="ออกจากระบบ"
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </header>
  );
};

export default TopBar;