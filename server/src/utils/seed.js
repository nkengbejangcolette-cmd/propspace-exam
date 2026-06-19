import 'dotenv/config';
import mongoose from 'mongoose';
import { connectDB } from '../config/db.js';
import User from '../models/User.js';
import Property from '../models/Property.js';

const run = async () => {
  await connectDB();

  await Property.deleteMany({});
  await User.deleteMany({});

  const demo = await User.create({
    username: 'demo',
    email: 'demo@propspace.app',
    password: 'demo123',
    phone: '+237 600 000 000',
    avatar: '',
  });

  const img = (id) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=1200&q=80`;

  const listings = [
    {
      title: 'Luxury Glass Villa',
      description:
        'A striking glass villa with floor-to-ceiling windows, infinity views and open-plan living spaces.',
      price: 320000, purpose: 'Sale', propertyType: 'House',
      city: 'Buea', country: 'Cameroon', bedrooms: 4, bathrooms: 3,
      images: [img('1518780664697-55e3ad937233'), img('1564013799919-ab600027ffc6')],
    },
    {
      title: 'Designer City Studio',
      description:
        'A modern studio in the heart of the city with smart appliances and a rooftop terrace.',
      price: 850, purpose: 'Rent', propertyType: 'Studio',
      city: 'Yaoundé', country: 'Cameroon', bedrooms: 1, bathrooms: 1,
      images: [img('1502672260266-1c1ef2d93688'), img('1493809842364-78817add7ffb')],
    },
    {
      title: 'Comfortable Garden Apartment',
      description:
        'Bright two-bedroom apartment with a private garden, natural ventilation and quick access to schools and markets.',
      price: 1200, purpose: 'Rent', propertyType: 'Apartment',
      city: 'Douala', country: 'Cameroon', bedrooms: 2, bathrooms: 2,
      images: [img('1493809842364-78817add7ffb'), img('1512917774080-9991f1c4c750')],
    },
    {
      title: 'Hillside Family House',
      description:
        'Spacious family home with a wraparound porch, mature trees and panoramic mountain views just minutes from town.',
      price: 275000, purpose: 'Sale', propertyType: 'House',
      city: 'Buea', country: 'Cameroon', bedrooms: 5, bathrooms: 4,
      images: [img('1568605114967-8130f3a36994'), img('1570129477492-45c003edd2be')],
    },
    {
      title: 'Minimalist City Studio',
      description:
        'A compact, light-filled studio ideal for students or young professionals, fully furnished and move-in ready.',
      price: 450, purpose: 'Rent', propertyType: 'Studio',
      city: 'Buea', country: 'Cameroon', bedrooms: 1, bathrooms: 1,
      images: [img('1522708323590-d24dbb6b0267'), img('1505691938895-1758d7feb511')],
    },
    {
      title: 'Riverside Apartment',
      description:
        'Calm two-bedroom unit overlooking the river, with a balcony, modern kitchen and secure parking.',
      price: 1500, purpose: 'Rent', propertyType: 'Apartment',
      city: 'Limbe', country: 'Cameroon', bedrooms: 2, bathrooms: 1,
      images: [img('1512918728675-ed5a9ecdebfd'), img('1502005229762-cf1b2da7c5d6')],
    },
  ].map((l) => ({ ...l, owner: demo._id }));

  await Property.insertMany(listings);

  console.log(`Seeded ${listings.length} listings.`);
  console.log('Demo login -> email: demo@propspace.app  password: demo123');

  await mongoose.connection.close();
  process.exit(0);
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
