# Retain: A Personal Expense & Budget Manager
Retain is a full-stack web application project that is build for managing personal expenses and monthly budgets using React with TypeScript and Vite for the frontend and a backend API (JavaScript or Python) to manage financial data.

# Live Demo & Deploymnet 
- Frontend deploy: https://retain-app-psi.vercel.app
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

- **Filter, Search and Sorting**: Manage all expense filering, searching and sorting using React Redux. The result are paginated

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
├── backend/                  # Node.js and Express REST API
│   ├── middleware/
│   │   └── auth.js           # Token check (auth) and admin check (adminOnly)
│   ├── models/               # Mongoose models (user, category, expense, budget)
│   ├── routes/
│   │   ├── admin.js          # Platform insights (admin only)
│   │   ├── auth.js           # Register, login and current user
│   │   ├── budget.js         # Monthly budget
│   │   ├── categories.js     # Category list and admin CRUD
│   │   ├── dashboard.js      # Monthly dashboard summary
│   │   └── expenses.js       # Expense CRUD, search, filters, sorting, pagination
│   ├── utils/
│   │   ├── budgetSummary.js
│   │   ├── handler.js
│   │   └── month.js
│   ├── server.js             # Express app and MongoDB connection
│   ├── seed.js               # Demo data script (uses Faker)
│   └── package.json
│
└── frontend/                 # React and TypeScript client
    ├── public/
    ├── src/
    │   ├── api/
    │   │   └── api.ts        # One function for every API call
    │   ├── components/       # BudgetManger, CategoryManager, Layout, Navbar,
    │   │                     # Pagination, Protect, Search, SpendBar, Table
    │   ├── context/
    │   │   └── AuthContext.tsx   # Authentication state and roles
    │   ├── pages/            # Admin, Dashboard, ExpenseDetails, ExpenseForm,
    │   │                     # ExpenseList, Login, Register
    │   ├── store/            # Redux Toolkit: hooks.ts, redux.ts (slice), store.ts
    │   ├── types/
    │   │   └── index.ts      # TypeScript types
    │   ├── utils/
    │   │   └── helpers.ts    # Formatting helpers
    │   ├── App.tsx           # Routes
    │   ├── index.css         # Styles
    │   ├── main.tsx          # Entry point
    │   └── payment.ts        # Payment methods and budget status text
    ├── package.json
    ├── tsconfig.json
    └── vite.config.ts
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

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| POST | `/api/auth/register` | Public | Create a user account |
| POST | `/api/auth/login` | Public | Sign in and receive a token |
| GET | `/api/auth/me` | Auth | Get the signed-in user |
| GET | `/api/expenses` | Auth | List your expenses (search, filters, sort, pagination) |
| POST | `/api/expenses` | Auth | Create an expense |
| GET | `/api/expenses/:id` | Auth | Get one expense |
| PUT | `/api/expenses/:id` | Auth | Update an expense |
| DELETE | `/api/expenses/:id` | Auth | Delete an expense |
| GET | `/api/budget/:month` | Auth | Get the budget summary for a month |
| PUT | `/api/budget/:month` | Auth | Set or update the budget, body `{ "amount": 3000 }` |
| GET | `/api/dashboard?month=YYYY-MM` | Auth | Monthly dashboard summary |
| GET | `/api/categories` | Auth | List categories |
| POST | `/api/categories` | Admin | Create a category |
| PUT | `/api/categories/:id` | Admin | Rename a category |
| DELETE | `/api/categories/:id` | Admin | Delete a category (its expenses move to Uncategorized) |
| GET | `/api/admin/insights` | Admin | Platform insights |

**Query parameters for `GET /api/expenses`:** `search`, `category`, `payMethod`, `startDate`, `endDate`, `minAmount`, `maxAmount`, `sortBy` (`date` or `amount`), `order` (`asc` or `desc`), `page`, `limit`.


## Deployment
- Database: MongoDB Atlas
- Backend: Render (root directory backend, build command npm install, start command npm start)
- Frontend: Vercel (root directory frontend, build command npm run build, output directory dist)
