import { Router } from 'express';
import { homePage, ttransactionsHistory } from '../controllers/userController.js';

const userRouter = Router();

userRouter.post('/nova-transacao/:type', ttransactionsHistory);
userRouter.get('/home', homePage);

export default userRouter;
