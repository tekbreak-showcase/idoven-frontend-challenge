import { TimeUnits } from "#/components/chart/chart.helpers";

export const inputs: {
  label: string;
  id: keyof TimeUnits;
  maxLength?: number;
  maxValue?: number;
  step?: number;
}[] = [
  {
    label: "Hours",
    id: "h",
    maxValue: -1,
  },
  {
    label: "Minutes",
    id: "m",
  },
  {
    label: "Seconds",
    id: "s",
  },
  {
    label: "Milliseconds",
    id: "ms",
    step: 40,
    maxLength: 3,
    maxValue: 999,
  },
];
