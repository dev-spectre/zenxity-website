import { describe, it, expect } from "vitest";
import { withPrismaFallback } from "./prisma-safe";

describe("withPrismaFallback", () => {
  it("returns the fallback value when the operation throws", async () => {
    const result = await withPrismaFallback(async () => {
      throw new Error("db unavailable");
    }, [] as Array<{ id: string }>);

    expect(result).toEqual([]);
  });

  it("returns the original result when the operation succeeds", async () => {
    const result = await withPrismaFallback(async () => [{ id: "1" }], [] as Array<{ id: string }>);

    expect(result).toEqual([{ id: "1" }]);
  });
});
