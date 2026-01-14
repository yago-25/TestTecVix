import { Modal, Stack, Box, IconButton } from "@mui/material";
import { useZTheme } from "../../../stores/useZTheme";
import { useTranslation } from "react-i18next";
import { useZMspRegisterPage } from "../../../stores/useZMspRegisterPage";
import { MspFormStep1 } from "./MspFormStep1";
import { MspFormStep2 } from "./MspFormStep2";
import { FullFilledButton } from "../../../components/Buttons/FullFilledButton";
import { UnfilledButton } from "../../../components/Buttons/UnfilledButton";
import { useBrandMasterResources } from "../../../hooks/useBrandMasterResources";
import { toast } from "react-toastify";
import { TextRob16Font1S } from "../../../components/Text1S";
import { useState, useEffect } from "react";
import CloseIcon from "@mui/icons-material/Close";
import { genStrongPass } from "../../../utils/genStrongPass";
import { useAuth } from "../../../hooks/useAuth";
import { api } from "../../../services/api";
import { useCnpj } from "../../../hooks/useCnpj";

interface IProps {
  isEditing?: boolean;
  mspId?: number;
  onClose: () => void;
  onSuccess: () => void;
}

interface IUserResponse {
  fullName?: string;
  username: string;
  email: string;
  userPhoneNumber?: string;
  role: string;
}

interface IUsersApiResponse {
  result: IUserResponse[];
}

export const MspFormModal = ({
  isEditing = false,
  mspId,
  onClose,
  onSuccess,
}: IProps) => {
  const { theme, mode } = useZTheme();
  const { t } = useTranslation();
  const {
    activeStep,
    setActiveStep,
    companyName,
    cnpj,
    phone,
    sector,
    contactEmail,
    cep,
    locality,
    countryState,
    city,
    street,
    streetNumber,
    admName,
    admEmail,
    admPhone,
    admPassword,
    brandLogoUrl,
    cityCode,
    district,
    isPoc,
    discountRate,
    minConsumption,
    showError,
    showErrorPageTwo,
    setShowError,
    setShowErrorPageTwo,
    resetAll,
    mspList,
    mspDomain,
    setMspList,
    setModalOpen,
  } = useZMspRegisterPage();

  const { createAnewBrandMaster, editBrandMaster, listAllBrands, isLoading } =
    useBrandMasterResources();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { getAuth } = useAuth();
  const { fetchCnpj, isLoading: isLoadingCnpj } = useCnpj();
  const [lastFetchedCnpj, setLastFetchedCnpj] = useState("");

  const {
    setCompanyName,
    setCnpj,
    setPhone,
    setSector,
    setContactEmail,
    setCep,
    setLocality,
    setCountryState,
    setCity,
    setStreet,
    setStreetNumber,
    setBrandLogo,
    setCityCode,
    setDistrict,
    setIsPoc,
    setDiscountRate,
    setMinConsumption,
    setMSPDomain,
    setAdmName,
    setAdmEmail,
    setAdmPhone,
  } = useZMspRegisterPage();

  useEffect(() => {
    if (isEditing && mspId) {
      const loadMspData = async () => {
        const msp = mspList.find((m) => m.idBrandMaster === mspId);
        if (msp) {
          setCompanyName(msp.brandName || "");
          setCnpj(msp.cnpj || "");
          setPhone(msp.smsContact || "");
          setContactEmail(msp.emailContact || "");
          setCep(msp.cep || "");
          setLocality(msp.location || "");
          setCountryState(msp.state || "");
          setCity(msp.city || "");
          setStreet(msp.street || "");
          setStreetNumber(msp.placeNumber || "");
          setSector(msp.setorName || "");
          setMSPDomain(msp.domain || "");
          setBrandLogo({
            brandLogoUrl: msp.brandLogo,
            brandObjectName: msp.brandLogo || "",
          });
          setCityCode(msp.cityCode ? `${msp.cityCode}` : "");
          setDistrict(msp.district || "");
          setIsPoc(Boolean(msp.isPoc));
          setDiscountRate(
            Number(msp.discountRate) ? Number(msp.discountRate) * 100 : 0,
          );
          setMinConsumption(
            Number(msp.minConsumption) ? Number(msp.minConsumption) : 0,
          );
          setLastFetchedCnpj(msp.cnpj || "");

          try {
            const auth = await getAuth();
            const usersResponse = await api.get<IUsersApiResponse>({
              url: "/user",
              auth,
              params: {
                idBrandMaster: mspId,
              },
            });
            if (usersResponse.data?.result?.length > 0) {
              const adminUser = usersResponse.data.result.find(
                (u) => u.role === "admin",
              );
              if (adminUser) {
                setAdmName(adminUser.fullName || adminUser.username || "");
                setAdmEmail(adminUser.email || "");
                setAdmPhone(adminUser.userPhoneNumber || "");
              }
            }
          } catch (error) {
            console.log("Error loading admin user:", error);
          }
        }
      };
      loadMspData();
    } else {
      setLastFetchedCnpj("");
    }
  }, [isEditing, mspId, mspList]);

  useEffect(() => {
    const cleanCnpj = cnpj.replace(/\D/g, "");

    if (cleanCnpj.length === 14 && cleanCnpj !== lastFetchedCnpj) {
      const fetchData = async () => {
        const data = await fetchCnpj(cleanCnpj);
        if (data) {
          setLastFetchedCnpj(cleanCnpj);

          if (data.razao_social && !companyName) {
            setCompanyName(data.razao_social);
          }

          if (data.cep) {
            const formattedCep = data.cep.replace(/^(\d{5})(\d{3})$/, "$1-$2");
            setCep(formattedCep);
          }

          if (data.logradouro) {
            setStreet(data.logradouro);
          }

          if (data.numero) {
            setStreetNumber(data.numero);
          }

          if (data.bairro) {
            setDistrict(data.bairro);
          }

          if (data.municipio) {
            setCity(data.municipio);
            setLocality(data.municipio);
          }

          if (data.uf) {
            setCountryState(data.uf);
          }

          if (data.telefone && !phone) {
            let formattedPhone = data.telefone;
            if (data.telefone.length === 10) {
              formattedPhone = data.telefone.replace(
                /^(\d{2})(\d{4})(\d{4})$/,
                "($1) $2-$3",
              );
            } else if (data.telefone.length === 11) {
              formattedPhone = data.telefone.replace(
                /^(\d{2})(\d{5})(\d{4})$/,
                "($1) $2-$3",
              );
            }
            setPhone(formattedPhone);
          }

          if (data.email && !contactEmail) {
            setContactEmail(data.email);
          }

          toast.success(
            t("mspRegister.cnpjDataLoaded") ||
              "Dados do CNPJ carregados com sucesso!",
          );
        }
      };

      fetchData();
    }
  }, [cnpj]);

  const validateStep1 = () => {
    if (!companyName || !cnpj || !contactEmail || !locality) {
      setShowError(true);
      return false;
    }
    setShowError(false);
    return true;
  };

  const validateStep2 = () => {
    if (!admName || !admEmail) {
      setShowErrorPageTwo(true);
      return false;
    }
    setShowErrorPageTwo(false);
    return true;
  };

  const handleNext = () => {
    if (activeStep === 0) {
      if (validateStep1()) {
        setActiveStep(1);
      }
    }
  };

  const handleBack = () => {
    if (activeStep === 1) {
      setActiveStep(0);
    }
  };

  const handleSubmit = async () => {
    if (!validateStep2()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const finalPassword = admPassword || genStrongPass(12);

      const brandMasterData = {
        companyName,
        cnpj: cnpj.replace(/\D/g, ""),
        phone,
        sector,
        contactEmail,
        cep: cep.replace(/\D/g, ""),
        locality,
        countryState,
        city,
        street,
        streetNumber,
        admName,
        admEmail,
        admPhone,
        position: "admin" as const,
        admPassword: finalPassword,
        brandLogo: brandLogoUrl || "",
        mspDomain: mspDomain || "",
        cityCode: cityCode ? Number(cityCode) : undefined,
        district,
        isPoc,
        discountRate: discountRate ? discountRate / 100 : undefined,
        minConsumption,
      };

      if (isEditing && mspId) {
        const result = await editBrandMaster(mspId, {
          brandName: companyName,
          cnpj: brandMasterData.cnpj,
          smsContact: phone,
          setorName: sector,
          emailContact: contactEmail,
          cep: brandMasterData.cep,
          location: locality,
          state: countryState,
          city,
          street,
          placeNumber: streetNumber,
          cityCode: brandMasterData.cityCode,
          district,
          isPoc,
          discountRate: discountRate ? discountRate / 100 : undefined,
          minConsumption,
          brandLogo: brandMasterData.brandLogo,
          domain: mspDomain || undefined,
        });

        if (result) {
          toast.success(t("mspRegister.editedMsp"));
          const updatedList = await listAllBrands();
          if (updatedList) {
            setMspList(updatedList.result);
          }
          setModalOpen("editedMsp");
          resetAll();
          onSuccess();
        }
      } else {
        const result = await createAnewBrandMaster(brandMasterData);

        if (result && result.brandMaster) {
          try {
            const auth = await getAuth();
            await api.post({
              url: "/user/new-user",
              auth,
              data: {
                username:
                  admEmail.split("@")[0] ||
                  admName.toLowerCase().replace(/\s/g, ""),
                email: admEmail,
                password: finalPassword,
                role: "admin",
                fullName: admName,
                userPhoneNumber: admPhone || undefined,
                idBrandMaster: result.brandMaster.idBrandMaster,
                isActive: true,
              },
            });
          } catch (error) {
            console.log("Error creating admin user:", error);
            toast.error(
              t("mspRegister.errorCreatingAdmin") ||
                "Erro ao criar usuário administrador",
            );
          }

          toast.success(t("mspRegister.createdMsp"));
          const updatedList = await listAllBrands();
          if (updatedList) {
            setMspList(updatedList.result);
          }
          setModalOpen("createdMsp");
          resetAll();
          onSuccess();
        }
      }
    } catch (error) {
      console.error("Erro ao enviar o formulário:", error);
      toast.error(
        isEditing
          ? t("mspRegister.editMspError")
          : t("mspRegister.alertMessage"),
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      open={true}
      onClose={onClose}
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
        backdropFilter: "blur(4px)",
      }}
    >
      <Box
        sx={{
          background: theme[mode].mainBackground,
          borderRadius: "24px",
          maxWidth: "1200px",
          width: "100%",
          maxHeight: "95vh",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          boxShadow: "0px 8px 32px rgba(0, 0, 0, 0.3)",
          border: `1px solid ${theme[mode].gray}`,
          opacity: isLoadingCnpj ? 0.7 : 1,
          pointerEvents: isLoadingCnpj ? "none" : "auto",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "20px 32px",
            borderBottom: `1px solid ${theme[mode].gray}`,
          }}
        >
          <TextRob16Font1S
            sx={{
              color: theme[mode].primary,
              fontSize: "24px",
              fontWeight: 600,
            }}
          >
            {isEditing
              ? t("mspRegister.editMsp") || "Editar MSP"
              : t("mspRegister.title")}
          </TextRob16Font1S>
          <IconButton
            onClick={onClose}
            sx={{
              color: theme[mode].black,
              "&:hover": {
                backgroundColor: theme[mode].gray + "20",
              },
            }}
          >
            <CloseIcon />
          </IconButton>
        </Box>

        <Box
          sx={{
            overflowY: "auto",
            flex: 1,
            "&::-webkit-scrollbar": {
              width: "8px",
            },
            "&::-webkit-scrollbar-track": {
              background: theme[mode].mainBackground,
            },
            "&::-webkit-scrollbar-thumb": {
              background: theme[mode].gray,
              borderRadius: "4px",
              "&:hover": {
                background: theme[mode].gray + "CC",
              },
            },
          }}
        >
          <Stack sx={{ gap: "0" }}>
            {activeStep === 0 ? <MspFormStep1 /> : <MspFormStep2 />}

            {showError && (
              <Box sx={{ padding: "16px 32px" }}>
                <TextRob16Font1S
                  sx={{
                    color: theme[mode].danger,
                    fontSize: "14px",
                    padding: "12px 16px",
                    background: theme[mode].danger + "15",
                    borderRadius: "8px",
                    border: `1px solid ${theme[mode].danger}40`,
                  }}
                >
                  {t("mspRegister.alertMessage")}
                </TextRob16Font1S>
              </Box>
            )}

            {showErrorPageTwo && (
              <Box sx={{ padding: "16px 32px" }}>
                <TextRob16Font1S
                  sx={{
                    color: theme[mode].danger,
                    fontSize: "14px",
                    padding: "12px 16px",
                    background: theme[mode].danger + "15",
                    borderRadius: "8px",
                    border: `1px solid ${theme[mode].danger}40`,
                  }}
                >
                  {t("mspRegister.alertMessage")}
                </TextRob16Font1S>
              </Box>
            )}
          </Stack>
        </Box>

        <Box
          sx={{
            padding: "24px 32px",
            borderTop: `1px solid ${theme[mode].gray}`,
            background: theme[mode].mainBackground,
          }}
        >
          <Stack
            sx={{
              flexDirection: "row",
              gap: "16px",
              justifyContent: activeStep === 0 ? "flex-end" : "space-between",
              alignItems: "center",
            }}
          >
            {activeStep === 0 ? (
              <>
                <FullFilledButton
                  label={t("mspRegister.continue") || "Continuar"}
                  onClick={handleNext}
                  sxButton={{ maxWidth: "150px", minWidth: "120px" }}
                />
                <UnfilledButton
                  label={t("mspRegister.cancel")}
                  onClick={onClose}
                  disabled={isSubmitting || isLoading || isLoadingCnpj}
                />
              </>
            ) : (
              <>
                <FullFilledButton
                  label={t("mspRegister.confirm")}
                  onClick={handleSubmit}
                  sxButton={{ maxWidth: "200px", minWidth: "180px" }}
                />
                <UnfilledButton
                  label={t("mspRegister.back")}
                  onClick={handleBack}
                  disabled={isSubmitting || isLoading || isLoadingCnpj}
                />
              </>
            )}
          </Stack>
        </Box>
      </Box>
    </Modal>
  );
};
