import type { Predicate, StatusTemplate } from '../types'
import { type Result } from "../result";
import { z } from 'zod';

type Handlers = {
   then?: StatusTemplate,
   else?: StatusTemplate
}

type Rule = {
   type: 'data' | 'error',
   predicate: Predicate,
   handlers: Handlers
}

export class Responder<TData = any, TError = Error> {
   private rules: Rule[] = [];

   constructor(
      private dataSchema?: z.ZodType<TData>,
      private errorSchema?: z.ZodType<TError>
   ) { }

   data(predicate: Predicate, handlers: Handlers) {
      this.rules.push({ type: 'data', predicate, handlers });
      return this;
   }

   error(predicate: Predicate, handlers: Handlers) {
      this.rules.push({ type: 'error', predicate, handlers });
      return this;
   }

   execute(result: Result<TData, TError>) {
      for (const rule of this.rules) {
         if (rule.type === 'data' && result.status === 'resolved') {
            const matches = rule.predicate(result.data);

            if (matches && rule.handlers.then) {
               return this.buildResponse(result, rule.handlers.then);
            }
            if (!matches && rule.handlers.else) {
               return this.buildResponse(result, rule.handlers.else);
            }
         }

         if (rule.type === 'error' && result.status === 'rejected') {
            const matches = rule.predicate(result.error);

            if (matches && rule.handlers.then) {
               return this.buildResponse(result, rule.handlers.then);
            }
            if (!matches && rule.handlers.else) {
               return this.buildResponse(result, rule.handlers.else);
            }
         }
      }

      return null;
   }

   buildResponse(result: Result<TData, TError>, statusConfig: StatusTemplate) {
      if (result.status === 'resolved') {
         return new Response(JSON.stringify(result.data), {
            status: statusConfig.status,
            headers: { 'Content-Type': 'application/json' }
         });
      } else {
         return new Response(JSON.stringify({
            status: statusConfig.status,
            message: statusConfig.description,
         }), {
            status: statusConfig.status,
            headers: { 'Content-Type': 'application/json' }
         });
      }
   }

   getDataSchema() {
      return this.dataSchema;
   }

   getErrorSchema() {
      return this.errorSchema;
   }

   getRules() {
      return this.rules;
   }
}
