import type { Context } from "hono"
import { z } from 'zod';

export type PathParams = Record<string, z.ZodType<any>>;

export interface ResponseDefinition {
   status: number;
   schema?: z.ZodType<any>;
}

export type StatusTemplate = {
   status: number,
   description: string
}

export type Predicate = ((data: unknown) => boolean) | ((error: unknown) => boolean)
