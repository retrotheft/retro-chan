# retro-chan

A helper library for creating APIs with Chanfana.

## Project Setup

**retro-chan** was designed to work specifically with a Chanfana api created using the following steps:

## Initialisation

1. run `pnpm create cloudflare@latest your-project-name -- --framework=hono`
2. select `Hello World example` and then `Api Starter`
3. I usually say no to git and deploy questions, then do it myself later

## Dependencies

1. run `pnpm i drizzle-orm` and `pnpm i -D drizzle-kit`

## Files

1. duplicate `wrangler.jsonc` and append `.example` to it. This version is safe to commit.
2. add `wrangler.jsonc` to your `.gitignore` since we'll be adding d1 database info to it.
3. Unrelated, but you may also want to add `.DS_Store` to `.gitignore` as well if you're on mac.

## D1 Database Instantiation

1. run `npx wrangler d1 create your-database-name`
2. `yes` to wrangler adding it on your behalf
3. Leave the binding as-is (you can change it later)
4. I usually say no to using remote locally.
5. Change the binding name in `wrangler.jsonc` if you want. I recommend `DB`.

## Database setup

1. Have Claude generate a schema from the types file.
2. Add `drizzle.config.ts`

```ts
// drizzle.config.ts
import type { Config } from 'drizzle-kit';

export default {
  schema: './src/db/schema.ts',
  out: './migrations', // the wrangler migrations command below expects this location
  dialect: 'sqlite',
} satisfies Config;
```

3. run `pnpm drizzle-kit generate`
4. run `npx wrangler d1 migrations apply your-database-name --local`
5. run `npx wrangler types` (this will update your bindings, otherwise typescript won't recognise your DB name)

**NOTE: You can also use the db binding name instead of the database name in step 4, but the docs recommand using the database name.**

## CORS

If you want to use a client with this api, you'll probably need to setup CORS:

1. Add the following to `src/index.ts`

```ts
import { cors } from "hono/cors";

const app = new Hono<{ Bindings: Env }>(); // this line wil already exist

app.use('/*', cors({
  origin: ['http://localhost:5173', 'http://localhost:5174'], // change these to your client's port(s)
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
  exposeHeaders: ['Content-Length'],
  maxAge: 600,
  credentials: true,
}));
````

**Important:** As per [this issue](https://github.com/cloudflare/chanfana/issues/184), you need to set `strictNullChecks` to `true` in `tsconfig`. Otherwise Zod makes fields optional which mucks with the type safety in the Endpoint's `body()` method.
