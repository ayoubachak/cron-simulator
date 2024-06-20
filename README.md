# Cron Simulator

This project simulates a CRON service using NestJS and PostgreSQL. The service allows you to create tasks, list all tasks, manually execute tasks, and automatically execute tasks based on their schedule. It also includes user authentication using JWT.

## Technologies Used
- NestJS
- PostgreSQL
- TypeORM
- @nestjs/schedule
- @nestjs/passport
- passport-local
- JWT

## Prerequisites
- Node.js
- npm
- PostgreSQL

## Getting Started

### Installation

1. **Clone the repository**:
    ```bash
    git clone <repository_url>
    cd cron-simulator
    ```

2. **Install dependencies**:
    ```bash
    npm install
    ```

3. **Set up PostgreSQL**:
    - Make sure PostgreSQL is installed and running.
    - Create a database named `cron_simulator`:
      ```bash
      psql -U postgres -c "CREATE DATABASE cron_simulator;"
      ```

4. **Create `.env` File**:
    Create a file named `.env` in the root directory of your project and add the following content:
    ```
    JWT_SECRET=your_secret_key
    ```

5. **Configure the database connection**:
    Open `src/app.module.ts` and update the database connection settings:
    ```typescript
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'your_username',  // Replace with your PostgreSQL username
      password: 'your_password',  // Replace with your PostgreSQL password
      database: 'cron_simulator',
      autoLoadEntities: true,
      synchronize: true,
    })
    ```

### Running the Application

1. **Start the NestJS application**:
    ```bash
    npm run start
    ```

    The application will start on `http://localhost:3000`.

### API Endpoints

#### Authentication

1. **Login to Get JWT Token**:
    ```bash
    curl -X POST http://localhost:3000/auth/login -H "Content-Type: application/json" -d '{"username": "test", "password": "test"}'
    ```

    The response will contain the JWT token:
    ```json
    {
      "access_token": "your_jwt_token"
    }
    ```

#### Tasks

2. **Create a Task**:
    ```bash
    curl -X POST http://localhost:3000/tasks -H "Authorization: Bearer your_jwt_token" -H "Content-Type: application/json" -d '{"title": "Task 1", "daysOfWeek": [0, 1], "time": "08:00:00", "timezone": "Europe/Paris"}'
    ```

3. **List All Tasks**:
    ```bash
    curl http://localhost:3000/tasks -H "Authorization: Bearer your_jwt_token"
    ```

4. **Execute a Task Manually**:
    ```bash
    curl -X POST http://localhost:3000/tasks/1/execute -H "Authorization: Bearer your_jwt_token"
    ```

### Example Task JSON
```json
{
  "taskId": 1,
  "title": "Task 1",
  "daysOfWeek": [0, 1],
  "time": "08:00:00",
  "timezone": "Europe/Paris"
}
