
import { Request, Response } from "express"
import db from "../../database/mongo_database.js";
import UserEntity from "./userEntity.js";
import bcrypt from "bcrypt"
import jwt  from "jsonwebtoken"
import { AuthRequest } from "../../middlewares/authRequest.js";
import { ObjectId } from "bson";


function randomNumber(min:number, max:number) {

  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}


class UserController{

    async add(req:Request, res:Response){

        const {name, age, email, key, adm} = req.body as {name:string, age:number, email:string, key:string, adm:boolean};
        
        if(!(name || key || age || email)){
            return res.status(400).json({mensagem: "dados incompletos"});
        }

        const rounds = randomNumber(1,10);
        const salts = bcrypt.genSaltSync(rounds);

        
        const encryptedKey = await bcrypt.hash(key, salts);

        const user = new UserEntity(name, age, email, encryptedKey, adm);

        const result = await db.collection('users').insertOne(user);
        res.status(201).json({...user, _id: result.insertedId});
    }

    async toList(req:AuthRequest, res:Response){

        const userId = req.userId;
        if(!userId) return res.status(401).send({mensagem: "usuario ID não encontrado"});

        const usersCollection = db.collection<UserEntity>('users');
        const thisUser = await usersCollection.findOne<UserEntity>({ _id: new ObjectId(userId) });

        if (!thisUser) return res.status(404).json({ mensagem: "Usuário não encontrado" });

        if(!thisUser.adm) return res.status(403).json({mensagem: "Sem permissão"});

        const users = await usersCollection.find().toArray()
        
        return res.status(200).json({mensagem: "lista de usuarios", users: users});
        
    }

    async login(req:Request, res:Response){
        const {email, key} = req.body as {email:string, key:string}

        if(!(email || key)) return res.status(400).send({mensagem: "Email e key são obrigatorios"});

        const user = await db.collection<UserEntity>("users").findOne({email});

        if(!user){
            return res.status(400).json({mensagem: "Usario ou key errados"});
        }

        const validKey = await bcrypt.compare(key, user.key);

        if(!validKey) return res.status(400).json({mensagem: "key incorreta"});

        const token = jwt.sign({userId: user._id, name: user.name, adm: user.adm}, process.env.JWT_SECRET!, {expiresIn: '1h'});
        res.status(200).json({token});

    }


}

export default new UserController()



