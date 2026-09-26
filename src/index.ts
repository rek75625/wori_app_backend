import express, { type Request, type Response } from 'express';
import { json } from 'body-parser';

import authroutes from './routes/authroutes.js';

const app = express();

app.use(json());

app.get('/', (req: Request, res: Response) => {
    res.send('WORI Backend is running successfully!');
});

app.use('/api/auth', authroutes);

const PORT = process.env.PORT || 6000;

app.listen(PORT, () => {
    console.log(`Server listening at ${PORT} port`);
});