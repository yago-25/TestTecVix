import { Router } from "express";
import { API_VERSION, ROOT_PATH } from "../constants/basePathRoutes";
import { BucketController } from "../controllers/BucketController";
import { BucketLocalService } from "../services/BucketLocalService";

const BASE_PATH = API_VERSION.V1 + ROOT_PATH.UPLOADS; // /api/v1/uploads

const uploadsRoutes = Router();

export const makeBucketController = () => {
  const service = new BucketLocalService();
  return new BucketController(service);
};

const uploadsController = makeBucketController();

/**
 * @swagger
 * tags:
 *   name: Uploads
 *   description: Acesso a arquivos armazenados no bucket
 */

/**
 * @swagger
 * /api/v1/uploads/{objectName}:
 *   get:
 *     summary: Buscar arquivo no bucket pelo nome do objeto
 *     tags: [Uploads]
 *     parameters:
 *       - in: path
 *         name: objectName
 *         required: true
 *         description: Nome do objeto armazenado no bucket
 *         schema:
 *           type: string
 *           example: avatar-user-123.png
 *     responses:
 *       200:
 *         description: Arquivo retornado com sucesso
 *         content:
 *           application/octet-stream:
 *             schema:
 *               type: string
 *               format: binary
 *       404:
 *         description: Arquivo não encontrado
 */
uploadsRoutes.get(`${BASE_PATH}/:objectName`, async (req, res) => {
  await uploadsController.getFileInBucketByObjectName(req, res);
});

export { uploadsRoutes };
