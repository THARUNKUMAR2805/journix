import { Router, Request, Response } from 'express';
import { prisma } from '../lib/prisma';

export const restaurantRoutes = Router();

// GET /api/restaurants
restaurantRoutes.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const { destinationId, cuisineType, priceRange } = req.query;
    const where: Record<string, unknown> = { isAvailable: true };
    if (destinationId) where.destinationId = destinationId;
    if (cuisineType) where.cuisineType = cuisineType;
    if (priceRange) where.priceRange = priceRange;

    const restaurants = await prisma.restaurant.findMany({
      where,
      include: { destination: { select: { name: true, state: true } } },
      orderBy: { rating: 'desc' },
    });
    res.json({ restaurants });
  } catch {
    res.status(500).json({ error: 'Failed to fetch restaurants' });
  }
});

// GET /api/restaurants/:id
restaurantRoutes.get('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const restaurant = await prisma.restaurant.findUnique({
      where: { id: req.params.id },
      include: {
        destination: true,
        reviews: {
          take: 10,
          orderBy: { createdAt: 'desc' },
          include: { user: { select: { name: true, avatar: true } } },
        },
      },
    });
    if (!restaurant) {
      res.status(404).json({ error: 'Restaurant not found' });
      return;
    }
    res.json({ restaurant });
  } catch {
    res.status(500).json({ error: 'Failed to fetch restaurant' });
  }
});
