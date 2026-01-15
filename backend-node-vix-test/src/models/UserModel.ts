import { prisma } from "../database/client";
import { TUserCreated } from "../types/validations/User/createUser";
import { TUserUpdated } from "../types/validations/User/updateUser";
import { TQuery } from "../types/validations/Queries/queryListAll";

export class UserModel {
  async getById(idUser: string) {
    return prisma.user.findUnique({
      where: { idUser },
      select: {
        idUser: true,
        username: true,
        email: true,
        profileImgUrl: true,
        role: true,
        idBrandMaster: true,
        isActive: true,
        lastLoginDate: true,
        createdAt: true,
        updatedAt: true,
        deletedAt: true,
      },
    });
  }

  async getByEmail(email: string) {
    return prisma.user.findFirst({
      where: {
        email,
        deletedAt: null,
      },
    });
  }

  async getByUsername(username: string) {
    return prisma.user.findFirst({
      where: {
        username,
        deletedAt: null,
      },
    });
  }

  async getByEmailOrUsername(emailOrUsername: string) {
    return prisma.user.findFirst({
      where: {
        AND: [
          {
            OR: [{ email: emailOrUsername }, { username: emailOrUsername }],
          },
          { deletedAt: null },
        ],
      },
      include: {
        brandMaster: true,
      },
    });
  }

  async totalCount(query: TQuery, isIncludeDeleted?: boolean) {
    return prisma.user.count({
      where: {
        ...(!isIncludeDeleted && { deletedAt: null }),
        ...(query.idBrandMaster !== undefined &&
          query.idBrandMaster !== null && {
            idBrandMaster: Number(query.idBrandMaster),
          }),
        ...(query.search && {
          OR: [
            { username: { contains: query.search } },
            { email: { contains: query.search } },
          ],
        }),
      },
    });
  }

  async listAll(query: TQuery, isIncludeDeleted?: boolean) {
    const limit = query.limit || 0;
    const skip = query.page ? query.page * limit : query.offset || 0;
    const orderBy =
      query.orderBy?.map(({ field, direction }) => ({
        [field]: direction,
      })) || [];

    const users = await prisma.user.findMany({
      where: {
        ...(!isIncludeDeleted && { deletedAt: null }),
        ...(query.idBrandMaster !== undefined &&
          query.idBrandMaster !== null && {
            idBrandMaster: Number(query.idBrandMaster),
          }),
        ...(query.search && {
          OR: [
            { username: { contains: query.search } },
            { email: { contains: query.search } },
          ],
        }),
      },
      take: limit || undefined,
      skip,
      ...(orderBy.length ? { orderBy } : { orderBy: [{ updatedAt: "desc" }] }),
      select: {
        idUser: true,
        username: true,
        email: true,
        profileImgUrl: true,
        role: true,
        idBrandMaster: true,
        isActive: true,
        lastLoginDate: true,
        createdAt: true,
        updatedAt: true,
        deletedAt: true,
      },
    });

    const totalCount = await this.totalCount(query, isIncludeDeleted);
    return { totalCount, result: users };
  }

  async createUser(data: TUserCreated & { password: string }) {
    return prisma.user.create({
      data,
      select: {
        idUser: true,
        username: true,
        email: true,
        profileImgUrl: true,
        role: true,
        idBrandMaster: true,
        isActive: true,
        lastLoginDate: true,
        createdAt: true,
        updatedAt: true,
        deletedAt: true,
      },
    });
  }

  async updateUser(idUser: string, data: TUserUpdated) {
    return prisma.user.update({
      where: { idUser },
      data: { ...data, updatedAt: new Date() },
      select: {
        idUser: true,
        username: true,
        email: true,
        profileImgUrl: true,
        role: true,
        idBrandMaster: true,
        isActive: true,
        lastLoginDate: true,
        createdAt: true,
        updatedAt: true,
        deletedAt: true,
        fullName: true,
        userPhoneNumber: true,
      },
    });
  }

  async updateLastLogin(idUser: string) {
    return prisma.user.update({
      where: { idUser },
      data: { lastLoginDate: new Date(), updatedAt: new Date() },
    });
  }

  async deleteUser(idUser: string) {
    return prisma.user.update({
      where: { idUser },
      data: { updatedAt: new Date(), deletedAt: new Date() },
      select: {
        idUser: true,
        username: true,
        email: true,
        profileImgUrl: true,
        role: true,
        idBrandMaster: true,
        isActive: true,
        lastLoginDate: true,
        createdAt: true,
        updatedAt: true,
        deletedAt: true,
      },
    });
  }
}
