/**
 * Seed script to create demo users for TIBYAN platform
 * Run with: node scripts/seed-users.js
 */

const { MongoClient } = require('mongodb');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/tibyan';

const demoUsers = [
  {
    email: 'admin@tibyan.com',
    name: 'مدير النظام',
    role: 'admin',
    avatar: null,
    department: 'إدارة النظام',
    isActive: true,
    preferences: {
      language: 'ar',
      theme: 'light',
      notifications: true,
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    email: 'service@tibyan.com',
    name: 'موظف خدمة العملاء',
    role: 'customer_service',
    avatar: null,
    department: 'خدمة العملاء',
    isActive: true,
    preferences: {
      language: 'ar',
      theme: 'light',
      notifications: true,
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    email: 'supervisor@tibyan.com',
    name: 'مشرف الجودة',
    role: 'quality_supervisor',
    avatar: null,
    department: 'الجودة والمراقبة',
    isActive: true,
    preferences: {
      language: 'ar',
      theme: 'light',
      notifications: true,
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    email: 'analyst@tibyan.com',
    name: 'محلل البيانات',
    role: 'data_analyst',
    avatar: null,
    department: 'التحليلات والبيانات',
    isActive: true,
    preferences: {
      language: 'ar',
      theme: 'light',
      notifications: true,
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    email: 'pr@tibyan.com',
    name: 'مدير العلاقات العامة',
    role: 'pr_manager',
    avatar: null,
    department: 'العلاقات العامة',
    isActive: true,
    preferences: {
      language: 'ar',
      theme: 'light',
      notifications: true,
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

async function seedUsers() {
  let client;
  
  try {
    console.log('🔗 Connecting to MongoDB...');
    client = new MongoClient(MONGODB_URI);
    await client.connect();
    
    const db = client.db();
    const usersCollection = db.collection('users');
    
    console.log('🗑️  Clearing existing users...');
    await usersCollection.deleteMany({});
    
    console.log('👥 Creating demo users...');
    const result = await usersCollection.insertMany(demoUsers);
    
    console.log(`✅ Successfully created ${result.insertedCount} demo users:`);
    demoUsers.forEach(user => {
      console.log(`   - ${user.name} (${user.email}) - ${user.role}`);
    });
    
    console.log('\n🔑 Login credentials for all users:');
    console.log('   Password: password123');
    
    console.log('\n📝 You can now login with any of these accounts:');
    demoUsers.forEach(user => {
      console.log(`   Email: ${user.email}`);
    });
    
  } catch (error) {
    console.error('❌ Error seeding users:', error);
  } finally {
    if (client) {
      await client.close();
      console.log('\n🔌 MongoDB connection closed');
    }
  }
}

// Run the seed function
seedUsers();
