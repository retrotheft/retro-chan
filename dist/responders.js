import { Responder } from './classes/Responder';
import { exists, isConflict, isUnavailable } from './databases/d1/predicates';
import Status from './http/status';
export const ListResponder = (schema, errorSchema) => new Responder(schema, errorSchema)
    .data(exists, {
    then: Status['200'],
    else: Status['404']
})
    .error(isUnavailable, {
    then: Status['503'],
    else: Status['500']
});
export const DeleteResponder = (schema, errorSchema) => new Responder(schema, errorSchema)
    .data(exists, {
    then: Status['200'],
    else: Status['500']
})
    .error(isUnavailable, {
    then: Status['503'],
    else: Status['500']
});
export const CreateResponder = (schema, errorSchema) => new Responder(schema, errorSchema)
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
});
export const GetResponder = (schema, errorSchema) => new Responder(schema, errorSchema)
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
});
export const UpdateResponder = (schema, errorSchema) => new Responder(schema, errorSchema)
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
});
