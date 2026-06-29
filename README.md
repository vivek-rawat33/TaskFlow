# MERN Task Tracker

A full-stack Task Tracker web application using React, Node.js, Express.js, MongoDB, REST APIs, and Tailwind CSS v4.

## Features

- Create, read, update, and delete tasks
- Frontend and backend validation
- REST API architecture
- MongoDB integration using Mongoose
- Responsive Tailwind CSS UI
- Dynamic UI updates without page refresh
- Search and filter tasks

## Folder Structure

```txt
task-tracker-mern/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   └── taskController.js
│   ├── middleware/
│   │   └── errorHandler.js
│   ├── models/
│   │   └── Task.js
│   ├── routes/
│   │   └── taskRoutes.js
│   ├── utils/
│   │   └── validateTask.js
│   ├── .env.example
│   ├── package.json
│   └── server.js
└── frontend/
    ├── src/
    │   ├── api/
    │   │   └── taskApi.js
    │   ├── components/
    │   │   ├── FilterBar.jsx
    │   │   ├── TaskCard.jsx
    │   │   ├── TaskForm.jsx
    │   │   └── TaskList.jsx
    │   ├── App.jsx
    │   ├── index.css
    │   └── main.jsx
    ├── .env.example
    ├── index.html
    ├── package.json
    └── vite.config.js
```

## Run Locally

### Backend

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

### Frontend

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

Open the frontend URL shown by Vite, usually `http://localhost:5173`.

## REST API Endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/health` | API health check |
| GET | `/api/tasks` | Get all tasks |
| POST | `/api/tasks` | Create a task |
| PUT | `/api/tasks/:id` | Update a task |
| DELETE | `/api/tasks/:id` | Delete a task |

## Deployed at `https://task-manager-mu-jet-14.vercel.app/`
