export const msToTime = (duration: number) => {
  let milliseconds = duration % 1000,
    seconds: string | number = Math.floor((duration / 1000) % 60),
    minutes: string | number = Math.floor((duration / (1000 * 60)) % 60),
    hours: string | number = Math.floor(duration / (1000 * 60 * 60));

  hours = hours < 10 ? "0" + hours : hours;
  minutes = minutes < 10 ? "0" + minutes : minutes;
  seconds = seconds < 10 ? "0" + seconds : seconds;

  return (
    hours +
    ":" +
    minutes +
    ":" +
    seconds +
    "." +
    milliseconds.toString().padStart(3, "0")
  );
};

export const msToTimeUnits = (duration: number): TimeUnits => {
  let milliseconds = duration % 1000,
    seconds: string | number = Math.floor((duration / 1000) % 60),
    minutes: string | number = Math.floor((duration / (1000 * 60)) % 60),
    hours: string | number = Math.floor(duration / (1000 * 60 * 60));

  return {
    h: hours,
    m: minutes,
    s: seconds,
    ms: milliseconds,
  };
};

export const timeUnitsToMS = (timeUnits: TimeUnits) => {
  const { h, m, s, ms } = timeUnits;
  return (60 * 60 * h + 60 * m + s) * 1000 + ms;
};

export type TimeUnits = {
  h: number;
  m: number;
  s: number;
  ms: number;
};

const getParameter = (
  query: Partial<{ [p: string]: string | string[] }>,
  name: string
) => {
  if (!query?.[name]) {
    return undefined;
  }

  const parameter = query[name];

  if (Array.isArray(parameter)) {
    return parseInt(parameter[0]);
  }

  return parameter ? parseInt(parameter) : parameter;
};
