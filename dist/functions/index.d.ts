import { Route } from '../classes/Route';
import { type PathParams, type Env } from '../types';
import { type HonoOpenAPIRouterType } from "chanfana";
import { type BlankSchema } from "hono/types";
export declare function createRoute<T extends PathParams = {}>(pathSegment: string, params?: T): Route<T>;
export declare function registerRoutes(openapi: HonoOpenAPIRouterType<{
    Bindings: Env;
}, BlankSchema, "/">, routes: Route[], prefix?: string): void;
export declare const createStatus: (status: number, description: string) => {
    status: number;
    description: string;
};
