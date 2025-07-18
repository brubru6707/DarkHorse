"use client";

import React, { useEffect, useState } from "react";
import PixelatedImageDisplay from "@/components/scan/pixelate";
import { useMutation } from "convex/react";
import { api } from "@packages/backend/convex/_generated/api";
import { Id } from "@packages/backend/convex/_generated/dataModel";

async function getImageDescription(data: object): Promise<string | null> {
  try {
    const response = await fetch('/api/generate-description', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ data }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('API Error:', errorData.message);
      return null;
    }

    const result = await response.json();
    return result.description || null;
  } catch (error) {
    console.error("Error calling generate-description API:", error);
    return null;
  }
}

async function generateImageFromDescription(description: string): Promise<string | null> {
  try {
    const response = await fetch('/api/generate-image', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ description }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Image Generation API Error:', errorData.message);
      return null;
    }

    const result = await response.json();
    return result.imageUrl || null;
  } catch (error) {
    console.error("Error calling generate-image API:", error);
    return null;
  }
}

interface ImageVisualizationProps {
  latestData: object | null;
  logId: Id<"userDataLogs"> | null;
  previousImageURL: string | null;
  previousImageDescription: string | null;
}

export default function ImageVisualization({ latestData, logId, previousImageURL, previousImageDescription }: ImageVisualizationProps) {
  const [imageDescription, setImageDescription] = useState<string | null>(previousImageDescription);
  const [imageURL, setImageURL] = useState<string | null>(previousImageURL);
  const updateImageURL = useMutation(api.logUserData.updateImageURL);
  const updateImageDescription = useMutation(api.logUserData.updateImageDescription);

  const generationAttemptedForLogIdRef = React.useRef<Id<"userDataLogs"> | null>(null);

  useEffect(() => {
    if (imageDescription !== previousImageDescription) {
      setImageDescription(previousImageDescription);
    }
    if (imageURL !== previousImageURL) {
      setImageURL(previousImageURL);
    }

    if (previousImageDescription && previousImageURL && generationAttemptedForLogIdRef.current === logId) {
      return;
    }

    if (!latestData || Object.keys(latestData).length === 0 || !logId) {
      setImageDescription(null);
      setImageURL(null);
      generationAttemptedForLogIdRef.current = null;
      return;
    }

    if ((!previousImageDescription || !previousImageURL) && generationAttemptedForLogIdRef.current !== logId) {
      generationAttemptedForLogIdRef.current = logId;

      const generateContent = async () => {
        try {
          let currentDescription = previousImageDescription;
          if (!currentDescription) {
            currentDescription = await getImageDescription(latestData);
            if (currentDescription) {
              setImageDescription(currentDescription);
              await updateImageDescription({ id: logId, imageDescription: currentDescription });
            } else {
              console.warn(`[ImageViz] Could not generate description for logId: ${logId}`);
            }
          }

          if (currentDescription && !previousImageURL) {
            const image = await generateImageFromDescription(currentDescription);
            if (image) {
              setImageURL(image);
              await updateImageURL({ id: logId, imageURL: image });
            } else {
              console.warn(`[ImageViz] Could not generate image for logId: ${logId}`);
            }
          }
        } catch (error) {
          console.error(`[ImageViz] Error generating image/description for logId ${logId}:`, error);
          setImageDescription(null);
          setImageURL(null);
        }
      };
      generateContent();
    }
  }, [latestData, logId, previousImageDescription, previousImageURL, updateImageDescription, updateImageURL]);

  const base64Only = imageURL ? imageURL.split(',')[1] : null;

  if (!base64Only && !imageDescription) {
    return <p>Generating image visualization...</p>;
  }

  return (
    <>
      {base64Only && (
        <div style={{ marginTop: '20px' }}>
          <h2>Pixelated Visualization:</h2>
          <PixelatedImageDisplay
            base64Image={base64Only}
            pixelationFactor={10}
          />
        </div>
      )}
      {imageDescription && (
        <p className="italic text-gray-600 mb-4">&quot;{imageDescription}&quot;</p>
      )}
    </>
  );
}
