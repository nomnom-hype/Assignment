import { useEffect, useMemo, useState } from 'react';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const [summary, setSummary] = useState(null);
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [projectForm, setProjectForm] = useState({ name: '', description: '' });
  const [memberForm, setMemberForm] = useState({ projectId: '', userId: '' });
  const [taskForm, setTaskForm] = useState({ title: '', projectId: '', assignedTo: '', dueDate: '' });
  const [message, setMessage] = useState('');

  const refresh = async () => {
    const [sumRes, projRes, taskRes, userRes] = await Promise.all([
      api.get('/tasks/dashboard/summary'),
      api.get('/projects'),
      api.get('/tasks'),
      api.get('/users')
    ]);
    setSummary(sumRes.data);
    setProjects(projRes.data);
    setTasks(taskRes.data);
    setUsers(userRes.data);
  };

  useEffect(() => {
    refresh().catch(() => setMessage('Unable to load dashboard data.'));
  }, []);

  const selectedProject = useMemo(() => projects.find((p) => p._id === taskForm.projectId), [projects, taskForm.projectId]);

  const createProject = async (e) => {
    e.preventDefault();
    try {
      await api.post('/projects', projectForm);
      setProjectForm({ name: '', description: '' });
      setMessage('Project created.');
      await refresh();
    } catch (err) { setMessage(err.response?.data?.message || 'Project creation failed.'); }
  };

  const addMember = async (e) => {
    e.preventDefault();
    try {
      await api.patch(`/projects/${memberForm.projectId}/members`, { userId: memberForm.userId });
      setMemberForm({ projectId: '', userId: '' });
      setMessage('Member added to project.');
      await refresh();
    } catch (err) { setMessage(err.response?.data?.message || 'Add member failed.'); }
  };

  const createTask = async (e) => {
    e.preventDefault();
    try {
      await api.post('/tasks', taskForm);
      setTaskForm({ title: '', projectId: '', assignedTo: '', dueDate: '' });
      setMessage('Task created.');
      await refresh();
    } catch (err) { setMessage(err.response?.data?.message || 'Task creation failed.'); }
  };

  const updateStatus = async (taskId, status) => {
    try {
      await api.patch(`/tasks/${taskId}/status`, { status });
      await refresh();
    } catch (err) { setMessage(err.response?.data?.message || 'Status update failed.'); }
  };

  return <div><h1>Team Task Manager</h1><p>Logged in as {user.name} ({user.role})</p><button onClick={logout}>Logout</button>{message && <p>{message}</p>}
    <h2>Dashboard</h2>{summary && <ul><li>Total: {summary.total}</li><li>Todo: {summary.todo}</li><li>In Progress: {summary.inProgress}</li><li>Done: {summary.done}</li><li>Overdue: {summary.overdue}</li></ul>}
    {user.role === 'Admin' && <form onSubmit={createProject}><h3>Create Project</h3><input placeholder="Project name" value={projectForm.name} onChange={(e)=>setProjectForm({...projectForm,name:e.target.value})}/><input placeholder="Description" value={projectForm.description} onChange={(e)=>setProjectForm({...projectForm,description:e.target.value})}/><button>Create Project</button></form>}
    {user.role === 'Admin' && <form onSubmit={addMember}><h3>Add Team Member</h3><select value={memberForm.projectId} onChange={(e)=>setMemberForm({...memberForm,projectId:e.target.value})}><option value="">Select project</option>{projects.map((p)=><option key={p._id} value={p._id}>{p.name}</option>)}</select><select value={memberForm.userId} onChange={(e)=>setMemberForm({...memberForm,userId:e.target.value})}><option value="">Select user</option>{users.map((u)=><option key={u._id} value={u._id}>{u.name} ({u.role})</option>)}</select><button>Add Member</button></form>}
    <form onSubmit={createTask}><h3>Create Task</h3><input placeholder="Task title" value={taskForm.title} onChange={(e)=>setTaskForm({...taskForm,title:e.target.value})}/><select value={taskForm.projectId} onChange={(e)=>setTaskForm({...taskForm,projectId:e.target.value,assignedTo:''})}><option value="">Select project</option>{projects.map((p)=><option key={p._id} value={p._id}>{p.name}</option>)}</select><select value={taskForm.assignedTo} onChange={(e)=>setTaskForm({...taskForm,assignedTo:e.target.value})}><option value="">Assign to</option>{(selectedProject?.members||[]).map((m)=><option key={m._id} value={m._id}>{m.name}</option>)}</select><input type="date" value={taskForm.dueDate} onChange={(e)=>setTaskForm({...taskForm,dueDate:e.target.value})}/><button>Create Task</button></form>
    <h3>Tasks</h3><ul>{tasks.map((t)=><li key={t._id}>{t.title} - {t.project?.name} - {t.assignedTo?.name} - {t.status}<select value={t.status} onChange={(e)=>updateStatus(t._id,e.target.value)}><option>Todo</option><option>In Progress</option><option>Done</option></select></li>)}</ul></div>;
}
