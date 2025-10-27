import { Response } from "express"
import db from "../../database/mongo_database.js";
import itemEntity from "./itensEntity.js";
import {ObjectId} from "bson";
import { AuthRequest } from "../../middlewares/authRequest.js";



class ItemController{
    
    async adicionar(req:AuthRequest, res:Response){

        const {name, price, imageUrl, description} = req.body as {name:string, price:number, imageUrl:string, description:string};
        const userId = req.usuarioId!;

        const item = new itemEntity(name, price, imageUrl, description, userId)

        const itemDTO = {_id:ObjectId.createFromHexString(item._id),name:item.name,price:item.price,imageUrl:item.imageUrl,description:item.description}
        
        const resultado = await db.collection('itens').insertOne(itemDTO)

        res.status(201).json({...item, _id: resultado.insertedId})  
    }

    async listar(req:AuthRequest, res:Response){

        const itens = await db.collection('itens').find().toArray();
        res.status(200).json(itens);
    }

}

export default new ItemController()