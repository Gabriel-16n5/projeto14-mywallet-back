import db from "../db.js";
import joi from "joi";
import dayjs from "dayjs";

export async function transactions (req, res) {
    const {valor, description} = req.body;
    const {tipo} = req.params;
    const {authorization} = req.headers;
    if(tipo != "entrada" && tipo != "saida") return res.status(404).send("page does not exist");
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
                name: validationToken.name,
                idUser: validationToken.idUser,
                token: validationToken.token,
                valor: (valor*1),
                description: description,
                data: dayjs().format('DD/MM'),
                exactTime: Date.now()
            })
        } else if (tipo === "saida"){
            await db.collection("out").insertOne({
                name: validationToken.name,
                idUser: validationToken.idUser,
                token: validationToken.token,
                valor: (valor*-1),
                description: description,
                data: dayjs().format('DD/MM'),
                exactTime: Date.now()
            })
        }
        res.send("Olá pessoa, beba água, é importante <3") 
    } catch (erro) {
        return res.status(500).send(erro.message)
    }
    
}

export async function home (req, res) {
    const {authorization} = req.headers;

    if(!authorization) return res.status(401).send("Unauthorized access");
    const token = authorization?.replace("Bearer ", "")
    try{
        const session = await db.collection("sessions").findOne({token});
        console.log(session)
        if(!session) return res.status(401).send("invalid token")
        const bankTransitionOut = await db.collection("out").find({
            idUser: session.idUser
        }).toArray();
        const bankTransitionIncoming = await db.collection("incoming").find({
            idUser: session.idUser
        }).toArray();
        const sortedBalance = [...bankTransitionOut, ...bankTransitionIncoming];
        const sorted = sortedBalance.sort((a, b) =>  b.exactTime - a.exactTime);
        res.send(sorted)
    } catch (erro) {
        return res.status(500).send(erro.message)
    }
    
}