import { Response } from "express"
import db from "../../database/mongo_database.js";
import itemEntity from "./itemEntity.js";
import {ObjectId} from "bson";
import { AuthRequest } from "../../middlewares/authRequest.js";



class ItemController{
    
    async add(req:AuthRequest, res:Response){

        const {name, price, imageUrl, description} = req.body as {name:string, price:number, imageUrl:string, description:string};
        const userId = req.userId!;

        const item = new itemEntity(name, price, imageUrl, description, userId)

        const itemDTO = {_id:ObjectId.createFromHexString(item._id),name:item.name,price:item.price,imageUrl:item.imageUrl,description:item.description}
        
        const resultado = await db.collection('items').insertOne(itemDTO)

        res.status(201).json({...item, _id: resultado.insertedId})  
    }

    async toList(req:AuthRequest, res:Response){

        const items = await db.collection('items').find().toArray();
        res.status(200).json(items);
    }

}

export default new ItemController()