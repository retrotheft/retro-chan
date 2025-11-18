import type { Predicate, StatusTemplate } from '../types';
import { type Result } from "../result";
import { z } from 'zod';
type Handlers = {
    then?: StatusTemplate;
    else?: StatusTemplate;
};
type Rule = {
    type: 'data' | 'error';
    predicate: Predicate;
    handlers: Handlers;
};
export declare class Responder<TData = any, TError = Error> {
    private dataSchema?;
    private errorSchema?;
    private rules;
    constructor(dataSchema?: z.ZodType<TData> | undefined, errorSchema?: z.ZodType<TError> | undefined);
    data(predicate: Predicate, handlers: Handlers): this;
    error(predicate: Predicate, handlers: Handlers): this;
    execute(result: Result<TData, TError>): Response | null;
    buildResponse(result: Result<TData, TError>, statusConfig: StatusTemplate): Response;
    getDataSchema(): z.ZodType<TData, z.ZodTypeDef, TData> | undefined;
    getErrorSchema(): z.ZodType<TError, z.ZodTypeDef, TError> | undefined;
    getRules(): Rule[];
}
export {};
