import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { MongoClient } from "mongodb";
import joi from "joi";
import dayjs from 'dayjs'
import bcrypt from "bcrypt"
const app = express();

app.use(cors());
app.use(express.json());
dotenv.config();

const mongoCLient = new MongoClient(process.env.DATABASE_URL)
    try{
        await mongoCLient.connect()
        console.log("conexão com db feita")
    }catch (erro) {
        console.log("não conectou com o db")
    }
const db = mongoCLient.db();

app.post("/cadastro", async (req, res) => {
    const {name, email, password} = req.body;

    const registerSchema = joi.object({
        name: joi.string().required(),
        email: joi.string().email().required(),
        password: joi.string().required().min(3)
    })
    const validation = registerSchema.validate(req.body, {abortEarly: false});
    if(validation.error) return res.status(422).send(validation.error.details);
    try{
        const emailValidation = await db.collection("users").findOne({email})
        if(emailValidation) return res.status(409).send("Email já cadastrado")
        const encryptedPass = (bcrypt.hashSync(password, 10));
        await db.collection("users").insertOne({
            name: name,
            email: email,
            password: encryptedPass
        })
        res.status(200).send("Conta criada com sucesso")
    } catch (erro) {
        return res.status(500).send(erro.message)
    }

})

app.post("/", async (req, res) => {
    
    try{

    } catch (erro) {
        return res.status(500).send(erro.message)
    }
    
})

app.post("/nova-transacao/:tipo", async (req, res) => {
    
    try{

    } catch (erro) {
        return res.status(500).send(erro.message)
    }
    
})

app.get("/home", async (req, res) => {
    
    try{

    } catch (erro) {
        return res.status(500).send(erro.message)
    }
    
})

app.listen(5000, () => console.log("servidor rodando na porta 5000"))