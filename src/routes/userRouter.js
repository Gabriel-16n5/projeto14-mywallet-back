import { Router } from "express";
import { home, transactions } from "../controllers/userController.js";

const userRouter = Router()

userRouter.post("/nova-transacao/:tipo", transactions)
userRouter.get("/home", home)

export default userRouter;