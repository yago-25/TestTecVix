import { prisma } from "../database/client";
import { TVMCreate } from "../types/validations/VM/createVM";
import { TVMUpdate } from "../types/validations/VM/updateVM";
import { IListAllVM } from "../types/IListAll";
import { Prisma } from "@prisma/client";

export class VMModel {
  async getById(idVM: number) {
    return await prisma.vM.findUnique({
      where: { idVM },
    });
  }

  async totalCount({ query, idBrandMaster }: IListAllVM) {
    const { status, idBrandMaster: idBrandMasterFromQuery, onlyMyVMs } = query;

    const whereClause: Prisma.vMWhereInput = {
      deletedAt: null,
    };

    if (query.search) {
      whereClause.vmName = {
        contains: query.search,
      };
    }

    if (status !== undefined) {
      whereClause.status = status;
    }

    if (typeof idBrandMasterFromQuery === "number") {
      whereClause.idBrandMaster = idBrandMasterFromQuery;
    } else if (onlyMyVMs && typeof idBrandMaster === "number") {
      whereClause.idBrandMaster = idBrandMaster;
    }

    return prisma.vM.count({
      where: whereClause,
    });
  }

  async listAll({ query, idBrandMaster }: IListAllVM) {
    const limit = query.limit || 10;
    const skip = query.page ? query.page * limit : query.offset || 0;
    const { status, idBrandMaster: idBrandMasterFromQuery, onlyMyVMs } = query;

    const orderBy =
      query.orderBy?.map(({ field, direction }) => ({
        [field]: direction,
      })) || [];

    const whereClause: Prisma.vMWhereInput = {
      deletedAt: null,
    };

    if (query.search) {
      whereClause.vmName = {
        contains: query.search,
      };
    }

    if (status !== undefined) {
      whereClause.status = status;
    }

    if (typeof idBrandMasterFromQuery === "number") {
      whereClause.idBrandMaster = idBrandMasterFromQuery;
    } else if (onlyMyVMs && typeof idBrandMaster === "number") {
      whereClause.idBrandMaster = idBrandMaster;
    }

    const vms = await prisma.vM.findMany({
      where: whereClause,
      skip,
      take: limit || undefined,
      orderBy: orderBy.length
        ? orderBy
        : {
            updatedAt: "desc",
          },
      include: {
        brandMaster: {
          select: {
            brandName: true,
            brandLogo: true,
          },
        },
      },
    });

    const totalCount = await this.totalCount({
      query,
      idBrandMaster,
    });

    return { totalCount, result: vms };
  }

  async createNewVM(data: TVMCreate) {
    return await prisma.vM.create({
      data: { ...data },
    });
  }

  async updateVM(idVM: number, data: TVMUpdate) {
    return await prisma.vM.update({
      where: { idVM },
      data: { ...data, updatedAt: new Date() },
    });
  }

  async deleteVM(idVM: number) {
    return await prisma.vM.update({
      where: { idVM },
      data: { updatedAt: new Date(), deletedAt: new Date() },
    });
  }
}
