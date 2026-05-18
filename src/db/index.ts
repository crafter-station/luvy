import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

import * as schema from "@/db/schema";

const databaseUrl =
  process.env.DATABASE_URL ?? "postgres://missing:missing@localhost/missing";

const sql = neon(databaseUrl);

export const db = drizzle(sql, { schema });
