// pg does not currently provide declarations in this project.
// @ts-expect-error TS7016: use the runtime module until @types/pg is installed.
import {Pool} from 'pg';

const pool = new Pool({
    user : 'postgres',
    password:'REk!2345',
    host:'localhost',
    port: 5432,
    database:'postgres'
})

export default pool;
