import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";


function Login({ setIsLogin, setShowRegister, setRole }) {   

  const [username,setUsername] = useState("");
  const [password,setPassword] = useState("");
  const navigate = useNavigate();
  const handleLogin = async () => {

    if(username === "" || password === ""){
      alert("Please enter username and password");
      return;
    }

    try{

      const res = await axios.post(
        "http://localhost:5000/api/login",
        {
          username:username,
          password:password
        }
      );

      if(res.data.success){

        alert("Login success");

        setRole(res.data.role);   
        setIsLogin(true);
        
if(res.data.role === "admin"){
  navigate("/admin/dashboard");
}

if(res.data.role === "race_manager"){
  navigate("/race/dashboard");
}

if(res.data.role === "team_manager"){
  navigate("/team/dashboard");
}

      }else{

        alert(res.data.message);

      }

    }catch(err){

      alert("Server error");

    }

  };

  return (

    <div style={{textAlign:"center",marginTop:"150px"}}>

      <h2>Login</h2>

      <input
        type="text"
        placeholder="Username"
        onChange={(e)=>setUsername(e.target.value)}
      />

      <br/><br/>

      <input
        type="password"
        placeholder="Password"
        onChange={(e)=>setPassword(e.target.value)}
      />

      <br/><br/>

      <button onClick={handleLogin}>
        Login
      </button>

      <br/><br/>

      <button onClick={()=>setShowRegister(true)}>
        Create Account
      </button>

    </div>

  );

}

export default Login;