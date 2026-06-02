import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding JourniX database...');

  // Clear existing data
  await prisma.reward.deleteMany();
  await prisma.review.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.virtualTour.deleteMany();
  await prisma.travelPackage.deleteMany();
  await prisma.transport.deleteMany();
  await prisma.restaurant.deleteMany();
  await prisma.hotel.deleteMany();
  await prisma.destination.deleteMany();
  await prisma.user.deleteMany();

  // Users
  const adminPass = await bcrypt.hash('admin123', 12);
  const userPass = await bcrypt.hash('user123', 12);

  const admin = await prisma.user.create({
    data: {
      name: 'Tharun Kumar',
      email: 'tharundondapati982@gmail.com',
      password: adminPass,
      role: 'admin',
      loyaltyPoints: 5000,
    },
  });

  const user1 = await prisma.user.create({
    data: {
      name: 'Priya Sharma',
      email: 'priya@example.com',
      password: userPass,
      role: 'customer',
      loyaltyPoints: 850,
      language: 'hi',
    },
  });

  const user2 = await prisma.user.create({
    data: {
      name: 'Rahul Kumar',
      email: 'rahul@example.com',
      password: userPass,
      role: 'customer',
      loyaltyPoints: 1200,
    },
  });

  console.log('✅ Users created');

  // Destinations
  const destinations = await Promise.all([
    prisma.destination.create({
      data: {
        name: 'Coorg',
        state: 'Karnataka',
        description: 'Known as the Scotland of India, Coorg is a hill station surrounded by lush coffee plantations, misty hills, and cascading waterfalls. A perfect retreat for nature lovers and adventure seekers.',
        shortDesc: 'Scotland of India — coffee hills & waterfalls',
        coverImage: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=800',
        images: JSON.stringify([
          'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=800',
          'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
          'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
        ]),
        season: 'winter',
        isLesserKnown: false,
        isTrending: true,
        rating: 4.7,
        totalReviews: 1240,
        latitude: 12.3375,
        longitude: 75.8069,
      },
    }),
    prisma.destination.create({
      data: {
        name: 'Hampi',
        state: 'Karnataka',
        description: 'A UNESCO World Heritage Site, Hampi is an ancient village full of stunning ruins of the Vijayanagara Empire. Boulder-strewn landscapes and ancient temples create a surreal atmosphere.',
        shortDesc: 'Ancient ruins & boulder landscapes',
        coverImage: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800',
        images: JSON.stringify([
          'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800',
          'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800',
        ]),
        season: 'winter',
        isLesserKnown: false,
        isTrending: true,
        rating: 4.8,
        totalReviews: 980,
      },
    }),
    prisma.destination.create({
      data: {
        name: 'Gokarna',
        state: 'Karnataka',
        description: 'A small temple town on the Arabian Sea coast, Gokarna offers pristine beaches, a laid-back vibe, and spiritual significance. Less crowded than Goa, it is a hidden gem.',
        shortDesc: 'Pristine beaches & spiritual temples',
        coverImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800',
        images: JSON.stringify([
          'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800',
          'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=800',
        ]),
        season: 'winter',
        isLesserKnown: true,
        isTrending: false,
        rating: 4.5,
        totalReviews: 640,
      },
    }),
    prisma.destination.create({
      data: {
        name: 'Wayanad',
        state: 'Kerala',
        description: 'Wayanad is a verdant district nestled in the Western Ghats, offering wildlife sanctuaries, ancient caves, and tea/spice plantations. A paradise for eco-tourists.',
        shortDesc: 'Wildlife & lush Western Ghats',
        coverImage: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800',
        images: JSON.stringify([
          'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800',
          'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
        ]),
        season: 'monsoon',
        isLesserKnown: false,
        isTrending: true,
        rating: 4.6,
        totalReviews: 870,
      },
    }),
    prisma.destination.create({
      data: {
        name: 'Chikmagalur',
        state: 'Karnataka',
        description: 'The birthplace of Indian coffee, Chikmagalur is a picturesque hill town with sprawling coffee estates, trekking trails and panoramic mountain views.',
        shortDesc: 'Coffee estates & mountain treks',
        coverImage: 'https://images.unsplash.com/photo-1569144157591-c60f3f82f137?w=800',
        images: JSON.stringify([
          'https://images.unsplash.com/photo-1569144157591-c60f3f82f137?w=800',
          'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
        ]),
        season: 'all',
        isLesserKnown: false,
        isTrending: false,
        rating: 4.4,
        totalReviews: 520,
      },
    }),
    prisma.destination.create({
      data: {
        name: 'Agumbe',
        state: 'Karnataka',
        description: 'Known as the Cherrapunji of the South, Agumbe is a tiny village famous for its king cobra habitat, breathtaking sunsets over the Arabian Sea, and dense rainforests.',
        shortDesc: 'Rainforests & legendary sunsets',
        coverImage: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=800',
        images: JSON.stringify([
          'https://images.unsplash.com/photo-1448375240586-882707db888b?w=800',
        ]),
        season: 'monsoon',
        isLesserKnown: true,
        isTrending: false,
        rating: 4.3,
        totalReviews: 210,
      },
    }),
  ]);

  console.log('✅ Destinations created');

  // Hotels for Coorg
  const coorg = destinations[0];
  const hampi = destinations[1];
  const gokarna = destinations[2];
  const wayanad = destinations[3];

  const hotels = await Promise.all([
    prisma.hotel.create({
      data: {
        name: 'Misty Hills Resort',
        type: 'resort',
        destinationId: coorg.id,
        description: 'Luxury resort nestled among coffee plantations offering stunning valley views and world-class amenities.',
        address: 'Madikeri, Coorg, Karnataka',
        coverImage: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800',
        images: JSON.stringify(['https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800']),
        pricePerNight: 4500,
        rating: 4.8,
        totalReviews: 342,
        facilities: JSON.stringify(['WiFi', 'Pool', 'Spa', 'Restaurant', 'Parking', 'Garden', 'Room Service']),
        phone: '+91-9876543210',
        email: 'info@mistyhills.com',
      },
    }),
    prisma.hotel.create({
      data: {
        name: 'Coorg Backpackers Hostel',
        type: 'hostel',
        destinationId: coorg.id,
        description: 'Budget-friendly hostel with a vibrant community vibe, perfect for solo travellers and backpackers.',
        address: 'Kushalnagar, Coorg, Karnataka',
        coverImage: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800',
        images: JSON.stringify(['https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800']),
        pricePerNight: 600,
        rating: 4.3,
        totalReviews: 189,
        facilities: JSON.stringify(['WiFi', 'Common Kitchen', 'Lockers', 'AC', 'Laundry']),
        phone: '+91-9876543211',
      },
    }),
    prisma.hotel.create({
      data: {
        name: 'Hampi Heritage Stay',
        type: 'homestay',
        destinationId: hampi.id,
        description: 'Authentic homestay run by local family offering traditional Karnataka meals and guided ruins tours.',
        address: 'Hampi Bazaar, Hampi, Karnataka',
        coverImage: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800',
        images: JSON.stringify(['https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800']),
        pricePerNight: 1200,
        rating: 4.9,
        totalReviews: 267,
        facilities: JSON.stringify(['WiFi', 'Home-cooked meals', 'Guided tours', 'Bicycle rental', 'Garden']),
        phone: '+91-9876543212',
      },
    }),
    prisma.hotel.create({
      data: {
        name: 'Namaste Beach Huts',
        type: 'resort',
        destinationId: gokarna.id,
        description: 'Eco-friendly beach huts right on Om Beach, offering a bohemian coastal experience.',
        address: 'Om Beach, Gokarna, Karnataka',
        coverImage: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800',
        images: JSON.stringify(['https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800']),
        pricePerNight: 2200,
        rating: 4.5,
        totalReviews: 156,
        facilities: JSON.stringify(['Sea View', 'Restaurant', 'Yoga Deck', 'Beach Access', 'WiFi']),
        phone: '+91-9876543213',
      },
    }),
    prisma.hotel.create({
      data: {
        name: 'Wayanad Jungle Lodge',
        type: 'resort',
        destinationId: wayanad.id,
        description: 'Luxury treehouse and jungle cottages at the edge of the wildlife sanctuary.',
        address: 'Vythiri, Wayanad, Kerala',
        coverImage: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800',
        images: JSON.stringify(['https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800']),
        pricePerNight: 6500,
        rating: 4.7,
        totalReviews: 423,
        facilities: JSON.stringify(['WiFi', 'Infinity Pool', 'Jungle Safari', 'Spa', 'Restaurant', 'Bonfire']),
        phone: '+91-9876543214',
      },
    }),
  ]);

  console.log('✅ Hotels created');

  // Restaurants
  await Promise.all([
    prisma.restaurant.create({
      data: {
        name: 'Akki Rotti House',
        destinationId: coorg.id,
        description: 'Authentic Kodava cuisine restaurant serving traditional dishes like Akki Rotti, Pandi Curry, and Kadambuttu.',
        cuisineType: 'traditional',
        speciality: 'Pandi Curry & Akki Rotti',
        coverImage: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=800',
        images: JSON.stringify(['https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=800']),
        priceRange: 'budget',
        rating: 4.6,
        totalReviews: 312,
        address: 'Madikeri Town, Coorg',
        phone: '+91-9845678901',
      },
    }),
    prisma.restaurant.create({
      data: {
        name: 'Hampi Mango Tree',
        destinationId: hampi.id,
        description: 'Famous riverside restaurant under a giant mango tree, serving multi-cuisine with stunning Tungabhadra river views.',
        cuisineType: 'fusion',
        speciality: 'River View Dining & Israeli Food',
        coverImage: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800',
        images: JSON.stringify(['https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800']),
        priceRange: 'budget',
        rating: 4.7,
        totalReviews: 445,
        address: 'Hippie Island, Hampi',
        phone: '+91-9845678902',
      },
    }),
    prisma.restaurant.create({
      data: {
        name: 'Om Shanti Cafe',
        destinationId: gokarna.id,
        description: 'Beachside cafe serving fresh seafood, smoothies, and Israeli cuisine. A favourite among backpackers.',
        cuisineType: 'local',
        speciality: 'Fresh Seafood & Coconut Fish Curry',
        coverImage: 'https://images.unsplash.com/photo-1553621042-f6e147245754?w=800',
        images: JSON.stringify(['https://images.unsplash.com/photo-1553621042-f6e147245754?w=800']),
        priceRange: 'budget',
        rating: 4.4,
        totalReviews: 228,
        address: 'Om Beach, Gokarna',
        phone: '+91-9845678903',
      },
    }),
    prisma.restaurant.create({
      data: {
        name: 'Spice Garden Kerala',
        destinationId: wayanad.id,
        description: 'Farm-to-table restaurant in a spice garden setting, serving authentic Kerala sadya on banana leaves.',
        cuisineType: 'traditional',
        speciality: 'Kerala Sadya & Appam Stew',
        coverImage: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800',
        images: JSON.stringify(['https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800']),
        priceRange: 'moderate',
        rating: 4.8,
        totalReviews: 367,
        address: 'Kalpetta, Wayanad',
        phone: '+91-9845678904',
      },
    }),
  ]);

  console.log('✅ Restaurants created');

  // Transport
  await Promise.all([
    prisma.transport.create({
      data: {
        name: 'Coorg Cab Services',
        type: 'taxi',
        destinationId: coorg.id,
        description: 'Reliable taxi service covering all tourist spots in Coorg with experienced local drivers.',
        coverImage: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=800',
        pricePerDay: 2500,
        capacity: 6,
        rating: 4.5,
        totalReviews: 198,
        ownerName: 'Muthanna Cariappa',
        ownerPhone: '+91-9756432101',
        isIndividual: false,
      },
    }),
    prisma.transport.create({
      data: {
        name: 'Raju\'s Auto Rickshaw',
        type: 'auto',
        destinationId: hampi.id,
        description: 'Friendly local auto driver who knows every nook of Hampi ruins. Affordable and authentic.',
        coverImage: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
        pricePerDay: 600,
        capacity: 3,
        rating: 4.9,
        totalReviews: 312,
        ownerName: 'Raju Gangadhar',
        ownerPhone: '+91-9756432102',
        isIndividual: true,
      },
    }),
    prisma.transport.create({
      data: {
        name: 'Gokarna Boat Tours',
        type: 'boat',
        destinationId: gokarna.id,
        description: 'Scenic boat rides along the Gokarna coastline connecting Om Beach, Half Moon Beach, and Paradise Beach.',
        coverImage: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800',
        pricePerDay: 1200,
        capacity: 12,
        rating: 4.6,
        totalReviews: 145,
        ownerName: 'Suresh Fishermen Coop',
        ownerPhone: '+91-9756432103',
        isIndividual: false,
      },
    }),
    prisma.transport.create({
      data: {
        name: 'Wayanad Jeep Safari',
        type: 'taxi',
        destinationId: wayanad.id,
        description: 'Rugged jeep safaris through Wayanad Wildlife Sanctuary with expert naturalist guides.',
        coverImage: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800',
        pricePerDay: 3500,
        capacity: 8,
        rating: 4.7,
        totalReviews: 289,
        ownerName: 'Green Trails Wayanad',
        ownerPhone: '+91-9756432104',
        isIndividual: false,
      },
    }),
  ]);

  console.log('✅ Transport created');

  // Travel Packages
  const packages = await Promise.all([
    prisma.travelPackage.create({
      data: {
        name: 'Coorg Coffee & Nature Escape',
        destinationId: coorg.id,
        description: 'A 3-day immersive experience in the coffee hills of Coorg. Includes plantation walks, waterfall treks, and authentic Kodava dining.',
        coverImage: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=800',
        images: JSON.stringify(['https://images.unsplash.com/photo-1599661046289-e31897846e41?w=800']),
        price: 8500,
        duration: 3,
        isMini: false,
        includes: JSON.stringify(['Hotel', 'Breakfast & Dinner', 'Transport', 'Guide', 'Plantation Walk', 'Waterfall Trek']),
        highlights: JSON.stringify(['Abbey Falls', 'Raja\'s Seat', 'Coffee Plantation Tour', 'Namdroling Monastery']),
        rating: 4.8,
        totalReviews: 234,
        maxPeople: 12,
      },
    }),
    prisma.travelPackage.create({
      data: {
        name: 'Hampi Ruins Explorer',
        destinationId: hampi.id,
        description: 'Spend 2 days exploring the magnificent ruins of the Vijayanagara empire with an expert archaeologist guide.',
        coverImage: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800',
        images: JSON.stringify(['https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800']),
        price: 5500,
        duration: 2,
        isMini: false,
        includes: JSON.stringify(['Homestay', 'All Meals', 'Auto Rickshaw', 'Archaeologist Guide', 'Entry Tickets']),
        highlights: JSON.stringify(['Virupaksha Temple', 'Vittala Temple', 'Royal Enclosure', 'Hampi Bazaar', 'Coracle Ride']),
        rating: 4.9,
        totalReviews: 178,
        maxPeople: 8,
      },
    }),
    prisma.travelPackage.create({
      data: {
        name: 'Gokarna Beach Weekend',
        destinationId: gokarna.id,
        description: 'Quick 2-day beach getaway to Gokarna\'s pristine beaches. Perfect for budget travellers.',
        coverImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800',
        images: JSON.stringify(['https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800']),
        price: 3200,
        duration: 2,
        isMini: true,
        includes: JSON.stringify(['Beach Hut', 'Breakfast', 'Boat Ride', 'Temple Visit']),
        highlights: JSON.stringify(['Om Beach', 'Mahabaleshwar Temple', 'Half Moon Beach', 'Sunset Point']),
        rating: 4.5,
        totalReviews: 312,
        maxPeople: 15,
      },
    }),
    prisma.travelPackage.create({
      data: {
        name: 'Wayanad Wilderness Retreat',
        destinationId: wayanad.id,
        description: 'Immerse yourself in Kerala\'s wildlife and nature for 4 days. Treehouse stays, jeep safaris, and spice garden visits.',
        coverImage: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800',
        images: JSON.stringify(['https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800']),
        price: 18500,
        duration: 4,
        isMini: false,
        includes: JSON.stringify(['Treehouse / Jungle Cottage', 'All Meals', 'Jeep Safari', 'Naturalist Guide', 'Spice Garden Tour', 'Edakkal Caves Visit']),
        highlights: JSON.stringify(['Chembra Peak Trek', 'Wayanad Wildlife Sanctuary', 'Banasura Sagar Dam', 'Edakkal Caves', 'Pookode Lake']),
        rating: 4.7,
        totalReviews: 201,
        maxPeople: 10,
      },
    }),
    prisma.travelPackage.create({
      data: {
        name: 'Chikmagalur Day Trip',
        destinationId: destinations[4].id,
        description: 'A budget-friendly 1-day mini package to explore Chikmagalur\'s coffee estates and scenic viewpoints.',
        coverImage: 'https://images.unsplash.com/photo-1569144157591-c60f3f82f137?w=800',
        images: JSON.stringify(['https://images.unsplash.com/photo-1569144157591-c60f3f82f137?w=800']),
        price: 1800,
        duration: 1,
        isMini: true,
        includes: JSON.stringify(['Transport', 'Lunch', 'Coffee Estate Tour', 'Guide']),
        highlights: JSON.stringify(['Mullayanagiri Peak', 'Bhadra Wildlife Sanctuary', 'Coffee Plantation Walk', 'Hebbe Falls']),
        rating: 4.4,
        totalReviews: 156,
        maxPeople: 20,
      },
    }),
  ]);

  console.log('✅ Packages created');

  // Virtual Tours
  await Promise.all([
    prisma.virtualTour.create({
      data: {
        destinationId: coorg.id,
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        images360: JSON.stringify([
          'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=1200',
          'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200',
        ]),
        description: 'Experience the misty hills, coffee plantations, and stunning waterfalls of Coorg in our virtual tour.',
        highlights: JSON.stringify(['Abbey Falls view', 'Coffee plantation walkthrough', 'Raja\'s Seat at sunset', 'Madikeri Fort']),
      },
    }),
    prisma.virtualTour.create({
      data: {
        destinationId: hampi.id,
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        images360: JSON.stringify([
          'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=1200',
        ]),
        description: 'Walk through the ancient ruins of the Vijayanagara Empire in this immersive virtual experience.',
        highlights: JSON.stringify(['Virupaksha Temple', 'Vittala Temple stone chariot', 'Hampi Bazaar', 'Royal Enclosure']),
      },
    }),
    prisma.virtualTour.create({
      data: {
        destinationId: wayanad.id,
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        images360: JSON.stringify([
          'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=1200',
        ]),
        description: 'Discover Wayanad\'s lush jungle, wildlife, and stunning landscapes before you book.',
        highlights: JSON.stringify(['Chembra Peak panorama', 'Banasura Sagar Dam', 'Edakkal Caves', 'Wildlife sightings']),
      },
    }),
  ]);

  console.log('✅ Virtual tours created');

  // Reviews (testimonials)
  await Promise.all([
    prisma.review.create({
      data: {
        userId: user1.id,
        type: 'package',
        packageId: packages[0].id,
        rating: 5,
        comment: 'Absolutely magical experience! The coffee plantation walk was something out of a dream. JourniX made everything seamless — from booking to checkout. Highly recommend the Coorg package!',
        isVerified: true,
      },
    }),
    prisma.review.create({
      data: {
        userId: user2.id,
        type: 'destination',
        destinationId: hampi.id,
        rating: 5,
        comment: 'Hampi is truly a hidden treasure. The Raju\'s auto-rickshaw tour was the highlight — he knew every stone\'s history. JourniX\'s local connections made this trip unforgettable.',
        isVerified: true,
      },
    }),
    prisma.review.create({
      data: {
        userId: admin.id,
        type: 'package',
        packageId: packages[3].id,
        rating: 5,
        comment: 'The Wayanad Wilderness Retreat exceeded all expectations. Staying in a treehouse, the jeep safari at dawn, and the Kerala food — pure bliss. JourniX truly knows local tourism!',
        isVerified: true,
      },
    }),
    prisma.review.create({
      data: {
        userId: user1.id,
        type: 'hotel',
        hotelId: hotels[0].id,
        rating: 4,
        comment: 'Misty Hills Resort is absolutely stunning. Woke up to coffee and valley mist every morning. Great value for money and the staff was incredibly warm.',
        isVerified: true,
      },
    }),
    prisma.review.create({
      data: {
        userId: user2.id,
        type: 'package',
        packageId: packages[2].id,
        rating: 5,
        comment: 'Gokarna on a budget? JourniX made it happen! The mini package covered everything perfectly. Om Beach at sunrise was breathtaking.',
        isVerified: true,
      },
    }),
  ]);

  console.log('✅ Reviews & testimonials created');

  // Rewards for seed users
  await prisma.reward.createMany({
    data: [
      { userId: user1.id, points: 500, type: 'earned', description: 'Points from Coorg package booking' },
      { userId: user1.id, points: 100, type: 'bonus', description: 'Welcome bonus points' },
      { userId: user1.id, points: 50, type: 'earned', description: 'Points for writing a review' },
      { userId: user1.id, points: 200, type: 'earned', description: 'Loyalty milestone bonus' },
      { userId: user2.id, points: 1000, type: 'earned', description: 'Points from Wayanad package booking' },
      { userId: user2.id, points: 100, type: 'bonus', description: 'Welcome bonus points' },
      { userId: user2.id, points: 100, type: 'bonus', description: 'Festival season bonus' },
    ],
  });

  console.log('✅ Rewards seeded');
  console.log('\n🎉 JourniX database seeded successfully!');
  console.log('\n📋 Test Accounts:');
  console.log('   Admin: tharundondapati982@gmail.com / admin123');
  console.log('   User:  priya@example.com / user123');
  console.log('   User:  rahul@example.com / user123');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
