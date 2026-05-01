import { Router } from 'express';
import { createTask, dashboard, getTasks, updateTaskStatus } from '../controllers/taskController.js';
import { protect } from '../middleware/auth.js';

const router = Router();
router.use(protect);
router.get('/', getTasks);
router.post('/', createTask);
router.patch('/:id/status', updateTaskStatus);
router.get('/dashboard/summary', dashboard);

export default router;
