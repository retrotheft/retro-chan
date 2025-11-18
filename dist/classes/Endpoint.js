import { z } from 'zod';
import { OpenAPIRoute } from 'chanfana';
import { createResult } from '../result';
export class Endpoint {
    verb;
    path;
    params;
    bodySchema;
    handlerClass;
    metadataConfig;
    Responder;
    queryParams;
    constructor(verb, path, params) {
        this.verb = verb;
        this.path = path;
        this.params = params;
    }
    metadata(config) {
        this.metadataConfig = config;
        return this;
    }
    query(params) {
        this.queryParams = params;
        return this;
    }
    body(schema) {
        this.bodySchema = schema;
        return this;
    }
    responder(responder) {
        this.Responder = responder;
        return this;
    }
    handler(handleFn) {
        const endpoint = this;
        this.handlerClass = class extends OpenAPIRoute {
            schema = endpoint.getChanfanaSchema();
            async handle(c) {
                const data = await this.getValidatedData();
                const handler = handleFn(data);
                return endpoint.run(() => handler(c.env.DB));
            }
        };
        return this;
    }
    getHandler() {
        return this.handlerClass;
    }
    async run(fn) {
        const result = await createResult(fn);
        if (this.Responder) {
            return this.Responder.execute(result);
        }
    }
    getChanfanaSchema() {
        const responses = {};
        if (this.Responder) {
            const statusConfigs = new Map();
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
        const schema = {
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
