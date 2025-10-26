import { Request, Response, NextFunction } from "express";
import  jwt  from "jsonwebtoken";

interface AuthRequest extends Request{
    usuarioId?:string
}

class Auth{

    userAuth(req:AuthRequest, res:Response, next: NextFunction){
        
        const authUserHeader = req.headers.authorization

        if(!authUserHeader){
            return res.status(401).json({mensagem:"token explodiu, não passado pelo header"});
        }

        const token = authUserHeader.split(" ")[1]!
        jwt.verify(token, process.env.JWT_SECRET!, (err,decoded)=>{

            if(err){
                console.log(err);
                return res.status(401).json({mensagem:"ERRO VALIDAÇÃO DO TOKEN Token invalido"});
            }

            if(typeof decoded === "string" || !decoded || !("usuarioId" in decoded)){
                return res.status(401).json({mensagem:"PayLoad invalido"});
            }

            req.usuarioId = decoded.usuarioId;

            next()
        });

    }

}

export default new Auth