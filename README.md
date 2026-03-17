## PDF Hub by Raj Sharma – Secure PDF Learning Platform

PDF Hub by Raj Sharma is a small full‑stack app where an **admin uploads PDFs** that are **watermarked per student**, and **students read or download them from an in‑browser viewer**, with access tracking, dark mode UI, and basic protection features.

This project has two parts:
- **backend** – Node.js/Express + MongoDB API (auth, PDF upload, watermarking, streaming, tracking)
- **frontend** – React + Vite + Tailwind CSS SPA

---

### 1. Prerequisites

- **Node.js** 18+ (LTS recommended)
- **npm** (comes with Node)
- A **MongoDB database** (local or Atlas)
- A **Cloudinary account** (for optional cloud storage/backup of PDFs)
- **Git** (optional, for version control)

---

### 2. Project structure

```text
lms-app/
  backend/        # Express API, Mongo, PDF handling, tracking
  frontend/       # React + Vite client, student/admin dashboards
  README.md
```

You will **run backend and frontend separately** (two terminals).

---

### 3. Backend setup (API server)

1. **Go to the backend folder**

```bash
cd backend
```

2. **Install dependencies**

```bash
npm install
```

3. **Create and configure `.env`**

There is already an example file `backend/env.example`. Create `backend/.env` and adjust values as needed:

```env
PORT=5000
MONGO_URI=mongodb+srv://<user>:<pass>@<cluster>/<dbName>
JWT_SECRET=your_strong_secret_here
ADMIN_EMAIL=your-admin-email@example.com
FRONTEND_URL=http://localhost:5173

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_KEY=your_cloudinary_api_key
CLOUDINARY_SECRET=your_cloudinary_api_secret
```

- `PORT` – API port (keep `5000` unless you change frontend config).
- `MONGO_URI` – your MongoDB connection string (local or Atlas).
- `JWT_SECRET` – change to a long random string.
- `ADMIN_EMAIL` – admin email used for watermark / identification.
- `FRONTEND_URL` – URL where the Vite dev server or built frontend runs.
- `CLOUDINARY_*` – Cloudinary credentials used for uploading PDFs as a backup / alternative delivery.

4. **Start the backend in development**

```bash
npm run dev
```

This runs `nodemon server.js` on the port from `PORT` (default `5000`).

The API root should respond at:

```text
http://localhost:5000/
```

---

### 4. Frontend setup (React app)

1. **Open a new terminal and go to the frontend folder**

```bash
cd frontend
```

2. **Install dependencies**

```bash
npm install
```

3. **Configure frontend environment**

`frontend/.env` already points to the backend:

```env
VITE_API_URL=http://localhost:5000
```

Change this only if you run the backend on a different host/port.

4. **Start the frontend in development**

```bash
npm run dev
```

Vite will show you a local URL, typically:

```text
http://localhost:5173/
```

Open this URL in your browser (Chrome, Firefox, etc.).

---

### 5. Usage guide

#### 5.1. Authentication and roles

- **Register student account**
  - Open the frontend URL.
  - Go to **Register**.
  - Create a student account (role is fixed to `student` in the UI).
- **Admin account**
  - Admins are assumed to be created manually (e.g., via database or seed).  
  - The `ADMIN_EMAIL` env variable is used for watermarking and identification.

#### 5.2. Admin flow

From the **Admin Dashboard** (`/admin`):

- View **stats**: total users, total PDFs, total views, recent access logs.
- Go to **Upload PDF** (`/admin/upload`):
  - Choose **Title**.
  - Enter **Student Email** that should receive access and watermark.
  - Upload a **PDF file**.
  - On success:
    - The API watermarks the PDF (admin + student email).
    - Saves the watermarked file to `backend/uploads/…` on disk (primary viewer source).
    - Uploads the same file to Cloudinary (backup / optional delivery).

#### 5.3. Student flow

From the **Student Dashboard** (`/student`):

- See a list of **assigned PDFs** in the left sidebar.
- Click a PDF to open it in the built‑in **protected viewer**:
  - Renders via an `<iframe>` without the default Chrome PDF toolbar.
  - Basic keyboard shortcuts (print, save, devtools) and right‑click are blocked at the UI layer.
  - The server tracks access events (IP/device/timestamp) for the admin dashboard.

> Note: This implementation discourages casual downloading/printing, but **cannot guarantee perfect protection** (screenshots, devtools, etc. are still technically possible).

---

### 6. Dark mode & responsiveness

- The frontend uses **Tailwind CSS with `darkMode: 'class'`**.
- The **theme toggle button** in the navbar adds/removes the `dark` class on `<html>`, switching between:
  - Light: `bg-backgroundLight` / dark text.
  - Dark: `bg-backgroundDark` / light text.
- Layout (especially navbar and dashboards) uses responsive Tailwind utilities (`sm:`, `lg:` etc.) so it works on **mobile, tablet, and desktop**.

If Tailwind styles don’t look correct after modifying the config, stop the dev server and run:

```bash
cd frontend
npm run dev
```

---

### 7. Production build

#### 7.1. Build frontend

```bash
cd frontend
npm run build
```

This produces a production build in `frontend/dist`.

You can serve it with any static file server or integrate it behind a reverse proxy (e.g., Nginx) that also forwards `/api/*` to the backend.

#### 7.2. Run backend in production

On your server:

```bash
cd backend
npm install --production
NODE_ENV=production node server.js
```

Make sure:

- `.env` is configured for your production MongoDB / domain.
- CORS `FRONTEND_URL` matches the deployed frontend origin.

---

### 8. Common issues

- **Frontend can’t reach backend**
  - Check `VITE_API_URL` in `frontend/.env`.
  - Check `PORT` and `FRONTEND_URL` in `backend/.env`.
  - Ensure both servers are running and there are no CORS errors in the browser console.

- **PDF not showing in Chrome but works in Firefox**
  - Make sure the backend is running and reachable.
  - Ensure Chrome is not blocking the page due to policies/extensions.
  - The `<iframe>` is intentionally not sandboxed so Chrome’s PDF renderer can load the stream.

- **Dark mode button doesn’t work**
  - Confirm `darkMode: 'class'` exists in `tailwind.config.cjs`.
  - Restart the Vite dev server after changing Tailwind config.

---

### 9. Scripts quick reference

From **backend/**:

- `npm run dev` – start API with nodemon (development).
- `npm start` – start API with node (production/simple).

From **frontend/**:

- `npm run dev` – start Vite dev server.
- `npm run build` – build production bundle.
- `npm run preview` – preview the production build locally.

Thanks👍

