import { Pool } from "pg";

const pool = new Pool({
  user: "postgres",
  password: "REk!2345",
  host: "localhost",
  port: 5432,
  database: "postgres",
});

export default pool;