import { Input, Slider, SxProps } from "@mui/material";
import { useZTheme } from "../../../stores/useZTheme";
import { Stack } from "@mui/system";
import { TextRob16FontL } from "../../../components/TextL";
import { useRefFocusEffect } from "../../../hooks/useRefFocusEffect";

interface Props {
  value?: number;
  onChange: (value: number) => void;
  sx?: SxProps;
  label?: string;
  sxLabel?: SxProps;
  min?: number;
  max?: number;
  step?: number;
  clickSelect?: boolean;
  disabled?: boolean;
}

export const SliderLabelNum = ({
  sx,
  value,
  onChange,
  label,
  sxLabel,
  min,
  max,
  step,
  clickSelect = true,
  disabled,
}: Props) => {
  const { theme, mode } = useZTheme();
  const { inputRef } = useRefFocusEffect();

  const handleSliderChange = (_event: Event, newValue: number | number[]) => {
    onChange(newValue as number);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.value === "" ? 0 : Number(event.target.value));
  };

  const handleBlur = () => {
    if (Number(value) < Number(min)) {
      onChange(Number(min) || 0);
    } else if (Number(value) > Number(max)) {
      onChange(Number(max));
    }
  };

  return (
    <Stack
      sx={{
        width: "100%",
        gap: "12px",
      }}
    >
      <TextRob16FontL
        sx={{
          fontWeight: 400,
          lineHeight: "16px",
          color: theme[mode].primary,
          ...sxLabel,
        }}
      >
        {label}
      </TextRob16FontL>
      <Stack
        sx={{
          flexDirection: "row",
          gap: "20px",
          backgroundColor: theme[mode].grayLight,
          borderRadius: "12px",
          height: "36px",
          alignItems: "center",
          justifyContent: "space-between",
          paddingLeft: "20px",
          paddingRight: "8px",
        }}
      >
        <Slider
          disabled={disabled}
          sx={{
            width: "100%",
            "& .MuiSlider-thumb": {
              width: "16px",
              height: "16px",
              color: theme[mode].primary,
              boxShadow: `0px 0px 0px 4px ${theme[mode].primary + "1a"}`,
              "&:focus, &:hover, &.Mui-active": {
                boxShadow: `0px 0px 0px 8px ${theme[mode].primary + "30"}`,
              },
            },
            "& .MuiSlider-track": {
              color: theme[mode].primary,
            },
            "& .MuiSlider-rail": {
              color: theme[mode].tertiary,
            },
            ...sx,
          }}
          value={typeof value === "number" ? value : 0}
          onChange={handleSliderChange}
          aria-labelledby="input-slider"
          min={min}
          max={max}
          step={step || 1}
        />

        <Input
          inputRef={clickSelect ? inputRef : undefined}
          value={value}
          size="small"
          onChange={handleInputChange}
          onBlur={handleBlur}
          disableUnderline
          sx={{
            width: "80px",
            color: theme[mode].primary,
          }}
          inputProps={{
            step: step || 1,
            min,
            max,
            type: "number",
            sx: {
              textAlign: "center",
            },
            "aria-labelledby": "input-slider",
          }}
        />
      </Stack>
    </Stack>
  );
};
