import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post('/auth/login', form);
      login(data);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return <form onSubmit={onSubmit}><h2>Login</h2>{error && <p>{error}</p>}<input placeholder="Email" value={form.email} onChange={(e)=>setForm({...form,email:e.target.value})}/><input type="password" placeholder="Password" value={form.password} onChange={(e)=>setForm({...form,password:e.target.value})}/><button>Login</button><p>No account? <Link to="/signup">Signup</Link></p></form>;
}
