import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';

export default function SignupPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'Member' });
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post('/auth/signup', form);
      login(data);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed');
    }
  };

  return <form onSubmit={onSubmit}><h2>Signup</h2>{error && <p>{error}</p>}<input placeholder="Name" value={form.name} onChange={(e)=>setForm({...form,name:e.target.value})}/><input placeholder="Email" value={form.email} onChange={(e)=>setForm({...form,email:e.target.value})}/><input type="password" placeholder="Password" value={form.password} onChange={(e)=>setForm({...form,password:e.target.value})}/><select value={form.role} onChange={(e)=>setForm({...form,role:e.target.value})}><option>Member</option><option>Admin</option></select><button>Signup</button><p>Have account? <Link to="/login">Login</Link></p></form>;
}
