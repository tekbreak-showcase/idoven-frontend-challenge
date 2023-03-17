import { useEffect, useRef, useState } from "react";
import Box from "@mui/material/Box";
import { PointsResponse } from "#/pages/api/points";
import { ConfigResponse } from "#/pages/api/config";
import { HighchartInstance } from "#/components/chart/chart";
import { Chart } from "#/components/chart";
import { TimeSelector } from "#/components/time-selector";
import { ButtonPanel } from "#/components/button-panel";

import { ChartRange } from "./app.types";
import { applyRange, getConfig, getPointsByRange } from "./app.helpers";

export const App = () => {
  const defaultRange: ChartRange = { start: 0, end: 0 };
  const [chartSelection, setChartSelection] = useState<ChartRange>();
  const [config, setConfig] = useState<ConfigResponse>();
  const chartComponent = useRef(null);
  const [initialData, setInitialData] = useState<PointsResponse>();
  const [range, setRange] = useState<ChartRange>();
  const [userRange, setUserRange] = useState<ChartRange>(defaultRange);
  const [points, setPoints] = useState<PointsResponse>();
  const getChart = () => {
    return (chartComponent.current as unknown as HighchartInstance)?.chart;
  };

  useEffect(() => {
    const init = async () => {
      const info = await getConfig();
      const end = info.size * 1000;

      const range = { start: 0, end };

      setConfig({ ...info });
      setUserRange(range);
      setRange(range);
    };

    init();
  }, []);

  useEffect(() => {
    const fetchPoints = async () => {
      if (config && range) {
        const diff = range.end - range.start;
        let newPoints: PointsResponse;

        if (initialData && diff > config.accuracy) {
          newPoints = applyRange(initialData, range);
        } else {
          getChart()?.showLoading?.();
          newPoints = await getPointsByRange(range?.start, range?.end);
        }

        if (!initialData) {
          setInitialData(newPoints);
        }

        getChart()?.hideLoading?.();
        setPoints(newPoints);
        setUserRange(range);
        getChart()?.xAxis.forEach((xAxis) =>
          xAxis.setExtremes(range.start, range.end)
        );
      }
    };

    fetchPoints();
  }, [range, config, initialData]);

  const getValidRange = (start?: number, end?: number) => {
    if (!config) {
      return { start: 0, end: 0 };
    }
    const maxEnd = config.size * 1000;

    let curatedStart = start ?? 0;
    let curatedEnd = end ?? maxEnd;

    // Check for negatives and wrong ranges
    curatedStart = Math.round(curatedStart <= 0 ? 0 : curatedStart);
    curatedEnd = Math.round(curatedEnd > curatedStart ? curatedEnd : maxEnd);
    curatedEnd = curatedEnd > maxEnd ? maxEnd : curatedEnd;

    return { start: curatedStart, end: curatedEnd };
  };

  const setExtremes = (start?: number, end?: number) => {
    if (!config) {
      return;
    }
    const interval = points?.interval ?? 1000;
    const newRange = getValidRange(start, end);

    setUserRange(newRange);

    // Find if we should get more date depending on the display window and the configured accuracy
    const diff = newRange.end - newRange.start;
    if (diff < config.accuracy) {
      const isAccurateZoom =
        interval === config.interval &&
        newRange.start >= userRange.start &&
        newRange.end <= userRange.end;

      if (!isAccurateZoom) {
        setRange(newRange);
        return;
      }
    }

    getChart()?.hideLoading?.();
  };

  if (!points || !range || !config || chartSelection) {
    return null;
  }

  return (
    <Box
      component={"main"}
      height={"100vh"}
      width={"100vw"}
      display={"flex"}
      flexDirection={"column"}
    >
      <Box>
        <TimeSelector
          getChart={getChart}
          userRange={userRange}
          setExtremes={(extremes) =>
            setRange(getValidRange(extremes.start, extremes.end))
          }
          config={config}
        />
        <ButtonPanel
          setExtremes={(extremes) =>
            setRange(getValidRange(extremes.start, extremes.end))
          }
          getChart={getChart}
          range={range ?? defaultRange}
          config={config}
          setConfig={(key, value) => setConfig({ ...config, [key]: value })}
        />
      </Box>
      <Chart
        ref={chartComponent}
        points={points}
        range={range}
        setRange={(start, end) => setExtremes(start, end)}
        config={config}
      />
    </Box>
  );
};
