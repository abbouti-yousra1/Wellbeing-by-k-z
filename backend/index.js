const express = require('express');
const passport = require('passport');
const authRoutes = require('./routes/auth');
  const cors = require('cors');
  const helmet = require('helmet');
  const morgan = require('morgan');
  require('dotenv').config();

  const app = express();

  // Middleware
  app.use(cors());
  app.use(helmet());
  app.use(morgan('dev'));
  app.use(express.json());
  app.use(passport.initialize());
  app.use('/auth', authRoutes);
  
  // Basic route
  app.get('/', (req, res) => {
    res.json({ message: 'Welcome to Wellbeing Reservations API' });
  });

  // Start server
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });