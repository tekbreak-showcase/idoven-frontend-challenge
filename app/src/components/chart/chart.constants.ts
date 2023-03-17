import { msToTime } from "#/components/chart/chart.helpers";
import { curateRange } from "#/helpers";

export const COMMON_CONFIG = {
  title: {
    text: "",
  },
  chart: {
    zoomType: "x",
    resetZoomButton: {
      theme: {
        style: {
          display: "none",
        },
      },
    },
  },
  loading: {
    labelStyle: {
      color: "white",
    },
    style: {
      backgroundColor: "gray",
    },
  },
  plotOptions: {
    series: {
      states: {
        inactive: {
          opacity: 1,
        },
      },
    },
  },

  tooltip: {
    crosshairs: true,
    valueDecimals: 3,
  },

  xAxis: {
    gridLineWidth: 0.8,
    type: "linear",
    minRange: 0.01,
  },

  accessibility: { enabled: false },
};

export const COMMON_Y_AXIS_CONFIG = {
  title: {
    text: "Values",
    offset: 30,
  },
  height: `100%`,
  offset: 20,
  top: 0,
  labels: {
    align: "left",
  },
};
