import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

// This function will handle GET requests to /api/users/count
export async function GET() {
  try {
    // A simple and efficient SQL query to count all rows in the users table
    const { rows } = await sql`SELECT COUNT(*) FROM users;`;
    const userCount = parseInt(rows[0].count, 10);

    return NextResponse.json({ count: userCount });
  } catch (error) {
    console.error('Error fetching user count:', error);
    // Return a default value or an error
    return NextResponse.json({ error: 'Failed to fetch user count' }, { status: 500 });
  }
}
