import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { prisma } from '../lib/prisma';
import { signToken } from '../utils/jwt';
import { authenticate, AuthRequest } from '../middleware/auth';
import { z } from 'zod';

export const authRoutes = Router();

const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  phone: z.string().optional(),
  language: z.string().default('en'),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

// POST /api/auth/register
authRoutes.post('/register', async (req: Request, res: Response): Promise<void> => {
  try {
    const data = registerSchema.parse(req.body);
    const existing = await prisma.user.findUnique({ where: { email: data.email } });
    if (existing) {
      res.status(400).json({ error: 'Email already registered' });
      return;
    }
    const hashed = await bcrypt.hash(data.password, 12);
    const user = await prisma.user.create({
      data: { ...data, password: hashed },
      select: { id: true, name: true, email: true, role: true, language: true, loyaltyPoints: true, avatar: true },
    });
    const token = signToken({ id: user.id, email: user.email, role: user.role });
    // Award welcome bonus
    await prisma.reward.create({
      data: { userId: user.id, points: 100, type: 'bonus', description: 'Welcome bonus points!' },
    });
    await prisma.user.update({ where: { id: user.id }, data: { loyaltyPoints: 100 } });
    res.status(201).json({ user, token });
  } catch (err) {
    if (err instanceof z.ZodError) {
      res.status(400).json({ error: 'Validation failed', details: err.errors });
      return;
    }
    res.status(500).json({ error: 'Registration failed' });
  }
});

// POST /api/auth/login
authRoutes.post('/login', async (req: Request, res: Response): Promise<void> => {
  try {
    const data = loginSchema.parse(req.body);
    const user = await prisma.user.findUnique({ where: { email: data.email } });
    if (!user) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }
    const valid = await bcrypt.compare(data.password, user.password);
    if (!valid) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }
    const token = signToken({ id: user.id, email: user.email, role: user.role });
    const { password: _p, ...safeUser } = user;
    res.json({ user: safeUser, token });
  } catch (err) {
    if (err instanceof z.ZodError) {
      res.status(400).json({ error: 'Validation failed', details: err.errors });
      return;
    }
    res.status(500).json({ error: 'Login failed' });
  }
});

// GET /api/auth/me
authRoutes.get('/me', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
      select: { id: true, name: true, email: true, role: true, language: true, loyaltyPoints: true, avatar: true, phone: true, createdAt: true },
    });
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }
    res.json({ user });
  } catch {
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

// PUT /api/auth/profile
authRoutes.put('/profile', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { name, phone, language, avatar } = req.body;
    const user = await prisma.user.update({
      where: { id: req.user!.id },
      data: { name, phone, language, avatar },
      select: { id: true, name: true, email: true, role: true, language: true, loyaltyPoints: true, avatar: true, phone: true },
    });
    res.json({ user });
  } catch {
    res.status(500).json({ error: 'Profile update failed' });
  }
});
