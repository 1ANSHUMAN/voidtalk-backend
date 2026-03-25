const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);

// CRITICAL: We must allow your Netlify frontend to talk to this backend
const io = new Server(server, { 
    cors: { 
        origin: "*", // In production, change "*" to your Netlify URL
        methods: ["GET", "POST"]
    } 
});

// A simple route so Render knows the server is awake
app.get('/', (req, res) => {
    res.send('VoidTalk Engine is Online and Listening.');
});

io.on('connection', (socket) => {
    console.log('[NETWORK] User connected to the Void:', socket.id);

    socket.on('chat_message', (data) => {
        io.emit('chat_message', data); 
    });

    socket.on('mood_shift', (mood) => {
        io.emit('mood_shift', mood);
    });

    socket.on('disconnect', () => {
        console.log('[NETWORK] User disconnected.');
    });
});

// CRITICAL: process.env.PORT is required for Render deployment
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`[SYSTEM] VoidTalk Engine running on port ${PORT}`);
});