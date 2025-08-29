const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const Joi = require('joi');
const router = express.Router();
const prisma = new PrismaClient();
const { requireAuth, requireRole } = require('../middleware/auth');

// Validation schema for registration
const registerSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  name: Joi.string().required(),
  phone: Joi.string().optional(),
  dateOfBirth: Joi.date().optional(),
  gender: Joi.string().valid('MALE', 'FEMALE', 'OTHER', 'PREFER_NOT_TO_SAY').optional(),
});

router.post('/register', async (req, res) => {
  try {
    const { error } = registerSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const { email, password, name, phone, dateOfBirth, gender } = req.body;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) return res.status(409).json({ error: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role: 'CLIENT', // Forced to CLIENT
        name,
        phone,
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : undefined,
        gender,
      },
    });
    res.status(201).json({ message: 'Client registered', user: { id: user.id, email, role: user.role, name } });
  } catch (error) {
    res.status(500).json({ error: 'Registration failed', details: error.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) return res.status(401).json({ error: 'Invalid credentials' });
    const token = jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({
      token,
      user: {
        id: user.id, email, role: user.role, name: user.name, phone: user.phone,
        dateOfBirth: user.dateOfBirth, gender: user.gender
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Login failed', details: error.message });
  }
});

router.get('/client/dashboard', requireAuth, requireRole(['CLIENT']), async (req, res) => {
  res.json({
    message: 'Welcome to Client Dashboard',
    user: req.user,
    features: 'View available services and book sessions (to be implemented)'
  });
});

router.get('/admin/dashboard', requireAuth, requireRole(['ADMIN']), async (req, res) => {
  const users = await prisma.user.findMany({ select: { id: true, email: true, role: true, name: true } });
  res.json({
    message: 'Welcome to Admin Dashboard',
    user: req.user,
    users,
    features: 'Manage services, providers, and cabinets (to be implemented)'
  });
});

module.exports = router;