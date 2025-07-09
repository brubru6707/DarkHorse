import { GoogleGenAI } from "@google/genai";
import { NextResponse } from 'next/server';

const GEMAI_API_KEY = process.env.GEMAI_API_KEY;
console.log("GEMAI_API_KEY", GEMAI_API_KEY);

if (!GEMAI_API_KEY) {
    console.error("GEMAI_API_KEY environment variable is not set.");
}

export async function POST(req: Request) {
    try {
        const { data } = await req.json();

        if (!data) {
            return NextResponse.json({ message: 'Missing data in request body' }, { status: 400 });
        }
        console.log("GEMAI_API_KEY", GEMAI_API_KEY);

        const ai = new GoogleGenAI({ apiKey: GEMAI_API_KEY });

        const prompt = `USING THE ATTRIBUTES AND VALUES, OUTPUT ONLY A 1 PARAGRAPH DESCRIPTION OF AN IMAGE DEPECTING THE USER. THE FOLLOWING IS THE DATA:\n\n${JSON.stringify(data, null, 2)}`;

        const response = await ai.models.generateContent({
            model: "gemini-1.5-flash",
            contents: [{ text: prompt }] 
        });

        const responseText = response.text;
        return NextResponse.json({ description: responseText }, { status: 200 });

    } catch (error) {
        console.error("Error generating image description:", error);
        return NextResponse.json({ message: 'Failed to generate description', error: (error as Error).message }, { status: 500 });
    }
}