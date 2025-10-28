import 'dotenv/config'
import express, { Request, Response } from 'express';
import cors from 'cors';
import authenticatedRoutes from './routes/authenticatedRoutes.js';
import Auth from './middlewares/auth.js';
import unauthenticatedRoutes from './routes/UnauthenticatedRoutes.js';


const app = express();
app.use(cors());
app.use(express.json());



//routes
app.use(unauthenticatedRoutes);

app.get("/test", (req:Request, res:Response)=>{
    res.send({mensagem:"churras testando"})
})

app.use(Auth.userAuth);
app.use(authenticatedRoutes);


app.listen(8000,()=>{
    console.log("servidor rodando na porta 8000");
});