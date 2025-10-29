import { Response } from "express";
import { AuthRequest } from "../../middlewares/authRequest.js";
import UserEntity from "./userEntity.js";
import db from "../../database/mongo_database.js";
import { ObjectId } from "bson";


class Admin {
    async Verify(req: AuthRequest): Promise<boolean> {
        const thisUserId = req.userId;
        if (!thisUserId) return false;

        const usersCollection = db.collection<UserEntity>('users');
        const thisUser = await usersCollection.findOne<UserEntity>({ _id: new ObjectId(thisUserId) });

        if (!thisUser || !thisUser.adm) return false;
        
        return true;
    }
}

export default new Admin