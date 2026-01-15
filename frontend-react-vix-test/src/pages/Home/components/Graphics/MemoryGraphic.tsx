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

interface IMemoryData {
  time: string;
  value: number;
}

interface IMemoryGraphicProps {
  totalMemory: number;
}

export const MemoryGraphic = ({ totalMemory }: IMemoryGraphicProps) => {
  const [chartData, setChartData] = useState<IMemoryData[]>([]);
  const { theme, mode } = useZTheme();
  const { t } = useTranslation();
  const { currentVMName: vmName, currentIdVM } = useZGlobalVar();

  useEffect(() => {
    if (!currentIdVM) return;

    const getBaseValue = (vmId: number) => {
      const seed = vmId * 11;
      const percentage = 40 + (seed % 35);
      return (totalMemory * percentage) / 100;
    };

    const generateInitialData = () => {
      const data: IMemoryData[] = [];
      const now = new Date();
      const baseValue = getBaseValue(currentIdVM);

      for (let i = 19; i >= 0; i--) {
        const time = new Date(now.getTime() - i * 2000);
        const timeString = time.toLocaleTimeString("pt-BR", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        });

        const variation =
          Math.sin(i * 0.3 + currentIdVM) * (totalMemory * 0.15);
        const randomNoise = (Math.random() - 0.5) * (totalMemory * 0.1);
        const value = Math.max(
          totalMemory * 0.1,
          Math.min(totalMemory * 0.95, baseValue + variation + randomNoise),
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

        const lastValue =
          prevData[prevData.length - 1]?.value || getBaseValue(currentIdVM);

        const trend = (Math.random() - 0.5) * (totalMemory * 0.08);
        const newValue = Math.max(
          totalMemory * 0.1,
          Math.min(
            totalMemory * 0.95,
            lastValue + trend + (Math.random() - 0.5) * (totalMemory * 0.05),
          ),
        );

        newData.push({
          time: timeString,
          value: parseFloat(newValue.toFixed(3)),
        });

        return newData;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [currentIdVM, totalMemory]);

  const lastMemoryUsage = chartData[chartData.length - 1]?.value || 0;
  const lastMemoryPercentage = (lastMemoryUsage / totalMemory) * 100;

  const valueColor =
    lastMemoryPercentage < 70
      ? theme[mode].ok
      : lastMemoryPercentage < 90
        ? theme[mode].warning
        : theme[mode].danger;

  const threshold70 = totalMemory * 0.7;
  const threshold90 = totalMemory * 0.9;

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
        {`${t("graphics.memoryUsage")} - ${vmName}`}
        <span style={{ color: theme[mode].gray, fontWeight: "300" }}>
          {" "}
          {t("graphics.currentUse")}{" "}
          <span style={{ color: valueColor }}>
            {lastMemoryUsage.toFixed(2)} GB ({lastMemoryPercentage.toFixed(1)}%)
          </span>
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
              value: t("graphics.memoryUsage"),
              angle: -90,
              position: "insideLeft",
              fill: theme[mode].dark,
              fontSize: 10,
            }}
            tick={{ fill: theme[mode].dark, fontSize: 10 }}
            domain={[0, (dataMax: number) => Math.ceil(dataMax * 1.16)]}
            tickFormatter={(value) => `${value.toFixed(1)} GB`}
          />
          <Tooltip
            formatter={(value) => [
              `${parseFloat(value as string).toFixed(2)} GB (${((parseFloat(value as string) / totalMemory) * 100).toFixed(1)}%)`,
              t("graphics.memoryUsage"),
            ]}
          />
          <Legend />
          <ReferenceLine
            y={threshold70}
            stroke="yellow"
            strokeDasharray="3 3"
            label={{
              value: `70% (${threshold70.toFixed(1)} GB)`,
              fill: "yellow",
              fontSize: 10,
            }}
          />
          <ReferenceLine
            y={threshold90}
            stroke="red"
            strokeDasharray="3 3"
            label={{
              value: `90% (${threshold90.toFixed(1)} GB)`,
              fill: "red",
              fontSize: 10,
            }}
          />
          <Area
            type="monotone"
            dataKey="value"
            stroke="#82ca9d"
            fill="#82ca9d"
            dot={false}
            isAnimationActive={false}
            legendType="none"
          />
        </AreaChart>
      </ResponsiveContainer>
    </Stack>
  );
};
