import { Router, Request, Response } from 'express';
import { prisma } from '../lib/prisma';

export const packageRoutes = Router();

// GET /api/packages
packageRoutes.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const { destinationId, isMini, maxPrice, maxDays } = req.query;
    const where: Record<string, unknown> = { isAvailable: true };
    if (destinationId) where.destinationId = destinationId;
    if (isMini !== undefined) where.isMini = isMini === 'true';
    if (maxPrice) where.price = { lte: parseFloat(maxPrice as string) };
    if (maxDays) where.duration = { lte: parseInt(maxDays as string) };

    const packages = await prisma.travelPackage.findMany({
      where,
      include: {
        destination: { select: { name: true, state: true, coverImage: true } },
        _count: { select: { reviews: true } },
      },
      orderBy: { rating: 'desc' },
    });
    res.json({ packages });
  } catch {
    res.status(500).json({ error: 'Failed to fetch packages' });
  }
});

// GET /api/packages/:id
packageRoutes.get('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const pkg = await prisma.travelPackage.findUnique({
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
    if (!pkg) {
      res.status(404).json({ error: 'Package not found' });
      return;
    }
    res.json({ package: pkg });
  } catch {
    res.status(500).json({ error: 'Failed to fetch package' });
  }
});
