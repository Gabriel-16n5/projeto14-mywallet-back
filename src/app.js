import express from "express";
import cors from "cors";
import { login, register } from "./controllers/authController.js";
import { home, transactions } from "./controllers/userController.js";
const app = express();

app.use(cors());
app.use(express.json());


app.post("/cadastro", register);
app.post("/", login);
app.post("/nova-transacao/:tipo", transactions)
app.get("/home", home)

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log("server running on port 8000 || or who knows"))