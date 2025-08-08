const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const router = require('./routes/auth.routes');

const app = express();

// ✅ Enable CORS for frontend with cookies
app.use(cors({
    origin: 'http://localhost:5173',  // Frontend URL
    credentials: true                // Allow cookies & headers
}));

app.use(express.json());
app.use(cookieParser());

// ✅ API routes
app.use('/api', router);

module.exports = app;
