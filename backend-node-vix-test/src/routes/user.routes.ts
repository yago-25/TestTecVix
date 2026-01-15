import { Router } from "express";
import { UserController } from "../controllers/UserController";
import { API_VERSION, ROOT_PATH } from "../constants/basePathRoutes";
import { authUser } from "../auth/authUser";

const BASE_PATH = API_VERSION.V1 + ROOT_PATH.USER; // /api/v1/user

const userRoutes = Router();

export const makeUserController = () => {
  return new UserController();
};

const userController = makeUserController();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Gerenciamento de usuários
 */

/**
 * @swagger
 * /api/v1/user:
 *   post:
 *     summary: Criar novo usuário
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - email
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 example: johndoe
 *               email:
 *                 type: string
 *                 example: john@email.com
 *               password:
 *                 type: string
 *                 example: 123456
 *               fullName:
 *                 type: string
 *                 example: John Doe
 *               userPhoneNumber:
 *                 type: string
 *                 example: "11999999999"
 *     responses:
 *       201:
 *         description: Usuário criado com sucesso
 *       400:
 *         description: Dados inválidos
 */
userRoutes.post(`${BASE_PATH}`, async (req, res) => {
  await userController.register(req, res);
});

/**
 * @swagger
 * /api/v1/user/login:
 *   post:
 *     summary: Login do usuário
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 example: johndoe
 *               email:
 *                 type: string
 *                 example: john@email.com
 *               password:
 *                 type: string
 *                 example: 123456
 *     responses:
 *       200:
 *         description: Login realizado com sucesso
 *       401:
 *         description: Credenciais inválidas
 */
userRoutes.post(`${BASE_PATH}/login`, async (req, res) => {
  await userController.login(req, res);
});

/**
 * @swagger
 * /api/v1/user/token/{idUser}:
 *   get:
 *     summary: Gerar novo token do usuário
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: idUser
 *         required: true
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: Token gerado com sucesso
 *       401:
 *         description: Não autorizado
 */
userRoutes.get(`${BASE_PATH}/token/:idUser`, authUser, async (req, res) => {
  await userController.getToken(req, res);
});

/**
 * @swagger
 * /api/v1/user/{idUser}:
 *   get:
 *     summary: Buscar usuário por ID
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: idUser
 *         required: true
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: Usuário encontrado
 *       401:
 *         description: Não autorizado
 *       404:
 *         description: Usuário não encontrado
 */
userRoutes.get(`${BASE_PATH}/:idUser`, authUser, async (req, res) => {
  await userController.getById(req, res);
});

/**
 * @swagger
 * /api/v1/user:
 *   get:
 *     summary: Listar todos os usuários
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de usuários
 *       401:
 *         description: Não autorizado
 */
userRoutes.get(`${BASE_PATH}`, authUser, async (req, res) => {
  await userController.listAll(req, res);
});

/**
 * @swagger
 * /api/v1/user/{idUser}:
 *   put:
 *     summary: Atualizar dados do usuário
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: idUser
 *         required: true
 *         schema:
 *           type: number
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               fullName:
 *                 type: string
 *               userPhoneNumber:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Usuário atualizado com sucesso
 *       401:
 *         description: Não autorizado
 *       404:
 *         description: Usuário não encontrado
 */
userRoutes.put(`${BASE_PATH}/:idUser`, authUser, async (req, res) => {
  await userController.updateUser(req, res);
});

/**
 * @swagger
 * /api/v1/user/{idUser}:
 *   delete:
 *     summary: Remover usuário
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: idUser
 *         required: true
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: Usuário removido com sucesso
 *       401:
 *         description: Não autorizado
 *       404:
 *         description: Usuário não encontrado
 */
userRoutes.delete(`${BASE_PATH}/:idUser`, authUser, async (req, res) => {
  await userController.deleteUser(req, res);
});

export { userRoutes };
