import { Response, NextFunction } from "express";
import { AppError } from "../errors/AppError";
import { ERROR_MESSAGE } from "../constants/erroMessages";
import { STATUS_CODE } from "../constants/statusCode";
import { verifyToken } from "../utils/jwt";
import { CustomRequest } from "../types/custom";
import { user } from "@prisma/client";
import { prisma } from "../database/client";

export const authUser = async (
  req: CustomRequest<user>,
  res: Response,
  next: NextFunction,
) => {
  const { authorization } = req.headers;
  if (!authorization) {
    throw new AppError(ERROR_MESSAGE.INVALID_TOKEN, STATUS_CODE.UNAUTHORIZED);
  }
  const token = authorization.split(" ")[1];
  if (!token) {
    throw new AppError(ERROR_MESSAGE.INVALID_TOKEN, STATUS_CODE.UNAUTHORIZED);
  }

  const idUser = verifyToken(token);
  const foundUser = await prisma.user.findFirst({
    where: {
      idUser,
      deletedAt: null,
    },
  });

  if (!foundUser || !foundUser.isActive) {
    throw new AppError(ERROR_MESSAGE.UNAUTHORIZED, STATUS_CODE.UNAUTHORIZED);
  }
  req.user = foundUser;
  return next();
};
