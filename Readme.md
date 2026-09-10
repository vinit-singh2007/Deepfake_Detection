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