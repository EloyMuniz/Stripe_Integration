import express from "express";
import cors from "cors";
import stripeRouter from "../routes/stripe";


const app = express();
const PORT = 8080;
const apiVersion = "v1";

const corsOptions = {
    origin: ["http://localhost:3333"]
};

app.use(stripeRouter);
app.use(cors(corsOptions));

app.get(`/${apiVersion}`, function (req, res) {
    res.send('Hello World!');
});


app.use(express.json());

//Dois parametros, onde o primeiro é a porta que será 'escutada' e o segundo uma função de callback para dizer que a porta está iniciada
app.listen(PORT, () =>
    console.log(`✨ Server started on ${PORT}`)
);
