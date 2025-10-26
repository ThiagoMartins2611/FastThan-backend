import 'dotenv/config'
import express, { Response, Request } from 'express';
import cors from 'cors';
import authenticatedRoutes from './routes/UnauthenticatedRoutes.js';
import auth from './middlewares/auth.js';
import UnauthenticatedRoutes from './routes/UnauthenticatedRoutes.js';

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req:Request, res:Response)=>{
    res.send("churras meu nobre");
});

//routes
app.use(UnauthenticatedRoutes);
app.use(auth.userAuth);
app.use(authenticatedRoutes);


app.listen(8000,()=>{
    console.log("servidor rodando na porta 8000");
});