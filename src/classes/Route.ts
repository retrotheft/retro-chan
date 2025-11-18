import { z } from 'zod';
import { Endpoint } from './Endpoint';

type PathParams = Record<string, z.ZodType<any>>;

export class Route<TParams extends PathParams = {}> {
   public path: string;
   public params: TParams;
   private endpoints: Map<string, Endpoint<any, any, any>> = new Map();

   constructor(pathSegment: string, params?: TParams) {
      this.params = (params || {}) as TParams;
      this.path = this.buildPath(pathSegment, this.params);
   }

   private buildPath(pathSegment: string, params: PathParams): string {
      if (Object.keys(params).length === 0) {
         return `/${pathSegment}`;
      }
      const paramPaths = Object.keys(params).map(key => `:${key}`).join('/');
      return `/${pathSegment}/${paramPaths}`;
   }

   get(): Endpoint<undefined, TParams, {}> {
      if (!this.endpoints.has('GET')) {
         const endpoint = new Endpoint('GET', this.path, this.params);
         this.endpoints.set('GET', endpoint);
      }
      return this.endpoints.get('GET')! as Endpoint<undefined, TParams, {}>;
   }

   post(): Endpoint<undefined, TParams, {}> {
      if (!this.endpoints.has('POST')) {
         const endpoint = new Endpoint('POST', this.path, this.params);
         this.endpoints.set('POST', endpoint);
      }
      return this.endpoints.get('POST')! as Endpoint<undefined, TParams, {}>;
   }

   put(): Endpoint<undefined, TParams, {}> {
      if (!this.endpoints.has('PUT')) {
         const endpoint = new Endpoint('PUT', this.path, this.params);
         this.endpoints.set('PUT', endpoint);
      }
      return this.endpoints.get('PUT')! as Endpoint<undefined, TParams, {}>;
   }

   patch(): Endpoint<undefined, TParams, {}> {
      if (!this.endpoints.has('PATCH')) {
         const endpoint = new Endpoint('PATCH', this.path, this.params);
         this.endpoints.set('PATCH', endpoint);
      }
      return this.endpoints.get('PATCH')! as Endpoint<undefined, TParams, {}>;
   }

   delete(): Endpoint<undefined, TParams, {}> {
      if (!this.endpoints.has('DELETE')) {
         const endpoint = new Endpoint('DELETE', this.path, this.params);
         this.endpoints.set('DELETE', endpoint);
      }
      return this.endpoints.get('DELETE')! as Endpoint<undefined, TParams, {}>;
   }

   GET = () => this.get();
   POST = () => this.post();
   PUT = () => this.put();
   PATCH = () => this.patch();
   DELETE = () => this.delete();

   getEndpoints(): Array<{ method: string; endpoint: Endpoint<any, any, any> }> {
      return Array.from(this.endpoints.entries()).map(([method, endpoint]) => ({
         method,
         endpoint
      }));
   }
}
