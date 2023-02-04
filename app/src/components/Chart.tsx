// https://echarts.apache.org/examples/en/editor.html?c=area-stack-gradient&theme=dark
// https://echarts.apache.org/examples/en/editor.html?c=sankey-simple&theme=dark

import { Save } from "@prisma/client";
import ECharts, { type Props as EChartsProps } from "./ECharts";
import { graphic } from "echarts";
import { Entry } from "../types";

interface Props {
  saves: Save[];
}

export default function Chart({ saves }: Props) {
  const revenueCategories = new Set<Entry["category"]>();
  const expenseCategories = new Set<Entry["category"]>();
  const dates = new Set<Save["date"]>();

  saves.forEach((save) => {
    const entries: Entry[] = JSON.parse(save.entries);

    entries.forEach((entry) => {
      if (entry.type === "revenue") revenueCategories.add(entry.category);
      if (entry.type === "expense") expenseCategories.add(entry.category);
    });

    dates.add(save.date);
  });

  const legendData = [
    ...Array.from(revenueCategories),
    ...Array.from(expenseCategories),
  ];

  const xAxisData = Array.from(dates).map((date) => date.toISOString());

  const series = [
    ...Array.from(revenueCategories).map((category) => {
      const data: number[] = [];

      saves.forEach((save) => {
        const entries = JSON.parse(save.entries);
        data.push(
          entries
            .filter((entry) => entry.category === category)
            .reduce((total, entry) => (total += parseInt(entry.value)), 0)
        );
      });

      return {
        name: category,
        type: "line",
        stack: "Total",
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
          focus: "series",
        },
        data,
      };
    }),
    ...Array.from(expenseCategories).map((category) => {
      const data: number[] = [];

      saves.forEach((save) => {
        const entries = JSON.parse(save.entries);
        data.push(
          entries
            .filter((entry) => entry.category === category)
            .reduce((total, entry) => (total += parseInt(entry.value)), 0)
        );
      });

      return {
        name: category,
        type: "line",
        stack: "Total",
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
          focus: "series",
        },
        data,
      };
    }),
  ];

  const option: EChartsProps["option"] = {
    color: ["#80FFA5", "#00DDFF", "#37A2FF", "#FF0087", "#FFBF00"],
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
      left: 0,
      right: 0,
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
    <section className="grow rounded bg-slate-800 p-8 text-slate-50">
      <ECharts option={option} />
    </section>
  );
}
