import { createStatus } from './functions/index'

export default {
   200: createStatus(200, "OK"),
   201: createStatus(201, "Created"),
   204: createStatus(204, "No Content"),
   404: createStatus(404, "Not Found"),
   409: createStatus(409, "Conflict"),
   500: createStatus(500, "Server Error"),
   503: createStatus(503, "Service Unavailable")
}
