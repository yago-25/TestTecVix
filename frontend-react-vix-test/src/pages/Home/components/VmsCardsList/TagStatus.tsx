import { Stack } from "@mui/material";
import { TextRob12Font2Xs } from "../../../../components/Text2Xs";
import { useZTheme } from "../../../../stores/useZTheme";
import { useTranslation } from "react-i18next";
import { checkStatus } from "../../../../utils/checkStatus";
import { TAction, TTask } from "../../../../types/VMTypes";

interface IProps {
  status: string | null;
  action?: TAction;
  task?: TTask;
}
export const TagStatus = ({ status, action, task }: IProps) => {
  const { theme, mode } = useZTheme();
  const { t } = useTranslation();
  const { color, textColor, text } = (() => {
    if (checkStatus(status, action, task).isRunning) {
      return {
        color: theme[mode].greenLight,
        textColor: theme[mode].green,
        text: t("home.running"),
      };
    }

    if (checkStatus(status, action, task).isStopped) {
      return {
        color: theme[mode].lightRed,
        textColor: theme[mode].red,
        text: t("home.stopped"),
      };
    }

    if (checkStatus(status, action, task).isPaused) {
      return {
        color: theme[mode].blue,
        textColor: theme[mode].blueDark,
        text: t("home.paused"),
      };
    }

    return {
      color: "#C1CAFB",
      textColor: "#3D04AA",
      text: t("home.waiting"),
    };
  })();

  return (
    <Stack
      sx={{
        backgroundColor: color,
        borderRadius: "12px",
        padding: "0px 16px",
        width: "fit-content",
      }}
    >
      <TextRob12Font2Xs
        sx={{
          color: textColor,
          lineHeight: "24px",
        }}
      >
        {text}
      </TextRob12Font2Xs>
    </Stack>
  );
};
