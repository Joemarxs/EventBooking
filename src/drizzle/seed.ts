import db from './db';
import { users, venues, events, payments, customerSupport } from './schema';

async function seed() {
  console.log('Seeding started...');

  // Insert Users
  const insertedUsers = await db
    .insert(users)
    .values([
      {
        firstName: 'Alice',
        lastName: 'Wanjiku',
        email: 'alice@example.com',
        password: 'password123',
        phone: '+254712345678',
        address: 'Karen, Nairobi',
        role: 'customer',
      },
      {
        firstName: 'Bob',
        lastName: 'Otieno',
        email: 'bob@example.com',
        password: 'secure456',
        phone: '+254798765432',
        address: 'Westlands, Nairobi',
        role: 'customer',
      },
    ])
    .returning();

  // Insert Venues
  const insertedVenues = await db
    .insert(venues)
    .values([
      {
        name: 'KICC',
        address: 'Harambee Avenue, Nairobi',
        capacity: 1000,
      },
      {
        name: 'Carnivore Grounds',
        address: 'Langata Road, Nairobi',
        capacity: 500,
      },
    ])
    .returning();

  // Insert Events
  const insertedEvents = await db
    .insert(events)
    .values([
      {
        title: 'Nairobi Tech Fest',
        category: 'tech',
        date: '2025-08-10',
        time: '10:00:00',
        ticketPrice: '1500.00',
        ticketsTotal: 300,
        ticketSold: 0,
        venue_id: insertedVenues[0].venue_id,
      },
      {
        title: 'Afrobeat Live',
        category: 'music',
        date: '2025-08-24',
        time: '18:00:00',
        ticketPrice: '2500.00',
        ticketsTotal: 500,
        ticketSold: 0,
        venue_id: insertedVenues[1].venue_id,
      },
    ])
    .returning();

  // Insert Payments
  const insertedPayments = await db
    .insert(payments)
    .values([
      {
        user_id: insertedUsers[0].user_id,
        event_id: insertedEvents[0].event_id,
        amount: '1500.00',
        paymentStatus: true,
        paymentDate: '2025-07-01',
        paymentMethod: 'mpesa',
        transactionId: 'MP123456',
      },
    ])
    .returning();

  // Insert Customer Support Ticket
  await db.insert(customerSupport).values([
    {
      user_id: insertedUsers[0].user_id,
      payment_id: insertedPayments[0].payment_id,
      subject: 'Payment not confirmed',
      description: 'I paid via M-Pesa but didn’t get a ticket confirmation.',
      status: 'open',
    },
  ]);

  console.log('✅ Seeding complete!');
  process.exit(0);
}

seed().catch((err) => {
  console.error('❌ Seeding failed:', err);
  process.exit(1);
});
