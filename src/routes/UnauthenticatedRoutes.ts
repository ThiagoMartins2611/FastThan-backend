import { Router } from "express";
import userController from "../appLogic/users/userController.js";

const UnauthenticatedRoutes = Router()

//cadastrar o usuario
UnauthenticatedRoutes.post("/registration", userController.add);

//fazer login do usuario
UnauthenticatedRoutes.post("/login", userController.login);

export default UnauthenticatedRoutes;