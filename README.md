# FoundIT – Lost & Found Application

FoundIT is a full-stack Lost & Found web application that enables users to report, search, and manage lost or found items through a centralized platform. It streamlines the process of reconnecting users with their belongings using a modern and responsive interface.

---

## Features

- User Authentication
- Report Lost Items
- Report Found Items
- View All Listings
- Search and Filter Items
- Update and Delete Posts
- Responsive User Interface
- RESTful API Architecture
- Secure Backend

---

## Tech Stack

### Frontend
- React.js
- Vite
- JavaScript
- HTML5
- CSS3

### Backend
- Node.js
- Express.js

### Database
- MongoDB

### Tools
- Git
- GitHub
- Postman
- Vercel

---

## Project Structure

```
FoundIT/
│
├── frontend/
│   ├── public/
│   ├── src/
│   ├── package.json
│   └── vite.config.js
│
├── backend/
│   ├── config/
│   ├── controller/
│   ├── middleware/
│   ├── models/
│   ├── router/
│   ├── utils/
│   ├── app.js
│   ├── server.js
│   └── package.json
│
└── README.md
```

---

## Installation

### Clone the Repository

```bash
git clone https://github.com/bipin-2005/FoundIT.git
cd FoundIT
```

---

## Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file inside the backend folder.

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

Run the backend server.

```bash
npm start
```

or

```bash
npm run dev
```

---

## Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The application will run locally on:

```
http://localhost:5173
```

---

## API Features

- User Registration
- User Login
- Create Item Listing
- Update Item
- Delete Item
- View All Items
- Search Items

---

## Future Enhancements

- Image Upload Support
- Email Notifications
- Google Maps Integration
- Real-time Chat
- Admin Dashboard
- Advanced Search Filters

---

## Screenshots

Add screenshots of:

- Home Page
- Login Page
- Dashboard
- Lost Items Page
- Found Items Page

---

## Author

**Bipin Rajak**

GitHub: https://github.com/bipin-2005

LinkedIn: Add your LinkedIn profile link

---

## License

This project is licensed under the MIT License.
