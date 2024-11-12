# Real-time Chat Application

A modern chat application built with React, Node.js and Socket.IO enabling real-time messaging between users.

## Features

- **Authentication:** Email/password login with persistent sessions
- **Users:** Login using pre-configured dummy users with avatars and status
   -  arjun@example.com / pass123 
   -  priya@example.com / pass123
   -  rahul@example.com / pass123
   -  neha@example.com / pass123
   -  vikram@example.com / pass123
- **Real-time Chat:** Instant messaging with typing indicators 
- **UI:** Responsive dark theme with smooth animations
- **Security:** Protected routes and session management

## Setup Instructions

### Running Using Docker
```bash
# Clone and run with Docker
git clone https://github.com/username/chat-app
cd chat-app
docker-compose up --build

# Access the app
Frontend: http://localhost:5173
Backend: http://localhost:3000

```
### Running without Docker
```bash
git clone https://github.com/username/chat-app
cd chat-app
cd server
npm install
npm run dev

cd ..
npm install
npm run dev

# Access the app
Frontend: http://localhost:5173
Backend: http://localhost:3000

```