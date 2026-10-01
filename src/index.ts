import express, { type Request, type Response } from 'express';
import cors from 'cors';

// Removed the .js extensions so TypeScript resolves files correctly
import authroutes from './routes/authroutes'
import conversationsRoutes from './routes/conversationsRoutes';

const app = express();

// Always put cors() right at the very top of your middleware stack
app.use(cors()); 
app.use(express.json());

// Main base routes
app.use('/api/auth', authroutes);
app.use('/api/conversations', conversationsRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server listening at port ${PORT}`);
});
