import { Router } from "express";
import userController from "../appLogic/users/userController.js";
import itemsController from "../appLogic/items/itemsController.js";

const unauthenticatedRoutes = Router()

//cadastrar o usuario (funcionando)
unauthenticatedRoutes.post("/registration", userController.add);

//listar todos os itens (funcionando)
unauthenticatedRoutes.get("/ShowItems", itemsController.toList);

//fazer login do usuario (funcionando)
unauthenticatedRoutes.post("/login", userController.login);

export default unauthenticatedRoutes;