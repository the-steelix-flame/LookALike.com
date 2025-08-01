import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';
import { toSql } from 'pgvector/utils'; // FIX: Import 'toSql' directly

export async function POST(req: NextRequest) {
  try {
    // 1. Parse the request body to get the embedding vector from the frontend
    const { embedding } = await req.json();

    // 2. Validate that the embedding exists and is an array
    if (!embedding || !Array.isArray(embedding)) {
      return NextResponse.json({ error: 'Invalid embedding provided' }, { status: 400 });
    }

    // 3. Convert the JavaScript array into the SQL format required by pgvector
    const embeddingSql = toSql(embedding); // FIX: Use 'toSql' directly

    // 4. Execute the similarity search query against your Neon database
    // The '<=>' operator calculates the cosine distance (a smaller number is a better match)
    // We calculate `1 - distance` to get a more intuitive similarity score (0 to 1)
    const { rows } = await sql`
      SELECT
        id,
        display_name,
        profile_pic_url,
        1 - (embedding <=> ${embeddingSql}) AS similarity
      FROM
        users
      WHERE
        embedding IS NOT NULL -- Only search users who have a registered embedding
      ORDER BY
        embedding <=> ${embeddingSql} -- Order by the distance to find the closest matches
      LIMIT 3; -- Return the top 3 results
    `;

    // 5. Return the search results as JSON
    return NextResponse.json({ results: rows }, { status: 200 });

  } catch (error) {
    // If any error occurs in the process, log it and return a generic server error
    console.error('Error in lookalike search API:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
