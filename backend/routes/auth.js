const express = require('express');
  const bcrypt = require('bcrypt');
  const jwt = require('jsonwebtoken');
  const { PrismaClient } = require('@prisma/client');
  const router = express.Router();
  const prisma = new PrismaClient();

  router.post('/register', async (req, res) => {
    try {
      const { email, password, role, name } = req.body;
      if (!email || !password || !role) {
        return res.status(400).json({ error: 'Email, password, and role are required' });
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          role,
          name,
        },
      });
      res.status(201).json({ message: 'User registered', user: { id: user.id, email, role, name } });
    } catch (error) {
      res.status(500).json({ error: 'Registration failed', details: error.message });
    }
  });

  router.post('/login', async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
      const token = jwt.sign(
        { userId: user.id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );
      res.json({ token, user: { id: user.id, email, role: user.role, name: user.name } });
    } catch (error) {
      res.status(500).json({ error: 'Login failed', details: error.message });
    }
  });

  module.exports = router;