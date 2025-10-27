
import { Response } from "express"
import db from "../../database/mongo_database.js";
import UserEntity from "./userEntity.js";
import bcrypt from "bcrypt"
import jwt  from "jsonwebtoken"
import { AuthRequest } from "../../middlewares/authRequest.js";


function randomNumber(min:number, max:number) {

  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}


class UserController{

    async add(req:AuthRequest, res:Response){

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



    async listar(req:AuthRequest, res:Response){
        const users = await db.collection<UserEntity>('users').find().toArray();
        res.status(200).json(users);
    }



    async login(req:AuthRequest, res:Response){
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



