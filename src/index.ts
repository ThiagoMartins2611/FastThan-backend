import 'dotenv/config'
import express from 'express';
import cors from 'cors';
import authenticatedRoutes from './routes/UnauthenticatedRoutes.js';
import auth from './middlewares/auth.js';
import UnauthenticatedRoutes from './routes/UnauthenticatedRoutes.js';

import itensController from './appLogic/items/itemsController.js';


const app = express();
app.use(cors());
app.use(express.json());

app.get('/', itensController.toList);

//routes
app.use(UnauthenticatedRoutes);
app.use(auth.userAuth);
app.use(authenticatedRoutes);


app.listen(8000,()=>{
    console.log("servidor rodando na porta 8000");
});