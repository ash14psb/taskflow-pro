# TaskFlow Pro 🚀

A full-stack, real-time Kanban board SaaS application built with the MERN stack. TaskFlow Pro allows users to manage tasks across multiple workspaces with drag-and-drop functionality, real-time synchronization across different devices, and a fully responsive dark/light mode interface.

**[Live Demo](https://taskflow-pro-cyan.vercel.app/)** | **[Backend API](https://taskflow-pro-api-852y.onrender.com/)**

## ✨ Key Features

- **Real-Time Synchronization:** Built with Socket.io to instantly reflect task movements (drag-and-drop) across all connected clients without refreshing.
- **Optimistic UI Drag & Drop:** Utilizes native HTML5 drag-and-drop API with optimistic UI updates for a lightning-fast, zero-latency user experience.
- **Secure Authentication:** Custom JWT-based authentication with encrypted passwords (bcrypt) and protected API routes.
- **Multiple Workspaces:** Users can segregate tasks into "Personal" and "Work" boards.
- **Modern State Management:** Uses Zustand for lightweight, boilerplate-free global state management (Auth state, UI state).
- **Responsive & Accessible UI:** Fully responsive design built with Tailwind CSS v4, including a complete Dark Mode implementation.

## 🛠️ Tech Stack

**Frontend:**

- React.js (Vite)
- Tailwind CSS v4
- Zustand (State Management)
- React Router DOM
- Socket.io-client
- Axios
- Lucide React (Icons)

**Backend:**

- Node.js & Express.js
- MongoDB & Mongoose
- Socket.io (WebSockets)
- JSON Web Tokens (JWT)
- Bcrypt (Password Hashing)

## 🚀 Getting Started (Local Development)

### Prerequisites

- Node.js (v18+ recommended)
- MongoDB database (Local or Atlas cluster)

### 1. Clone the repository

### 1. Clone the repository

```bash
git clone https://github.com/ash14psb/taskflow-pro.git
cd taskflow-pro
