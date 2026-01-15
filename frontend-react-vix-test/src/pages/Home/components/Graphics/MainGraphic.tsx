import { useState, useEffect } from "react";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
  Area,
  AreaChart,
} from "recharts";
import { Stack, Typography } from "@mui/material";
import { useZTheme } from "../../../../stores/useZTheme";
import { useTranslation } from "react-i18next";
import { useZGlobalVar } from "../../../../stores/useZGlobalVar";
import { IFormatData } from "../../../../types/socketType";

export const MainGraphic = () => {
  const [chartData, setChartData] = useState<IFormatData[]>([]);
  const { theme, mode } = useZTheme();
  const { t } = useTranslation();
  const { currentVMName: vmName, currentIdVM } = useZGlobalVar();

  useEffect(() => {
    if (!currentIdVM) return;

    const getBaseValue = (vmId: number) => {
      const seed = vmId * 7;
      return 30 + (seed % 40);
    };

    const generateInitialData = () => {
      const data: IFormatData[] = [];
      const now = new Date();
      const baseValue = getBaseValue(currentIdVM);

      for (let i = 19; i >= 0; i--) {
        const time = new Date(now.getTime() - i * 2000);
        const timeString = time.toLocaleTimeString("pt-BR", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        });

        const variation = Math.sin(i * 0.5 + currentIdVM) * 15;
        const randomNoise = (Math.random() - 0.5) * 10;
        const value = Math.max(
          5,
          Math.min(95, baseValue + variation + randomNoise),
        );

        data.push({
          time: timeString,
          value: parseFloat(value.toFixed(3)),
        });
      }

      return data;
    };

    setChartData(generateInitialData());

    const interval = setInterval(() => {
      setChartData((prevData) => {
        const newData = [...prevData.slice(1)];
        const now = new Date();
        const timeString = now.toLocaleTimeString("pt-BR", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        });

        const baseValue = getBaseValue(currentIdVM);
        const lastValue = prevData[prevData.length - 1]?.value || baseValue;

        const trend = (Math.random() - 0.5) * 8;
        const newValue = Math.max(
          5,
          Math.min(95, lastValue + trend + (Math.random() - 0.5) * 5),
        );

        newData.push({
          time: timeString,
          value: parseFloat(newValue.toFixed(3)),
        });

        return newData;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [currentIdVM]);

  const lastCpuUsage = chartData[chartData.length - 1]?.value || 0;

  const valueColor =
    lastCpuUsage < 70
      ? theme[mode].ok
      : lastCpuUsage < 90
        ? theme[mode].warning
        : theme[mode].danger;

  // if (!chartData.length) return <EmptyFeedBack />;

  return (
    <Stack
      sx={{
        width: "100%",
        height: "100%",
      }}
    >
      <Typography
        sx={{
          padding: "2px",
          color: theme[mode].primary,
          fontWeight: "500",
          paddingRight: "24px",
        }}
      >
        {`${t("graphics.cpuUsage")} - ${vmName}`}
        <span style={{ color: theme[mode].gray, fontWeight: "300" }}>
          {" "}
          {t("graphics.currentUse")}{" "}
          <span style={{ color: valueColor }}>{lastCpuUsage.toFixed(3)}%</span>
        </span>
      </Typography>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 0, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke={theme[mode].gray} />
          <XAxis
            dataKey="time"
            label={{
              value: t("graphics.time"),
              position: "insideBottomRight",
              offset: -5,
              fill: theme[mode].dark,
              fontSize: 10,
            }}
            tick={{ fill: theme[mode].dark, fontSize: 10 }}
          />
          <YAxis
            label={{
              value: t("graphics.cpuUsage"),
              angle: -90,
              position: "insideLeft",
              fill: theme[mode].dark,
              fontSize: 10,
            }}
            tick={{ fill: theme[mode].dark, fontSize: 10 }}
            domain={[0, (dataMax: number) => Math.ceil(dataMax * 1.16)]}
          />
          <Tooltip
            formatter={(value) => parseFloat(value as string).toFixed(2)}
          />
          <Legend />
          <ReferenceLine y={70} stroke="yellow" strokeDasharray="3 3" />
          <ReferenceLine y={90} stroke="red" strokeDasharray="3 3" />
          <Area
            type="monotone"
            dataKey="value"
            stroke="#8884d8"
            fill="#8884d8"
            dot={false}
            isAnimationActive={false}
            legendType="none"
          />
        </AreaChart>
      </ResponsiveContainer>
    </Stack>
  );
};
