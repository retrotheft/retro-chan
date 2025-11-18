import z from "zod";
import { Responder } from './classes/Responder';
export declare const ListResponder: (schema: z.ZodType, errorSchema: z.ZodType) => Responder<any, any>;
export declare const DeleteResponder: (schema: z.ZodType, errorSchema: z.ZodType) => Responder<any, any>;
export declare const CreateResponder: (schema: z.ZodType, errorSchema: z.ZodType) => Responder<any, any>;
export declare const GetResponder: (schema: z.ZodType, errorSchema: z.ZodType) => Responder<any, any>;
export declare const UpdateResponder: (schema: z.ZodType, errorSchema: z.ZodType) => Responder<any, any>;
