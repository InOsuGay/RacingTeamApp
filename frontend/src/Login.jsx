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

      const res = await axios.post("http://localhost:5000/api/users/login", { username, password });

      if(res.data.success){
        const user = res.data.data;

        if (user) {
          
          // Map DB 'manager' to frontend 'team_manager' for tab permissions
          let userRole = user.role;
          if (userRole === "manager") userRole = "team_manager";

          setRole(userRole);   
          setIsLogin(true);
          
          if(userRole === "admin"){
            navigate("/");
          } else if(userRole === "race_manager"){
            navigate("/");
          } else if(userRole === "team_manager"){
            navigate("/");
          }
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