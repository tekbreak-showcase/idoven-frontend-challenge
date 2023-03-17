export const curateRange = (
  rawStart: string | number | undefined,
  rawEnd: string | number | undefined
) => {
  let start = rawStart || 0;
  let end = rawEnd || 0;

  start = parseInt(`${start}`);
  if (isNaN(start) || start < 0) {
    start = 0;
  }

  end = parseInt(`${end}`);
  if (isNaN(end) || end < 0 || end < start) {
    start = 0;
    end = 0;
  }

  return { start, end };
};

export const getParameter = (
  query: Partial<{ [p: string]: string | string[] }>,
  name: string,
  defaultValue = ""
) => {
  const parameter = query?.[name];

  if (!parameter) {
    return defaultValue;
  }

  if (typeof parameter === "string") {
    return parameter || defaultValue;
  }

  if (Array.isArray(parameter) && parameter.length > 0) {
    return parameter[0] || defaultValue;
  }

  return defaultValue;
};