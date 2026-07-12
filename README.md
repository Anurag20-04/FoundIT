# 🔍 FoundIT - Lost & Found Management System

A full-stack MERN web application that helps users report, search, and recover lost items through a secure and centralized platform. FoundIT replaces traditional manual lost-and-found systems with a modern digital solution featuring authentication, item matching, real-time communication, and claim management.

![React](https://img.shields.io/badge/React-19-blue?logo=react)
![Node.js](https://img.shields.io/badge/Node.js-Express-green?logo=node.js)
![MongoDB](https://img.shields.io/badge/MongoDB-Database-green?logo=mongodb)
![License](https://img.shields.io/badge/License-MIT-blue)

## 📖 Overview

Losing personal belongings is a common problem, and traditional lost-and-found systems are often slow and unorganized. FoundIT provides a centralized platform where users can report lost or found items, browse listings, communicate securely, and recover belongings efficiently.

## Live Link : https://found-it-rho.vercel.app/

---

## ✨ Features

- 🔐 JWT Authentication
- 📧 Email OTP Verification
- 👤 User Registration & Login
- 📝 Report Lost or Found Items
- 🔍 Browse & Search Items
- 🏷️ Category-Based Filtering
- 🖼️ Multiple Image Uploads
- 💬 Real-Time Chat Between Users
- 📢 Notifications for Item Matches
- 🎁 Reward System for Lost Items
- 📄 Claim Verification System
- 👤 User Profile Management
- 📱 Responsive User Interface

---

## 🛠️ Tech Stack

### Frontend
- React.js
- HTML5
- CSS3
- JavaScript

### Backend
- Node.js
- Express.js

### Database
- MongoDB
- Mongoose

### Authentication
- JWT (JSON Web Token)
- Email OTP Verification
- bcrypt Password Hashing

### Other Tools
- Cloudinary (Image Upload)
- Nodemailer
- Git & GitHub
- VS Code

---

## 📂 Project Structure

```
FoundIT/
│
├── client/
│   ├── src/
│   ├── public/
│   └── package.json
│
├── server/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── utils/
│   ├── config/
│   └── server.js
│
├── .env
├── package.json
└── README.md
```

---

## 🚀 Installation

### Clone the repository

```bash
git clone https://github.com/yourusername/FoundIT.git
```

### Navigate to the project

```bash
cd FoundIT
```

### Install dependencies

Frontend

```bash
cd client
npm install
```

Backend

```bash
cd ../server
npm install
```

### Configure Environment Variables

Create a `.env` file inside the server directory.

Example:

```env
PORT=5000

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret

EMAIL_USER=your_email

EMAIL_PASS=your_email_password

CLOUDINARY_CLOUD_NAME=your_cloud_name

CLOUDINARY_API_KEY=your_api_key

CLOUDINARY_API_SECRET=your_api_secret
```

---

## ▶️ Run the Application

Backend

```bash
npm run dev
```

Frontend

```bash
npm start
```

---

## 📸 Screenshots
## 📸 Screenshots

<table>
  <tr>
    <td align="center">
      <strong> Home Page</strong><br><br>
      <img src="https://github.com/user-attachments/assets/ad09d824-cabe-4541-91be-02fbbce61a81" alt="Home Page" width="100%">
    </td>
    <td align="center">
      <strong> Login Page</strong><br><br>
      <img src="https://github.com/user-attachments/assets/cf918f4e-ed89-4c18-8b28-7a3d4033d462" alt="Login Page" width="100%">
    </td>
  </tr>

  <tr>
    <td align="center">
      <strong> Browse Items</strong><br><br>
      <img src="https://github.com/user-attachments/assets/2f49867f-b325-46c5-89a0-2436656e396b" alt="Browse Items" width="100%">
    </td>
    <td align="center">
      <strong> Report Item</strong><br><br>
      <img src="https://github.com/user-attachments/assets/fc2e3a33-9a2f-4465-af67-71db9e721bc7" alt="Report Item" width="100%">
    </td>
  </tr>
</table>
---

## 🔒 Security Features

- JWT Authentication
- Password Hashing using bcrypt
- Email OTP Verification
- Protected Routes
- Input Validation
- Secure Password Storage

---

## 📌 Future Improvements

- AI-Based Item Matching
- Aadhaar Verification
- GPS-Based Location Matching
- Push Notifications
- Multi-Language Support
- Mobile Application
- Admin Dashboard

---

## 👨‍💻 Contributors

### Bipin Rajak
- **GitHub:** https://github.com/bipin-2005
- **LinkedIn:** https://www.linkedin.com/in/bipin-rajak/

### Anurag Kumar Harijan
- **GitHub:** https://github.com/Anurag20-04
- **LinkedIn:** https://www.linkedin.com/in/anurag-45era8349/

---

## 📄 License

This project is developed for educational and learning purposes.

---

## ⭐ If you found this project useful, consider giving it a star!
