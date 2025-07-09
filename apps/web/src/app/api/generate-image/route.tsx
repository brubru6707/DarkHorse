import { GoogleGenAI } from "@google/genai";
import { NextResponse } from 'next/server';

const GEMAI_API_KEY = process.env.GEMAI_API_KEY;

if (!GEMAI_API_KEY) {
    console.error("CRITICAL: GEMAI_API_KEY environment variable is not set.");
} else {
    console.log("GEMAI_API_KEY is potentially loaded (top level):", GEMAI_API_KEY.substring(0, 5) + '...');
}

export async function POST(req: Request) {
    if (!GEMAI_API_KEY) {
        console.error("Server configuration error: GEMAI_API_KEY is not defined.");
        return NextResponse.json(
            { message: 'Server configuration error: Image generation API Key missing.' },
            { status: 500 }
        );
    }

    const ai = new GoogleGenAI({ apiKey: GEMAI_API_KEY });

    try {
        const { description } = await req.json();

        if (!description || typeof description !== 'string') {
            return NextResponse.json(
                { message: 'Missing or invalid description in request body' },
                { status: 400 }
            );
        }

        console.log("Generating image for description:", description);

        const response = await ai.models.generateImages({
            model: 'imagen-4.0-generate-preview-06-06',
            prompt: description,
        });

        let imgBytes = response.generatedImages?.[0]?.image?.imageBytes;

        if (!imgBytes) {
            console.warn("No image bytes received from Gemini API.");
            return NextResponse.json(
                { message: 'No image generated or image bytes missing.' },
                { status: 500 }
            );
        }

        const base64Image = imgBytes;
        
        return NextResponse.json(
            { imageUrl: `data:image/png;base64,${base64Image}` },
            { status: 200 }
        );

    } catch (error) {
        console.error("Error generating image:", error);
        return NextResponse.json(
            { message: 'Failed to generate image', error: (error as Error).message },
            { status: 500 }
        );
    }
}