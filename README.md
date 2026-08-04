# Team Task Manager

A full-stack team-based task management application built with the MERN stack.  
It allows users to create teams, manage members, assign tasks, track progress, schedule meetings, monitor deadlines, broadcast announcements, and analyze team productivity through an interactive dashboard.

This project focuses on team collaboration, role-based access control, task tracking, meeting scheduling, deadline alerts, responsive UI, and analytics.

---

## Live Demo

[View Live Project](https://task-manager-mu-jet-14.vercel.app/)

---

## Repository

[GitHub Repository](https://github.com/vivek-rawat33/task-manager)

---

## Overview

Team Task Manager is designed for small teams, student groups, project teams, and collaborative workspaces where tasks need to be assigned, tracked, and managed based on user roles.

The application supports multiple teams, team members, role-based permissions, task assignment, task status tracking, interactive meeting calendar, workspace-wide deadline timelines, announcements, categories, priorities, and analytics charts.

---

## Features

### 🚀 AI Assistance & Collaboration

> [!NOTE]
> **Antigravity AI Assistance**: Built with pair-programming assistance from **Google Antigravity AI**, specifically for architecting, designing, and implementing the **Team Meetings Calendar**, the **Deadlines & Overdue Alert System**, and full-stack performance optimizations.

---

### Authentication

- User signup & signin
- JWT-based authentication
- Password hashing using bcrypt
- Google OAuth callback support
- Protected dashboard routes
- Persistent login using stored auth token
- Logout functionality

---

### Team Management

- Create a new team workspace
- View joined teams
- Switch between teams seamlessly
- Add members to a team using email
- View team members with role badges
- Manage team members based on role (Owner, Admin, Member, Viewer)
- Delete or update team settings based on permissions

---

### 📅 Team Meetings & Calendar (New)

- **Interactive Month Calendar**: Full monthly view for scheduling and browsing team meetings.
- **Meeting Details**: Title, date, start time, end time, description, and direct meeting links (Google Meet, Zoom, Teams, etc.).
- **Role-Based Management**: Team Owners and Admins can schedule and delete meetings; all members can view meetings and launch meeting links.
- **Clean Modal Interface**: Smooth dialog form using custom DatePicker and styled time pickers.

---

### ⏰ Deadlines & Notification Alerts (New)

- **Sidebar Overdue Alert Badge**: Pulsing red notification badge on the sidebar "Deadlines" link alerting users to their uncompleted overdue tasks.
- **Workspace Scope Switcher**: Toggle view between **All Teams (All Workspaces)** and specific team workspaces.
- **Urgent Overdue Warning Banner**: Prominent banner alerting users to immediate overdue task action items.
- **KPI Summary Metric Cards**: Summary counters for **Overdue Tasks**, **Due Today**, **This Week**, and **Completed**.
- **Grouped Urgency Timeline**: Tasks grouped logically into Overdue (`Overdue by X days`), Due Today, Due This Week, Upcoming, and Completed.
- **Quick Status Updates**: Change task status (Todo, In Process, Done) directly from the Deadlines page.

---

### 📢 Team Announcements

- Broadcast team announcements to all members.
- Created by team Owners/Admins to communicate critical updates.
- Chronological timeline with creator details and timestamps.

---

### Role-Based Access Control

The application uses team-level roles to control permissions inside a team:

| Role   | Permissions                                       |
| ------ | ------------------------------------------------- |
| Owner  | Full access to team, members, tasks, meetings, announcements, and settings |
| Admin  | Can manage members, tasks, meetings, and announcements |
| Member | Can view tasks, update assigned tasks, view meetings & announcements |
| Viewer | Read-only access                                  |

Role-based permissions are strictly enforced on both frontend and backend.

---

### Task Management

- Create tasks inside a selected team
- Assign tasks to team members
- Update task status (Todo, In Process, Done)
- Mark tasks as completed
- Set task priority (Low, Medium, High)
- Set task due dates / deadlines
- Add task category
- Search and filter tasks by status and priority
- Drag-and-drop table view with customizable columns

---

### Dashboard and Analytics (Optimized)

The dashboard provides real-time visual insights into team progress:

- Total task overview
- Interactive area chart for task creation vs completion over time
- Status distribution pie chart with custom active shapes
- Priority distribution bar chart
- Deadline overview horizontal bar chart
- Member performance ranking chart
- Fully memoized (`React.memo`) to eliminate redundant SVG re-renders

---

### ⚡ Full-Stack Performance Optimizations

- **Mongoose Lean Queries (`.lean()`)**: Bypasses heavy Mongoose document hydration for **3x–5x faster JSON response times**.
- **MongoDB Indexing**: Compound indexes on `Task` (`teamId + status`, `teamId + priority`) for fast query execution.
- **Frontend Code-Splitting (`React.lazy` & `<Suspense>`)**: Route-level lazy loading in `App.jsx` to reduce initial JS bundle payload.
- **React Render Memoization**: `useMemo` for task filtering and `React.memo` across all dashboard charts.

---

## Tech Stack

### Frontend

- **Core**: React 19, Vite
- **Styling**: Tailwind CSS v4, shadcn/ui
- **Routing**: React Router DOM v7
- **HTTP Client**: Axios
- **Charts**: Recharts
- **Icons**: Lucide React
- **Notifications**: Sonner

### Backend

- **Runtime**: Node.js, Express.js
- **Database**: MongoDB, Mongoose
- **Authentication**: JWT, bcryptjs, Passport.js (Google Strategy)
- **Middleware**: CORS, dotenv

### Deployment

- **Frontend**: Vercel
- **Backend**: Render
- **Database**: MongoDB Atlas

---

## API Routes Overview

### Auth Routes

```txt
POST /api/auth/signup
POST /api/auth/signin
GET  /api/auth/me
```

---

### Team Routes

```txt
POST   /api/teams
GET    /api/teams
GET    /api/teams/:teamId
GET    /api/teams/:teamId/members
POST   /api/teams/:teamId/members
PATCH  /api/teams/:teamId
DELETE /api/teams/:teamId
```

---

### Task Routes

```txt
POST   /api/teams/:teamId/tasks
GET    /api/teams/:teamId/tasks
GET    /api/tasks/all-my-tasks
PATCH  /api/tasks/:taskId
DELETE /api/tasks/:taskId
```

---

### Meeting Routes

```txt
GET    /api/teams/:teamId/meetings
POST   /api/teams/:teamId/meetings
DELETE /api/teams/:teamId/meetings/:meetingId
```

---

### Announcement Routes

```txt
GET    /api/teams/:teamId/announcements
POST   /api/teams/:teamId/announcements
DELETE /api/teams/:teamId/announcements/:announcementId
```

---

## Author

**Vivek Singh Rawat**

- GitHub: [vivek-rawat33](https://github.com/vivek-rawat33)
- Project: Team Task Manager

---

## License

This project is open source and available under the MIT License.
