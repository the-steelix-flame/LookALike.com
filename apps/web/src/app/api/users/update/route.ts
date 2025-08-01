import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';
import { toSql } from 'pgvector/utils';

// This function will handle POST requests to /api/users/update
export async function POST(req: NextRequest) {
    try {
        const { userId, displayName, profilePic_base64 } = await req.json();
        const origin = req.nextUrl.origin;

        // Basic validation
        if (!userId || !displayName) {
            return NextResponse.json({ error: 'User ID and display name are required.' }, { status: 400 });
        }

        // If a new profile picture is provided, process it
        if (profilePic_base64) {
            // Step 1: Get a new embedding for the uploaded profile picture
            const embeddingRes = await fetch(`${origin}/api/generate_embedding`, {
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

            // Step 2: In a real app, you would upload the base64 image to a service
            // like Firebase Storage here and get a public URL. For this example,
            // we'll use a placeholder URL, but the embedding will be real.
            const newProfilePicUrl = 'https://placehold.co/128x128/FBBF24/FFFFFF?text=New+Pic';

            // Step 3: Update the user's record with all new information
            await sql`
        UPDATE users
        SET 
          display_name = ${displayName},
          profile_pic_url = ${newProfilePicUrl},
          embedding = ${embeddingSql}
        WHERE id = ${userId};
      `;

        } else {
            // If no new picture is provided, only update the display name
            await sql`
        UPDATE users
        SET display_name = ${displayName}
        WHERE id = ${userId};
      `;
        }

        return NextResponse.json({ message: 'Profile updated successfully.' }, { status: 200 });

    } catch (error) {
        console.error('Error updating user profile:', error);
        const errorMessage = error instanceof Error ? error.message : 'Internal Server Error';
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
}
