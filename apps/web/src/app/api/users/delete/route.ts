import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';
import admin from 'firebase-admin';
import path from 'path';
import fs from 'fs/promises'; // Use the modern file system promises API

// --- Firebase Admin Initialization ---
async function initializeFirebaseAdmin() {
    if (admin.apps.length > 0) {
        return;
    }

    try {
        console.log("Attempting to initialize Firebase Admin SDK...");

        let serviceAccount;
        if (process.env.NODE_ENV === 'production' && process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
            serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
        } else if (process.env.FIREBASE_ADMIN_PRIVATE_KEY_PATH) {
            // FIX: Use fs.readFile instead of require()
            const keyPath = path.resolve(process.cwd(), process.env.FIREBASE_ADMIN_PRIVATE_KEY_PATH);
            const keyFile = await fs.readFile(keyPath, 'utf-8');
            serviceAccount = JSON.parse(keyFile);
        } else {
            throw new Error("Firebase Admin credentials not found.");
        }

        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
        });
        console.log("Firebase Admin SDK initialized successfully.");
    } catch (error) {
        console.error('FIREBASE ADMIN INITIALIZATION ERROR:', error);
    }
}
// ------------------------------------

export async function POST(req: NextRequest) {
    try {
        await initializeFirebaseAdmin(); // Ensure Firebase Admin is initialized

        const { userId } = await req.json();

        if (!userId) {
            return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
        }

        console.log(`API: Attempting to delete user: ${userId}`);

        await admin.auth().deleteUser(userId);
        console.log(`API: Successfully deleted user ${userId} from Firebase Auth.`);

        await sql`DELETE FROM users WHERE id = ${userId};`;
        console.log(`API: Successfully deleted user ${userId} from PostgreSQL database.`);

        return NextResponse.json({ message: 'Account completely deleted.' }, { status: 200 });
    } catch (error) {
        console.error('API Error in /api/users/delete:', error);

        // FIX: Check if error is an object with a 'code' property
        if (typeof error === 'object' && error !== null && 'code' in error && error.code === 'auth/user-not-found') {
            return NextResponse.json({ error: 'User not found in authentication system.' }, { status: 404 });
        }

        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
