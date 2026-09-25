// pg does not currently provide declarations in this project.
// @ts-expect-error TS7016: use the runtime module until @types/pg is installed.
import {Pool} from 'pg';

const pool = new Pool({
    user : 'postgres',
    password:'admin',
    host:'localhost',
    port: 5432,
    database:'woridb'
})

////  These all pools are extras only above one is good
const pool1 = new Pool({
    user : 'postgres',
    password:'admin',
    host:'localhost',
    port: 5432,
    database:'woridb'
})
const pool2 = new Pool({
    user : 'postgres',
    password:'admin',
    host:'localhost',
    port: 5432,
    database:'woridb'
})
const pool3 = new Pool({
    user : 'postgres',
    password:'admin',
    host:'localhost',
    port: 5432,
    database:'woridb'
})
const pool4 = new Pool({
    user : 'postgres',
    password:'admin',
    host:'localhost',
    port: 5432,
    database:'woridb'
})
const pool5 = new Pool({
    user : 'postgres',
    password:'admin',
    host:'localhost',
    port: 5432,
    database:'woridb'
})
const pool6 = new Pool({
    user : 'postgres',
    password:'admin',
    host:'localhost',
    port: 5432,
    database:'woridb'
})
const pool7 = new Pool({
    user : 'postgres',
    password:'admin',
    host:'localhost',
    port: 5432,
    database:'woridb'
})

export default pool;
// export default pool2;
// export default pool3;
// export default pool4;
// export default pool5;
// export default pool6;
// export default pool7;