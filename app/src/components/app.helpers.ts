import axios from "axios";
import { PointsResponse } from "#/pages/api/points";
import { ChartRange } from "#/components/app.types";
import { ConfigResponse } from "#/pages/api/config";

export const getPointsByRange = async (
  start?: number,
  end?: number
): Promise<PointsResponse> => {
  const { data } = await axios.get<PointsResponse>(
    `/api/points?start=${start ?? ""}&end=${end ?? ""}`
  );
  return data;
};

export const getConfig = async (
  collection?: string
): Promise<ConfigResponse> => {
  const { data } = await axios.get<ConfigResponse>(
    `/api/config${collection ? `?collection=${collection}` : ""}`
  );
  return data;
};

export const applyRange = (
  points: PointsResponse,
  range: ChartRange
): PointsResponse => {
  return {
    ...points,
    series: points.series.map((series) =>
      series.slice(range.start / 1000, range.end / 1000)
    ),
  };
};
