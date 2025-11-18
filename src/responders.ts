import z from "zod"
import { Responder } from './classes/Responder'
import { exists, isConflict, isUnavailable } from './predicates'
import Status from './statuses'

export const ListResponder = (schema: z.ZodType, errorSchema: z.ZodType) =>
   new Responder(schema, errorSchema)
      .data(exists, {
         then: Status['200'],
         else: Status['404']
      })
      .error(isUnavailable, {
         then: Status['503'],
         else: Status['500']
      })

export const DeleteResponder = (schema: z.ZodType, errorSchema: z.ZodType) =>
   new Responder(schema, errorSchema)
      .data(exists, {
         then: Status['200'],
         else: Status['500']
      })
      .error(isUnavailable, {
         then: Status['503'],
         else: Status['500']
      })

export const CreateResponder = (schema: z.ZodType, errorSchema: z.ZodType) =>
   new Responder(schema, errorSchema)
      .data(exists, {
         then: Status['201'],
         else: Status['500']
      })
      .error(isConflict, {
         then: Status['409']
      })
      .error(isUnavailable, {
         then: Status['503'],
         else: Status['500']
      })

export const GetResponder = (schema: z.ZodType, errorSchema: z.ZodType) =>
   new Responder(schema, errorSchema)
      .data(exists, {
         then: Status['200'],
         else: Status['404']
      })
      .error(isConflict, {
         then: Status['409']
      })
      .error(isUnavailable, {
         then: Status['503'],
         else: Status['500']
      })

export const UpdateResponder = (schema: z.ZodType, errorSchema: z.ZodType) =>
   new Responder(schema, errorSchema)
      .data(exists, {
         then: Status['200'],
         else: Status['404']
      })
      .error(isConflict, {
         then: Status['409']
      })
      .error(isUnavailable, {
         then: Status['503'],
         else: Status['500']
      })
