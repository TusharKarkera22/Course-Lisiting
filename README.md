# Development Course Platform

## Overview

This project is a development course platform that includes a backend built with Express and MongoDB, and a frontend using React and various libraries. The platform allows for course management, including creating, viewing, and handling course details with features like JWT authentication, image uploads to Cloudinary, and more.

## Technologies Used

- **Frontend:** React, Redux, Shadcn, 
- **Backend:** Express, MongoDB, Mongoose, JWT
- **File Upload:** Cloudinary
- **State Management:** Redux
- **Styling:** Tailwind CSS, Shadcn components
- **Others:** CORS, Multer for file uploads

## Installation Guide

### Frontend Setup

1. **Navigate to the frontend directory:**
    ```bash
    cd frontend
    ```

2. **Install dependencies:**
    ```bash
    npm install
    ```

3. **Start the development server:**
    ```bash
    npm run dev
    ```

### Backend Setup

1. **Navigate to the backend directory:**
    ```bash
    cd backend
    ```

2. **Install dependencies:**
    ```bash
    npm install
    ```

3. **Create a `.env` file in the `backend` directory with the following example content:**

    ```dotenv
    CORS_ORIGIN="http://localhost:5173"
    PORT="8080"
    MONGODB_URI="your_mongodb_uri_here"
    ACCESS_TOKEN_SECRET=""
    ACCESS_TOKEN_EXPIRY=60m
    REFRESH_TOKEN_SECRET=""
    REFRESH_TOKEN_EXPIRY=7d
    CLOUDINARY_CLOUD_NAME="your_cloudinary_cloud_name_here"
    CLOUDINARY_API_KEY="your_cloudinary_api_key_here"
    CLOUDINARY_API_SECRET="your_cloudinary_api_secret_here"
    ```

4. **Start the backend server:**
    ```bash
    npm run dev
    ```

## Features

- **User Authentication:** JWT-based authentication for admin users.
- **Course Management:** CRUD operations for courses, including image upload via Cloudinary.
- **Syllabus Management:** Dynamic syllabus management with weekly topics and content.

## API Endpoints

### Authentication

- **POST /api/admin/register** - Register a new admin.
- **POST /api/admin/login** - Log in an admin and get JWT tokens.


