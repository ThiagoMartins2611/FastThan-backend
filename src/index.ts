import 'dotenv/config'
import express from 'express';
import cors from 'cors';
import authenticatedRoutes from './routes/authenticatedRoutes.js';
import Auth from './middlewares/auth.js';
import UnauthenticatedRoutes from './routes/UnauthenticatedRoutes.js';


const app = express();
app.use(cors());
app.use(express.json());


//routes
app.use(UnauthenticatedRoutes);
app.use(Auth.userAuth);
app.use(authenticatedRoutes);


app.listen(8000,()=>{
    console.log("servidor rodando na porta 8000");
});