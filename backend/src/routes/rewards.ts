import { Router, Response } from 'express';
import { prisma } from '../lib/prisma';
import { authenticate, AuthRequest } from '../middleware/auth';

export const rewardRoutes = Router();

// GET /api/rewards
rewardRoutes.get('/', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const rewards = await prisma.reward.findMany({
      where: { userId: req.user!.id },
      orderBy: { createdAt: 'desc' },
    });
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
      select: { loyaltyPoints: true },
    });
    res.json({ rewards, totalPoints: user?.loyaltyPoints ?? 0 });
  } catch {
    res.status(500).json({ error: 'Failed to fetch rewards' });
  }
});

// POST /api/rewards/redeem
rewardRoutes.post('/redeem', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { points } = req.body;
    if (!points || points < 100) {
      res.status(400).json({ error: 'Minimum 100 points required to redeem' });
      return;
    }
    const user = await prisma.user.findUnique({ where: { id: req.user!.id } });
    if (!user || user.loyaltyPoints < points) {
      res.status(400).json({ error: 'Insufficient loyalty points' });
      return;
    }
    await prisma.user.update({
      where: { id: req.user!.id },
      data: { loyaltyPoints: { decrement: points } },
    });
    await prisma.reward.create({
      data: {
        userId: req.user!.id,
        points: -points,
        type: 'redeemed',
        description: `Redeemed ${points} points for discount`,
      },
    });
    const discountAmount = points / 10; // 10 points = ₹1 discount
    res.json({ message: 'Points redeemed successfully', discountAmount });
  } catch {
    res.status(500).json({ error: 'Redemption failed' });
  }
});
