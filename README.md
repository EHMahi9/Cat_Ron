# 📖 BookNook – A Small Online Library

> **Live Website URL**: [https://cat-ron.vercel.app](https://cat-ron.vercel.app)  
> **Live Server API URL**: [https://cat-ron-server.onrender.com](https://cat-ron-server.onrender.com)  
> *Theme*: **Add a book, borrow a book, return a book.**  
> *Assignment Variant*: `B14-A8-Cat_Ron`

---

## 🌟 Key Features

- **Dynamic Catalogue & Real-Time New Arrivals**: Instantly showcases the latest 6 additions from MongoDB on the homepage with Swiper.js banner transitions, and provides a 3-column responsive grid on the `/books` route.
- **Atomic Inventory Management & Copy Tracking**: Real-time copy tracking decrements available stock upon borrowing and restores it upon return (`$inc: { copies: +/-1 }`). If copies reach zero, the borrowing action is automatically locked.
- **Concurrent Double-Borrow Prevention**: Intelligent protection system preventing users from borrowing the same literary title concurrently until the active borrow is returned.
- **Secure BetterAuth & MongoDB Integration**: End-to-end authentication with Email/Password and Google OAuth, persistent sessions across route reloads, and signed JWT token exchanges for protected REST APIs.
- **Full Library CRUD Workflows**: Authenticated members can easily contribute new titles, upload cover imagery via ImgBB, modify their submissions via pre-filled edit dialogs, and delete records with custom confirmation modals (no native browser alerts).
- **Responsive & Themed UI Design**: Built-in Dark and Light mode toggle with local persistence, accessible layout, custom 404 page, and rebranded social icons (new 𝕏 logo).

---

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4, Lucide React Icons
- **UI Components & Slider**: Swiper.js, Custom Modal Components, Framer Motion
- **Authentication**: BetterAuth with MongoDB Adapter, Google OAuth
- **Notifications**: React Hot Toast
- **Database**: MongoDB Atlas

---

## ⚙️ Environment Variables

Create a `.env` file in the root of the `client` directory:

```env
# BetterAuth Configuration
BETTER_AUTH_SECRET=your_better_auth_secret_key
BETTER_AUTH_URL=http://localhost:3000
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Backend Express API URL
NEXT_PUBLIC_API_URL=http://localhost:5000

# MongoDB Connection for BetterAuth Adapter
BETTER_AUTH_DB_URL=mongodb+srv://<username>:<password>@cluster.mongodb.net/?appName=BookNook

# Google OAuth Credentials
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# ImgBB API Key for Cover Uploads
NEXT_PUBLIC_IMGBB_API_KEY=your_imgbb_api_key
```

---

## 🚀 Getting Started

1. **Clone the repository**:
   ```bash
   git clone https://github.com/EHMahi9/Cat_Ron.git
   cd Cat_Ron
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Run development server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

4. **Build for production**:
   ```bash
   npm run build
   npm run start
   ```

---

## 📄 License

This project is licensed under the MIT License.
