import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { useAuthStore, getDummyUsers } from '../store/authStore';
import { useChatStore } from '../store/chatStore';
import { Send, Wifi } from 'lucide-react';
import { io } from 'socket.io-client';

const socket = io('http://localhost:3000');

export default function ChatPage() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const currentUser = useAuthStore((state) => state.user);
  const { messages, isTyping, isConnected, addMessage, setTyping, setConnected } =
    useChatStore();
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const otherUser = getDummyUsers().find((u) => u.id === userId);

  useEffect(() => {
    if (!currentUser) {
      navigate('/');
      return;
    }

    // Join the chat
    socket.emit('join', currentUser.id);

    // Fetch existing messages
    fetch('http://localhost:3000/messages')
      .then(res => res.json())
      .then(existingMessages => {
        existingMessages.forEach(msg => addMessage(msg));
      })
      .catch(err => console.error('Error fetching messages:', err));

    socket.on('connect', () => setConnected(true));
    socket.on('disconnect', () => setConnected(false));
    socket.on('typing', ({ userId: typingUserId }) => {
      if (typingUserId === userId) {
        setTyping(true);
      }
    });
    socket.on('stopTyping', ({ userId: typingUserId }) => {
      if (typingUserId === userId) {
        setTyping(false);
      }
    });
    socket.on('message', (message) => {
      if (
        (message.senderId === currentUser.id &&
          message.receiverId === userId) ||
        (message.senderId === userId && message.receiverId === currentUser.id)
      ) {
        addMessage(message);
      }
    });

    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('typing');
      socket.off('stopTyping');
      socket.off('message');
    };
  }, [currentUser, userId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (!newMessage.trim()) return;

    const message = {
      id: Date.now().toString(),
      senderId: currentUser!.id,
      receiverId: userId!,
      content: newMessage,
      timestamp: new Date().toISOString(),
    };

    socket.emit('message', message);
    setNewMessage('');
  };

  const handleTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewMessage(e.target.value);
    socket.emit('typing', { userId: currentUser!.id });
    
    const timeoutId = setTimeout(() => {
      socket.emit('stopTyping', { userId: currentUser!.id });
    }, 1000);

    return () => clearTimeout(timeoutId);
  };

  const filteredMessages = messages.filter(
    (m) =>
      (m.senderId === currentUser?.id && m.receiverId === userId) ||
      (m.senderId === userId && m.receiverId === currentUser?.id)
  );

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      <div className="bg-blue-600 p-4 flex justify-between items-center">
        <div className="text-xl font-bold text-white">Chat Room</div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
              {otherUser?.username[0]}
            </div>
            <span className="text-white">{otherUser?.username}</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
              {currentUser?.username[0]}
            </div>
            <span className="text-white">You</span>
          </div>
          <div className="flex items-center space-x-2 bg-green-600 px-3 py-1 rounded">
            <Wifi size={18} className="text-white" />
            <span className="text-white">
              {isConnected ? 'Connected' : 'Disconnected'}
            </span>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {filteredMessages.map((message) => {
          const isSender = message.senderId === currentUser?.id;
          return (
            <div
              key={message.id}
              className={`flex ${isSender ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs md:max-w-md ${
                  isSender
                    ? 'bg-blue-600 text-white rounded-l-lg rounded-tr-lg'
                    : 'bg-gray-700 text-white rounded-r-lg rounded-tl-lg'
                } p-3`}
              >
                <p>{message.content}</p>
                <p className="text-xs mt-1 opacity-75">
                  {format(new Date(message.timestamp), 'HH:mm')}
                </p>
              </div>
            </div>
          );
        })}
        {isTyping && (
          <div className="text-gray-400 text-sm">{otherUser?.username} is typing...</div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 bg-gray-800">
        <div className="flex space-x-4">
          <input
            type="text"
            value={newMessage}
            onChange={handleTyping}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type a message"
            className="flex-1 bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleSend}
            className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Send size={24} />
          </button>
        </div>
      </div>
    </div>
  );
}