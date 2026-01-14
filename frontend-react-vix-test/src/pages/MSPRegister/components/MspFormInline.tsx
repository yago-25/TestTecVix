import { Stack, Box, IconButton } from "@mui/material";
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
import { TextRob16FontL } from "../../../components/TextL";
import { useState, useEffect, useRef } from "react";
import CloseIcon from "@mui/icons-material/Close";
import { useAuth } from "../../../hooks/useAuth";
import { api } from "../../../services/api";
import { genStrongPass } from "../../../utils/genStrongPass";
import { useCnpj } from "../../../hooks/useCnpj";

interface IProps {
  editingMspId?: number;
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

export const MspFormInline = ({ editingMspId, onSuccess }: IProps) => {
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
    setAdmPassword,
  } = useZMspRegisterPage();

  const { createAnewBrandMaster, editBrandMaster, listAllBrands, isLoading } =
    useBrandMasterResources();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const formRef = useRef<HTMLDivElement>(null);
  const { getAuth } = useAuth();
  const { fetchCnpj, isLoading: isLoadingCnpj } = useCnpj();
  const [lastFetchedCnpj, setLastFetchedCnpj] = useState("");

  useEffect(() => {
    if (editingMspId) {
      const loadMspData = async () => {
        const msp = mspList.find((m) => m.idBrandMaster === editingMspId);
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
          setActiveStep(0);
          setLastFetchedCnpj(msp.cnpj || "");

          try {
            const auth = await getAuth();
            const usersResponse = await api.get<IUsersApiResponse>({
              url: "/user",
              auth,
              params: {
                idBrandMaster: editingMspId,
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
                setAdmPassword("");
              }
            }
          } catch (error) {
            console.log("Error loading admin user:", error);
          }

          setTimeout(() => {
            if (formRef.current) {
              const elementPosition =
                formRef.current.getBoundingClientRect().top;
              const offsetPosition = elementPosition + window.pageYOffset - 100;
              window.scrollTo({
                top: offsetPosition,
                behavior: "smooth",
              });
            }
          }, 100);
        }
      };
      loadMspData();
    } else {
      resetAll();
      setActiveStep(0);
      setLastFetchedCnpj("");
    }
  }, [editingMspId, mspList]);

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

      if (editingMspId) {
        const result = await editBrandMaster(editingMspId, {
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
          setActiveStep(0);
          setTimeout(() => {
            onSuccess();
          }, 100);
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
          setActiveStep(0);
          setTimeout(() => {
            onSuccess();
          }, 100);
        }
      }
    } catch (error) {
      console.log("Error submitting MSP form:", error);
      toast.error(
        editingMspId
          ? t("mspRegister.editMspError")
          : t("mspRegister.alertMessage"),
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    resetAll();
    setActiveStep(0);
    setLastFetchedCnpj("");
    onSuccess();
  };

  return (
    <Box
      ref={formRef}
      sx={{
        width: "100%",
        background: theme[mode].mainBackground,
        borderRadius: "16px",
        padding: "40px",
        marginBottom: "32px",
        border: `1px solid ${theme[mode].gray}40`,
        boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.1)",
        opacity: isLoadingCnpj ? 0.7 : 1,
        pointerEvents: isLoadingCnpj ? "none" : "auto",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "24px",
          paddingBottom: "16px",
          borderBottom: `1px solid ${theme[mode].gray}40`,
        }}
      >
        <TextRob16FontL
          sx={{
            color: theme[mode].primary,
            fontSize: "24px",
            fontWeight: 600,
          }}
        >
          {editingMspId
            ? t("mspRegister.editMsp") || "Editar MSP"
            : t("mspRegister.createNew") || "Criar novo MSP"}
        </TextRob16FontL>
        {editingMspId && (
          <IconButton
            onClick={handleCancel}
            sx={{
              color: theme[mode].black,
              "&:hover": {
                backgroundColor: theme[mode].gray + "20",
              },
            }}
          >
            <CloseIcon />
          </IconButton>
        )}
      </Box>

      <Stack sx={{ gap: "32px" }}>
        {activeStep === 0 ? <MspFormStep1 /> : <MspFormStep2 />}

        {showError && (
          <Box>
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
          <Box>
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

        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            gap: "16px",
            justifyContent: activeStep === 0 ? "flex-end" : "space-between",
            alignItems: "center",
            paddingTop: "16px",
            borderTop: `1px solid ${theme[mode].gray}40`,
          }}
        >
          {activeStep === 0 ? (
            <>
              <FullFilledButton
                label={t("mspRegister.continue") || "Continuar"}
                onClick={handleNext}
                sxButton={{ maxWidth: "150px", minWidth: "120px" }}
              />
              {editingMspId && (
                <UnfilledButton
                  label={t("mspRegister.cancel")}
                  onClick={handleCancel}
                  disabled={isSubmitting || isLoading || isLoadingCnpj}
                />
              )}
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
        </Box>
      </Stack>
    </Box>
  );
};
