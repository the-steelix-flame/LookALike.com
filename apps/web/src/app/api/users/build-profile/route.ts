import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';
import { toSql } from 'pgvector/utils';

// This function calculates the average of multiple embedding vectors.
function calculateAverageEmbedding(embeddings: number[][]): number[] {
    if (embeddings.length === 0) return [];

    const vectorLength = embeddings[0].length;
    const averageVector = new Array(vectorLength).fill(0);

    for (const embedding of embeddings) {
        for (let i = 0; i < vectorLength; i++) {
            averageVector[i] += embedding[i];
        }
    }

    for (let i = 0; i < vectorLength; i++) {
        averageVector[i] /= embeddings.length;
    }

    return averageVector;
}

export async function POST(req: NextRequest) {
    try {
        const { userId, images_base64 } = await req.json();

        if (!userId || !images_base64 || !Array.isArray(images_base64) || images_base64.length === 0) {
            return NextResponse.json({ error: 'User ID and images are required.' }, { status: 400 });
        }

        const allEmbeddings: number[][] = [];
        const origin = req.nextUrl.origin; // Get the base URL (e.g., http://localhost:3000)

        // Process each image to get its embedding
        for (const image of images_base64) {
            try {
                const response = await fetch(`${origin}/api/generate_embedding`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ image_base64: image }),
                });
                if (response.ok) {
                    const { embedding } = await response.json();
                    allEmbeddings.push(embedding);
                }
            } catch (e) {
                // Log error but continue, so one bad image doesn't stop the whole process
                console.error("Could not process one of the images:", e);
            }
        }

        if (allEmbeddings.length === 0) {
            // More lenient and helpful error message
            return NextResponse.json({ error: "We couldn't create a profile from the uploaded images. This can sometimes happen due to lighting or angles. Please try again with a few different photos." }, { status: 400 });
        }

        // Calculate the average embedding
        const averageEmbedding = calculateAverageEmbedding(allEmbeddings);
        const embeddingSql = toSql(averageEmbedding);

        // Update the user's record in the database with the new average embedding
        await sql`
      UPDATE users
      SET embedding = ${embeddingSql}
      WHERE id = ${userId};
    `;

        return NextResponse.json({ message: 'Profile built successfully' }, { status: 200 });

    } catch (error) {
        console.error('Error building profile:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
