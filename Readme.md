frontend/
├── src/
│   ├── components/
│   │   ├── Navbar.jsx
│   │   ├── PrivateRoute.jsx   # Auth check wrapper component
│   │   ├── VideoUploader.jsx
│   │   ├── ResultCard.jsx
│   │   └── TimelineBar.jsx
│   ├── context/
│   │   └── AuthContext.jsx    # Global User Login State (JWT token store)
│   ├── pages/
│   │   ├── Home.jsx           # Landing Page
│   │   ├── Login.jsx          # Login Page
│   │   ├── Register.jsx       # Register Page
│   │   ├── Dashboard.jsx      # Video Analyzer Dashboard
│   │   ├── History.jsx        # Past Reports
│   │   └── Awareness.jsx      # Educational Section
│   ├── services/
│   │   └── api.js             # Axios instance with Auth Bearer Interceptor
│   ├── App.jsx                # React Router Config
│   └── main.jsx

backend/
├── app/
│   ├── api/
│   │   ├── auth.py          # /login, /register, /me endpoints
│   │   ├── video.py         # /upload, /analyze, /history endpoints
│   │   └── health.py        # System check
│   ├── core/
│   │   ├── config.py        # Environment variables (.env)
│   │   └── security.py      # JWT token generation & password hashing (bcrypt)
│   ├── db/
│   │   └── mongodb.py       # MongoDB Async connection setup
│   ├── models/
│   │   ├── user.py          # User Pydantic schema
│   │   └── analysis.py      # Scan Result Pydantic schema
│   ├── services/
│   │   ├── ffmpeg_service.py # Audio extraction script
│   │   └── ml_service.py     # AI Model wrapper (MediaPipe + SyncNet)
│   └── main.py              # App entry point
├── uploads/                 # Storage for temporary video files
├── .env
└── requirements.txt

# 🛡️ DeepShield - Advanced Deepfake Detection

DeepShield is a cutting-edge web application designed to detect deepfake videos using frame-by-frame lip-sync and landmark verification models. It provides a seamless interface for users to upload media, analyze facial discrepancies, and review historical detection logs.

## 🚀 Features

* **Video Analysis:** Upload MP4, MOV, or AVI files (up to 100MB) for deepfake detection.
* **Lip-Sync & Landmark Verification:** Frame-by-frame scrutiny to spot audio-visual mismatches and facial manipulation.
* **Temporal Analysis:** Track anomalies and inconsistencies across video timelines.
* **Analysis History:** Keep a comprehensive log of all past scans and results.
* **Modern UI/UX:** Sleek dark-mode interface built with dedicated dashboard navigation.

## 🛠️ Tech Stack

* **Frontend:** React / Next.js, Tailwind CSS
* **Backend:** Python, Flask / FastAPI
* **Machine Learning:** PyTorch / TensorFlow, OpenCV, Facial Landmark Models

## 📦 Local Setup & Execution

Since this project is set up locally in your environment, follow these steps to run it:

1. **Navigate to the Project Directory**
   ```bash
   cd C:\DeepShield\Deepfake_Detection