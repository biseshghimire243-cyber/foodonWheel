# 🍔 FoodShala - Online Food Ordering System

FoodShala is a full-stack online food ordering and cloud kitchen web application.

The system allows customers to browse food items, search and filter menus, manage their cart, place orders, view previous orders, and manage their profile.

It also includes an admin section for managing food items, categories, users, and orders.

---

## 🚀 Features

### 👤 Customer Features

- User Registration
- User Login
- JWT Authentication
- Browse Food Menu
- Search Food Items
- Filter Food by Category
- Sort Food by Price and Name
- View Food Details
- Add Food to Cart
- Update Cart Quantity
- Remove Items from Cart
- View Cart Total
- Checkout
- Place Food Orders
- View Order History
- View Order Status
- Manage User Profile
- Update Personal Information
- Logout

### 🛠️ Admin Features

- Admin Dashboard
- Manage Users
- Manage Food Items
- Add New Food
- Update Food
- Delete Food
- Manage Categories
- Add Categories
- Update Categories
- Delete Categories
- Manage Orders
- Update Order Status

---

## 🧑‍💻 Technologies Used

### Frontend

- HTML5
- CSS3
- JavaScript
- Responsive Design
- Fetch API

### Backend

- Node.js
- Express.js
- REST API
- JWT Authentication
- bcrypt

### Database

- MySQL
- phpMyAdmin

### Development Tools

- Visual Studio Code
- XAMPP
- Git
- GitHub
- Nodemon

---

## 📂 Project Structure

```text
FoodShala/
│
├── backend/
│   │
│   ├── .env
│   ├── package.json
│   ├── server.js
│   │
│   ├── config/
│   │   └── db.js
│   │
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── foodController.js
│   │   ├── orderController.js
│   │   └── userController.js
│   │
│   ├── middleware/
│   │   ├── adminMiddleware.js
│   │   └── authMiddleware.js
│   │
│   └── routes/
│       ├── authRoutes.js
│       ├── cartRoutes.js
│       ├── categoryRoutes.js
│       ├── foodRoutes.js
│       ├── orderRoutes.js
│       ├── reviewRoutes.js
│       └── userRoutes.js
│
├── database/
│   └── foodshala.sql
│
├── frontend/
│   │
│   ├── index.html
│   ├── menu.html
│   ├── food-details.html
│   ├── cart.html
│   ├── checkout.html
│   ├── orders.html
│   ├── profile.html
│   ├── login.html
│   ├── register.html
│   │
│   ├── admin/
│   │   ├── dashboard.html
│   │   ├── foods.html
│   │   ├── categories.html
│   │   ├── orders.html
│   │   └── users.html
│   │
│   ├── css/
│   │   ├── style.css
│   │   ├── menu.css
│   │   ├── cart.css
│   │   └── admin.css
│   │
│   └── js/
│       ├── main.js
│       ├── auth.js
│       ├── menu.js
│       ├── cart.js
│       ├── checkout.js
│       ├── orders.js
│       ├── profile.js
│       └── admin.js
│
└── README.md