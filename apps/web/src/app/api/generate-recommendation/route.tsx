import { GoogleGenAI } from "@google/genai";
import { NextResponse } from 'next/server';

const GEMAI_API_KEY = process.env.GEMAI_API_KEY;

if (!GEMAI_API_KEY) {
    console.error("GEMAI_API_KEY environment variable is not set.");
}

export async function POST(req: Request) {
    try {
        const { data } = await req.json();

        if (!data) {
            return NextResponse.json({ message: 'Missing data in request body' }, { status: 400 });
        }

        const ai = new GoogleGenAI({ apiKey: GEMAI_API_KEY });

        const prompt = `USING THE ATTRIBUTES AND VALUES, OUTPUT 3 PARAGRAPH RECOMMENDATIONS FOR THE USER TO BE SAFER ONLINE. THE FOLLOWING IS THE DATA:\n\n${JSON.stringify(data, null, 2)}`;

        const response = await ai.models.generateContent({
            model: "gemini-2.0-flash-lite",
            contents: [{ text: prompt }] 
        });

        const responseText = response.text;
        return NextResponse.json({ recommendation: responseText }, { status: 200 });

    } catch (error) {
        console.error("Error generating image recommendation:", error);
        return NextResponse.json({ message: 'Failed to generate recommendation', error: (error as Error).message }, { status: 500 });
    }
}