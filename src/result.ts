// lib/result.ts
export type Result<T, E = Error> =
   | { status: 'resolved'; data: T }
   | { status: 'rejected'; error: E };

export async function createResult<T>(asyncFn: () => Promise<T>): Promise<Result<T, Error>> {
   try {
      const data = await asyncFn();
      return { status: 'resolved', data };
   } catch (error) {
      return { status: 'rejected', error: error as Error };
   }
}
