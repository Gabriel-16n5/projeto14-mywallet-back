import userRouter from "./userRouter.js"
import authRouter from "./authRouter.js"
import { Router } from "express"

const router = Router();

router.use(userRouter);
router.use(authRouter);

export default router;