import { Stack, Box, Checkbox, Grid, Divider } from "@mui/material";
import { useZTheme } from "../../../stores/useZTheme";
import { useTranslation } from "react-i18next";
import { useZMspRegisterPage } from "../../../stores/useZMspRegisterPage";
import { InputLabelTooltip } from "../../../components/Inputs/InputLabelTooltip";
import { TextRob16Font1S } from "../../../components/Text1S";
import { TextRob16FontL } from "../../../components/TextL";
import { maskCNPJ } from "../../../utils/maskCNPJ";
import { useCnpj } from "../../../hooks/useCnpj";

export const MspFormStep1 = () => {
  const { theme, mode } = useZTheme();
  const { t } = useTranslation();
  const {
    companyName,
    setCompanyName,
    cnpj,
    setCnpj,
    phone,
    setPhone,
    sector,
    setSector,
    contactEmail,
    setContactEmail,
    locality,
    setLocality,
    showCnpjError,
    setShowCnpjError,
    isPoc,
    setIsPoc,
    discountRate,
    setDiscountRate,
    minConsumption,
    setMinConsumption,
  } = useZMspRegisterPage();

  const { fetchCnpj, isLoading: isLoadingCnpj } = useCnpj();

  const handleCnpjBlur = async () => {
    if (cnpj.replace(/\D/g, "").length === 14) {
      const cnpjData = await fetchCnpj(cnpj);
      if (cnpjData) {
        if (!companyName) {
          setCompanyName(cnpjData.razao_social || "");
        }
        setShowCnpjError(false);
      } else {
        setShowCnpjError(true);
      }
    }
  };

  return (
    <Stack
      sx={{
        width: "100%",
        gap: "32px",
      }}
    >
      <TextRob16FontL
        sx={{
          color: theme[mode].primary,
          fontSize: "20px",
          fontWeight: 500,
          marginBottom: "8px",
        }}
      >
        {t("mspRegister.stepOneTitle")}
      </TextRob16FontL>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Box sx={{ marginBottom: "20px" }}>
            <InputLabelTooltip
              label={
                <>
                  {t("mspRegister.companyName")}{" "}
                  <span style={{ color: theme[mode].danger }}>
                    {t("mspRegister.required")}
                  </span>
                </>
              }
              value={companyName}
              onChange={setCompanyName}
              placeholder={t("mspRegister.companyName")}
            />
          </Box>

          <Box sx={{ marginBottom: "20px" }}>
            <InputLabelTooltip
              label={
                <>
                  {t("mspRegister.location")}{" "}
                  <span style={{ color: theme[mode].danger }}>
                    {t("mspRegister.required")}
                  </span>
                </>
              }
              value={locality}
              onChange={setLocality}
              placeholder={t("mspRegister.locationPlaceholder")}
            />
          </Box>

          <Box sx={{ marginBottom: "20px" }}>
            <InputLabelTooltip
              label={
                <>
                  {t("mspRegister.cnpj")}{" "}
                  <span style={{ color: theme[mode].danger }}>
                    {t("mspRegister.required")}
                  </span>
                </>
              }
              value={maskCNPJ(cnpj)}
              onChange={(value) => setCnpj(value)}
              onBlur={handleCnpjBlur}
              placeholder="00.000.000/0000-00"
              endText={isLoadingCnpj ? "Carregando..." : ""}
            />
            {showCnpjError && (
              <TextRob16Font1S
                sx={{
                  color: theme[mode].danger,
                  fontSize: "12px",
                  marginTop: "4px",
                }}
              >
                {t("mspRegister.cnpjAlertMessage")}
              </TextRob16Font1S>
            )}
          </Box>
        </Grid>

        <Grid item xs={12} md={6}>
          <Box sx={{ marginBottom: "20px" }}>
            <InputLabelTooltip
              label={t("mspRegister.phone")}
              value={phone}
              onChange={setPhone}
              placeholder="(00) 00000-0000"
            />
          </Box>

          <Box sx={{ marginBottom: "20px" }}>
            <InputLabelTooltip
              label={
                <>
                  {t("mspRegister.sector")}{" "}
                  <span style={{ color: theme[mode].danger }}>
                    {t("mspRegister.required")}
                  </span>
                </>
              }
              value={sector}
              onChange={setSector}
              placeholder={t("mspRegister.sectorPlaceholder")}
            />
          </Box>

          <Box sx={{ marginBottom: "20px" }}>
            <InputLabelTooltip
              label={
                <>
                  {t("mspRegister.contactEmail")}{" "}
                  <span style={{ color: theme[mode].danger }}>
                    {t("mspRegister.required")}
                  </span>
                </>
              }
              value={contactEmail}
              onChange={setContactEmail}
              placeholder="contato@empresa.com"
              type="email"
            />
          </Box>
        </Grid>
      </Grid>

      <Divider sx={{ marginY: "32px", borderColor: theme[mode].gray + "40" }} />

      <Grid container spacing={3} alignItems="center">
        <Grid item xs={12} sm={4}>
          <InputLabelTooltip
            label={t("mspRegister.minConsumption")}
            value={minConsumption.toString()}
            onChange={(value) => setMinConsumption(Number(value) || 0)}
            type="number"
            placeholder="0"
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <Box sx={{ display: "flex", alignItems: "flex-start", gap: "8px" }}>
            <Box sx={{ flex: 1 }}>
              <InputLabelTooltip
                label={t("mspRegister.discountPercentage")}
                value={discountRate.toString()}
                onChange={(value) => setDiscountRate(Number(value) || 0)}
                type="number"
                placeholder="0"
              />
            </Box>
            <TextRob16Font1S
              sx={{
                color: theme[mode].black,
                fontSize: "16px",
                marginTop: "32px",
                fontWeight: 500,
              }}
            >
              %
            </TextRob16Font1S>
          </Box>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginTop: "0",
            }}
          >
            <Checkbox
              checked={isPoc}
              onChange={(e) => setIsPoc(e.target.checked)}
              sx={{
                color: theme[mode].blue,
                "&.Mui-checked": {
                  color: theme[mode].blue,
                },
              }}
            />
            <TextRob16Font1S sx={{ color: theme[mode].black }}>
              {t("mspRegister.isPoc")}
            </TextRob16Font1S>
          </Box>
        </Grid>
      </Grid>
    </Stack>
  );
};
