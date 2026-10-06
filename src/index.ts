import express, { type Request, type Response } from 'express';
import cors from 'cors';

// Removed the .js extensions so TypeScript resolves files correctly
import authroutes from './routes/authroutes'
import conversationsRoutes from './routes/conversationsRoutes';
import messageRoutes from './routes/messageRoutes';
import http from 'http';
import { Server } from 'socket.io';
import { createMessage } from './controllers/messagesController';

const app = express()
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: '*'
    }
})


// Always put cors() right at the very top of your middleware stack
app.use(cors());
app.use(express.json());

/// Socket.io event handling
io.on('connection', (socket) => {
    console.log('a user connected', socket.id);
    socket.on('join_room', (conversationId) => {
        socket.join(conversationId);
        console.log(`User ${socket.id} joined room ${conversationId}`);

    });
    socket.on('send_message', async (message) => {
        const { conversationId, senderId, content } = message;
        try {
            const createdmessage = await createMessage(conversationId, senderId, content);
            console.log('Message created:', createdmessage);
            io.to(conversationId).emit('receive_message', createdmessage);
        } catch (error) {
            console.error('Error creating message:', error);
        }
    });
    socket.on('disconnect', () => {
        console.log('user disconnected', socket.id);
    });
});

// Main base routes
app.use('/api/auth', authroutes);
app.use('/api/conversations', conversationsRoutes);
app.use('/api/messages', messageRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server listening at port ${PORT}`);
});
