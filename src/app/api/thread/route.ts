import { NextRequest, NextResponse } from "next/server";

export const POST = async (request: NextRequest) => {

    // Check if the request is a POST method
    if (request.method !== 'POST') {
        return new NextResponse('Method Not Allowed', { status: 405 });
    }

    try {
        // Make sure the API base URL is correctly set
        const baseUrl = process.env.API_BASE_URL;
        if (!baseUrl) {
            throw new Error("API base URL is not set.");
        }
        
        // Request a new thread ID from backend
        const response = await fetch(`${baseUrl}/threads`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        const threadId = data.threadId;

        // Prepare the response with the new thread ID
        const jsonResponse = new NextResponse(JSON.stringify({ threadId }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });

        // Set the cookie with threadId
        jsonResponse.cookies.set('threadId', threadId, {
            path: '/',
            httpOnly: true,
            sameSite: 'strict',
            maxAge: 60 * 60 * 24 * 7 // 7 days
        });

        return jsonResponse;

    } catch (error) {
        console.error('Failed to generate new thread ID:', error);
        return new NextResponse(JSON.stringify({ error: 'Failed to generate new thread ID' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}
