import pg from "pg";
const { Pool } = pg;

const pool = new Pool({
  user: "postgres",
  password: "REk!2345", // Double check if 'k' should be lowercase or capital 'K'
  host: "localhost",
  port: 5432,
  database: "postgres",
});

export default pool;
