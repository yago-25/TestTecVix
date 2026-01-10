import { Router } from "express";
import { UserController } from "../controllers/UserController";
import { API_VERSION, ROOT_PATH } from "../constants/basePathRoutes";
import { authUser } from "../auth/authUser";

const BASE_PATH = API_VERSION.V1 + ROOT_PATH.USER;

const userRoutes = Router();

export const makeUserController = () => {
  return new UserController();
};

const userController = makeUserController();

userRoutes.post(`${BASE_PATH}`, async (req, res) => {
  await userController.register(req, res);
});

userRoutes.post(`${BASE_PATH}/login`, async (req, res) => {
  await userController.login(req, res);
});

userRoutes.get(`${BASE_PATH}/token/:idUser`, authUser, async (req, res) => {
  await userController.getToken(req, res);
});

userRoutes.get(`${BASE_PATH}/:idUser`, authUser, async (req, res) => {
  await userController.getById(req, res);
});

userRoutes.get(`${BASE_PATH}`, authUser, async (req, res) => {
  await userController.listAll(req, res);
});

userRoutes.put(`${BASE_PATH}/:idUser`, authUser, async (req, res) => {
  await userController.updateUser(req, res);
});

userRoutes.delete(`${BASE_PATH}/:idUser`, authUser, async (req, res) => {
  await userController.deleteUser(req, res);
});

export { userRoutes };
