import { ObjectId } from "bson"


class itemEntity{

    readonly _id:string
    readonly name:string
    readonly price:number
    readonly imageUrl:string
    readonly description:string
    readonly userId: string

    constructor(name:string, price:number, imageUrl:string,description:string, userId:string, _id?:string, ){
    
        this._id = _id ?? new ObjectId().toString()
        this.name = name
        this.price = price
        this.imageUrl = imageUrl
        this.description = description
        this.userId = userId
    }

}

export default itemEntity