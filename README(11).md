# TaskFlow

A full-stack task management application built with **NestJS, MongoDB, React, and Tailwind CSS**. It allows users to manage projects, team members, and tasks with role-based permissions for **Members** and **Admins**.

## Main Features

- Register, login, JWT authentication, and protected routes
- Member and Admin roles
- Create, view, update, and delete projects
- Add and remove project members using email
- Create, view, update, and delete tasks
- Assign tasks to project members
- Filter tasks by status, priority, and assignee
- Assignees can update task status only
- Admin dashboard and application-wide management permissions

## Technologies

**Backend:** NestJS, TypeScript, MongoDB, Mongoose, JWT, Joi/Class Validator  
**Frontend:** React, Vite, Tailwind CSS, React Router, Axios, React Hook Form, Joi

## Project Structure

```text
project-root/
├── backend/
├── frontend/
├── docs/
│   └── TaskFlow.postman_collection.json
└── README.md
```

> Change the folder names in the commands below if your backend or frontend folders use different names.

## Requirements

Install the following before running the project:

- Node.js 18 or later
- npm
- MongoDB or MongoDB Atlas

## Environment Variables

Create a `.env` file inside the backend folder. Use the same variable names defined in your backend configuration or `.env.example` file.

Example:

```env
PORT=3000
MONGO_URI=mongodb://127.0.0.1:27017/taskflow
JWT_SECRET=replace_with_a_secure_secret
JWT_EXPIRES_IN=7d
```

Do not upload the real `.env` file to GitHub.

## Run the Backend

```bash
cd backend
npm install
npm run start:dev
```

The backend runs by default on:

```text
http://localhost:3000
```

## Run the Frontend

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

The frontend runs by default on:

```text
http://localhost:5173
```

## User Roles

### Member

New registered accounts use the `member` role by default. Members can access projects they own or have joined, create tasks, and perform actions allowed by the backend authorization rules.

### Admin

For security, users cannot select the Admin role during registration.

To create an Admin account:

1. Register a normal account from the application.
2. Open MongoDB Compass or MongoDB Atlas.
3. Open the project database and the `users` collection.
4. Find the required user by email.
5. Change:

```json
{
  "role": "member"
}
```

To:

```json
{
  "role": "admin"
}
```

6. Log out and log in again so a new JWT is generated with the Admin role.
7. Open the Admin Dashboard from the sidebar or visit `/admin`.

Admins can manage projects, members, and tasks across the application.

## Main Routes

```text
/                  Landing page
/login             Login
/signup            Registration
/dashboard         User dashboard
/projects          All accessible projects
/createProject     Create project
/projectDetails/:id  Project details and tasks
/admin              Admin dashboard
```

## API Documentation

Import the Postman collection into Postman:

```text
docs/TaskFlow.postman_collection.json
```

Set the required values such as:

```text
baseUrl = http://localhost:3000
token = your JWT token
projectId = a valid project ID
taskId = a valid task ID
```

## Tests

Run the backend tests with:

```bash
cd backend
npm test
```

## Authorization Summary

- Project owners and Admins can update and delete projects.
- Project owners and Admins can add or remove members.
- Authorized project users can view project tasks.
- Project owners, Admins, and task creators can manage tasks according to backend rules.
- A task assignee can update the task status only.
- Backend authorization is the main security layer; hiding frontend buttons is only a UI improvement.

## Build Check

Before submission, verify both applications build successfully:

```bash
cd backend
npm run build
```

```bash
cd frontend
npm run build
```

## Notes

- Make sure MongoDB is running before starting the backend.
- Do not commit `.env`, `node_modules`, or `dist` folders.
- Use the Postman collection to test the API endpoints.
