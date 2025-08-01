    import { NextRequest, NextResponse } from 'next/server';
    import { sql } from '@vercel/postgres';

    export async function POST(req: NextRequest) {
      try {
        const { uid, email, displayName } = await req.json();

        if (!uid || !email) {
          return NextResponse.json({ error: 'Missing UID or email' }, { status: 400 });
        }

        // Upsert logic: Insert user if they don't exist.
        // ON CONFLICT (id) DO NOTHING ensures we don't get an error if the user
        // signs in with Google multiple times, for example.
        await sql`
          INSERT INTO users (id, email, display_name)
          VALUES (${uid}, ${email}, ${displayName})
          ON CONFLICT (id) DO NOTHING;
        `;

        return NextResponse.json({ message: 'User registered successfully' }, { status: 201 });
      } catch (error) {
        console.error('Error in /api/users/register:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
      }
    }
    