import Offer from '../models/Offer';

export default async function seedData() {
  try {
    const offerCount = await Offer.countDocuments();
    if (offerCount === 0) {
      console.log('Seeding initial data...');
      await Offer.insertMany([
        {
          title: 'Summer Getaway',
          description: '20% off on all hotel bookings',
          discount: '20%',
          validUntil: new Date(new Date().setMonth(new Date().getMonth() + 2)),
          category: 'hotel',
          code: 'SUMMER20'
        },
        {
          title: 'First Ride Free',
          description: 'Up to $15 off your first cab ride',
          discount: '$15',
          validUntil: new Date(new Date().setMonth(new Date().getMonth() + 1)),
          category: 'cab',
          code: 'FIRST15'
        },
        {
          title: 'Bus Bonanza',
          description: '10% cashback on interstate buses',
          discount: '10%',
          validUntil: new Date(new Date().setMonth(new Date().getMonth() + 3)),
          category: 'bus',
          code: 'BUS10'
        },
        {
          title: 'Student Special',
          description: 'Extra 5% off on all bookings',
          discount: '5%',
          validUntil: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
          category: 'general',
          code: 'STUDENT5'
        }
      ]);
      console.log('Seed data inserted.');
    }
  } catch (error) {
    console.error('Error seeding data:', error);
  }
}
