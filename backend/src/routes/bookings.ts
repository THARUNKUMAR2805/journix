import { Router, Response } from 'express';
import { prisma } from '../lib/prisma';
import { authenticate, AuthRequest } from '../middleware/auth';
import { z } from 'zod';

export const bookingRoutes = Router();

const bookingSchema = z.object({
  type: z.enum(['hotel', 'transport', 'package']),
  hotelId: z.string().optional(),
  transportId: z.string().optional(),
  packageId: z.string().optional(),
  checkIn: z.string().optional(),
  checkOut: z.string().optional(),
  people: z.number().int().min(1).default(1),
  specialRequests: z.string().optional(),
});

// GET /api/bookings (user's bookings)
bookingRoutes.get('/', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const bookings = await prisma.booking.findMany({
      where: { userId: req.user!.id },
      include: {
        hotel: { select: { name: true, coverImage: true } },
        transport: { select: { name: true, type: true } },
        package: { select: { name: true, coverImage: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
    res.json({ bookings });
  } catch {
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
});

// POST /api/bookings
bookingRoutes.post('/', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const data = bookingSchema.parse(req.body);

    // Calculate total amount
    let totalAmount = 0;
    if (data.type === 'hotel' && data.hotelId && data.checkIn && data.checkOut) {
      const hotel = await prisma.hotel.findUnique({ where: { id: data.hotelId } });
      if (!hotel) { res.status(404).json({ error: 'Hotel not found' }); return; }
      const days = Math.ceil((new Date(data.checkOut).getTime() - new Date(data.checkIn).getTime()) / 86400000);
      totalAmount = hotel.pricePerNight * days * data.people;
    } else if (data.type === 'transport' && data.transportId) {
      const transport = await prisma.transport.findUnique({ where: { id: data.transportId } });
      if (!transport) { res.status(404).json({ error: 'Transport not found' }); return; }
      totalAmount = transport.pricePerDay;
    } else if (data.type === 'package' && data.packageId) {
      const pkg = await prisma.travelPackage.findUnique({ where: { id: data.packageId } });
      if (!pkg) { res.status(404).json({ error: 'Package not found' }); return; }
      totalAmount = pkg.price * data.people;
    }

    const booking = await prisma.booking.create({
      data: {
        ...data,
        userId: req.user!.id,
        checkIn: data.checkIn ? new Date(data.checkIn) : null,
        checkOut: data.checkOut ? new Date(data.checkOut) : null,
        totalAmount,
        status: 'confirmed',
        paymentStatus: 'pending',
      },
    });

    // Award loyalty points (1 point per ₹100 spent)
    const pointsEarned = Math.floor(totalAmount / 100);
    if (pointsEarned > 0) {
      await prisma.user.update({
        where: { id: req.user!.id },
        data: { loyaltyPoints: { increment: pointsEarned } },
      });
      await prisma.reward.create({
        data: { userId: req.user!.id, points: pointsEarned, type: 'earned', description: `Points earned from booking #${booking.id.slice(-6)}` },
      });
    }

    res.status(201).json({ booking, pointsEarned });
  } catch (err) {
    if (err instanceof z.ZodError) {
      res.status(400).json({ error: 'Validation failed', details: err.errors });
      return;
    }
    res.status(500).json({ error: 'Booking failed' });
  }
});

// PUT /api/bookings/:id/cancel
bookingRoutes.put('/:id/cancel', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const booking = await prisma.booking.findFirst({
      where: { id: req.params.id, userId: req.user!.id },
    });
    if (!booking) { res.status(404).json({ error: 'Booking not found' }); return; }
    if (booking.status === 'cancelled') { res.status(400).json({ error: 'Already cancelled' }); return; }

    const updated = await prisma.booking.update({
      where: { id: req.params.id },
      data: { status: 'cancelled' },
    });
    res.json({ booking: updated });
  } catch {
    res.status(500).json({ error: 'Cancellation failed' });
  }
});
