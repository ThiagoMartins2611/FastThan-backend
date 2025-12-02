
import { Response } from "express"
import db from "../../database/mongo_database.js";
import { ObjectId } from "bson";
import { AuthRequest } from "../../middlewares/authRequest.js";
import CartEntity from "../carts/cartEntity.js";
import Admin from "../users/adminVerify.js";
import UserEntity from "../users/userEntity.js";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

class Buy{
    
    async realizeBuy(req:AuthRequest, res:Response){
        
        const userId = req.userId;
        if(!userId) return res.status(400).json({mensagem: "UserId não encontrado"})

        const total = req.body as {total:string}

                //Buscar o carrinho do usuário que está no token para pegar o amount
        //O amount aqui é em centavos, tem que fazer a conversão
        try {


            const cart = await db.collection<CartEntity>('carts').findOne({userId: userId});
            if(!cart) return res.status(400).json({mensagem: "carrinho não encontrado"});

            const valorPagar = cart.total;

            const paymentIntent = await stripe.paymentIntents.create({
                amount: valorPagar*100,
                currency: "brl",
                payment_method_types: ["card"],
            });

            res.json({
                clientSecret: paymentIntent.client_secret,
            });

            await db.collection("carts").deleteOne({userId: userId});
        } catch (err) {
            if (err instanceof Error)
            return res.status(400).json({ mensagem: err.message });
            res.status(400).json({ mensagem: "Erro de pagamento desconhecido!" });
        }
    }
}

export default new Buy()