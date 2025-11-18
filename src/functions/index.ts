import { Route } from '../classes/Route'
import { type PathParams, type Env } from '../types';
import { type HonoOpenAPIRouterType } from "chanfana";
import { type BlankSchema } from "hono/types";

export function createRoute<T extends PathParams = {}>(
   pathSegment: string,
   params?: T
): Route<T> {
   return new Route(pathSegment, params || {} as T);
}

export function registerRoutes(openapi:  HonoOpenAPIRouterType<{
   Bindings: Env;
}, BlankSchema, "/">, routes: Route[], prefix = '') {
   for (const route of routes) {
      const fullPath = prefix + route.path;
      for (const { method, endpoint } of route.getEndpoints()) {
         const handler = endpoint.getHandler();
         if (handler) {
            const methodLower = method.toLowerCase() as keyof typeof openapi;
            if (typeof openapi[methodLower] === 'function') {
               (openapi[methodLower] as any)(fullPath, handler);
            }
         }
      }
   }
}

export const createStatus = (status: number, description: string) =>
({
   status,
   description
})
