import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';
import admin from 'firebase-admin';
import path from 'path';
import fs from 'fs/promises';

async function initializeFirebaseAdmin() {
    if (admin.apps.length > 0) return;
    try {
        let serviceAccount;
        if (process.env.NODE_ENV === 'production' && process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
            serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
        } else if (process.env.FIREBASE_ADMIN_PRIVATE_KEY_PATH) {
            const keyPath = path.resolve(process.cwd(), process.env.FIREBASE_ADMIN_PRIVATE_KEY_PATH);
            const keyFile = await fs.readFile(keyPath, 'utf-8');
            serviceAccount = JSON.parse(keyFile);
        } else {
            throw new Error("Firebase Admin credentials not found.");
        }
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
        });
    } catch (error) {
        console.error('FIREBASE ADMIN INITIALIZATION ERROR:', error);
    }
}

export async function POST(req: NextRequest) {
    try {
        await initializeFirebaseAdmin();
        const { userId } = await req.json();

        if (!userId) {
            return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
        }

        // Firebase Auth must be deleted first
        await admin.auth().deleteUser(userId);

        // Then delete from PostgreSQL
        await sql`DELETE FROM users WHERE id = ${userId};`;

        return NextResponse.json({ message: 'Account completely deleted.' }, { status: 200 });
    } catch (error) {
        console.error('API Error in /api/users/delete:', error);
        if (typeof error === 'object' && error !== null && 'code' in error && error.code === 'auth/user-not-found') {
            return NextResponse.json({ error: 'User not found in authentication system.' }, { status: 404 });
        }
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
