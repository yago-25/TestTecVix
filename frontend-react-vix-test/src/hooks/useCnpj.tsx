import { useState } from "react";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

interface IBrasilApiCnpjResponse {
  cnpj: string;
  razao_social: string;
  nome_fantasia?: string;
  descricao_tipo_logradouro?: string;
  logradouro?: string;
  numero?: string;
  complemento?: string;
  bairro?: string;
  municipio?: string;
  uf?: string;
  cep?: string;
  ddd_telefone_1?: string;
  email?: string;
  situacao_cadastral?: string;
}

interface ICnpjResponse {
  cnpj: string;
  razao_social: string;
  nome_fantasia?: string;
  logradouro?: string;
  numero?: string;
  complemento?: string;
  bairro?: string;
  municipio?: string;
  uf?: string;
  cep?: string;
  telefone?: string;
  email?: string;
  situacao?: string;
  erro?: boolean;
}

export const useCnpj = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useTranslation();

  const fetchCnpj = async (cnpj: string): Promise<ICnpjResponse | null> => {
    const cleanCnpj = cnpj.replace(/\D/g, "");

    if (cleanCnpj.length !== 14) {
      return null;
    }

    setIsLoading(true);
    try {
      const response = await fetch(
        `https://brasilapi.com.br/api/cnpj/v1/${cleanCnpj}`,
      );

      if (!response.ok) {
        toast.error(t("mspRegister.cnpjAlertMessage"));
        setIsLoading(false);
        return null;
      }

      const data: IBrasilApiCnpjResponse = await response.json();

      if (!data.razao_social) {
        toast.error(t("mspRegister.cnpjAlertMessage"));
        setIsLoading(false);
        return null;
      }

      const mappedData: ICnpjResponse = {
        cnpj: data.cnpj,
        razao_social: data.razao_social,
        nome_fantasia: data.nome_fantasia,
        logradouro: data.logradouro,
        numero: data.numero,
        complemento: data.complemento,
        bairro: data.bairro,
        municipio: data.municipio,
        uf: data.uf,
        cep: data.cep?.replace(/\D/g, ""),
        telefone: data.ddd_telefone_1,
        email: data.email,
        situacao: data.situacao_cadastral,
      };

      setIsLoading(false);
      return mappedData;
    } catch (error) {
      console.warn("Erro ao buscar CNPJ:", error);
      toast.error(t("mspRegister.cnpjAlertMessage"));
      setIsLoading(false);
      return null;
    }
  };

  return { fetchCnpj, isLoading };
};
