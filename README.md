# Task Frontend

A responsive React frontend for managing tasks, consuming a JWT-authenticated REST API. Built as an internship task (WA-3) to demonstrate real API integration, client-side routing, form validation, and graceful loading/error handling — no mock data anywhere in the final app.

## Features
- User login with JWT stored client-side, attached automatically to every API request
- Full task management: list, view, create, edit, delete
- Client-side validation on the create/edit form before any API call is made
- Visible loading and error states throughout — no blank screens or silent failures
- Automatic redirect to login on session expiry (401 handling via an axios interceptor)
- Responsive layout (mobile + desktop)

## Tech Stack
- React 19 + Vite
- React Router (client-side routing)
- Axios (API client with interceptors)

## Routes
| Path | Page |
|---|---|
| `/login` | Log in |
| `/tasks` | List all tasks |
| `/tasks/new` | Create a task |
| `/tasks/:id` | View task details |
| `/tasks/:id/edit` | Edit a task |

## Setup

This app expects a running instance of the [task-manager-api](https://github.com/dakshkumawat07/task-manager-api) backend at `http://127.0.0.1:8000`.

```bash
git clone https://github.com/dakshkumawat07/task-frontend.git
cd task-frontend
npm install
npm run dev
```

Open the printed local URL (typically `http://localhost:5173`).

## Backend requirement
Make sure the [task-manager-api](https://github.com/dakshkumawat07/task-manager-api) backend is running and configured to allow CORS requests from `http://localhost:5173` (see that repo's README).

## Concepts Learned
- Centralizing API calls and auth headers via an axios instance with interceptors
- Handling loading/error/empty states as first-class UI states, not afterthoughts
- Client-side form validation that actually blocks submission, not just displays a message
- Route param handling (`useParams`) to reuse one form component for both create and edit

## Author
Daksh Kumawat — [@dakshkumawat07](https://github.com/dakshkumawat07)
