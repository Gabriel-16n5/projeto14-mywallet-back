import { Router } from 'express';
import { login, register } from '../controllers/authController.js';

const authRouter = Router();

authRouter.post('/cadastro', register);
authRouter.post('/', login);

export default authRouter;
