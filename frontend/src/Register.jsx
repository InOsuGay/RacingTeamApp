import React, { useState } from "react";
import axios from "axios";

function Register({ setShowRegister }) {

  const [formData,setFormData] = useState({
    username:"",
    password:"",
    confirmPassword:"",
    fullname:"",
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
      formData.confirmPassword === ""
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
        "http://localhost:5000/api/users",
        {
          username: formData.username,
          password_hash: formData.password,
          role: formData.role || "user"
        }
      );

      if(res.data.success){
        alert("Register success");
        setShowRegister(false);
      }else{
        alert(res.data.message);
      }

    }catch(err){
      console.error(err);
      alert("Server error: " + (err.response?.data?.message || err.message));
    }

  };

  return(

    <div className="modal-backdrop" style={{ background: 'var(--bg-main)' }}>
      <div className="modal-surface card" style={{ width: '450px', textAlign: 'center', maxHeight: '90vh', overflowY: 'auto' }}>
        <h2 style={{ fontSize: '1.8rem', fontWeight: '800', marginBottom: '1.5rem', color: 'var(--primary)', letterSpacing: '0.05em' }}>
          CREATE ACCOUNT
        </h2>

        <div style={{ textAlign: 'left', marginBottom: '1rem' }}>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '6px', color: 'var(--text-main)' }}>
              Username
            </label>
            <input
              type="text"
              name="username"
              placeholder="Pick a unique username"
              value={formData.username}
              onChange={handleChange}
              style={{ marginBottom: '0.5rem' }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '6px', color: 'var(--text-main)' }}>
                Password
              </label>
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                style={{ marginBottom: '0.5rem' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '6px', color: 'var(--text-main)' }}>
                Confirm
              </label>
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm"
                value={formData.confirmPassword}
                onChange={handleChange}
                style={{ marginBottom: '0.5rem' }}
              />
            </div>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '6px', color: 'var(--text-main)' }}>
              Full Name
            </label>
            <input
              type="text"
              name="fullname"
              placeholder="Your display name"
              value={formData.fullname}
              onChange={handleChange}
              style={{ marginBottom: '0.5rem' }}
            />
          </div>

          <button 
            className="btn-primary" 
            onClick={handleRegister}
            style={{ width: '100%', padding: '14px' }}
          >
            Create System Identity
          </button>
        </div>

        <div style={{ marginTop: '1rem', borderTop: '1px solid var(--border)', paddingTop: '1rem' }}>
          <button 
            onClick={()=>setShowRegister(false)}
            style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: '600', cursor: 'pointer', fontSize: '0.9rem' }}
          >
            Return to Login
          </button>
        </div>
      </div>
    </div>

  );

}

export default Register;