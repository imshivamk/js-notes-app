# JavaScript Notes App

A simple and secure notes application built with JavaScript, Node.js, Express, and MongoDB. It features user authentication, note creation, and email notifications using Nodemailer.

## Features

- User signup and login with JWT-based authentication
- Create, read, update, and delete notes
- Email notifications using Gmail SMTP and Nodemailer
- Secure environment variable management with `.env`

## Getting Started

### Prerequisites

- Node.js and npm installed
- MongoDB Atlas account or local MongoDB server
- Gmail account for sending emails via Nodemailer

### MongoDB Connection String

You need a MongoDB connection string to connect your app to the database.

1. Create a free account on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Create a new Cluster (choose free tier).
3. Create a Database user with username and password.
4. Under Cluster -> Connect -> Connect your application, copy the connection string.
5. Replace `<username>`, `<password>`, and `<dbname>` with your actual database username, password, and database name.

Example connection string format:

```
mongodb+srv://<username>:<password>@cluster0.mongodb.net/<dbname>?retryWrites=true&w=majority
```

### Setting Up Gmail App Password for Nodemailer

Gmail requires you to create an app password for third-party apps like Nodemailer.

1. Go to your Google Account and enable **2-Step Verification**: [Google 2-Step Verification](https://myaccount.google.com/security-checkup)
2. After enabling, go to **App passwords**: [Google App Passwords](https://myaccount.google.com/apppasswords)
3. Select **Mail** as the app and **Other (Custom name)** as the device, then generate an app password.
4. Copy the 16-character app password (no spaces).

Use this app password in your `.env` file to authenticate Nodemailer with your Gmail account.

### Environment Variables Setup (`.env`)

Create a `.env` file in the root of your project and add the following variables:

```env
PORT=3000
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/<dbname>?retryWrites=true&w=majority
JWT_SECRET=your_jwt_secret_key
NODE_ENV=development
EMAIL_ADDRESS=your-email@gmail.com
EMAIL_PASSWORD=your-16-digit-app-password
```

- Replace `MONGO_URI` with your actual MongoDB connection string.
- Replace `JWT_SECRET` with a strong, random secret for JWT authentication.
- Replace `EMAIL_ADDRESS` with your Gmail email address.
- Replace `EMAIL_PASSWORD` with the generated Gmail app password.

### Installation

Since the repository already contains a `package.json` file, install dependencies by running:

```bash
npm install
```

### Running the App

To start the app, run:

```bash
npm start
```

The app runs on the port defined by the `PORT` environment variable (default: 3000).

### Accessing the App

Open your browser and navigate to:

```
http://localhost:3000
```

(or the port you specified in `.env`).

## Usage

- Sign up with your email and password
- Log in to create, edit, and delete your notes
- Receive email notifications for important actions
