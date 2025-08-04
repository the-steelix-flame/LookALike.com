import { NextRequest, NextResponse } from 'next/server';
import Ably from 'ably';

export async function GET(req: NextRequest) {
    if (!process.env.ABLY_API_KEY) {
        return NextResponse.json({ error: 'Ably API key not configured' }, { status: 500 });
    }

    // Initialize the Ably SDK on the backend with your main API key
    const client = new Ably.Realtime({ key: process.env.ABLY_API_KEY });

    // Create a token request for the client. This is a temporary, safe key.
    const tokenRequestData = await client.auth.createTokenRequest({ clientId: 'lookalike-user' });

    return NextResponse.json(tokenRequestData);
}
