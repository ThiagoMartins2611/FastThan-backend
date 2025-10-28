import { Router } from "express";
import cartsController from "../appLogic/carts/cartsController.js";
import itemsController from "../appLogic/items/itemsController.js";
import userController from "../appLogic/users/userController.js";

const authenticatedRoutes = Router()

//lsitar carrinhos (adm)
authenticatedRoutes.get("/ShowCart", cartsController.toListItem);

//listar usuarios (adm)
authenticatedRoutes.get("/ShowUsers", userController.toList);



//listar todos os itens (funcionando)
authenticatedRoutes.get("/ShowItems", itemsController.toList);

//listar os intens que estão no carrinho do usuario
authenticatedRoutes.get("ShowItemsInCart", cartsController.toListItem)

//colocar itens para vender (funcionando)
authenticatedRoutes.post("/AddItemsForSale", itemsController.add);

//colocoar um item no seu carrinho
authenticatedRoutes.post("/AddItemsInCart", cartsController.addItem);

//remover o item do carrinho
authenticatedRoutes.post("removeItemofCart", cartsController.removeItem);

//remover o carrinho da existencia
authenticatedRoutes.delete("eraseCart", cartsController.eraseCart);

//atualizar a quantidade do item dentro do carrinho
authenticatedRoutes.patch("/UpdateQuantityofCart", cartsController.updatequantity);



export default authenticatedRoutes;