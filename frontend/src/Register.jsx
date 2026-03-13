import React, { useState } from "react";
import axios from "axios";

function Register({ setShowRegister }) {

  const [formData,setFormData] = useState({
    username:"",
    password:"",
    confirmPassword:"",
    fullname:"",
    email:"",
    role:"user"
  });

  const handleChange = (e)=>{
    setFormData({
      ...formData,
      [e.target.name]:e.target.value
    });
  };

  const handleRegister = async ()=>{

    if(
      formData.username === "" ||
      formData.password === "" ||
      formData.confirmPassword === "" ||
      formData.fullname === "" ||
      formData.email === ""
    ){
      alert("Please fill all fields");
      return;
    }

    if(formData.password !== formData.confirmPassword){
      alert("Password not match");
      return;
    }

    try{

      const res = await axios.post(
        "http://localhost:5000/api/register",
        formData
      );

      if(res.data.success){
        alert("Register success");
        setShowRegister(false);
      }else{
        alert(res.data.message);
      }

    }catch(err){
      alert("Server error");
    }

  };

  return(

    <div style={{textAlign:"center",marginTop:"120px"}}>

      <h2>Create Account</h2>

      <input
        type="text"
        name="username"
        placeholder="Username"
        onChange={handleChange}
      />

      <br/><br/>

      <input
        type="password"
        name="password"
        placeholder="Password"
        onChange={handleChange}
      />

      <br/><br/>

      <input
        type="password"
        name="confirmPassword"
        placeholder="Confirm Password"
        onChange={handleChange}
      />

      <br/><br/>

      <input
        type="text"
        name="fullname"
        placeholder="Full Name"
        onChange={handleChange}
      />

      <br/><br/>

      <input
        type="email"
        name="email"
        placeholder="Email"
        onChange={handleChange}
      />

      <br/><br/>

      

      <br/><br/>

      <button onClick={handleRegister}>
        
      </button>

      <br/><br/>

      <button onClick={()=>setShowRegister(false)}>
        Back to Login
      </button>

    </div>

  );

}

export default Register;