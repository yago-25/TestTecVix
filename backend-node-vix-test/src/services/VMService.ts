import { VMModel } from "../models/VMModel";
import { vMCreatedSchema } from "../types/validations/VM/createVM";
import { AppError } from "../errors/AppError";
import { ERROR_MESSAGE } from "../constants/erroMessages";
import { STATUS_CODE } from "../constants/statusCode";
import { vMUpdatedSchema } from "../types/validations/VM/updateVM";
import { vmListAllSchema } from "../types/validations/VM/vmListAll";
import { user } from "@prisma/client";

export class VMService {
  constructor() {}

  private vMModel = new VMModel();

  async getById(idVM: number) {
    return this.vMModel.getById(idVM);
  }

  async listAll(query: unknown, user: user) {
    const validQuery = vmListAllSchema.parse(query);
    return this.vMModel.listAll({
      query: validQuery,
      idBrandMaster: user.idBrandMaster,
    });
  }

  async createNewVM(data: unknown) {
    const validateData = vMCreatedSchema.parse(data);

    const createdVM = await this.vMModel.createNewVM({
      ...validateData,
      status: "RUNNING",
    });

    return createdVM;
  }

  async updateVM(idVM: number, data: unknown) {
    const validateDataSchema = vMUpdatedSchema.parse(data);
    const oldVM = await this.getById(idVM);

    if (!oldVM) {
      throw new AppError(ERROR_MESSAGE.NOT_FOUND, STATUS_CODE.NOT_FOUND);
    }

    const updatedVM = await this.vMModel.updateVM(idVM, validateDataSchema);
    return updatedVM;
  }

  async deleteVM(idVM: number) {
    const oldVM = await this.getById(idVM);
    if (!oldVM) {
      throw new AppError(ERROR_MESSAGE.NOT_FOUND, STATUS_CODE.NOT_FOUND);
    }
    const deletedVm = await this.vMModel.deleteVM(idVM);
    return deletedVm;
  }
}
