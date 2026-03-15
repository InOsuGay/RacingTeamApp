import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";


function Login({ setIsLogin, setShowRegister, setRole, setCurrentUser }) {   

  const [username,setUsername] = useState("");
  const [password,setPassword] = useState("");
  const navigate = useNavigate();
  const handleLogin = async () => {

    if(username === "" || password === ""){
      alert("Please enter username and password");
      return;
    }

    try{

      const res = await axios.post("http://localhost:5000/api/users/login", { username, password });

      if(res.data.success){
        const user = res.data.data;

        if (user) {
          
          const userRole = user.role;

          setRole(userRole);   
          setCurrentUser(user); 
          setIsLogin(true);
          
          // All roles go to home for now, as App handles the layout
          navigate("/");
        } else {
          alert("Invalid username or password");
        }

      }else{
        alert(res.data.message);
      }

    }catch(err){
      alert("Server error");
    }

  };

  return (

    <div className="modal-backdrop" style={{ background: 'var(--bg-main)' }}>
      <div className="modal-surface card" style={{ width: '400px', textAlign: 'center' }}>
        <h2 style={{ fontSize: '1.8rem', fontWeight: '800', marginBottom: '2rem', color: 'var(--primary)', letterSpacing: '0.05em' }}>
          RACING MANAGEMENT
        </h2>

        <div style={{ textAlign: 'left', marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '6px', color: 'var(--text-main)' }}>
            Username
          </label>
          <input
            type="text"
            placeholder="Enter your username"
            value={username}
            onChange={(e)=>setUsername(e.target.value)}
            style={{ marginBottom: '1rem' }}
          />

          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '6px', color: 'var(--text-main)' }}>
            Password
          </label>
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e)=>setPassword(e.target.value)}
            style={{ marginBottom: '1.5rem' }}
          />

          <button 
            className="btn-primary" 
            onClick={handleLogin}
            style={{ width: '100%', padding: '14px' }}
          >
            Authenticate
          </button>
        </div>

        <div style={{ marginTop: '1.5rem', borderTop: '1px solid var(--border)', paddingTop: '1.5rem' }}>
          <button 
            onClick={()=>setShowRegister(true)}
            style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: '600', cursor: 'pointer', fontSize: '0.9rem' }}
          >
            Create System Account
          </button>
        </div>
      </div>
    </div>

  );

}

export default Login;