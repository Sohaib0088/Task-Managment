# 🧩 Task Manager Dashboard

A modern full-stack **Task Management App** built with **Next.js 14 (App Router)**, **NextAuth.js**, and **Redis**.
Easily manage your daily tasks with Google authentication, real-time updates, and a clean dashboard UI.

---

## 🚀 Features

✅ **Authentication with Google** — Secure login using NextAuth.js
📝 **Task Management** — Add, edit, delete, and mark tasks as complete
📊 **User Dashboard** — Personalized dashboard per user
💾 **Redis Storage** — Ultra-fast in-memory database for tasks
🎨 **Modern UI** — Built with TailwindCSS for clean, responsive design
⚡ **Serverless API Routes** — Efficient backend logic using Next.js route handlers
🔔 **Toasts & Notifications** — Interactive feedback on every action

---

## 🛠️ Tech Stack

| Layer        | Technology                    |
| ------------ | ----------------------------- |
| **Frontend** | React (Next.js 14 App Router) |
| **Styling**  | TailwindCSS                   |
| **Auth**     | NextAuth.js (Google Provider) |
| **Database** | Redis (via ioredis)           |
| **Hosting**  | Vercel (Recommended)          |
| **Language** | JavaScript (ESNext)           |

---

## ⚙️ Installation & Setup

### 1️⃣ Clone the repository

```bash
git clone https://github.com/YOUR-USERNAME/task-manager-dashboard.git
cd task-manager-dashboard
```

### 2️⃣ Install dependencies

```bash
npm install
```

### 3️⃣ Set up environment variables

Create a `.env.local` file in the root directory and add:

```bash
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=http://localhost:3000
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
REDIS_HOST=localhost
REDIS_PORT=6379
```

> 💡 You can generate `NEXTAUTH_SECRET` using:
>
> ```bash
> npx auth secret
> ```

### 4️⃣ Run the development server

```bash
npm run dev
```

Your app will be live at:
👉 [http://localhost:3000](http://localhost:3000)

---

## 🧠 Project Structure

```
task-manager-dashboard/
│
├── app/
│   ├── api/
│   │   └── tasks/route.js       # API routes for CRUD operations
│   ├── dashboard/page.jsx       # Main dashboard UI
│   ├── layout.jsx               # Layout wrapper with SessionProvider
│   └── page.jsx                 # Landing/login page
│
├── lib/
│   └── redis.js                 # Redis connection setup
│
├── package.json
├── tailwind.config.js
└── README.md
```

---

## 🧱 Core Concepts Used

* **Next.js App Router** for file-based routing and server actions
* **Middleware** for protecting authenticated routes
* **Controllers** to separate business logic from route handlers
* **Redis** for quick and scalable data storage
* **NextAuth** for OAuth2-based login

---

## 💬 Contributing

Feel free to fork this repo, open issues, or submit pull requests!
Contributions and suggestions are welcome.

---

## 🧑‍💻 Author

**Sohaib**
💼 Developer | 🌐 Full-Stack Enthusiast
📧 [sohaib021222@gmail.com](mailto:sohaib021222@gmail.com)

---

## 📜 License

This project is licensed under the **MIT License** — feel free to use and modify.
