# FinTrack 💰

A modern, full-stack personal finance management application with a focus on ease of use and beautiful data visualization. Track your income, expenses, and get deep insights into your spending habits.

![Dashboard Preview](https://via.placeholder.com/800x400?text=Finance+Tracker+Dashboard)

## ✨ Features

- **📊 Dynamic Dashboard**: Real-time overview of your balance, income, and expenses with period filtering (Monthly, Yearly, All Time).
- **📝 Transaction Management**: Easily record, **edit**, and categorize every income and expense.
- **📁 Custom Categories**: Organize your finances with personalized labels.
- **📈 Advanced Reports**: Visual trend analysis (Income vs Expenses) and categorical breakdown.
- **🔒 Secure Authentication**: User registration and login with JWT-based sessions.
- **👤 Profile Management**: Update your personal details and security settings.
- **📱 Responsive Design**: Fully mobile and tablet friendly "glassmorphism" UI.

## 🛠️ Tech Stack

- **Frontend**: React (Vite), Tailwind CSS, Lucide React, Chart.js.
- **Backend**: Node.js, Express, Sequelize ORM.
- **Database**: PostgreSQL.
- **Security**: JWT, Bcrypt.js.

## 🚀 Getting Started

### Prerequisites

- Node.js (v18+)
- PostgreSQL installed and running.

### 1. Database Setup

Create a new PostgreSQL database and user:

```sql
CREATE DATABASE finance_tracker;
CREATE USER finance_tracker_user WITH PASSWORD 'yourpassword';
GRANT ALL PRIVILEGES ON DATABASE finance_tracker TO finance_tracker_user;
```

### 2. Backend Configuration

1. Navigate to the `backend` folder:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file based on `.env.example`:
   ```env
   DB_NAME=finance_tracker
   DB_USER=finance_tracker_user
   DB_PASS=yourpassword
   DB_HOST=localhost
   JWT_SECRET=your_jwt_secret
   PORT=5000
   ```
4. Seed the database (optional):
   ```bash
   npm run seed
   ```
5. Start the server:
   ```bash
   npm run dev
   ```

### 3. Frontend Configuration

1. Navigate to the `frontend` folder:
   ```bash
   cd ../frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the application:
   ```bash
   npm run dev
   ```

## 📖 User Manual

For a detailed guide on how to use the application, please refer to the [User Manual](./USER_MANUAL.md).

## 📄 License

This project is licensed under the ISC License.
