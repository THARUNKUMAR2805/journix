import { Router, Request, Response } from 'express';
import { prisma } from '../lib/prisma';

export const hotelRoutes = Router();

// GET /api/hotels
hotelRoutes.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const { destinationId, type, maxPrice, minRating } = req.query;
    const where: Record<string, unknown> = { isAvailable: true };
    if (destinationId) where.destinationId = destinationId;
    if (type) where.type = type;
    if (maxPrice) where.pricePerNight = { lte: parseFloat(maxPrice as string) };
    if (minRating) where.rating = { gte: parseFloat(minRating as string) };

    const hotels = await prisma.hotel.findMany({
      where,
      include: {
        destination: { select: { name: true, state: true } },
        _count: { select: { reviews: true } },
      },
      orderBy: { rating: 'desc' },
    });
    res.json({ hotels });
  } catch {
    res.status(500).json({ error: 'Failed to fetch hotels' });
  }
});

// GET /api/hotels/:id
hotelRoutes.get('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const hotel = await prisma.hotel.findUnique({
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
    if (!hotel) {
      res.status(404).json({ error: 'Hotel not found' });
      return;
    }
    res.json({ hotel });
  } catch {
    res.status(500).json({ error: 'Failed to fetch hotel' });
  }
});
