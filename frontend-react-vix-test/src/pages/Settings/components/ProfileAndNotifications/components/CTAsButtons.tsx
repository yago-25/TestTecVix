import { Button, Stack } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useZTheme } from "../../../../../stores/useZTheme";
import { TextRob16FontL } from "../../../../../components/TextL";
import { toast } from "react-toastify";
import { useZFormProfileNotifications } from "../../../../../stores/useZFormProfileNotifications";
import { useUserResources } from "../../../../../hooks/useUserResources";

interface IUpdateUserPayload {
  username?: string;
  email?: string;
  fullName?: string;
  userPhoneNumber?: string | null;
  password?: string;
}

export const CTAsButtons = () => {
  const { t } = useTranslation();
  const { theme, mode } = useZTheme();
  const { updateUser, isLoading } = useUserResources();

  const {
    fullNameForm,
    userName,
    userEmail,
    userPhone,
    password,
    confirmPassword,
    setFormProfileNotifications,
  } = useZFormProfileNotifications();

  const validateAll = () => {
    let ok = true;

    if (
      !fullNameForm.value ||
      fullNameForm.value.length < 4 ||
      fullNameForm.value.length > 100
    ) {
      ok = false;
      setFormProfileNotifications({
        fullNameForm: {
          ...fullNameForm,
          errorMessage: fullNameForm.value
            ? t("profileAndNotifications.invalidData")
            : t("profileAndNotifications.requiredField"),
        },
      });
    } else {
      setFormProfileNotifications({
        fullNameForm: { ...fullNameForm, errorMessage: "" },
      });
    }

    if (
      !userName.value ||
      userName.value.length < 4 ||
      userName.value.length > 100
    ) {
      ok = false;
      setFormProfileNotifications({
        userName: {
          ...userName,
          errorMessage: userName.value
            ? t("profileAndNotifications.invalidData")
            : t("profileAndNotifications.requiredField"),
        },
      });
    } else {
      setFormProfileNotifications({
        userName: { ...userName, errorMessage: "" },
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (
      !userEmail.value ||
      !emailRegex.test(userEmail.value) ||
      userEmail.value.length > 100
    ) {
      ok = false;
      setFormProfileNotifications({
        userEmail: {
          ...userEmail,
          errorMessage: userEmail.value
            ? t("profileAndNotifications.invalidData")
            : t("profileAndNotifications.requiredField"),
        },
      });
    } else {
      setFormProfileNotifications({
        userEmail: { ...userEmail, errorMessage: "" },
      });
    }

    const phoneRegex = /^\d{10,11}$/;
    if (
      userPhone.value &&
      (!phoneRegex.test(userPhone.value) || userPhone.value.length > 20)
    ) {
      ok = false;
      setFormProfileNotifications({
        userPhone: {
          ...userPhone,
          errorMessage: t("profileAndNotifications.invalidData"),
        },
      });
    } else {
      setFormProfileNotifications({
        userPhone: { ...userPhone, errorMessage: "" },
      });
    }

    if (password.value) {
      if (password.value !== confirmPassword.value) {
        ok = false;
        setFormProfileNotifications({
          password: {
            ...password,
            errorMessage: t("colaboratorRegister.dontMatch"),
          },
        });
      } else {
        setFormProfileNotifications({
          password: { ...password, errorMessage: "" },
        });
      }
    } else {
      setFormProfileNotifications({
        password: { ...password, errorMessage: "" },
      });
    }

    return ok;
  };

  const handleSave = async () => {
    const ok = validateAll();
    if (!ok) return toast.error(t("profileAndNotifications.errorForm"));

    const payload: IUpdateUserPayload = {
      fullName: fullNameForm.value,
      username: userName.value,
      email: userEmail.value,
      userPhoneNumber: userPhone.value || null,
    };

    if (password.value) payload.password = password.value;

    const res = await updateUser(payload);
    console.log(res, "res");
    if (!res) return;

    toast.success(t("generic.dataSavesuccess"));

    setFormProfileNotifications({
      password: { ...password, value: "", errorMessage: "" },
      confirmPassword: { ...confirmPassword, value: "", errorMessage: "" },
    });
  };

  const handleReset = () => {
    setFormProfileNotifications({
      password: { ...password, value: "", errorMessage: "" },
      confirmPassword: { ...confirmPassword, value: "", errorMessage: "" },
      fullNameForm: { ...fullNameForm, errorMessage: "" },
      userName: { ...userName, errorMessage: "" },
      userEmail: { ...userEmail, errorMessage: "" },
      userPhone: { ...userPhone, errorMessage: "" },
    });
  };

  return (
    <Stack
      flexDirection={"row"}
      sx={{
        gap: "24px",
        "@media (max-width: 745px)": {
          flexDirection: "column",
        },
      }}
    >
      <Button
        disabled={isLoading}
        sx={{
          background: theme[mode].blue,
          border: `1px solid ${theme[mode].blue}`,
          textTransform: "none",
          borderRadius: "12px",
          height: "48px",
          fontWeight: "500",
          fontSize: "16px",
          width: "100%",
          maxWidth: "330px",
          "@media (max-width: 745px)": {
            maxWidth: "100%",
          },
        }}
        onClick={handleSave}
      >
        <TextRob16FontL
          sx={{
            color: theme[mode].btnText,
            fontWeight: "500",
            fontFamily: "Roboto",
            lineHeight: "16px",
          }}
        >
          {t("profileAndNotifications.saveChanges")}
        </TextRob16FontL>
      </Button>

      <Button
        disabled={isLoading}
        sx={{
          background: "transparent",
          border: `1px solid ${theme[mode].blueDark}`,
          textTransform: "none",
          borderRadius: "12px",
          height: "48px",
          fontWeight: "500",
          fontSize: "16px",
          width: "100%",
          maxWidth: "330px",
          "@media (max-width: 745px)": {
            maxWidth: "100%",
          },
        }}
        onClick={handleReset}
      >
        <TextRob16FontL
          sx={{
            color: theme[mode].blueDark,
            fontWeight: "500",
            fontFamily: "Roboto",
            lineHeight: "16px",
          }}
        >
          {t("profileAndNotifications.redefineAllData")}
        </TextRob16FontL>
      </Button>
    </Stack>
  );
};
