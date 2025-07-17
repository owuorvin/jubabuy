// drizzle.config.ts
// import { defineConfig } from 'drizzle-kit';
// import * as dotenv from 'dotenv';

// dotenv.config({ path: '.env.local' });

// export default defineConfig({
//   schema: './lib/db/schema.ts',
//   out: './drizzle',
//   dialect: 'sqlite',
//   // Remove the driver: 'turso' line!
//   dbCredentials: {
//     url: process.env.TURSO_DATABASE_URL!,
//     authToken: process.env.TURSO_AUTH_TOKEN!,
//   },
// });
import { defineConfig } from 'drizzle-kit';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

if (!process.env.TURSO_DATABASE_URL) {
  throw new Error('TURSO_DATABASE_URL is not set in .env.local');
}

if (!process.env.TURSO_AUTH_TOKEN) {
  throw new Error('TURSO_AUTH_TOKEN is not set in .env.local');
}

export default defineConfig({
  schema: './lib/db/schema.ts',
  out: './drizzle',
  dialect: 'turso',
  dbCredentials: {
    url: process.env.TURSO_DATABASE_URL,
    authToken: process.env.TURSO_AUTH_TOKEN,
  },
  verbose: true,
  strict: true,
  breakpoints: false,
});