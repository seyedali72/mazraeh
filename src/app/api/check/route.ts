import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const filename = searchParams.get('filename');
    if (!filename) { return NextResponse.json({ error: 'Filename is required' }, { status: 400 }); }
    const filePath = path.join(process.cwd(), 'public/uploads', filename);
    if (!fs.existsSync(filePath)) { return NextResponse.json({ error: 'File not found' }, { status: 404 }); }
    const fileBuffer = fs.readFileSync(filePath);
    return new Response(fileBuffer, {
        status: 200,
        headers: {
            'Content-Disposition': `inline; filename="${filename}"`,
        },
    });
}
