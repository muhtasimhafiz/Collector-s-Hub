import express, { Router } from 'express';
import { createUserHandler } from './';

const router: Router = express.Router();

router.post('/users', createUserHandler);

export default router;
