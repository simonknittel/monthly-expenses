// https://echarts.apache.org/examples/en/editor.html?c=area-stack-gradient&theme=dark
// https://echarts.apache.org/en/option.html#series-line

import { Save } from "@prisma/client";
import ECharts, { type Props as EChartsProps } from "./ECharts";
import { graphic } from "echarts";
import { Entry } from "../types";

interface Props {
  saves: { date: Date; entries: Entry[] }[];
}

export default function Chart({ saves }: Props) {
  const revenueValues: number[] = [];
  const expenseValues: number[] = [];
  const dates = new Set<Save["date"]>();

  saves
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .forEach((save) => {
      let revenue = 0;
      let expense = 0;

      save.entries.forEach((entry) => {
        if (entry.type === "revenue") revenue += entry.value;
        if (entry.type === "expense") expense += entry.value;
      });

      revenueValues.push(revenue);
      expenseValues.push(expense);

      dates.add(save.date);
    });

  const legendData = ["Revenue", "Expense"];

  const xAxisData = Array.from(dates).map((date) => {
    const timeFormat = new Intl.DateTimeFormat("de-DE", {
      dateStyle: "short",
      timeStyle: "short",
    });

    return timeFormat.format(date);
  });

  const series = [
    {
      name: "Revenue",
      type: "line",
      stack: "RevenueTotal",
      smooth: true,
      lineStyle: {
        width: 0,
      },
      showSymbol: false,
      areaStyle: {
        opacity: 0.8,
        color: new graphic.LinearGradient(0, 0, 0, 1, [
          {
            offset: 0,
            color: "rgb(128, 255, 165)",
          },
          {
            offset: 1,
            color: "rgb(1, 191, 236)",
          },
        ]),
      },
      emphasis: {
        disabled: true,
      },
      data: revenueValues,
    },
    {
      name: "Expense",
      type: "line",
      stack: "ExpenseTotal",
      smooth: true,
      lineStyle: {
        width: 0,
      },
      showSymbol: false,
      areaStyle: {
        opacity: 0.8,
        color: new graphic.LinearGradient(0, 0, 0, 1, [
          {
            offset: 0,
            color: "rgb(255, 0, 135)",
          },
          {
            offset: 1,
            color: "rgb(135, 0, 157)",
          },
        ]),
      },
      emphasis: {
        disabled: true,
      },
      data: expenseValues,
    },
  ];

  const option: EChartsProps["option"] = {
    color: ["#80FFA5", "#FF0087"],
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "cross",
        label: {
          backgroundColor: "#6a7985",
        },
      },
    },
    legend: {
      data: legendData,
    },
    grid: {
      left: "5px",
      right: "45px",
      bottom: 0,
      containLabel: true,
    },
    xAxis: [
      {
        type: "category",
        boundaryGap: false,
        data: xAxisData,
      },
    ],
    yAxis: [
      {
        type: "value",
      },
    ],
    series,
  };

  return (
    <section className="min-w-[480px] grow rounded bg-slate-800 p-8 text-slate-50">
      <ECharts option={option} />
    </section>
  );
}
