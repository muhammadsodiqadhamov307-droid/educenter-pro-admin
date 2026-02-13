
# EduCenter Pro Admin

Administrative dashboard for education centers, featuring student/teacher management, course scheduling, and AI-powered tools.

## Features

- **User Management**: Manage students and teachers.
- **Course Management**: Create and manage courses with AI-powered descriptions.
- **Group Management**: Organize classes and schedules.
- **AI Tools**: Generate course descriptions and bot prompts using Google Gemini.
- **Full Stack**: React frontend + Express backend + PostgreSQL database.

## Prerequisites

- Node.js (v18+)
- PostgreSQL (v14+) OR Docker

## Local Setup

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/muhammadsodiqadhamov307-droid/educenter-pro-admin.git
    cd educenter-pro-admin
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Environment Configuration:**
    Create a `.env` file in the root directory:
    ```env
    DATABASE_URL="postgresql://user:password@localhost:5432/educenter?schema=public"
    API_KEY="your_google_gemini_api_key"
    PORT=3000
    ```
    *Note: If you don't have a local Postgres, you can use Docker (see below).*

4.  **Database Setup:**
    ```bash
    npx prisma generate
    npx prisma db push
    ```

5.  **Run Locally:**
    You can run the frontend and backend separately or together.
    
    **Development (Frontend + Backend):**
    ```bash
    # Open two terminals
    npm run dev      # Frontend (http://localhost:5173)
    npm run server   # Backend (http://localhost:3000)
    ```

## Docker Setup (Recommended)

1.  **Run with Docker Compose:**
    ```bash
    docker-compose up --build
    ```
    This will start the application on `http://localhost:3000` and a PostgreSQL database.

## Deployment

1.  **Build for Production:**
    ```bash
    npm run build
    ```

2.  **Start Production Server:**
    ```bash
    npm start
    ```

## Project Structure

- `src/`: React Frontend
- `server/`: Express Backend
- `prisma/`: Database Schema
- `components/`: UI Components
- `services/`: API Services

