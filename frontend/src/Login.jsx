import axios from "axios";
import React, { useState } from "react";

function Login({ setIsLogin, setShowRegister, setRole, setCurrentUser }) {   

  const [username,setUsername] = useState("");
  const [password,setPassword] = useState("");

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
          setRole(user.role);   
          setCurrentUser(user); 
          setIsLogin(true);
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
    <div className="login-container">
      <div className="login-card">

        <h2 className="login-title">RACING MANAGEMENT</h2>

        <div className="form-group">
          <label>Username</label>
          <input
            type="text"
            placeholder="Enter username"
            value={username}
            onChange={(e)=>setUsername(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e)=>setPassword(e.target.value)}
          />
        </div>

        <button className="btn-primary" onClick={handleLogin}>
          Login
        </button>

        <button 
          className="register-btn" 
          onClick={()=>setShowRegister(true)}
        >
          Create System Account
        </button>

      </div>
    </div>
  );
}

export default Login;