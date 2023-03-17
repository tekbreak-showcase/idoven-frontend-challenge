import { useTheme } from "@mui/material";
import { msToTimeUnits, timeUnitsToMS } from "#/components/chart/chart.helpers";
import {
  TimeInputContainer,
  TimeInputUnitContainer,
  TimeInputUnitLabel,
} from "./time-selector.styles";
import { inputs } from "./time-selector.constants";

type TimeSelectorProps = {
  onChange: (value: number) => void;
  value: number;
  tabIndexStart?: number;
};
export const TimeInput = ({
  onChange,
  value,
  tabIndexStart,
}: TimeSelectorProps) => {
  const theme = useTheme();
  const timeUnits = msToTimeUnits(value);

  return (
    <TimeInputContainer>
      {inputs.map(({ label, id, maxLength, maxValue, step }, index) => (
        <TimeInputUnitContainer key={`${label}$_{id}`}>
          <input
            maxLength={maxLength}
            tabIndex={(tabIndexStart ?? 1) + index}
            type={"numeric"}
            value={timeUnits[id]}
            step={step}
            pattern={`[0-9]{1,${maxLength ?? 2}}`}
            onFocus={(event) => event.currentTarget.select()}
            onChange={(event) => {
              const regex = new RegExp(`\\d{1,${maxLength ?? 2}}`);
              const value = event.target.value.match(regex)?.[0] ?? "0";

              const isOverflow =
                maxValue && maxValue != -1 && parseInt(value) > maxValue;
              const curatedValue = isOverflow ? maxValue.toString() : value;

              event.target.value = curatedValue;
              onChange(
                timeUnitsToMS({ ...timeUnits, [id]: parseInt(curatedValue) })
              );
            }}
          />
          <TimeInputUnitLabel backgroundColor={theme.palette.primary.main}>
            {label}
          </TimeInputUnitLabel>
        </TimeInputUnitContainer>
      ))}
    </TimeInputContainer>
  );
};
