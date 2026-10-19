# Retain: A Personal Expense & Budget Manager
Retain is a full-stack web application project that is build for managing personal expenses and monthly budgets using React with TypeScript and Vite for the frontend and a backend API (JavaScript or Python) to manage financial data.

# Live Demo & Deploymnet 
- Frontend deploy: https://retain-app-psi.vercel.app/login
- Backend deploy: https://retain-app-sf1e.onrender.com
- GitHub Link: https://github.com/Yvette334/retain-app.git

## Demo Accounts

You can use the following credentials to test both user and administrator roles:

| Role | Email | Password |
| :--- | :--- | :--- |
| **Admin** | `admin@gmail.com` | `Admin123` |
| **User** | `user@gmail.com` | `User123` |

# Main Features

## User & Authentication

- **Authenticatication**: Implement authentication strictly using React Context. Required functionality is sign up, sign in, sign out, user roles, and protected routes.

- **Role based**: Added user roles(user and admin) with procted routing and admin-protected endpoints to support category management and the required admin insights 

## Expense & Budget Management

- **Expense CRUD** : Create, read, update and delete expenses including titles, amount, categories, dates, payment methods and notes.

- **Filter & Sorting**: Manage all expense filering, searching and sorting using React Redux.

- **Monthly Budgets**: Allows users to set/update a budget and view, Total amount spent and remaining budget, if it is within, approaching, or over budget

## Dashboards & Analytics

- **User Dashboard**: Summary displaying Total spending for the month, remaining monthly budget, highest individual expense, spending by category and recent expenses.

- **Admin dashboard**: Allow admins to see registered users, expenses recorded, value of expenses recorded,
number of expenses for the current month, total spending per category, top 5 most-used expense categories, bottom 5 least-used expense categories, recently added expenses, recently registered users.

## Tech Stack

### Frontend:

- React with TypeScript
- Vite
- React Router v6 (Routing & Protected Layouts)
- React Context(Authentication & Role Authorization)
- Redux Toolkit(State management for search, filtering and sorting)
- CSS

### Backend & Database:

- Node.js & Express
- MongoDB Atlas
- JWT Authentication & Role Authorization Middleware

## Repository Structure
This project is structured with a repo that contain frontend and backend code.

```
retain-app/
├── backend/                # Node.js & Express REST API server
│   ├── models/             # Mongoose database models
│   ├── routes/             # API Endpoints
│   │   ├── admin.js        # Platform insights & audit logs
│   │   ├── auth.js         # Authentication workflow
│   │   ├── budget.js       # Monthly budget logic
│   │   ├── categories.js   # Category management CRUD
│   │   ├── dashboard.js    # Financial metrics
│   │   `-- expenses.js     # Expense CRUD & filtering
│   ├── utils/              # Backend helper scripts
│   │   ├── budgetSummary.js
│   │   ├── handler.js
│   │   `-- month.js
│   ├── server.js           # Express app entry point & MongoDB Atlas connection
│   ├── seed.js             # Initial database seeding script
│   `-- package.json        # Backend dependencies & scripts
│
└── frontend/               # React & TypeScript client application
    ├── public/             # Static assets (favicons, icons)
    │   ├── favicon.svg
    │   `-- icons.svg
    ├── src/                # Frontend source code
    │   ├── api/
    │   │   `-- api.ts      # Centralized API configuration
    │   ├── components/     # UI components (BudgetManager, CategoryManager, Table, etc.)
    │   │   ├── BudgetManger.tsx
    │   │   ├── CategoryManager.tsx
    │   │   ├── Layout.tsx
    │   │   ├── Navbar.tsx
    │   │   ├── Pagination.tsx
    │   │   ├── Protect.tsx
    │   │   ├── Search.tsx
    │   │   ├── SpendBar.tsx
    │   │   `-- Table.tsx
    │   ├── context/
    │   │   `-- AuthContext.tsx # Authentication state management
    │   ├── pages/          # Page views (Dashboard, Admin, ExpenseList, etc.)
    │   │   ├── Admin.tsx
    │   │   ├── Dashboard.tsx
    │   │   ├── ExpenseDetails.tsx
    │   │   ├── ExpenseForm.tsx
    │   │   ├── ExpenseList.tsx
    │   │   ├── Login.tsx
    │   │   `-- Register.tsx
    │   ├── store/          # Redux Toolkit store & slices
    │   │   ├── hooks.ts
    │   │   ├── redux.ts
    │   │   `-- store.ts
    │   ├── types/
    │   │   `-- index.ts    # Global TypeScript interfaces
    │   ├── utils/
    │   │   `-- helpers.ts  # Formatting & helper utilities
    │   ├── App.tsx         # Main routing and layout integration
    │   ├── index.css       # Global styles
    │   ├── main.tsx        # React entry point
    │   └── payment.ts      # Payment options
    ├── package.json        # Frontend dependencies & scripts
    ├── tsconfig.json       # TypeScript configuration
    └── vite.config.ts      # Vite configuration
```

## Setup and installation
Follow these steps to run the application locally on your machine.

### Prerequisites
- Node.js installed on your system
- MongoDB Atlas cluster and connection string

1. Clone the Repository

```
https://github.com/Yvette334/retain-app.git
```
2. Backend Setup
Navigate to the backend directory and install dependencies:
```
cd backend
npm install
```
Create a .env file in the backend root folder:

```
PORT=5000
MONGO=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret_key
```
### Run backend server and demo data:
```
npm run seed
npm run dev
```
The API runs at http://localhost:5000. Note that npm run seed clears the database before adding the demo data.

3. Frontend Setup

Open another terminal, navigate to the frontend directory and instsll dependecies:
```
cd frontend
npm install
```
Create a .env file in the backend root folder:

```
VITE_URL=http://localhost:5000/api
```
### Run frontend server:
```
npm run dev
```
open browser and navigate to http://localhost:5173

## API information

All routes start with **/api**. Routes marked Auth need the header Authorization: Bearer token.

Authentication:

POST /api/auth/register - Register a new user

POST /api/auth/login - Authenticate user & receive token

Expenses:

GET /api/expenses - Retrieve filtered/paginated expenses

POST /api/expenses - Create a new expense

GET /api/expenses/:id - Get single expense details

PUT /api/expenses/:id - Update an expense

DELETE /api/expenses/:id - Delete an expense

Budgets & Dashboard:

GET /api/dashboard?month=YYYY-MM - Fetch monthly summary metrics

PUT /api/budget/:month - Set or update monthly budget

Categories & Admin:

GET /api/categories - Fetch all expense categories

POST /api/categories - Create a new category (Admin)

PUT /api/categories/:id - Update a category (Admin)

DELETE /api/categories/:id - Delete a category (Admin)

GET /api/admin/insights - Retrieve comprehensive platform statistics (Admin)

## Deployment
- Database: MongoDB Atlas
- Backend: Render (root directory backend, build command npm install, start command npm start)
- Frontend: Vercel (root directory frontend, build command npm run build, output directory dist)
