import pg from "pg";

export const pool = new pg.Pool({
  user: process.env.DB_USER ?? "postgres",
  host: process.env.DB_HOST ?? "localhost",
  password: process.env.DB_PASSWORD ?? "password",
  database: process.env.DB_NAME ?? "pymemanager",
  port: Number(process.env.DB_PORT ?? "5432"),
});
