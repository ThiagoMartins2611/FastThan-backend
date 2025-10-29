import { Response } from "express"
import db from "../../database/mongo_database.js";
import itemEntity from "./itemEntity.js";
import {ObjectId} from "bson";
import { AuthRequest } from "../../middlewares/authRequest.js";
import UserEntity from "../users/userEntity.js";
import Admin from "../users/adminVerify.js";



class ItemController{
    
    async add(req:AuthRequest, res:Response){

        const {name, price, imageUrl, description} = req.body as {name:string, price:number, imageUrl:string, description:string};
        const userId = req.userId!;
      

        if(!(await Admin.Verify(req))){
        
            return res.status(401).send({mensagem: "Acesso negado"});  
         } 


        const item = new itemEntity(name, price, imageUrl, description, userId)

        const itemDTO = {_id:ObjectId.createFromHexString(item._id),name:item.name,price:item.price,imageUrl:item.imageUrl,description:item.description}
        
        const resultado = await db.collection('items').insertOne(itemDTO)

        return res.status(201).json({...item, _id: resultado.insertedId})  
    }

    async toList(req:AuthRequest, res:Response){

        const items = await db.collection('items').find().toArray();
        res.status(200).json(items);
    }

    async deleteItem(req:AuthRequest, res:Response){

        const {DeletedItemId} = req.body as { DeletedItemId:string };
       

         if(!(await Admin.Verify(req))){
        
            return res.status(401).send({mensagem: "Acesso negado"});  
         } 


        const result = await db.collection("items").deleteOne({ _id: new ObjectId(DeletedItemId) });

        if (result.deletedCount === 0) {
            return res.status(404).send({ mensagem: "Item não encontrado ou já deletado" });
        }

        return res.status(200).send({mensagem: "Item apagado com sucesso!"});

    }

    async updateItem(req: AuthRequest, res: Response) {

        const { itemId, name, price, imageUrl, description } = req.body as { itemId: string, name: string, price: number, imageUrl: string, description: string };


        if (!(await Admin.Verify(req))) {

            return res.status(401).send({ mensagem: "Acesso negado" });
        }


        if (!ObjectId.isValid(itemId)) {

            return res.status(400).send({ mensagem: "ID de item inválido" });
        }


        const updateFields: any = {};
        if(name) updateFields.name = name;
        if(price) updateFields.price = price;
        if(imageUrl) updateFields.imageUrl = imageUrl;
        if(description) updateFields.description = description;

        const result = await db.collection("items").updateOne(
            { _id: new ObjectId(itemId) },
            { $set: updateFields }
        );

        if(result.matchedCount === 0) return res.status(404).send({ mensagem: "Item não encontrado" });
    
        if(!result.acknowledged) return res.status(400).send({ mensagem: "Falha ao atualizar o item" });
        
        return res.status(200).send({ mensagem: "Item atualizado com sucesso!" });
  }

}

export default new ItemController()