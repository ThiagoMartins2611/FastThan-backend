import itemEntity from "../items/itemEntity.js";

class ItemCart extends itemEntity{

    public quantity: number;

    constructor(name:string, price:number, imageUrl:string, description:string, userId:string, _id:string){

        super(name, price, imageUrl, description, userId, _id)
        this.quantity = 0;

    }

}

export default ItemCart