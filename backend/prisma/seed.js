const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('adminpassword123', 10); // Secure this!

  // Seed Admins
  await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      password: hashedPassword,
      name: 'Admin User',
      role: 'ADMIN',
    },
  });
  await prisma.user.upsert({
    where: { email: 'admin2@example.com' },
    update: {},
    create: {
      email: 'admin2@example.com',
      password: hashedPassword,
      name: 'Admin Two',
      role: 'ADMIN',
    },
  });

  // Seed Services (based on PDF filenames - customize descriptions/prices as needed)
  const services = [
    { name: 'Soins Generaux', description: 'General wellbeing care', duration: 60, price: 50.00, imageUrl: 'https://example.com/soins.jpg' },
    { name: 'Pressotherapie', description: 'Pressotherapy for lymphatic drainage', duration: 45, price: 40.00, imageUrl: 'https://example.com/presso.jpg' },
    { name: 'Anti-Stress', description: 'Stress relief therapy', duration: 90, price: 70.00, imageUrl: 'https://example.com/antistress.jpg' },
    { name: 'Lumino Visage & Corps', description: 'Lumino therapy for face and body', duration: 75, price: 60.00, imageUrl: 'https://example.com/lumino.jpg' },
    { name: 'Aromatherapie', description: 'Aromatherapy session', duration: 60, price: 55.00, imageUrl: 'https://example.com/aroma.jpg' },
    { name: 'Soins Lumino Visage', description: 'Lumino facial care', duration: 50, price: 45.00, imageUrl: 'https://example.com/lumino-visage.jpg' },
  ];

  const createdServices = [];
  for (const service of services) {
    let existingService = await prisma.service.findFirst({
      where: { name: service.name },
    });

    if (!existingService) {
      existingService = await prisma.service.create({
        data: service,
      });
    }

    createdServices.push(existingService);
  }

  // Seed Cabinets
  let existingCabinet = await prisma.cabinet.findFirst({
    where: { name: 'Main Cabinet' },
  });

  if (!existingCabinet) {
    existingCabinet = await prisma.cabinet.create({
      data: {
        name: 'Main Cabinet',
        address: '123 Wellbeing St',
        description: 'Fully equipped with therapy tools and relaxing ambiance',
      },
    });
  }

  // Seed Providers
  const provider = await prisma.user.upsert({
    where: { email: 'provider@example.com' },
    update: {},
    create: {
      email: 'provider@example.com',
      password: hashedPassword,
      name: 'Provider One',
      role: 'PROVIDER',
      phone: '+1234567890',
    },
  });

  // Assign provider to all services
  for (const service of createdServices) {
    await prisma.service.update({
      where: { id: service.id },
      data: { assignedProviders: { connect: { id: provider.id } } },
    });
  }

  console.log('Admins, services, cabinets, and providers seeded successfully');
}

main()
  .catch(e => {
    console.error('Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });