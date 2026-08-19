require('dotenv').config();

// ─── IMPORTS ───
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');
const connectDB = require('./config/db');
const { errorHandler } = require('./utils/errorHandler');

// ─── ROUTES ───
const authRoutes = require('./routes/authRoute');
const resetRoutes = require('./routes/resetRoute');
const blogRoutes = require('./routes/blogRoute');
const projectRoutes = require('./routes/projectRoute');
const testimonialsRoutes = require('./routes/testimonialRoute');
const dashboardRoutes = require('./routes/dashboardRoute');
const caseStudyRoutes = require('./routes/CaseStudyRoute');
const chatbotRoutes = require('./routes/chatbotRoute');

// ─── APP SETUP ───
const app = express();
const PORT = process.env.PORT || 5000;

const FRONTEND_ORIGIN = process.env.NODE_ENV === 'production'
  ? 'https://ondrivo.onrender.com/'
  : 'http://localhost:5173';

app.set('trust proxy', 1);

// ─── MIDDLEWARE ───
app.use(cors({
  origin: FRONTEND_ORIGIN,
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

// ─── STATIC FILES ───
app.use('/uploads', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', FRONTEND_ORIGIN);
  res.header('Access-Control-Allow-Credentials', 'true');
  next();
}, express.static(path.join(__dirname, 'uploads')));

app.use(express.static(path.join(__dirname, 'public')));

// ─── PUBLIC ROUTES ───
app.use('/api', authRoutes);
app.use('/api/reset', resetRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/testimonials', testimonialsRoutes);
app.use('/api/chatbot', chatbotRoutes);
app.use('/api/case-studies', caseStudyRoutes);

app.get('/api/config', (req, res) => {
  res.json({
    whatsappNumber: process.env.VITE_WHATSAPP_NUMBER || 254703433014,
    phoneNumber: process.env.VITE_PHONE_NUMBER || 254703433014,
  });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// ─── PROTECTED ROUTES ───
app.use('/api/dashboard', dashboardRoutes);

// ─── CLIENT-SIDE ROUTING CATCH-ALL ───
app.use((req, res, next) => {
  if (req.path.startsWith('/api')) return next();
  if (req.path.startsWith('/uploads')) return next();
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ─── 404 FOR UNMATCHED API ROUTES ───
app.use('/api', (req, res) => {
  res.status(404).json({ message: 'Not found' });
});

// ─── GLOBAL ERROR HANDLER ───
app.use(errorHandler);

// ─── START SERVER ───
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Backend running on http://localhost:${PORT}`);
  });
});