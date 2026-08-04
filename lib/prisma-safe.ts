export async function withPrismaFallback<T>(operation: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await operation();
  } catch (error) {
    console.warn("Prisma request failed, using fallback data", error);
    return fallback;
  }
}
