import { Router, Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { authenticate, AuthRequest } from '../middleware/auth';
import { z } from 'zod';

export const reviewRoutes = Router();

const reviewSchema = z.object({
  type: z.enum(['destination', 'hotel', 'restaurant', 'transport', 'package']),
  destinationId: z.string().optional(),
  hotelId: z.string().optional(),
  restaurantId: z.string().optional(),
  transportId: z.string().optional(),
  packageId: z.string().optional(),
  rating: z.number().int().min(1).max(5),
  comment: z.string().min(5),
});

// GET /api/reviews
reviewRoutes.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const { type, destinationId, hotelId, restaurantId, transportId, packageId } = req.query;
    const where: Record<string, unknown> = {};
    if (type) where.type = type;
    if (destinationId) where.destinationId = destinationId;
    if (hotelId) where.hotelId = hotelId;
    if (restaurantId) where.restaurantId = restaurantId;
    if (transportId) where.transportId = transportId;
    if (packageId) where.packageId = packageId;

    const reviews = await prisma.review.findMany({
      where,
      include: { user: { select: { name: true, avatar: true } } },
      orderBy: { createdAt: 'desc' },
    });
    res.json({ reviews });
  } catch {
    res.status(500).json({ error: 'Failed to fetch reviews' });
  }
});

// GET /api/reviews/testimonials (top verified reviews for landing page)
reviewRoutes.get('/testimonials', async (_req: Request, res: Response): Promise<void> => {
  try {
    const testimonials = await prisma.review.findMany({
      where: { isVerified: true, rating: { gte: 4 } },
      take: 8,
      orderBy: { createdAt: 'desc' },
      include: { user: { select: { name: true, avatar: true } } },
    });
    res.json({ testimonials });
  } catch {
    res.status(500).json({ error: 'Failed to fetch testimonials' });
  }
});

// POST /api/reviews
reviewRoutes.post('/', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const data = reviewSchema.parse(req.body);
    const review = await prisma.review.create({
      data: { ...data, userId: req.user!.id },
      include: { user: { select: { name: true, avatar: true } } },
    });
    // Award points for writing a review
    await prisma.user.update({
      where: { id: req.user!.id },
      data: { loyaltyPoints: { increment: 50 } },
    });
    await prisma.reward.create({
      data: { userId: req.user!.id, points: 50, type: 'earned', description: 'Points earned for writing a review' },
    });
    res.status(201).json({ review });
  } catch (err) {
    if (err instanceof z.ZodError) {
      res.status(400).json({ error: 'Validation failed', details: err.errors });
      return;
    }
    res.status(500).json({ error: 'Failed to create review' });
  }
});
