import { useState } from "react";
import { api } from "../services/api";
import { useAuth } from "./useAuth";
import { IVMCreatedResponse } from "../types/VMTypes";

interface IVMListParams {
  search?: string | null;
  page?: number;
  orderBy?: string;
  limit?: number;
  idBrandMaster?: number | null;
  status?: string;
  onlyMyVMs?: boolean;
  onlyMSPVMs?: boolean;
}

interface IVMListResponse {
  result: IVMCreatedResponse[];
  totalCount: number;
}

export const useMyVMList = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { getAuth } = useAuth();

  const fetchMyVmsList = async (
    params: IVMListParams,
  ): Promise<{ vmList: IVMCreatedResponse[]; totalCount: number }> => {
    setIsLoading(true);
    const auth = await getAuth();

    const queryParams: Record<string, string | number | boolean> = {};

    queryParams.page = params.page ?? 0;
    queryParams.limit = params.limit ?? 10;

    if (params.search) {
      queryParams.search = params.search;
    }

    if (params.orderBy) {
      queryParams.orderBy = params.orderBy;
    }

    if (params.status) {
      queryParams.status = params.status;
    }

    if (params.idBrandMaster !== undefined && params.idBrandMaster !== null) {
      queryParams.idBrandMaster = params.idBrandMaster;
    }

    if (params.onlyMyVMs === true) {
      queryParams.onlyMyVMs = true;
    }

    if (params.onlyMSPVMs === true) {
      queryParams.onlyMSPVMs = true;
    }

    const response = await api.get<IVMListResponse>({
      url: "/vm",
      auth,
      params: queryParams,
    });

    setIsLoading(false);

    if (response.error) {
      return {
        vmList: [],
        totalCount: 0,
      };
    }

    return {
      vmList: response.data.result,
      totalCount: response.data.totalCount,
    };
  };

  return { fetchMyVmsList, isLoading };
};
