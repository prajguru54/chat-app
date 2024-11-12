import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: ["http://localhost:5173", "http://localhost:5174"],
    methods: ["GET", "POST"]
  }
});

const users = new Map(); // userId -> socketId
let messages = [];

app.use(cors());
app.use(express.json());

app.get('/messages', (req, res) => {
  console.log('GET /messages - Returning messages:', messages.length);
  res.json(messages);
});

io.on('connection', (socket) => {
  console.log('🔌 Socket connected:', socket.id);

  socket.on('join', (userId) => {
    console.log('👤 User joined -', { userId, socketId: socket.id });
    users.set(userId, socket.id);
    console.log('Current users:', Array.from(users.entries()));
  });

  socket.on('message', (message) => {
    console.log('📨 Message received:', message);
    console.log('Current users map:', Array.from(users.entries()));
    
    messages.push(message);
    
    const receiverSocketId = users.get(message.receiverId);
    console.log('Receiver socket ID:', receiverSocketId);

    if (receiverSocketId) {
      // Send to receiver
      console.log(`✉️ Sending to receiver ${message.receiverId} (${receiverSocketId})`);
      io.to(receiverSocketId).emit('message', message);
      
      // Send back to sender
      console.log(`✉️ Sending back to sender ${message.senderId}`);
      const senderSocketId = users.get(message.senderId);
      if (senderSocketId) {
        io.to(senderSocketId).emit('message', message);
      }
    } else {
      console.log('❌ Receiver not found:', message.receiverId);
    }
  });

  socket.on('typing', ({ userId }) => {
    // console.log('⌨️ Typing event from:', userId);
    const receiverId = [...users.keys()].find(id => id !== userId);
    if (receiverId) {
      const receiverSocketId = users.get(receiverId);
      // console.log(`Sending typing indicator to: ${receiverId} (${receiverSocketId})`);
      io.to(receiverSocketId).emit('typing', { userId });
    }
  });

  socket.on('stopTyping', ({ userId }) => {
    // console.log('⌨️ Stop typing event from:', userId);
    const receiverId = [...users.keys()].find(id => id !== userId);
    if (receiverId) {
      const receiverSocketId = users.get(receiverId);
      io.to(receiverSocketId).emit('stopTyping', { userId });
    }
  });

  socket.on('disconnect', () => {
    const userId = [...users.entries()].find(([_, socketId]) => socketId === socket.id)?.[0];
    if (userId) {
      console.log('👋 User disconnected:', userId);
      users.delete(userId);
      console.log('Remaining users:', Array.from(users.entries()));
    }
  });
});

const PORT = 3000;
httpServer.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});