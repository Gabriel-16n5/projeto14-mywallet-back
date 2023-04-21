import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { MongoClient } from "mongodb";
import joi from "joi";
import {v4 as uuid} from "uuid"
import bcrypt from "bcrypt"
import dayjs from "dayjs";
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
    const {email, password} = req.body;

    const loginSchema = joi.object({
        email: joi.string().email().required(),
        password: joi.string().required().min(3)
    })
    const validation = loginSchema.validate(req.body, {abortEarly: false});
    if(validation.error) return res.status(422).send(validation.error.details);
    try{
        const user = await db.collection("users").findOne({email})
        if(!user) return res.status(404).send("Email não cadastrado")
        const passValidation = bcrypt.compareSync(password, user.password)
        if(!passValidation) return res.status(401).send("Senha incorreta")
        const token = uuid()
        await db.collection("sessions").insertOne({token, idUser: user._id})
        res.status(200).send(token)
    } catch (erro) {
        return res.status(500).send(erro.message)
    }
    
})

app.post("/nova-transacao/:tipo", async (req, res) => {
    const {valor, description} = req.body;
    const {tipo} = req.params;
    const {authorization} = req.headers;
    if(tipo != "entrada" && tipo != "saida") return res.status(404).send("tipo errado");
    const token = authorization?.replace("Bearer ", "")

    const currencySchema = joi.object({
        valor: joi.number().min(0).required(),
        description: joi.string().required()
    })
    const validation = currencySchema.validate(req.body, {abortEarly: false});
    if(validation.error) return res.status(422).send(validation.error.details);
    try{
        const validationToken = await db.collection("sessions").findOne({token});
        if(!validationToken) return res.status(401).send("Invalid token");
        if(tipo === "entrada"){
            await db.collection("incoming").insertOne({
                idUser: validationToken.idUser,
                token: validationToken.token,
                valor: valor,
                data: dayjs().format('DD/MM')
            })
        } else if (tipo === "saida"){
            await db.collection("out").insertOne({
                idUser: validationToken.idUser,
                token: validationToken.token,
                valor: valor,
                data: dayjs().format('DD/MM')
            })
        }
        res.send("pamonha") 
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