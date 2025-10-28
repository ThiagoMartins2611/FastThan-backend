import { Router } from "express";
import userController from "../appLogic/users/userController.js";

const unauthenticatedRoutes = Router()

//cadastrar o usuario
unauthenticatedRoutes.post("/registration", userController.add);

//fazer login do usuario
unauthenticatedRoutes.post("/login", userController.login);

export default unauthenticatedRoutes;