const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const router = require('./routes/auth.routes');

const app = express();

// ✅ Enable CORS for frontend with cookies
const allowedOrigins = [
    "http://localhost:5173", // Local Vite frontend
    "https://social-media-bynimesh.vercel.app" // Production frontend
];

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps, curl, etc.)
        if (!origin) return callback(null, true);
        if (allowedOrigins.includes(origin)) {
            return callback(null, true);
        } else {
            return callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true
}));

app.use(express.json());
app.use(cookieParser());

// ✅ API routes
app.use('/api', router);

module.exports = app;
