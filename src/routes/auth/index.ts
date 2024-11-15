import express from 'express';
import { registerController } from '../../controllers/auth';

const router = express.Router();

router.post('/api/register', registerController);

export default router;