import { Router, Request, Response } from 'express';
import { prisma } from '../lib/prisma';

export const transportRoutes = Router();

// GET /api/transport
transportRoutes.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const { destinationId, type, isIndividual } = req.query;
    const where: Record<string, unknown> = { isAvailable: true };
    if (destinationId) where.destinationId = destinationId;
    if (type) where.type = type;
    if (isIndividual !== undefined) where.isIndividual = isIndividual === 'true';

    const transports = await prisma.transport.findMany({
      where,
      include: { destination: { select: { name: true, state: true } } },
      orderBy: { rating: 'desc' },
    });
    res.json({ transports });
  } catch {
    res.status(500).json({ error: 'Failed to fetch transport services' });
  }
});

// GET /api/transport/:id
transportRoutes.get('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const transport = await prisma.transport.findUnique({
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
    if (!transport) {
      res.status(404).json({ error: 'Transport not found' });
      return;
    }
    res.json({ transport });
  } catch {
    res.status(500).json({ error: 'Failed to fetch transport' });
  }
});
