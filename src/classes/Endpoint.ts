import { z } from 'zod';
import { AppContext } from '../types';
import type { StatusTemplate } from "../types";
import { OpenAPIRoute } from 'chanfana';
import { createResult } from '../result';
import type { OpenAPIRouteSchema } from 'chanfana';
import { Responder } from './Responder';

type EndpointMetadata = Pick<
   OpenAPIRouteSchema,
   | 'operationId'
   | 'summary'
   | 'description'
   | 'tags'
   | 'deprecated'
   | 'security'
   | 'externalDocs'
   | 'servers'
   | 'callbacks'
>;

type InferZodObject<T extends Record<string, z.ZodTypeAny>> = {
   [K in keyof T]: z.infer<T[K]>
};

interface ValidatedHandlerData<
   TBody = undefined,
   TParams = {},
   TQuery = {}
> {
   body: TBody;
   params: TParams;
   query: TQuery;
}

export class Endpoint<
   TBody = undefined,
   TParams extends Record<string, z.ZodTypeAny> = {},
   TQuery extends Record<string, z.ZodTypeAny> = {}
> {
   private bodySchema?: z.ZodTypeAny;
   private handlerClass?: typeof OpenAPIRoute;
   private metadataConfig?: Partial<EndpointMetadata>;
   private Responder?: Responder<any, any>;
   private queryParams?: Record<string, z.ZodTypeAny>;

   constructor(
      public verb: string,
      public path: string,
      public params: TParams
   ) { }

   metadata(config: Partial<EndpointMetadata>): this {
      this.metadataConfig = config;
      return this;
   }

   query<T extends Record<string, z.ZodTypeAny>>(params: T): Endpoint<TBody, TParams, T> {
      this.queryParams = params;
      return this as any;
   }

   body<T extends z.ZodTypeAny>(schema: T): Endpoint<z.infer<T>, TParams, TQuery> {
      this.bodySchema = schema;
      return this as any;
   }

   responder<TData, TError>(responder: Responder<TData, TError>): this {
      this.Responder = responder;
      return this;
   }

   handler(handleFn: (data: ValidatedHandlerData<TBody, InferZodObject<TParams>, InferZodObject<TQuery>>) => (db: D1Database) => Promise<any>) {
      const endpoint = this;

      this.handlerClass = class extends OpenAPIRoute {
         schema = endpoint.getChanfanaSchema();

         async handle(c: AppContext) {
            const data = await this.getValidatedData<typeof this.schema>();
            const handler = handleFn(data as any);
            return endpoint.run(() => handler(c.env.DB));
         }
      };

      return this;
   }

   getHandler() {
      return this.handlerClass;
   }

   async run(fn: () => Promise<any>) {
      const result = await createResult(fn);
      if (this.Responder) {
         return this.Responder.execute(result);
      }
   }

   getChanfanaSchema(): OpenAPIRouteSchema {
      const responses: Record<string, any> = {};

      if (this.Responder) {
         const statusConfigs = new Map<number, StatusTemplate>();

         for (const rule of this.Responder.getRules()) {
            if (rule.handlers?.then) {
               statusConfigs.set(rule.handlers.then.status, rule.handlers.then);
            }
            if (rule.handlers?.else) {
               statusConfigs.set(rule.handlers.else.status, rule.handlers.else);
            }
         }

         for (const [statusCode, statusConfig] of statusConfigs) {
            const isSuccess = statusCode >= 200 && statusCode < 300;

            const responseSchema = isSuccess
               ? this.Responder.getDataSchema()
               : this.Responder.getErrorSchema();

            responses[statusCode.toString()] = {
               description: statusConfig.description,
               // Only add content if schema exists
               ...(responseSchema && {
                  content: {
                     'application/json': {
                        schema: responseSchema,
                     },
                  },
               }),
            };
         }
      }

      const schema: OpenAPIRouteSchema = {
         responses,
         ...this.metadataConfig,
      };

       if (this.queryParams) {
          schema.request = schema.request || {};
          schema.request.query = z.object(this.queryParams);
       }

      // Add request body if present
      if (this.bodySchema) {
         schema.request = schema.request || {};
          schema.request.body = {
             content: {
                'application/json': {
                   schema: this.bodySchema,
                },
             },
          };
      }

       // Add path parameters if present
       if (Object.keys(this.params).length > 0) {
          schema.request = schema.request || {};
          schema.request.params = z.object(this.params);
       }

      return schema;
   }
}
