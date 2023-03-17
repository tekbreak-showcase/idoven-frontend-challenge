import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import { Button } from "@mui/material";
import { ConfigResponse } from "#/pages/api/config";
import { ChartRange } from "#/components/app.types";
import { SliderInput } from "./slider-input";
import { TimeInput } from "./time-input";
import { ChartType } from "#/components/chart";

type TimeSelectorProps = {
  userRange: ChartRange;
  setExtremes: (range: ChartRange) => void;
  config: ConfigResponse;
  getChart: () => ChartType;
};
export const TimeSelector = ({
  userRange,
  setExtremes,
  getChart,
  config,
}: TimeSelectorProps) => {
  const [start, setStart] = useState<number>(userRange.start);
  const [end, setEnd] = useState<number>(userRange.end);

  const updatePlot = (id: string, value: number) => {
    const chart = getChart();
    if (!chart) {
      return;
    }

    chart.xAxis[0].removePlotLine(id);

    const min = chart.xAxis[0].min;
    const max = chart.xAxis[0].max;

    const shouldDrawPlot =
      min !== null &&
      max !== null &&
      ((id === "start" && min < value) || (id === "end" && value < max));

    if (shouldDrawPlot) {
      getChart().xAxis[0].addPlotLine({
        id,
        color: "#FF0000",
        width: 0.8,
        value: value,
      });
    }
  };

  useEffect(() => {
    setStart(userRange.start);
    setEnd(userRange.end);
  }, [userRange]);

  return (
    <Box>
      <Box
        display={"flex"}
        flexWrap={"nowrap"}
        alignItems={"center"}
        justifyContent={"space-between"}
      >
        <TimeInput
          value={start}
          onChange={(value) => {
            if (value === start || value > end) {
              return;
            }
            setStart(value);
            updatePlot("start", value);
          }}
          tabIndexStart={1}
        />
        <Box flexGrow={1} textAlign={"center"}>
          <Button
            size={"small"}
            disabled={start === userRange.start && end === userRange.end}
            variant="outlined"
            onClick={() => {
              setExtremes({ start, end });
            }}
          >
            APPLY
          </Button>
        </Box>
        <TimeInput
          value={end}
          onChange={(value) => {
            if (value === end || value < start) {
              return;
            }
            setEnd(value);
            updatePlot("end", value);
          }}
          tabIndexStart={6}
        />
      </Box>
      <Box
        display={"flex"}
        flexWrap={"nowrap"}
        alignItems={"center"}
        justifyContent={"space-evenly"}
        padding={"0 1em"}
      >
        <SliderInput
          tabIndex={5}
          step={config.interval}
          start={start}
          max={config.size * 1000}
          min={0}
          end={end}
          onChange={(value) => {
            setStart(value[0]);
            setEnd(value[1]);
            updatePlot("start", value[0]);
            updatePlot("end", value[1]);
          }}
        />
      </Box>
    </Box>
  );
};
