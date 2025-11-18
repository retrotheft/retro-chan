import { drizzle } from 'drizzle-orm/d1';
import { eq } from 'drizzle-orm';
// database ALWAYS comes last, otherwise endpoints pass different shapes to get result
// might want to include data closure even when unused
export const createResource = (table) => (data) => (d1) => drizzle(d1)
    .insert(table)
    .values(data)
    .returning();
export const getAll = (table) => (_) => (d1) => drizzle(d1).select().from(table);
export const getSome = (table) => (limit) => (d1) => {
    const query = drizzle(d1).select().from(table);
    return limit ? query.limit(limit) : query;
};
// table and column in same closure for generics typing purposes
export const getOne = (table, column) => (param) => (d1) => drizzle(d1)
    .select()
    .from(table)
    .where(eq(column, param))
    .limit(1);
export const deleteResource = (table, column) => (param) => (d1) => drizzle(d1)
    .delete(table)
    .where(eq(column, param))
    .returning();
export default {
    create: createResource,
    list: getAll,
    some: getSome,
    get: getOne,
    delete: deleteResource
};
