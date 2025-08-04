import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';
import { toSql } from 'pgvector/utils';

export async function POST(req: NextRequest) {
  try {
    const { userId, displayName, profilePicUrl, profilePic_base64 } = await req.json();
    const aiServiceUrl = process.env.NEXT_PUBLIC_AI_SERVICE_URL;

    if (!userId || !displayName) {
      return NextResponse.json({ error: 'User ID and display name are required.' }, { status: 400 });
    }

    // If a new image was uploaded (we can tell by the presence of the base64 string)
    if (profilePic_base64) {
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

      // Now we save the REAL URL from Firebase Storage
      await sql`
        UPDATE users
        SET 
          display_name = ${displayName},
          profile_pic_url = ${profilePicUrl},
          embedding = ${embeddingSql}
        WHERE id = ${userId};
      `;
    } else {
      // If no new picture was uploaded, only update the name
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
