import { Router } from 'express';
import { homePage, transactionsHistory } from '../controllers/userController.js';

const userRouter = Router();

userRouter.post('/nova-transacao/:type', transactionsHistory);
userRouter.get('/home', homePage);

export default userRouter;
