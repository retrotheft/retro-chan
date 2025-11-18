import { Endpoint } from './Endpoint';
export class Route {
    path;
    params;
    endpoints = new Map();
    constructor(pathSegment, params) {
        this.params = (params || {});
        this.path = this.buildPath(pathSegment, this.params);
    }
    buildPath(pathSegment, params) {
        if (Object.keys(params).length === 0) {
            return `/${pathSegment}`;
        }
        const paramPaths = Object.keys(params).map(key => `:${key}`).join('/');
        return `/${pathSegment}/${paramPaths}`;
    }
    get() {
        if (!this.endpoints.has('GET')) {
            const endpoint = new Endpoint('GET', this.path, this.params);
            this.endpoints.set('GET', endpoint);
        }
        return this.endpoints.get('GET');
    }
    post() {
        if (!this.endpoints.has('POST')) {
            const endpoint = new Endpoint('POST', this.path, this.params);
            this.endpoints.set('POST', endpoint);
        }
        return this.endpoints.get('POST');
    }
    put() {
        if (!this.endpoints.has('PUT')) {
            const endpoint = new Endpoint('PUT', this.path, this.params);
            this.endpoints.set('PUT', endpoint);
        }
        return this.endpoints.get('PUT');
    }
    patch() {
        if (!this.endpoints.has('PATCH')) {
            const endpoint = new Endpoint('PATCH', this.path, this.params);
            this.endpoints.set('PATCH', endpoint);
        }
        return this.endpoints.get('PATCH');
    }
    delete() {
        if (!this.endpoints.has('DELETE')) {
            const endpoint = new Endpoint('DELETE', this.path, this.params);
            this.endpoints.set('DELETE', endpoint);
        }
        return this.endpoints.get('DELETE');
    }
    GET = () => this.get();
    POST = () => this.post();
    PUT = () => this.put();
    PATCH = () => this.patch();
    DELETE = () => this.delete();
    getEndpoints() {
        return Array.from(this.endpoints.entries()).map(([method, endpoint]) => ({
            method,
            endpoint
        }));
    }
}
