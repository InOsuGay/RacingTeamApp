import React from 'react';
import { Search, LogOut, Printer } from 'lucide-react';

const TopBar = ({ title, onLogout, searchTerm, setSearchTerm, onPrintClick, canPrint }) => {
  return (
    <header className="topbar">
      <div className="topbar-left">
        <h1 className="topbar-title">{title}</h1>
      </div>
      
      <div className="topbar-right">
         <div className="search-box">
           <Search size={18} />
           <input 
             type="text" 
             placeholder={`Search ${title}...`} 
             value={searchTerm}
             onChange={(e) => setSearchTerm(e.target.value)}
           />
         </div>

         {canPrint && (
           <button 
             className="icon-btn" 
             onClick={onPrintClick}
             title="Print Report Configuration"
             style={{ marginLeft: '10px' }}
           >
             <Printer size={20} />
           </button>
         )}
 
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