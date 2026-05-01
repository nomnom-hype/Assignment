import Task from '../models/Task.js';
import Project from '../models/Project.js';

export const createTask = async (req, res) => {
  const { title, description, projectId, assignedTo, dueDate } = req.body;
  if (!title || !projectId || !assignedTo) return res.status(400).json({ message: 'Missing fields' });

  const project = await Project.findById(projectId);
  if (!project) return res.status(404).json({ message: 'Project not found' });
  if (!project.members.map(String).includes(String(req.user._id))) return res.status(403).json({ message: 'Not a project member' });

  const task = await Task.create({ title, description, project: projectId, assignedTo, createdBy: req.user._id, dueDate });
  res.status(201).json(task);
};

export const getTasks = async (req, res) => {
  const filter = req.query.projectId ? { project: req.query.projectId } : {};
  const tasks = await Task.find(filter).populate('project assignedTo createdBy', 'name email');
  res.json(tasks);
};

export const updateTaskStatus = async (req, res) => {
  const { status } = req.body;
  if (!['Todo', 'In Progress', 'Done'].includes(status)) return res.status(400).json({ message: 'Invalid status' });
  const task = await Task.findById(req.params.id);
  if (!task) return res.status(404).json({ message: 'Task not found' });
  if (String(task.assignedTo) !== String(req.user._id) && req.user.role !== 'Admin') {
    return res.status(403).json({ message: 'Only assignee/admin can update status' });
  }
  task.status = status;
  await task.save();
  res.json(task);
};

export const dashboard = async (req, res) => {
  const tasks = await Task.find({ assignedTo: req.user._id });
  const now = new Date();
  const data = {
    total: tasks.length,
    todo: tasks.filter((t) => t.status === 'Todo').length,
    inProgress: tasks.filter((t) => t.status === 'In Progress').length,
    done: tasks.filter((t) => t.status === 'Done').length,
    overdue: tasks.filter((t) => t.dueDate && t.dueDate < now && t.status !== 'Done').length
  };
  res.json(data);
};
