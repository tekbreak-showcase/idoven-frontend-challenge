import React, { useEffect, useState } from "react";
import SliderMUI from "@mui/material/Slider";

type SliderValue = [number, number];
type SliderProps = {
  start: number;
  end: number;
  onChange: (value: SliderValue) => void;
  step: number;
  tabIndex: number;
  max: number;
  min: number;
};
export const SliderInput = ({
  start,
  end,
  onChange,
  step,
  max,
  min,
  tabIndex,
}: SliderProps) => {
  const [selection, setSelection] = useState<SliderValue>([min, max]);

  useEffect(() => {
    setSelection([start, end]);
  }, [start, end]);

  return (
    <SliderMUI
      tabIndex={tabIndex}
      getAriaLabel={() => "Temperature range"}
      defaultValue={[min, max]}
      value={selection}
      size="small"
      step={step}
      min={min}
      max={max}
      onChange={(_, range) => {
        const extremes = Array.isArray(range) ? range : [start, end];
        const value: SliderValue = [extremes[0], extremes[1]];
        onChange(value);
        setSelection(value);
      }}
      valueLabelDisplay={"off"}
    />
  );
};
