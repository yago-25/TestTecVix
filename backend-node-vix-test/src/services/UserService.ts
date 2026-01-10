import { user } from "@prisma/client";
import { UserModel } from "../models/UserModel";
import { querySchema } from "../types/validations/Queries/queryListAll";
import {
  userCreatedSchema,
  TUserCreated,
} from "../types/validations/User/createUser";
import {
  userUpdatedSchema,
  TUserUpdated,
} from "../types/validations/User/updateUser";
import {
  userLoginSchema,
  TUserLogin,
} from "../types/validations/User/loginUser";
import { AppError } from "../errors/AppError";
import { ERROR_MESSAGE } from "../constants/erroMessages";
import { STATUS_CODE } from "../constants/statusCode";
import bcrypt from "bcryptjs";
import { genToken } from "../utils/jwt";

type UserWithoutPassword = Omit<user, "password"> & {
  brandMaster?: { idBrandMaster: number; brandName: string | null } | null;
};

export class UserService {
  constructor() {}
  private userModel = new UserModel();

  async getById(idUser: string) {
    const foundUser = await this.userModel.getById(idUser);
    if (!foundUser || foundUser.deletedAt) {
      throw new AppError(ERROR_MESSAGE.USER_NOT_FOUND, STATUS_CODE.NOT_FOUND);
    }
    return foundUser;
  }

  async listAll(query: unknown) {
    const validQuery = querySchema.parse(query);
    return this.userModel.listAll(validQuery);
  }

  async register(data: TUserCreated) {
    const validData = userCreatedSchema.parse(data);

    const existingEmail = await this.userModel.getByEmail(validData.email);
    if (existingEmail) {
      throw new AppError(
        ERROR_MESSAGE.EMAIL_ALREADY_EXISTS,
        STATUS_CODE.CONFLICT,
      );
    }

    const existingUsername = await this.userModel.getByUsername(
      validData.username,
    );
    if (existingUsername) {
      throw new AppError(
        ERROR_MESSAGE.USERNAME_ALREADY_EXISTS,
        STATUS_CODE.CONFLICT,
      );
    }

    const hashedPassword = await bcrypt.hash(validData.password, 10);

    const newUser = await this.userModel.createUser({
      ...validData,
      password: hashedPassword,
      role: validData.role || "member",
      isActive: validData.isActive ?? true,
    });

    return newUser;
  }

  async login(data: TUserLogin) {
    const validData = userLoginSchema.parse(data);

    const identifier = validData.email || validData.username;
    if (!identifier) {
      throw new AppError(
        ERROR_MESSAGE.INVALID_EMAIL_OR_PASSWORD,
        STATUS_CODE.UNAUTHORIZED,
      );
    }

    const foundUser = await this.userModel.getByEmailOrUsername(identifier);
    if (!foundUser) {
      throw new AppError(
        ERROR_MESSAGE.INVALID_EMAIL_OR_PASSWORD,
        STATUS_CODE.UNAUTHORIZED,
      );
    }

    const isPasswordValid = await bcrypt.compare(
      validData.password,
      foundUser.password,
    );
    if (!isPasswordValid) {
      throw new AppError(
        ERROR_MESSAGE.INVALID_EMAIL_OR_PASSWORD,
        STATUS_CODE.UNAUTHORIZED,
      );
    }

    if (!foundUser.isActive) {
      throw new AppError(ERROR_MESSAGE.UNAUTHORIZED, STATUS_CODE.UNAUTHORIZED);
    }

    await this.userModel.updateLastLogin(foundUser.idUser);

    const token = genToken({ idUser: foundUser.idUser });

    const { ...userWithoutPassword } = foundUser;

    return {
      user: userWithoutPassword as UserWithoutPassword,
      token,
    };
  }

  async updateUser(idUser: string, data: TUserUpdated) {
    const validData = userUpdatedSchema.parse(data);
    const oldUser = await this.userModel.getById(idUser);

    if (!oldUser || oldUser.deletedAt) {
      throw new AppError(ERROR_MESSAGE.USER_NOT_FOUND, STATUS_CODE.NOT_FOUND);
    }

    if (validData.email && validData.email !== oldUser.email) {
      const existingEmail = await this.userModel.getByEmail(validData.email);
      if (existingEmail && existingEmail.idUser !== idUser) {
        throw new AppError(
          ERROR_MESSAGE.EMAIL_ALREADY_EXISTS,
          STATUS_CODE.CONFLICT,
        );
      }
    }

    if (validData.username && validData.username !== oldUser.username) {
      const existingUsername = await this.userModel.getByUsername(
        validData.username,
      );
      if (existingUsername && existingUsername.idUser !== idUser) {
        throw new AppError(
          ERROR_MESSAGE.USERNAME_ALREADY_EXISTS,
          STATUS_CODE.CONFLICT,
        );
      }
    }

    if (validData.password) {
      validData.password = await bcrypt.hash(validData.password, 10);
    }

    const updatedUser = await this.userModel.updateUser(idUser, validData);

    return updatedUser;
  }

  async deleteUser(idUser: string) {
    const oldUser = await this.userModel.getById(idUser);

    if (!oldUser || oldUser.deletedAt) {
      throw new AppError(ERROR_MESSAGE.USER_NOT_FOUND, STATUS_CODE.NOT_FOUND);
    }

    const deletedUser = await this.userModel.deleteUser(idUser);

    return {
      user: deletedUser,
    };
  }

  async getToken(idUser: string) {
    const foundUser = await this.userModel.getById(idUser);
    if (!foundUser || foundUser.deletedAt || !foundUser.isActive) {
      throw new AppError(ERROR_MESSAGE.USER_NOT_FOUND, STATUS_CODE.NOT_FOUND);
    }

    const token = genToken({ idUser: foundUser.idUser });
    return { token };
  }
}
