const express = require('express');
const Joi = require('joi');
const { PrismaClient } = require('@prisma/client');
const { requireAuth, requireRole } = require('../middleware/auth');
const bcrypt = require('bcrypt');

const router = express.Router();
const prisma = new PrismaClient();

// Service validation schema
const serviceSchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().allow('').optional(),
  duration: Joi.number().integer().min(1).required(),
  price: Joi.number().min(0).optional(),
  imageUrl: Joi.string().uri().allow('').optional(),
  assignedProviders: Joi.array().items(Joi.number().integer()).optional(),
});

// Cabinet validation schema
const cabinetSchema = Joi.object({
  name: Joi.string().required(),
  address: Joi.string().allow('').optional(),
  description: Joi.string().allow('').optional(),
});

// Provider validation schema
const providerSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  name: Joi.string().required(),
  phone: Joi.string().allow('').optional(),
  services: Joi.array().items(Joi.number().integer()).optional(),
});

// Schedule validation schema
const scheduleSchema = Joi.object({
  providerId: Joi.number().integer().required(),
  cabinetId: Joi.number().integer().optional(),
  date: Joi.date().required(),
  startTime: Joi.date().required(),
  endTime: Joi.date().required(),
  status: Joi.string().valid('AVAILABLE', 'BOOKED', 'OFF', 'BREAK').default('AVAILABLE'),
});

// --- Services Endpoints ---
// Create a service
router.post('/services', requireAuth, requireRole(['ADMIN']), async (req, res) => {
  try {
    const { error } = serviceSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const { name, description, duration, price, imageUrl, assignedProviders } = req.body;

    const existingService = await prisma.service.findFirst({ where: { name } });
    if (existingService) return res.status(409).json({ error: 'Service already exists' });

    const service = await prisma.service.create({
      data: {
        name,
        description,
        duration,
        price,
        imageUrl,
        assignedProviders: assignedProviders ? {
          connect: assignedProviders.map(id => ({ id })),
        } : undefined,
      },
      include: { assignedProviders: { select: { id: true, name: true } } },
    });

    res.status(201).json({ message: 'Service created', service });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create service', details: error.message });
  }
});

// Get all services
router.get('/services', requireAuth, requireRole(['ADMIN']), async (req, res) => {
  try {
    const services = await prisma.service.findMany({
      include: { assignedProviders: { select: { id: true, name: true } } },
    });
    res.json(services);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch services', details: error.message });
  }
});

// Update a service
router.put('/services/:id', requireAuth, requireRole(['ADMIN']), async (req, res) => {
  try {
    const { id } = req.params;
    const { error } = serviceSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const { name, description, duration, price, imageUrl, assignedProviders } = req.body;

    const service = await prisma.service.update({
      where: { id: parseInt(id) },
      data: {
        name,
        description,
        duration,
        price,
        imageUrl,
        assignedProviders: assignedProviders ? {
          set: assignedProviders.map(id => ({ id })),
        } : undefined,
      },
      include: { assignedProviders: { select: { id: true, name: true } } },
    });

    res.json({ message: 'Service updated', service });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update service', details: error.message });
  }
});

// Delete a service
router.delete('/services/:id', requireAuth, requireRole(['ADMIN']), async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.service.delete({ where: { id: parseInt(id) } });
    res.json({ message: 'Service deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete service', details: error.message });
  }
});

// --- Cabinets Endpoints ---
// Create a cabinet
router.post('/cabinets', requireAuth, requireRole(['ADMIN']), async (req, res) => {
  try {
    const { error } = cabinetSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const { name, address, description } = req.body;

    const existingCabinet = await prisma.cabinet.findFirst({ where: { name } });
    if (existingCabinet) return res.status(409).json({ error: 'Cabinet already exists' });

    const cabinet = await prisma.cabinet.create({
      data: { name, address, description },
    });

    res.status(201).json({ message: 'Cabinet created', cabinet });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create cabinet', details: error.message });
  }
});

// Get all cabinets
router.get('/cabinets', requireAuth, requireRole(['ADMIN']), async (req, res) => {
  try {
    const cabinets = await prisma.cabinet.findMany();
    res.json(cabinets);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch cabinets', details: error.message });
  }
});

// Update a cabinet
router.put('/cabinets/:id', requireAuth, requireRole(['ADMIN']), async (req, res) => {
  try {
    const { id } = req.params;
    const { error } = cabinetSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const { name, address, description } = req.body;

    const cabinet = await prisma.cabinet.update({
      where: { id: parseInt(id) },
      data: { name, address, description },
    });

    res.json({ message: 'Cabinet updated', cabinet });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update cabinet', details: error.message });
  }
});

// Delete a cabinet
router.delete('/cabinets/:id', requireAuth, requireRole(['ADMIN']), async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.cabinet.delete({ where: { id: parseInt(id) } });
    res.json({ message: 'Cabinet deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete cabinet', details: error.message });
  }
});

// --- Providers Endpoints ---
// Create a provider
router.post('/providers', requireAuth, requireRole(['ADMIN']), async (req, res) => {
  try {
    const { error } = providerSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const { email, password, name, phone, services } = req.body;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) return res.status(409).json({ error: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const provider = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        phone,
        role: 'PROVIDER',
        services: services ? {
          connect: services.map(id => ({ id })),
        } : undefined,
      },
      include: { services: { select: { id: true, name: true } } },
    });

    res.status(201).json({ message: 'Provider created', provider });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create provider', details: error.message });
  }
});

// Get all providers
router.get('/providers', requireAuth, requireRole(['ADMIN']), async (req, res) => {
  try {
    const providers = await prisma.user.findMany({
      where: { role: 'PROVIDER' },
      include: { services: { select: { id: true, name: true } } },
    });
    res.json(providers);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch providers', details: error.message });
  }
});

// Update a provider
router.put('/providers/:id', requireAuth, requireRole(['ADMIN']), async (req, res) => {
  try {
    const { id } = req.params;
    const { error } = providerSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const { email, password, name, phone, services } = req.body;

    const data = { email, name, phone };
    if (password) data.password = await bcrypt.hash(password, 10);

    const provider = await prisma.user.update({
      where: { id: parseInt(id) },
      data: {
        ...data,
        services: services ? {
          set: services.map(id => ({ id })),
        } : undefined,
      },
      include: { services: { select: { id: true, name: true } } },
    });

    res.json({ message: 'Provider updated', provider });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update provider', details: error.message });
  }
});

// Delete a provider
router.delete('/providers/:id', requireAuth, requireRole(['ADMIN']), async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.user.delete({ where: { id: parseInt(id) } });
    res.json({ message: 'Provider deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete provider', details: error.message });
  }
});

// --- Schedules Endpoints ---
// Create a schedule
router.post('/schedules', requireAuth, requireRole(['ADMIN']), async (req, res) => {
  try {
    const { error } = scheduleSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const { providerId, cabinetId, date, startTime, endTime, status } = req.body;

    const provider = await prisma.user.findUnique({ where: { id: providerId } });
    if (!provider || provider.role !== 'PROVIDER') return res.status(400).json({ error: 'Invalid provider' });

    if (cabinetId) {
      const cabinet = await prisma.cabinet.findUnique({ where: { id: cabinetId } });
      if (!cabinet) return res.status(400).json({ error: 'Invalid cabinet' });
    }

    const schedule = await prisma.schedule.create({
      data: {
        providerId,
        cabinetId,
        date: new Date(date),
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        status,
      },
      include: { provider: { select: { id: true, name: true } }, cabinet: true },
    });

    res.status(201).json({ message: 'Schedule created', schedule });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create schedule', details: error.message });
  }
});

// Get all schedules (with optional filters)
router.get('/schedules', requireAuth, requireRole(['ADMIN']), async (req, res) => {
  try {
    const { providerId, cabinetId, date } = req.query;
    const where = {};
    if (providerId) where.providerId = parseInt(providerId);
    if (cabinetId) where.cabinetId = parseInt(cabinetId);
    if (date) where.date = { gte: new Date(date), lte: new Date(date) };

    const schedules = await prisma.schedule.findMany({
      where,
      include: { provider: { select: { id: true, name: true } }, cabinet: true },
    });
    res.json(schedules);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch schedules', details: error.message });
  }
});

// Update a schedule
router.put('/schedules/:id', requireAuth, requireRole(['ADMIN']), async (req, res) => {
  try {
    const { id } = req.params;
    const { error } = scheduleSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const { providerId, cabinetId, date, startTime, endTime, status } = req.body;

    const provider = await prisma.user.findUnique({ where: { id: providerId } });
    if (!provider || provider.role !== 'PROVIDER') return res.status(400).json({ error: 'Invalid provider' });

    if (cabinetId) {
      const cabinet = await prisma.cabinet.findUnique({ where: { id: cabinetId } });
      if (!cabinet) return res.status(400).json({ error: 'Invalid cabinet' });
    }

    const schedule = await prisma.schedule.update({
      where: { id: parseInt(id) },
      data: {
        providerId,
        cabinetId,
        date: new Date(date),
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        status,
      },
      include: { provider: { select: { id: true, name: true } }, cabinet: true },
    });

    res.json({ message: 'Schedule updated', schedule });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update schedule', details: error.message });
  }
});

// Delete a schedule
router.delete('/schedules/:id', requireAuth, requireRole(['ADMIN']), async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.schedule.delete({ where: { id: parseInt(id) } });
    res.json({ message: 'Schedule deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete schedule', details: error.message });
  }
});


module.exports = router;