import jwt, { TokenExpiredError } from "jsonwebtoken";
import { AppError } from "../errors/AppError";
import { ERROR_MESSAGE } from "../constants/erroMessages";
import { STATUS_CODE } from "../constants/statusCode";

const secret = process.env.JWT_SECRET || "default_secret_change_in_production";

interface IPayload {
  idUser: string;
}

export const genToken = (payload: IPayload): string => {
  if (!secret) {
    throw new AppError(ERROR_MESSAGE.SERVER_ERROR, STATUS_CODE.SERVER_ERROR);
  }
  return jwt.sign(payload, secret, { expiresIn: "24h" });
};

export const verifyToken = (token: string): string => {
  if (!secret) {
    throw new AppError(ERROR_MESSAGE.INVALID_TOKEN, STATUS_CODE.UNAUTHORIZED);
  }
  try {
    const decoded = jwt.verify(token, secret) as IPayload;
    return decoded.idUser;
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      throw new AppError(ERROR_MESSAGE.INVALID_TOKEN, STATUS_CODE.UNAUTHORIZED);
    }
    throw new AppError(ERROR_MESSAGE.INVALID_TOKEN, STATUS_CODE.UNAUTHORIZED);
  }
};
