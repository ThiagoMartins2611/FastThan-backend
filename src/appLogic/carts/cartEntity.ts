import { ObjectId } from "bson";
import ItemCart from "./itemCart.js";

class CartEntity {

    readonly userId: string;
    readonly userName: string;
    readonly items: ItemCart[];
    readonly dataAtualizacao: Date;
    readonly total: number;

    constructor(userId: string, userName:string, items: ItemCart[], dataAtualizacao: Date, total: number) {
        this.userId = userId;
        this.userName = userName;
        this.items = items;
        this.dataAtualizacao = dataAtualizacao;
        this.total = total;
    }
}

export default CartEntity;