# BookMyShow WebApp

## Project Overview
This project is a web application for booking shows. It allows users to browse events, book seats, and manage their bookings. This project is developed as part of our Database Management Systems (DBMS) course.

## Table of Contents
- [Project Overview](#project-overview)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Database Schema](#database-schema)
- [Setup Instructions](#setup-instructions)
- [Usage](#usage)
- [Collaborators](#collaborators)

## Features
- **User authentication and authorization**
- **Event management** (create, update, delete events)
- **Venue management** (create, update, delete venues)
- **Seat management** (view and book seats)
- **Booking management** (create, view, cancel bookings)
- **Responsive design** for a seamless user experience

## Technologies Used
- **Frontend**: React.js
- **Backend**: Node.js, Express.js
- **Database**: PostgreSQL
- **ORM**: Sequelize
- **Authentication**: JWT (JSON Web Tokens)
- **Styling**: CSS, Bootstrap
- **Deployment**: Vercel (Frontend), Heroku (Backend)

## Database Schema

### User Table
Stores user information including their role (admin or user).

### Event Table
Stores event details and references the Venue and User tables.

### Venue Table
Stores venue details.

### Seat Table
Stores seat details and references the Venue table.

### Booking Table
Stores booking details and references the Event table.

## Setup Instructions
1. **Clone the repository**:
    ```bash
    git clone <repository-url>
    ```
2. **Set up environment variables**: Create a `.env` file in the root directory and add the following:
    ```plaintext
    PORT=3000
    PG_NAME=postgres 
    PG_HOST=127.0.0.1
    PG_PORT=5432 
    DB_NAME=postgres
    HASH_SECRET=your-secret-hash
    JWT_SECRET=your-jwt-secret
    CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
    CLOUDINARY_API_KEY=your-cloudinary-api-key
    CLOUDINARY_API_SECRET=your-cloudinary-api-secret
    PASS_SUPA=your-password-supa
    ```
3. **Install dependencies**:
    ```bash
    cd project-directory
    npm run build
    npm run dev
    ```

4. **Navigate to the frontend**: Open your browser and go to `http://localhost:3000`.

## Usage
- **User Authentication**: Sign up and log in to access the platform.
- **Browse Events**: View a list of available events.
- **Book Seats**: Select seats and book them for an event.
- **Manage Bookings**: View and cancel your bookings.


## Collaborators
- Bipin Kumar Marasini (THA078BCT014)
- Dharmendra Singh Chaudhary (THA078BCT016)
- Jesis Upadhaya (THA078BCT017)

This project is developed as part of our DBMS course to demonstrate our understanding of database design, SQL queries, and web application development.
