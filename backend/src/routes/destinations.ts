import { Router, Request, Response } from 'express';
import { prisma } from '../lib/prisma';

export const destinationRoutes = Router();

// GET /api/destinations
destinationRoutes.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const { season, trending, lesserKnown, search, limit } = req.query;
    const where: Record<string, unknown> = {};
    if (season && season !== 'all') where.season = season;
    if (trending === 'true') where.isTrending = true;
    if (lesserKnown === 'true') where.isLesserKnown = true;
    if (search) where.name = { contains: search as string };

    const destinations = await prisma.destination.findMany({
      where,
      take: limit ? parseInt(limit as string) : undefined,
      orderBy: { rating: 'desc' },
      include: {
        _count: { select: { hotels: true, restaurants: true, packages: true } },
        virtualTour: { select: { id: true } },
      },
    });
    res.json({ destinations });
  } catch {
    res.status(500).json({ error: 'Failed to fetch destinations' });
  }
});

// GET /api/destinations/:id
destinationRoutes.get('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const destination = await prisma.destination.findUnique({
      where: { id: req.params.id },
      include: {
        hotels: { take: 3 },
        restaurants: { take: 3 },
        transports: { take: 3 },
        packages: { take: 3 },
        virtualTour: true,
        reviews: {
          take: 5,
          orderBy: { createdAt: 'desc' },
          include: { user: { select: { name: true, avatar: true } } },
        },
      },
    });
    if (!destination) {
      res.status(404).json({ error: 'Destination not found' });
      return;
    }
    res.json({ destination });
  } catch {
    res.status(500).json({ error: 'Failed to fetch destination' });
  }
});

// GET /api/destinations/seasonal/recommendations
destinationRoutes.get('/seasonal/recommendations', async (_req: Request, res: Response): Promise<void> => {
  try {
    const month = new Date().getMonth();
    let season = 'all';
    if (month >= 2 && month <= 5) season = 'summer';
    else if (month >= 6 && month <= 8) season = 'monsoon';
    else season = 'winter';

    const destinations = await prisma.destination.findMany({
      where: { OR: [{ season }, { season: 'all' }] },
      take: 6,
      orderBy: { rating: 'desc' },
    });
    res.json({ destinations, currentSeason: season });
  } catch {
    res.status(500).json({ error: 'Failed to fetch seasonal recommendations' });
  }
});
