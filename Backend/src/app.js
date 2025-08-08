const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const router = require('./routes/auth.routes');

const app = express();

// ✅ Enable CORS for frontend with cookies
const cors = require("cors");

app.use(cors({
  origin: "https://socialmediabynimesh.netlify.app", // your frontend domain
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true
}));

// Explicitly handle preflight requests
app.options("*", cors({
  origin: "https://socialmediabynimesh.netlify.app",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());

// ✅ API routes
app.use('/api', router);

module.exports = app;
