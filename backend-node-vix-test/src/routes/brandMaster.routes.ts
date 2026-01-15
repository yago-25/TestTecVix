import { Router } from "express";
import { BrandMasterController } from "../controllers/BrandMasterController";
import { API_VERSION, ROOT_PATH } from "../constants/basePathRoutes";
import { authUser } from "../auth/authUser";

const BASE_PATH = API_VERSION.V1 + ROOT_PATH.BRANDMASTER; // /api/v1/brand-master

const brandMasterRoutes = Router();

export const makeBrandMasterController = () => {
  return new BrandMasterController();
};

const brandMasterController = makeBrandMasterController();

/**
 * @swagger
 * tags:
 *   name: BrandMaster
 *   description: Gerenciamento de Brand Masters
 */

/**
 * @swagger
 * /api/v1/brand-master/self:
 *   get:
 *     summary: Buscar Brand Master do usuário autenticado
 *     tags: [BrandMaster]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Brand Master encontrado
 *       401:
 *         description: Não autorizado
 */
brandMasterRoutes.get(`${BASE_PATH}/self`, async (req, res) => {
  await brandMasterController.getSelf(req, res);
});

/**
 * @swagger
 * /api/v1/brand-master/{idBrandMaster}:
 *   get:
 *     summary: Buscar Brand Master por ID
 *     tags: [BrandMaster]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: idBrandMaster
 *         required: true
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: Brand Master encontrado
 *       401:
 *         description: Não autorizado
 *       404:
 *         description: Brand Master não encontrado
 */
brandMasterRoutes.get(
  `${BASE_PATH}/:idBrandMaster`,
  authUser,
  async (req, res) => {
    await brandMasterController.getById(req, res);
  },
);

/**
 * @swagger
 * /api/v1/brand-master:
 *   get:
 *     summary: Listar todos os Brand Masters
 *     tags: [BrandMaster]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de Brand Masters
 *       401:
 *         description: Não autorizado
 */
brandMasterRoutes.get(`${BASE_PATH}`, authUser, async (req, res) => {
  await brandMasterController.listAll(req, res);
});

/**
 * @swagger
 * /api/v1/brand-master:
 *   post:
 *     summary: Criar um novo Brand Master
 *     tags: [BrandMaster]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: Empresa XPTO
 *     responses:
 *       201:
 *         description: Brand Master criado com sucesso
 *       401:
 *         description: Não autorizado
 */
brandMasterRoutes.post(`${BASE_PATH}`, authUser, async (req, res) => {
  await brandMasterController.createNewBrandMaster(req, res);
});

/**
 * @swagger
 * /api/v1/brand-master/{idBrandMaster}:
 *   put:
 *     summary: Atualizar um Brand Master
 *     tags: [BrandMaster]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: idBrandMaster
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
 *               name:
 *                 type: string
 *                 example: Empresa XPTO Atualizada
 *     responses:
 *       200:
 *         description: Brand Master atualizado com sucesso
 *       401:
 *         description: Não autorizado
 *       404:
 *         description: Brand Master não encontrado
 */
brandMasterRoutes.put(
  `${BASE_PATH}/:idBrandMaster`,
  authUser,
  async (req, res) => {
    await brandMasterController.updateBrandMaster(req, res);
  },
);

/**
 * @swagger
 * /api/v1/brand-master/{idBrandMaster}:
 *   delete:
 *     summary: Remover um Brand Master
 *     tags: [BrandMaster]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: idBrandMaster
 *         required: true
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: Brand Master removido com sucesso
 *       401:
 *         description: Não autorizado
 *       404:
 *         description: Brand Master não encontrado
 */
brandMasterRoutes.delete(
  `${BASE_PATH}/:idBrandMaster`,
  authUser,
  async (req, res) => {
    await brandMasterController.deleteBrandMaster(req, res);
  },
);

export { brandMasterRoutes };
