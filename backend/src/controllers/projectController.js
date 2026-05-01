import Project from '../models/Project.js';

export const createProject = async (req, res) => {
  const { name, description, members = [] } = req.body;
  if (!name) return res.status(400).json({ message: 'Project name required' });

  const project = await Project.create({ name, description, owner: req.user._id, members: [req.user._id, ...members] });
  res.status(201).json(project);
};

export const getProjects = async (req, res) => {
  const projects = await Project.find({ members: req.user._id }).populate('owner members', 'name email role');
  res.json(projects);
};

export const addMember = async (req, res) => {
  const project = await Project.findById(req.params.id);
  if (!project) return res.status(404).json({ message: 'Project not found' });
  if (String(project.owner) !== String(req.user._id) && req.user.role !== 'Admin') {
    return res.status(403).json({ message: 'Only owner/admin can add members' });
  }

  const { userId } = req.body;
  if (!userId) return res.status(400).json({ message: 'userId required' });
  if (!project.members.includes(userId)) project.members.push(userId);
  await project.save();
  res.json(project);
};
