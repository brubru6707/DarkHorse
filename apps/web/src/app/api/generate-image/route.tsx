import { NextResponse } from 'next/server';
import OpenAI from "openai";
import { writeFile } from "fs/promises";
import sharp from "sharp";

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

if (!OPENAI_API_KEY) {
    console.error("CRITICAL: OPENAI_API_KEY environment variable is not set.");
} else {
    console.log("OPENAI_API_KEY is potentially loaded (top level):", OPENAI_API_KEY.substring(0, 5) + '...');
}

const openai = new OpenAI({
    apiKey: OPENAI_API_KEY,
});

export async function POST(req: Request) {
    if (!OPENAI_API_KEY) {
        console.error("Server configuration error: OPENAI_API_KEY is not defined.");
        return NextResponse.json(
            { message: 'Server configuration error: Image generation API Key missing.' },
            { status: 500 }
        );
    }

    try {
        const { description } = await req.json();

        if (!description || typeof description !== 'string') {
            return NextResponse.json(
                { message: 'Missing or invalid description in request body' },
                { status: 400 }
            );
        }

        const imageResponse = await openai.images.generate({
            model: "gpt-image-1",
            prompt: description,
            n: 1,
            size: "1024x1024",
            quality: "low",
        });

        const base64Image = imageResponse.data?.[0]?.b64_json;

        if (!base64Image) {
            console.warn("No base64 image data received from OpenAI API.");
            return NextResponse.json(
                { message: 'No image generated or base64 data missing.' },
                { status: 500 }
            );
        }

        let imageBuffer = Buffer.from(base64Image, "base64");

        const MAX_IMAGE_SIZE_BYTES = 900 * 1024;
        const TARGET_WIDTH = 512;
        const TARGET_HEIGHT = 512;

        console.log("Original image buffer size:", imageBuffer.length, "bytes");

        let compressedImageBuffer;
        try {
            compressedImageBuffer = await sharp(imageBuffer)
                .resize(TARGET_WIDTH, TARGET_HEIGHT, {
                    fit: sharp.fit.inside,
                    withoutEnlargement: true
                })
                .jpeg({
                    quality: 70,
                    progressive: true
                })
                .toBuffer();

            console.log("Compressed image buffer size:", compressedImageBuffer.length, "bytes");

            if (compressedImageBuffer.length > MAX_IMAGE_SIZE_BYTES) {
                console.warn("Image still too large after initial compression. Attempting more aggressive compression.");
                compressedImageBuffer = await sharp(imageBuffer)
                    .resize(TARGET_WIDTH, TARGET_HEIGHT, { fit: sharp.fit.inside, withoutEnlargement: true })
                    .jpeg({
                        quality: 50,
                        progressive: true
                    })
                    .toBuffer();
                console.log("Aggressively compressed image buffer size:", compressedImageBuffer.length, "bytes");
            }

        } catch (sharpError) {
            console.error("Error compressing image with Sharp:", sharpError);
            compressedImageBuffer = imageBuffer;
        }

        const finalBase64Image = compressedImageBuffer.toString("base64");

        return NextResponse.json(
            { imageUrl: `data:image/jpeg;base64,${finalBase64Image}` },
            { status: 200 }
        );

    } catch (error) {
        console.error("Error generating or processing image:", error);
        return NextResponse.json(
            { message: 'Failed to generate or process image', error: (error as Error).message },
            { status: 500 }
        );
    }
}