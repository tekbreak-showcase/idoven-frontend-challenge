import {
  Button,
  ButtonGroup,
  FormControlLabel,
  FormGroup,
  Switch,
} from "@mui/material";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import ZoomOutIcon from "@mui/icons-material/ZoomOut";
import ZoomInIcon from "@mui/icons-material/ZoomIn";
import RefreshOutlined from "@mui/icons-material/Refresh";

import Box from "@mui/material/Box";
import React, { ReactNode } from "react";
import { ChartType } from "#/components/chart";
import { ChartRange } from "#/components/app.types";
import { ConfigResponse } from "#/pages/api/config";
import {curateRange} from "#/helpers";

type ButtonPanelProps = {
  setExtremes: (range: ChartRange) => void;
  getChart: () => ChartType;
  range: ChartRange;
  config: ConfigResponse;
  setConfig: (key: string, value: boolean) => void;
};

type ButtonProps = {
  name: string;
  icon: ReactNode;
  getExtremes: () => ChartRange;
};

export const ButtonPanel = ({
  setExtremes,
  range,
  config,
  setConfig,
}: ButtonPanelProps) => {
  const controlButtons: ButtonProps[] = [
    {
      name: "Prev",
      icon: <NavigateBeforeIcon />,
      getExtremes: () => {
        const diff = range.end - range.start;
        return {
          start: range.start - diff,
          end: range.start,
        };
      },
    },
    {
      name: "Up",
      icon: <ZoomOutIcon />,
      getExtremes: () => {
        const diff = range.end - range.start;
        return {
          start: range.start - diff,
          end: range.end + diff,
        };
      },
    },
    {
      name: "Down",
      icon: <ZoomInIcon />,
      getExtremes: () => {
        const diff = (range.end - range.start) / 4;
        return {
          start: range.start + diff,
          end: range.end - diff,
        };
      },
    },
    {
      name: "Next",
      icon: <NavigateNextIcon />,
      getExtremes: () => {
        const diff = range.end - range.start;
        return {
          start: range.end,
          end: range.end + diff,
        };
      },
    },
  ];
  return (
    <Box
      display={"flex"}
      flexWrap={"nowrap"}
      alignItems={"center"}
      justifyContent={"space-between"}
      padding={"0 1em"}
    >
      <Box>
        <FormGroup>
          <FormControlLabel
            style={{ marginLeft: 0 }}
            control={
              <Switch
                size="small"
                defaultChecked={config.merged}
                onChange={(event) => {
                  setConfig("merged", event.target.checked);
                }}
              />
            }
            label={config.merged ? "Unmerge charts" : "Merge charts"}
            labelPlacement={"start"}
          />
        </FormGroup>
      </Box>
      <Box>
        <ButtonGroup
          variant="outlined"
          size={"small"}
          aria-label="outlined button group"
        >
          {controlButtons.map(({ name, icon, getExtremes }) => (
            <Button
              key={name}
              startIcon={icon}
              onClick={() => {
                const extremes = getExtremes()
                const curatedExtremes = curateRange(extremes.start, extremes.end)
                setExtremes(curatedExtremes);
              }}
            >
              {name}
            </Button>
          ))}
        </ButtonGroup>
      </Box>
      <Box>
        <Button
          startIcon={<RefreshOutlined />}
          onClick={() => {
            const range = { start: 0, end: config.size * 1000 };
            setExtremes(range);
          }}
        >
          Reset
        </Button>
      </Box>
    </Box>
  );
};
