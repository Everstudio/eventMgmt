# Event Management System

This is a event management application built using Node.js, Express.js, and MySQL. It handles related event management features.

## Prerequisites

- Node.js (v16 or higher recommended)
- npm (v8 or higher recommended)
- MySQL server

## Getting Started

Follow these steps to run the application locally:

1. **Clone the Repository**
   
   Clone the project repository from GitHub:
   ```bash
   git clone <repository-url>
   cd membermgmt

2. **Install Dependencies**

    Run the following command to install all required dependencies:
    ```bash
    npm install

3. **Environment Variables Setup**

    Create a .env file in the root directory of the project. You need to get the environment variable details from the project owner. The .env file should look something like this:

    ```bash

    DB_HOST = 127.0.0.1
    DB_USER = root
    DB_PASSWORD = root1234
    DB_NAME = membermgmt

    JWT_SECRET = xxxxx //for jwt token


4. **Running the Application**

    To run the application in development mode with automatic restart on changes:

    ```bash
    npm run start:dev


## Note
The application is deployed on a cloud server. If there are any updates to the codebase, follow these steps:

1. **Restart the Application**

    After updating the code, restart the application using pm2:

    ```bash
    pm2 restart [application id]

2. **Clear Cache (if needed)**

    ```bash
    pm2 flush

