import React, { forwardRef, memo, Ref, useMemo } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import HighchartsBoost from "highcharts/modules/boost";
import GridLight from "highcharts/themes/grid-light";
import { ChartRange } from "#/components/app.types";
import { msToTime } from "#/components/chart/chart.helpers";
import type { Chart as HighchartChartType } from "highcharts";
import { PointsResponse } from "#/pages/api/points";
import { curateRange } from "#/helpers";
import { ConfigResponse } from "#/pages/api/config";
import {
  COMMON_CONFIG,
  COMMON_Y_AXIS_CONFIG,
} from "#/components/chart/chart.constants";

if (typeof Highcharts === "object") {
  GridLight(Highcharts);
  HighchartsBoost(Highcharts);
}

export type HighchartInstance = {
  chart: HighchartChartType;
};

interface ChartProps {
  points: PointsResponse;
  range: ChartRange;
  setRange: (start: number, end: number) => void;
  config: ConfigResponse;
}

const ChartComponent = (
  { points, range, setRange, config }: ChartProps,
  forwardedRef: Ref<HTMLDivElement>
) => {
  const options = useMemo(
    () => ({
      ...COMMON_CONFIG,
      tooltip: {
        ...COMMON_CONFIG.tooltip,
        formatter: function () {
          const instance = this as unknown as { x: number; y: number };
          return `${msToTime(instance.x)}<br /><b>${instance.y}vu</b><br /><i>${
            instance.x
          }ms</i>`;
        },
      },
      yAxis: config.merged
        ? COMMON_Y_AXIS_CONFIG
        : points.series.map((series, index) => ({
            ...COMMON_Y_AXIS_CONFIG,
            title: {
              ...COMMON_Y_AXIS_CONFIG,
              text: `Value ${index}`,
            },
            height: `${80 / points.series.length}%`,
            top: `${(index * 100) / points.series.length}%`,
          })),
      xAxis: {
        ...COMMON_CONFIG.xAxis,
        events: {
          afterSetExtremes: async (e: {
            min: number;
            max: number;
            dataMin: number;
            dataMax: number;
          }) => {
            // const newRange = curateRange(e.min, e.max);
            // setRange(newRange.start, newRange.end);
            //console.log(e);
            if (e.min !== e.dataMin && e.min !== e.dataMax) {
              const newRange = curateRange(e.min, e.max);
              setRange(newRange.start, newRange.end);
            }
          },
        },
        labels: {
          formatter: (a: { value: number }) => {
            return msToTime(a.value);
          },
        },
      },
      series: points.series.map((series, index) => {
        return {
          type: "line",
          data: series,
          yAxis: config.merged ? undefined : index,
          lineWidth: 1,
          name: `Value ${index}`,
          pointInterval: points.interval,
          pointStart: range.start,
          marker: {
            enabled: false,
          },
        };
      }),
    }),
    [points, range]
  );

  return (
    <HighchartsReact
      ref={forwardedRef}
      highcharts={Highcharts}
      options={options}
      style={{ height: "100vh", width: "100vw" }}
    />
  );
};

export const Chart = memo(forwardRef(ChartComponent));
