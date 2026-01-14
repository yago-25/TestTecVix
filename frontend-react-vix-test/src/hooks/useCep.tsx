import { useState } from "react";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

interface ICepResponse {
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
  erro?: boolean;
}

export const useCep = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useTranslation();

  const fetchCep = async (cep: string): Promise<ICepResponse | null> => {
    const cleanCep = cep.replace(/\D/g, "");

    if (cleanCep.length !== 8) {
      return null;
    }

    setIsLoading(true);
    try {
      const response = await fetch(
        `https://viacep.com.br/ws/${cleanCep}/json/`,
      );
      const data: ICepResponse = await response.json();

      if (data.erro) {
        toast.error(t("mspRegister.cepAlertMessage"));
        setIsLoading(false);
        return null;
      }

      setIsLoading(false);
      return data;
    } catch (error) {
      console.error("Erro ao buscar CEP:", error);
      toast.error(t("mspRegister.cepAlertMessage"));
      setIsLoading(false);
      return null;
    }
  };

  return { fetchCep, isLoading };
};
