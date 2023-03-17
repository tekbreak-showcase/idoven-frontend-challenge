import type { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import clientPromise from "../../lib/mongodb";
import { Filter, FindOptions, Document } from "mongodb";
import { curateRange, getParameter } from "../../helpers";

export interface Point {
  t: number;
  "1": number;
  "2": number;
  "3": number;
  "4": number;
  x: number;
}

export interface PointDocument extends Point, Document {}

export interface PointsResponse {
  series: number[][];
  interval: number;
}
const Points = async (req: NextApiRequest, res: NextApiResponse) => {
  const accuracy = process.env.ACCURACY ?? 7_200_000;
  const defaultCollection =
    process.env.DEFAULT_COLLECTION ?? "14-29-05_data_data";
  const fields: Array<keyof Point> = ["1", "2", "3", "4"];

  let filter: Filter<PointDocument>;
  const output: PointsResponse = {
    series: [],
    interval: parseInt(process.env.DATA_SAMPLE_INTERVAL ?? "40"),
  };

  const { start, end } = curateRange(
    getParameter(req.query, "start"),
    getParameter(req.query, "end")
  );

  const collection = getParameter(req.query, "collection", defaultCollection);
  const initialFile = `./data/${collection}.init`;
  const lengthFile = `./data/${collection}.length`;
  const size = parseInt(fs.readFileSync(lengthFile, "utf-8")) * 1000;
  const isInitial = (!start && !end) || (start === 0 && end === size);

  try {
    const client = await clientPromise;
    const db = client.db("idoven");

    const findOptions = {
      projection: { _id: 0 },
      sort: { t: 1 },
    } as FindOptions;

    if (isInitial) {
      if (fs.existsSync(initialFile)) {
        const data = fs.readFileSync(initialFile, "utf-8");
        res.send(data);
        return;
      }

      filter = { x: 1 };
      output.interval = 1000;
    } else {
      filter = { t: { $gte: start / 10, $lte: end / 10 } };
    }

    // Responses with more than accuracy time are cropped out to show only exact seconds
    const diff = end - start;
    if (diff > accuracy) {
      output.interval = 1000;
      filter = { ...filter, x: 1 };
    }

    const points = await db
      .collection<PointDocument>(collection)
      .find(filter, findOptions)
      .toArray();

    fields.forEach((field) => {
      output.series.push(points.map((point) => point[field]));
    });
  } catch (e: any) {
    console.error(e);
    throw e?.message;
  }

  res.json(output);
};

export default Points;
