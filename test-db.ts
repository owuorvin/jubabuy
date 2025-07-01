import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { createClient } from '@libsql/client';

async function test() {
  console.log('URL:', process.env.TURSO_DATABASE_URL);
  console.log('Token exists:', !!process.env.TURSO_AUTH_TOKEN);
  
  try {
    const client = createClient({
      url: process.env.TURSO_DATABASE_URL!,
      authToken: process.env.TURSO_AUTH_TOKEN!,
    });
    
    await client.execute('SELECT 1');
    console.log('✅ Connection successful!');
  } catch (error: any) {
    console.error('❌ Connection failed:', error.message);
  }
}

test();