# 🍰 Spiritual Bakes – Online Food Ordering Platform (MERN Stack)

Spiritual Bakes is a full-stack online bakery ordering web application built using the MERN stack. Users can browse menu items, add to cart, and pay securely via **dynamic UPI QR code** or **Cash on Delivery (COD)**. Admins can manage orders and monitor statuses. Payments are verified and order confirmation emails are sent via **EmailJS**.

---

## 🚀 Live Demo

> Coming soon... (You can deploy it via **Render**, **Netlify**, or **Vercel**)

---

## 📦 Tech Stack

* **Frontend:** React.js, Tailwind CSS / CSS Modules
* **Backend:** Node.js, Express.js
* **Database:** MongoDB Atlas
* **Payment:** UPI QR (custom URL), EmailJS for confirmation mail
* **Other Tools:** Axios, emailjs, QRCode React

---

## 💡 Features

### User Side

* View menu items with images and prices (in INR)
* Add/remove items from cart
* Checkout with form for delivery info
* UPI QR code generation valid for 3 minutes
* Order verification and email confirmation to admin
* Cash on Delivery supported
* My Orders page with live status tracking

### Admin Side (via backend)

* View all orders with status
* Update order status (e.g., Processing, Out for Delivery)
* Monitor email-based order confirmations

---

## 🔧 Installation and Setup

```bash
# Clone the project
git clone https://github.com/your-username/spiritual-bakes.git
cd spiritual-bakes

# Install server dependencies
cd backend
npm install

# Install client dependencies
cd ../frontend
npm install
```

---

## 🪪 Running the Project

### Start Backend

```bash
cd backend
npm start
```

### Start Frontend

```bash
cd frontend
npm run dev
```

---

## 🔐 Environment Variables

### Backend (`backend/.env`)

```env
PORT=5050
MONGO_URL=your_mongo_connection_string
```

### Frontend (`frontend/.env`)

```env
VITE_BACKEND_URL=http://localhost:5050
```

---

## 📧 EmailJS Integration

1. Go to [EmailJS](https://www.emailjs.com/)
2. Create an account, link Gmail, and create a template
3. Get:

   * Service ID
   * Template ID
   * Public Key
4. Replace the values in `PlaceOrder.jsx`:

```js
emailjs.send("YOUR_SERVICE_ID", "YOUR_TEMPLATE_ID", templateParams, "YOUR_PUBLIC_KEY")
```

---

## ✅ Upcoming Features

* Admin dashboard UI
* Razorpay or PhonePe payment verification
* Order cancellation
* Inventory management

---

## 🤝 Contribution

1. Fork the repo
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a pull request

---

## 📸 Screenshots

> Add screenshots or GIFs of the homepage, QR code, and cart experience here

---

## 📬 Contact

**Developer:** Hema Raghul
**Email:** [hr4617@srmist.edu.in](mailto:hr4617@srmist.edu.in)

