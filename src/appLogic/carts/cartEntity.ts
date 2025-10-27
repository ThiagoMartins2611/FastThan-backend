import { ObjectId } from "bson";
import ItemCart from "./itemCart.js";

class CartEntity {

    readonly userId: string;
    readonly items: ItemCart[];
    readonly dataAtualizacao: Date;
    readonly total: number;

    constructor(userId: string, items: ItemCart[], dataAtualizacao: Date, total: number) {
        this.userId = userId;
        this.items = items;
        this.dataAtualizacao = dataAtualizacao;
        this.total = total;
    }
}

export default CartEntity;