import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';
import { toSql } from 'pgvector/utils';

export async function POST(req: NextRequest) {
  try {
    const { userId, displayName, profilePic_base64 } = await req.json();
    // CHANGE: Use the new environment variable for the AI service URL
    const aiServiceUrl = process.env.NEXT_PUBLIC_AI_SERVICE_URL;

    if (!userId || !displayName) {
      return NextResponse.json({ error: 'User ID and display name are required.' }, { status: 400 });
    }

    if (profilePic_base64) {
      // CHANGE: Call the external AI service
      const embeddingRes = await fetch(`${aiServiceUrl}/generate_embedding`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image_base64: profilePic_base64 }),
      });

      if (!embeddingRes.ok) {
        const errorData = await embeddingRes.json();
        throw new Error(errorData.error || 'Failed to process the new profile picture.');
      }

      const { embedding } = await embeddingRes.json();
      const embeddingSql = toSql(embedding);

      const newProfilePicUrl = 'https://placehold.co/128x128/FBBF24/FFFFFF?text=New+Pic';

      await sql`
        UPDATE users
        SET 
          display_name = ${displayName},
          profile_pic_url = ${newProfilePicUrl},
          embedding = ${embeddingSql}
        WHERE id = ${userId};
      `;
    } else {
      await sql`
        UPDATE users
        SET display_name = ${displayName}
        WHERE id = ${userId};
      `;
    }

    return NextResponse.json({ message: 'Profile updated successfully.' }, { status: 200 });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
