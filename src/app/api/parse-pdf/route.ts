import { NextRequest, NextResponse } from 'next/server';
import pdfParse from 'pdf-parse';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    // Get the FormData from the request
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    // Check if a file was uploaded
    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // Validate file type (must be a PDF)
    if (file.type !== 'application/pdf') {
      return NextResponse.json({ error: 'Invalid file type. Please upload a PDF.' }, { status: 400 });
    }

    // Convert the File to a Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Parse the PDF
    const data = await pdfParse(buffer);
    const text = data.text;

    return NextResponse.json({ text });
  } catch (error) {
    console.error('PDF parsing error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to parse PDF', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      }, 
      { status: 500 }
    );
  }
}