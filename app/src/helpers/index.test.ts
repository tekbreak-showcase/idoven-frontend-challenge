import { curateRange } from "./index";

describe("Helpers", () => {
  describe("curateRange", () => {
    it("should return 0 0 when end is negative", () => {
      const given = { start: 100, end: -1 };
      const expected = { start: 0, end: 0 };
      const result = curateRange(given.start, given.end);

      console.log(result);
      expect(result).toEqual(expected);
    });
  });
});
