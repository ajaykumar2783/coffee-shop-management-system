# ☕ Smart Coffee Shop Management System

A **full-stack coffee shop web application** designed to handle ordering, tracking, admin management, and analytics — built like a real-world product.

---

## 🚀 Live Demo
👉 Add your deployed link here

---

## 📸 Preview

- Customer Menu & Ordering  
- Cart & Payment UI  
- Admin Dashboard  
- Kitchen Order Panel  
- Order Tracking System  

(Add screenshots here later)

---

## ✨ Features

### 🛒 Customer Side
- Browse coffee menu with categories & search  
- Add to cart with live count  
- Wishlist (❤️ save items)  
- Fake payment options (UPI, Cash, Card)  
- Download PDF invoice  
- Send order to café via WhatsApp  
- Track order (Pending → Preparing → Completed)  
- QR Code menu access  

---

### 👨‍💼 Admin Side
- Secure Admin Login  
- Dashboard with analytics  
- Daily sales chart (Chart.js)  
- Popular items chart  
- View & manage all orders  
- Update order status  
- Menu CRUD (Add/Edit/Delete items)  

---

### 👨‍🍳 Kitchen Panel
- Live order display  
- Sound notification for new orders  
- Quick status update buttons  
- Auto-refresh system  

---

### ⚡ Advanced Features
- PWA support (Installable App)  
- Smooth animations (Swiggy/Zomato style)  
- Glassmorphism UI design  
- Live search suggestions  
- Cart icon with item count  
- Premium responsive design  

---

## 🛠 Tech Stack

### Frontend
- HTML, CSS, JavaScript  
- Chart.js (analytics)  
- jsPDF (invoice generation)  

### Backend
- Flask (Python)  
- REST APIs  
- SQLite Database  
```
---

## 📂 Project Structure
coffee-shop/
│
├── backend/
│ ├── app.py
│ ├── models.py
│ ├── config.py
│ ├── requirements.txt
│
├── frontend/
│ ├── index.html
│ ├── menu.html
│ ├── cart.html
│ ├── dashboard.html
│ ├── admin-login.html
│ ├── admin-menu.html
│ ├── kitchen.html
│ ├── track-order.html
│ ├── css/
│ ├── js/
│
└── README.md


---

## ⚙️ Setup Instructions

### 1️⃣ Backend Setup

```bash
cd backend
pip install -r requirements.txt
python app.py

Backend runs at:

http://127.0.0.1:5000

Frontend Setup

Open using Live Server:

frontend/index.html

Admin Login
Username: admin  
Password: admin123

Usage Flow
1. Open Menu → Add items to cart
2. Go to Cart → Enter details → Place order
3. Download invoice / Send WhatsApp order
4. Admin logs in → Manage orders
5. Kitchen updates order status
6. Customer tracks order live

👨‍💻 Author

Ajay Kumar S

Software Developer
```
