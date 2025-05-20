import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const { question, pdfText } = await req.json();
    console.log('Received request:', { question, hasPdfText: !!pdfText });
    
    const apiKey = process.env.GEMINI_API_KEY;
    console.log('API Key present:', !!apiKey);
    
    if (!apiKey) {
      console.error('Gemini API key not set');
      return NextResponse.json({ error: 'Gemini API key not set' }, { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' }); // Updated to gemini-2.0-flash

    let prompt = question;
    if (pdfText) {
      prompt = `Context from PDF:\n${pdfText}\n\nUser question: ${question}\n\nPlease provide a helpful response based on the PDF context if relevant, or answer the question directly if the PDF context is not applicable.`;
    }
    console.log('Sending prompt to Gemini:', prompt);

    const result = await model.generateContent(prompt);
    console.log('Received result from Gemini');
    
    const response = await result.response;
    console.log('Processed response');
    
    const answer = response.text();
    console.log('Extracted text from response');

    if (!answer) {
      console.error('Empty response from Gemini');
      return NextResponse.json({ error: 'Empty response from Gemini' }, { status: 500 });
    }

    return NextResponse.json({ answer });
  } catch (error) {
    console.error('Detailed Gemini API error:', {
      name: error instanceof Error ? error.name : 'Unknown',
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });
    
    return NextResponse.json({ 
      error: 'Failed to get response from Gemini',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}