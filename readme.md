# Expense Tracker API

An Expense Tracker API built with Node.js, Express, and Prisma using a Clean Architecture approach. This API allows users to manage their expenses, authenticate securely with JWT, and store data in a database with Prisma as the ORM.

## Features

- User registration and login with secure password hashing (bcrypt).
- JWT-based authentication for secure access to API endpoints.
- CRUD operations for expenses (create, read, update, delete).
- Clean Architecture design for maintainable and scalable codebase.
- TypeScript for static type checking.
- Prisma as the ORM for database interactions.

## Tech Stack

- **Node**.js: JavaScript runtime for building server-side applications.
- **Express**: Fast, unopinionated, minimalist web framework for Node.js.
- **TypeScript**: Typed JavaScript for better code quality.
- **Prisma**: Modern ORM for seamless database access.
- **JWT**: JSON Web Token for secure user authentication.
- **bcryptjs**: Password hashing for enhanced security.
- **UUID**: Generate unique identifiers for resources.
- **SQLite**: Lightweight database for development and testing.

## Prerequisites

- Node.js (version 18 or later)
- npm or yarn package manager
- A database (e.g., PostgreSQL, MySQL, SQLite). Prisma supports various databases.
  
## Getting Started

Follow the steps below to set up and run the API locally.

1. Clone the Repository

```bash 
git clone https://github.com/EduardoHoths/expense-tracker-api.git
cd expense-tracker-api
```

2. Install Dependencies

```bash
npm install
```

3. Configure Environment Variables  
Create a .env file in the root directory and configure your database URL and JWT secret.   
Example:

```bash
DATABASE_URL="your-database-url"
JWT_SECRET="your-secret-key"
```

4. Set Up the Database  
Run the following command to generate Prisma client and apply migrations:

```bash
npx prisma migrate dev --name init
```

5. Start the Development Server
   
```bash
npm run dev
```

## Running Tests

The project uses Vitest for testing. You can run tests with:

```bash
npm test
```