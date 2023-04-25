import { login, register } from "../controllers/authController.js";
import { Router } from "express";

const authRouter = Router();

authRouter.post("/cadastro", register);
authRouter.post("/", login);

export default authRouter;