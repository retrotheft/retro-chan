import { SQLiteTable, SQLiteColumn } from 'drizzle-orm/sqlite-core';
import { drizzle } from 'drizzle-orm/d1';
import { eq } from 'drizzle-orm';

// database ALWAYS comes last, otherwise endpoints pass different shapes to get result
// might want to include data closure even when unused

export const createResource = <T extends SQLiteTable>
   (table: T) => (data: T['$inferInsert']) =>
      (d1: D1Database) =>
         drizzle(d1)
            .insert(table)
            .values(data)
            .returning();

export const getAll = <T extends SQLiteTable>
   (table: T) => (_?: undefined) => (d1: D1Database) =>
      drizzle(d1).select().from(table)

export const getSome = <T extends SQLiteTable>
   (table: T) => (limit?: number) => (d1: D1Database) => {
      const query = drizzle(d1).select().from(table);
      return limit ? query.limit(limit) : query;
   }

// table and column in same closure for generics typing purposes
export const getOne = <T extends SQLiteTable, C extends SQLiteColumn>
   (table: T, column: C) =>
      (param: C['_']['data']) => (d1: D1Database) =>
         drizzle(d1)
            .select()
            .from(table)
            .where(eq(column, param))
            .limit(1)



export const deleteResource = <T extends SQLiteTable, C extends SQLiteColumn>
   (table: T, column: C) =>
      (param: C['_']['data']) => (d1: D1Database) =>
         drizzle(d1)
            .delete(table)
            .where(eq(column, param))
            .returning()

export default {
   create: createResource,
   list: getAll,
   some: getSome,
   get: getOne,
   delete: deleteResource
}
