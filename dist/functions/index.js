import { Route } from '../classes/Route';
export function createRoute(pathSegment, params) {
    return new Route(pathSegment, params || {});
}
export function registerRoutes(openapi, routes, prefix = '') {
    for (const route of routes) {
        const fullPath = prefix + route.path;
        for (const { method, endpoint } of route.getEndpoints()) {
            const handler = endpoint.getHandler();
            if (handler) {
                const methodLower = method.toLowerCase();
                if (typeof openapi[methodLower] === 'function') {
                    openapi[methodLower](fullPath, handler);
                }
            }
        }
    }
}
export const createStatus = (status, description) => ({
    status,
    description
});
