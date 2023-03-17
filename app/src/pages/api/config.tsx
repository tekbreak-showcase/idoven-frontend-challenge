import type { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import { getParameter } from "../../helpers";

export type ConfigResponse = {
  size: number;
  accuracy: number;
  merged: boolean;
  interval: number;
};
const Config = async (
  req: NextApiRequest,
  res: NextApiResponse<ConfigResponse>
) => {
  const defaultCollection =
    process.env.DEFAULT_COLLECTION ?? "14-29-05_data_data";

  const sampleInterval = parseInt(process.env.DATA_SAMPLE_INTERVAL ?? "40");

  const collection = getParameter(req.query, "collection", defaultCollection);

  const size = parseInt(
    fs.readFileSync(`./data/${collection}.length`, "utf-8")
  );
  const accuracy = process.env.ACCURACY
    ? parseInt(process.env.ACCURACY)
    : 7_200_000; // 2 Hours

  res.json({ size, accuracy, merged: false, interval: sampleInterval });
};

export default Config;
