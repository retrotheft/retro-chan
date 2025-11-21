# retro-chan

A helper library for creating APIs with Chanfana.

## Example Usage

```ts
const taskById = createRoute('tasks', { id: Str() })

taskById.GET()
   .handler(data => getTaskById(data.params.id))
   .responder(GetResponder(Task, ApiError))
   .metadata({
      tags: ["task"],
      summary: "Gets a single task by its id"
   })
```

**retro-chan** minimises the code you need to write and maximises its intuitiveness, while staying as similar as possible to actual OpenAPI semantics. The example above demonstrates several key realisations I had while developing the library:

- any given route should only have one of each http method (GET, POST etc.)
- consequently, path params should be declared as *part of the route itself*
- most handler functions just receive the validated data and return a response
- branching response logic can be moved to a post-handler runner that checks predicates and returns templates

## Database Operations

**retro-chan** ships with partially-applied D1 Drizzle data ops for common patterns. This means all you need to do is declare your table-specific data ops, like so:

```ts
import { tasks } from './schema'
import { d1 } from 'retro-chan'

export const createTask = d1.create(tasks)
export const getAllTasks = d1.list(tasks)
export const getTaskById = d1.get(tasks, tasks.id)
export const deleteTaskById = d1.delete(tasks, tasks.id)
export const getSomeTasks = d1.some(tasks)
```
