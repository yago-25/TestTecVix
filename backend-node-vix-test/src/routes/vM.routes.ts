import { Router } from "express";
import { VMController } from "../controllers/VMController";
import { API_VERSION, ROOT_PATH } from "../constants/basePathRoutes";
import { authUser } from "../auth/authUser";

const BASE_PATH = API_VERSION.V1 + ROOT_PATH.VM; // /api/v1/vm

const vMRoutes = Router();

export const makeVMController = () => {
  return new VMController();
};

const vMController = makeVMController();

/**
 * @swagger
 * tags:
 *   name: VM
 *   description: Gerenciamento de VMs
 */

/**
 * @swagger
 * /api/v1/vm:
 *   get:
 *     summary: Listar todas as VMs
 *     tags: [VM]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de VMs
 *       401:
 *         description: Não autorizado
 */
vMRoutes.get(BASE_PATH, authUser, async (req, res) => {
  await vMController.listAll(req, res);
});

/**
 * @swagger
 * /api/v1/vm/{idVM}:
 *   get:
 *     summary: Buscar VM por ID
 *     tags: [VM]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: idVM
 *         required: true
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: VM encontrada
 *       401:
 *         description: Não autorizado
 *       404:
 *         description: VM não encontrada
 */
vMRoutes.get(`${BASE_PATH}/:idVM`, authUser, async (req, res) => {
  await vMController.getById(req, res);
});

/**
 * @swagger
 * /api/v1/vm:
 *   post:
 *     summary: Criar nova VM
 *     tags: [VM]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - vmName
 *             properties:
 *               vmName:
 *                 type: string
 *                 example: Minha VM
 *               description:
 *                 type: string
 *                 example: VM de testes
 *               status:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       201:
 *         description: VM criada com sucesso
 *       401:
 *         description: Não autorizado
 */
vMRoutes.post(BASE_PATH, authUser, async (req, res) => {
  await vMController.createVM(req, res);
});

/**
 * @swagger
 * /api/v1/vm/{idVM}:
 *   put:
 *     summary: Atualizar VM
 *     tags: [VM]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: idVM
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
 *               vmName:
 *                 type: string
 *               description:
 *                 type: string
 *               status:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: VM atualizada com sucesso
 *       401:
 *         description: Não autorizado
 *       404:
 *         description: VM não encontrada
 */
vMRoutes.put(`${BASE_PATH}/:idVM`, authUser, async (req, res) => {
  await vMController.updateVM(req, res);
});

/**
 * @swagger
 * /api/v1/vm/{idVM}:
 *   delete:
 *     summary: Remover VM
 *     tags: [VM]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: idVM
 *         required: true
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: VM removida com sucesso
 *       401:
 *         description: Não autorizado
 *       404:
 *         description: VM não encontrada
 */
vMRoutes.delete(`${BASE_PATH}/:idVM`, authUser, async (req, res) => {
  await vMController.deleteVM(req, res);
});

export { vMRoutes };
