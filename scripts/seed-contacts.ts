import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedContacts() {
  try {
    // Find the first user (you should replace this with actual user ID)
    const user = await prisma.user.findFirst();
    
    if (!user) {
      console.log('No users found. Please create a user first.');
      return;
    }

    console.log(`Seeding data for user: ${user.email}`);

    // Create sample contacts
    const contacts = [
      {
        userId: user.id,
        name: 'Sarah Johnson',
        title: 'CEO',
        company: 'Tech Innovations',
        email: 'sarah@techinnovations.com',
        phone: '+1-555-0123',
        status: 'new',
        tags: ['tech', 'startup'],
      },
      {
        userId: user.id,
        name: 'Michael Chen',
        title: 'CTO',
        company: 'Digital Solutions',
        email: 'michael@digitalsolutions.com',
        phone: '+1-555-0456',
        status: 'active',
        tags: ['tech', 'development'],
        lastContact: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
      },
      {
        userId: user.id,
        name: 'Emma Williams',
        title: 'Designer',
        company: 'Creative Agency',
        email: 'emma@creativeagency.com',
        phone: '+1-555-0789',
        status: 'pending',
        tags: ['design', 'creative'],
        lastContact: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      },
      {
        userId: user.id,
        name: 'David Rodriguez',
        title: 'Marketing Director',
        company: 'Growth Labs',
        email: 'david@growthlabs.com',
        phone: '+1-555-0321',
        status: 'active',
        tags: ['marketing', 'growth'],
        lastContact: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
      },
      {
        userId: user.id,
        name: 'Lisa Park',
        title: 'Sales Manager',
        company: 'Business Solutions Inc',
        email: 'lisa@businesssolutions.com',
        phone: '+1-555-0654',
        status: 'new',
        tags: ['sales', 'business'],
      },
    ];

    // Create contacts
    for (const contact of contacts) {
      await prisma.contact.create({
        data: contact,
      });
    }

    // Create some OCR responses to increase the cards scanned count
    const ocrResponses = [
      {
        userId: user.id,
        originalName: 'business-card-1.jpg',
        extractedText: 'Sarah Johnson\nCEO\nTech Innovations\nsarah@techinnovations.com\n+1-555-0123',
        imageSize: 1024000,
        mimeType: 'image/jpeg',
        processingTime: 1500,
        isDemo: false,
      },
      {
        userId: user.id,
        originalName: 'business-card-2.jpg',
        extractedText: 'Michael Chen\nCTO\nDigital Solutions\nmichael@digitalsolutions.com\n+1-555-0456',
        imageSize: 896000,
        mimeType: 'image/jpeg',
        processingTime: 1200,
        isDemo: false,
      },
      {
        userId: user.id,
        originalName: 'business-card-3.jpg',
        extractedText: 'Emma Williams\nDesigner\nCreative Agency\nemma@creativeagency.com\n+1-555-0789',
        imageSize: 1200000,
        mimeType: 'image/png',
        processingTime: 1800,
        isDemo: false,
      },
    ];

    for (const ocrResponse of ocrResponses) {
      await prisma.ocrResponse.create({
        data: ocrResponse,
      });
    }


    console.log('Sample data created successfully!');
  } catch (error) {
    console.error('Error seeding data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedContacts();
