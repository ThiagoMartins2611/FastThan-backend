import { Router } from "express";
import cartsController from "../appLogic/carts/cartsController.js";
import itemsController from "../appLogic/items/itemsController.js";
import userController from "../appLogic/users/userController.js";

const authenticatedRoutes = Router()

//****ADMINISTRADOR****//

//Carrinho

//lsitar carrinhos (adm)
authenticatedRoutes.get("/ShowCart", cartsController.toList);


//Usuario

//listar usuarios (adm)
authenticatedRoutes.get("/ShowUsers", userController.toList);

//listar apagar usuarios (adm)
authenticatedRoutes.delete("/deleteUser", userController.deleteUser);


//Items

//colocar itens para vender (adm)
authenticatedRoutes.post("/AddItemsForSale", itemsController.add);

//atualizar itens (adm)
authenticatedRoutes.put("/UpdateItem", itemsController.updateItem);

//deletar item (adm)
authenticatedRoutes.delete("/DeleteItem", itemsController.deleteItem);



//****USUARIO COMUM****/

//listar os intens que estão no carrinho do usuario (funcionando)
authenticatedRoutes.get("/ShowItemsInCart", cartsController.toListItem);

//colocoar um item no seu carrinho (funcionando)
authenticatedRoutes.post("/AddItemsInCart", cartsController.addItem);

//remover o item do carrinho
authenticatedRoutes.post("removeItemofCart", cartsController.removeItem);

//remover o carrinho da existencia
authenticatedRoutes.delete("eraseCart", cartsController.eraseCart);

//atualizar a quantidade do item dentro do carrinho
authenticatedRoutes.patch("/UpdateQuantityofCart", cartsController.updatequantity);



export default authenticatedRoutes;