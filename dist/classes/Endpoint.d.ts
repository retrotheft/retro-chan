import { z } from 'zod';
import { OpenAPIRoute } from 'chanfana';
import type { OpenAPIRouteSchema } from 'chanfana';
import { Responder } from './Responder';
type EndpointMetadata = Pick<OpenAPIRouteSchema, 'operationId' | 'summary' | 'description' | 'tags' | 'deprecated' | 'security' | 'externalDocs' | 'servers' | 'callbacks'>;
type InferZodObject<T extends Record<string, z.ZodTypeAny>> = {
    [K in keyof T]: z.infer<T[K]>;
};
interface ValidatedHandlerData<TBody = undefined, TParams = {}, TQuery = {}> {
    body: TBody;
    params: TParams;
    query: TQuery;
}
export declare class Endpoint<TBody = undefined, TParams extends Record<string, z.ZodTypeAny> = {}, TQuery extends Record<string, z.ZodTypeAny> = {}> {
    verb: string;
    path: string;
    params: TParams;
    private bodySchema?;
    private handlerClass?;
    private metadataConfig?;
    private Responder?;
    private queryParams?;
    constructor(verb: string, path: string, params: TParams);
    metadata(config: Partial<EndpointMetadata>): this;
    query<T extends Record<string, z.ZodTypeAny>>(params: T): Endpoint<TBody, TParams, T>;
    body<T extends z.ZodTypeAny>(schema: T): Endpoint<z.infer<T>, TParams, TQuery>;
    responder<TData, TError>(responder: Responder<TData, TError>): this;
    handler(handleFn: (data: ValidatedHandlerData<TBody, InferZodObject<TParams>, InferZodObject<TQuery>>) => (db: D1Database) => Promise<any>): this;
    getHandler(): typeof OpenAPIRoute | undefined;
    run(fn: () => Promise<any>): Promise<Response | null | undefined>;
    getChanfanaSchema(): OpenAPIRouteSchema;
}
export {};
