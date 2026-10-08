import express from 'express';
import cors from 'cors';
import http from 'http';
import { Server } from 'socket.io';

import authroutes from './routes/authroutes';
import conversationsRoutes from './routes/conversationsRoutes';
import messageRoutes from './routes/messageRoutes';

import { createMessage } from './controllers/messagesController';

const app = express();

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST'],
    },
});

// Express middleware
app.use(cors());
app.use(express.json());

// Socket.IO
io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    socket.on('join_room', (conversationId) => {
        socket.join(conversationId);

        console.log(
            `User ${socket.id} joined room ${conversationId}`
        );
    });

    socket.on('send_message', async (message) => {
        const { conversationId, senderId, content } = message;

        try {
            const createdMessage = await createMessage(
                conversationId,
                senderId,
                content
            );

            console.log('Message created:', createdMessage);

            io.to(conversationId).emit(
                'receive_message',
                createdMessage
            );
        } catch (error) {
            console.error(
                'Error creating message:',
                error
            );
        }
    });

    socket.on('disconnect', () => {
        console.log(
            'User disconnected:',
            socket.id
        );
    });
});

// REST API routes
app.use('/api/auth', authroutes);
app.use('/api/conversations', conversationsRoutes);
app.use('/api/messages', messageRoutes);

const PORT = process.env.PORT || 5000;

// IMPORTANT: use server.listen(), NOT app.listen()
server.listen(PORT, () => {
    console.log(`Server listening at port ${PORT}`);
});