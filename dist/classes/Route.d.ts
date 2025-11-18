import { z } from 'zod';
import { Endpoint } from './Endpoint';
type PathParams = Record<string, z.ZodType<any>>;
export declare class Route<TParams extends PathParams = {}> {
    path: string;
    params: TParams;
    private endpoints;
    constructor(pathSegment: string, params?: TParams);
    private buildPath;
    get(): Endpoint<undefined, TParams, {}>;
    post(): Endpoint<undefined, TParams, {}>;
    put(): Endpoint<undefined, TParams, {}>;
    patch(): Endpoint<undefined, TParams, {}>;
    delete(): Endpoint<undefined, TParams, {}>;
    GET: () => Endpoint<undefined, TParams, {}>;
    POST: () => Endpoint<undefined, TParams, {}>;
    PUT: () => Endpoint<undefined, TParams, {}>;
    PATCH: () => Endpoint<undefined, TParams, {}>;
    DELETE: () => Endpoint<undefined, TParams, {}>;
    getEndpoints(): Array<{
        method: string;
        endpoint: Endpoint<any, any, any>;
    }>;
}
export {};
