import User from '../models/User.js';

export const listUsers = async (_req, res) => {
  const users = await User.find().select('name email role');
  res.json(users);
};
