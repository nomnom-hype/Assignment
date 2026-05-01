import { Router } from 'express';
import { addMember, createProject, getProjects } from '../controllers/projectController.js';
import { protect, requireRole } from '../middleware/auth.js';

const router = Router();
router.use(protect);
router.get('/', getProjects);
router.post('/', requireRole('Admin'), createProject);
router.patch('/:id/members', requireRole('Admin'), addMember);

export default router;
