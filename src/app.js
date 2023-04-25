/*
                        ───▄▀▀▀▄▄▄▄▄▄▄▀▀▀▄───
                        ───█▒▒░░░░░░░░░▒▒█───
                        ────█░░█░░░░░█░░█────
                        ─▄▄──█░░░▀█▀░░░█──▄▄─
                        █░░█─▀▄░░░░░░░▄▀─█░░█
                        █▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀█
                        █░░╦─╦╔╗╦─╔╗╔╗╔╦╗╔╗░░█
                        █░░║║║╠─║─║─║║║║║╠─░░█
                        █░░╚╩╝╚╝╚╝╚╝╚╝╩─╩╚╝░░█
                        █▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄█

    Olá pessoa, tudo bem? espero que sim (◠‿◠)/
    Apenas gostaria de lhe informar que optei por não fazer
    alguns middlewares, até tentei, mas bagunçou muito a lógica
    na minha cabeça, foi um erro deixar para fazer ao final. Já
    a separação dos schemas não achei positivo para o código tirar
    eles dos controllers, são únicos e pequenos. Obrigado <3

*/
import express from "express";
import cors from "cors";
import router from "./routes/index.Router.js";
const app = express();

app.use(cors());
app.use(express.json());
app.use(router);




const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log("server running on port 8000 || or who knows"))