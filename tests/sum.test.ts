import { sum } from "../libs/sum";

describe("sum 2 numbers", () => {
  it("should return 3", () => {
    expect(sum(1, 2)).toBe(3);
  });
});
