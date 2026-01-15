import pg from 'pg';
import bcrypt from 'bcryptjs';
import * as dotenv from 'dotenv';

dotenv.config();

const { Client } = pg;

async function main() {
  const email = process.env.ADMIN_EMAIL || 'admin@healthnutritionhacks.com';
  const password = process.env.ADMIN_PASSWORD || 'admin123456';
  const name = process.env.ADMIN_NAME || 'Admin';

  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });

  await client.connect();

  try {
    // Check if user already exists
    const existing = await client.query(
      'SELECT id FROM "User" WHERE email = $1',
      [email]
    );

    if (existing.rows.length > 0) {
      console.log('Admin user already exists:', email);
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const id = `cuid_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    await client.query(
      `INSERT INTO "User" (id, email, password, name, role, "createdAt", "updatedAt") 
       VALUES ($1, $2, $3, $4, $5, NOW(), NOW())`,
      [id, email, hashedPassword, name, 'ADMIN']
    );

    console.log('✅ Admin user created successfully!');
    console.log('📧 Email:', email);
    console.log('🔑 Password:', password);
    console.log('\n⚠️  Please change the default password after first login!');
  } finally {
    await client.end();
  }
}

main().catch((e) => {
  console.error('Error seeding admin:', e);
  process.exit(1);
});
