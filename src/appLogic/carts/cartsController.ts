
import { Response } from "express"
import db from "../../database/mongo_database.js";
import { ObjectId } from "bson";
import { AuthRequest } from "../../middlewares/authRequest.js";
import Cart from "./cartEntity.js";
import ItemCart from "./itemCart.js";
import CartEntity from "./cartEntity.js";
import UserEntity from "../users/userEntity.js";
import itemEntity from "../items/itemEntity.js";



interface ItemDTO {
    _id: ObjectId,
    name:string,
    price: number,
    imageUrl:string,
    userId:string
    description: string
}

class CartsController{

    async addItem(req:AuthRequest, res:Response){

        const {itemId, quantityItem} = req.body as {itemId:string, quantityItem:number};
        const userId = req.userId;

        if(!userId) return res.status(401).send({mensagem: "usuario ID não encontrado"})

        const result = await db.collection('carts').find({userId: userId}).toArray();

        const item:ItemDTO | null = await db.collection<ItemDTO>('items').findOne({_id:ObjectId.createFromHexString(itemId)});

        

        if(!item){
            return res.status(400).json({mensagem: "item não encontrado"})
        }

        const itemCart = new ItemCart(item.name, item.price, item.imageUrl, item.description, item.userId, item._id.toString(), );
        itemCart.quantity = quantityItem;
        
        
        if(result.length === 0){
            
            const newCart = {
                userId:userId,
                items: [itemCart],
                dataAtualizacao: new Date(),
                total: itemCart.price*quantityItem
            }

            const re = await db.collection('carts').insertOne(newCart)
            return res.status(201).json({mensagem: "Cart criado com sucesso"})
        } 
        
        else{

            //verificar se o item já está no Cart
            let CartJáContemoitem = false;

            (result[0]!.items).forEach((element:ItemDTO) => {
                if(element._id.toString() == itemCart._id){
                    CartJáContemoitem = true;
                }
            }); 

            if (CartJáContemoitem) return res.status(201).json({mensagem: "Este item já está no Cart"});

            

             const resultAtualizacao = await db.collection<Cart>('carts').updateOne(
                {userId: userId}, 
                {

                    $push: {items: itemCart},
                    $set: {dataAtualizacao: new Date()},
                    $inc: {total: (itemCart.price*quantityItem)}
                }
            
            )

            return res.status(201).json({...item, _id: result[0]?._id, mensagem: "Item adcionado com sucesso"})  
        }
    }


    async toListItem(req:AuthRequest, res:Response){
        const userId = req.userId;
        const filter = req.query.filter;

        if(!userId) return res.status(401).send({mensagem: "usuario ID não encontrado"})

        const Cart = await db.collection<Cart>('carts').findOne({userId: userId});
        if(!Cart) return res.status(401).send({mensagem: "carrinho com esse id de usuario não encontrado"})

        const itemsCart = (Cart.items);

        switch(filter){

            case "":
                res.status(200).json(itemsCart);
            break;

            case "maisCaro":
                res.status(200).json(itemsCart.sort((a, b)=> b.price - a.price));
            break;

            case "menosCaro":
                res.status(200).json(itemsCart.sort((a, b)=> a.price - b.price));
            break;

            case "maiorQuantidade": 
                res.status(200).json(itemsCart.sort((a, b)=> b.quantity - a.quantity ));
            break;

            case "menorQuantidade":
                res.status(200).json(itemsCart.sort((a, b)=> a.quantity - b.quantity));
            break;

            default: 
                res.status(200).json(itemsCart);
            break;

        }

    }


    async removeItem(req:AuthRequest, res:Response){

        const {itemId} = req.body as {itemId: string};
        const userId = req.userId;

        if(!userId) return res.status(401).send({mensagem: "usuario ID não encontrado"})

        const CartA = await db.collection<Cart>('carts').findOne({userId:userId});
        
        const itemCart = (CartA?.items.find(item => item._id === itemId)) as ItemCart;

        const Cart = await db.collection<Cart>('carts').updateOne(
            {userId: userId},
            {
                $pull: {
                    items: {_id: itemId}
                },

                $set: {
                    dataAtualizacao: new Date()
                },

                $inc: {
                    total: -itemCart.price*itemCart.quantity
                }
                
            }
        );

        if(Cart.modifiedCount){
            return res.status(200).json({mensagem: "Item excluido do Cart com sucesso"});
        }else{
            return res.status(401).json({mensagem: "Item ou Cart não encontrado"})
        }
 
    }


    async updatequantity(req:AuthRequest, res:Response){
        
        const {itemId, quantity} = req.body as {itemId: string, quantity: number};
        const userId = req.userId;

        if(!userId) return res.status(401).send({mensagem: "usuario ID não encontrado"})
        
        const CartA = await db.collection<Cart>('carts').findOne({userId:userId});
        if(!CartA){
            return res.status(401).send({mensagem: "Cart não foi encontrado"})
        }
        
        const itemCart = (CartA?.items.find(item => item._id === itemId)) as ItemCart;

        if(!itemCart) return res.status(201).send({mensagem: "Item dentro do Cart não encontrado"})
        
        const quantityAntiga = itemCart.quantity

        if(quantity < 0){
            return res.status(401).send({mensagem: "Não pode haver quantity negativa"})
        }

  
        const Cart = await db.collection<Cart>('carts').updateOne(
            {userId: userId, "items._id": itemId},
            {
                
                $set: {
                    dataAtualizacao: new Date(),
                    "items.$.quantity": quantity,
                    total: CartA.total - (quantityAntiga * itemCart.price) + (quantity * itemCart.price)
                },
            }
        );

        if(Cart.modifiedCount){
            return res.status(200).json({mensagem: "quantity Atualizada"});
        }else{
            return res.status(401).json({mensagem: "Item ou Cart não encontrado", erro: Cart.modifiedCount})
        }
 

    }


    async toList(req:AuthRequest, res:Response){
        const userId = req.userId;
        if(!userId) return res.status(401).send({mensagem: "usuario ID não encontrado"});

        const usersCollection = db.collection<UserEntity>('users');
        const thisUser = await usersCollection.findOne<UserEntity>({ _id: new ObjectId(userId) });

        if (!thisUser) return res.status(404).json({ mensagem: "Usuário não encontrado" });

        if(!thisUser.adm) return res.status(403).json({mensagem: "Sem permissão"});

        //gostei que da pra organizar com o sort : ) no caso está os mais recentes primiero
        const carts = await db.collection<CartEntity>("carts").find().sort({dataAtualizacao: -1}).toArray()
        
        return res.status(200).json({mensagem: "lista de carrinhos", carts: carts});
    }


    async eraseCart(req:AuthRequest, res:Response){
        
        const userId = req.userId;

        if(!userId) return res.status(401).send({mensagem: "usuario ID não encontrado"})

        const resul = await db.collection("carts").deleteOne({userId: userId});

        if(!resul.acknowledged){
            return res.status(401).send({mensagem: "Cart falhou em ser apagado"})
        }

        return res.status(200).send({mensagem: "Cart apagado com sucesso!"})
    }



}

export default new CartsController()