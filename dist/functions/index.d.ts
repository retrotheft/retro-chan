import { Route } from '../classes/Route';
import { type PathParams } from '../types';
import { type HonoOpenAPIRouterType } from "chanfana";
export declare function createRoute<T extends PathParams = {}>(pathSegment: string, params?: T): Route<T>;
export declare function registerRoutes(openapi: HonoOpenAPIRouterType<any, any, any>, routes: Route[], prefix?: string): void;
export declare const createStatus: (status: number, description: string) => {
    status: number;
    description: string;
};
