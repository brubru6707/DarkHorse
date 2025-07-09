"use client";

import { useEffect, useState } from "react";
import { api } from "../../../../../packages/backend/convex/_generated/api";
import { useMutation, useQuery } from "convex/react";
import { collectClientData } from "@/lib/collectClientData";
import PixelatedImageDisplay from "@/components/darkhorse/pixelate";

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

async function runNmapScan(ip: string) {
  const res = await fetch("/api/scan", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ip }),
  });

  const data = await res.json();
  return data.result;
}

export default function DarkHorsePage() {
  const logUserData = useMutation(api.logUserData.logUserData);
  const latestData = useQuery(api.logUserData.getUserDataLogs);

  const [imageDescription, setImageDescription] = useState<string | null>(null);
  const [imageURL, setImageURL] = useState<string | null>(null);
  const [nmapOutput, setNmapOutput] = useState<string | null>(null);

  useEffect(() => {
    const sendUserData = async () => {
      try {
        const data = await collectClientData();
        await logUserData({ data });
      } catch (error) {
        console.error("Failed to log user data:", error);
      }
    };

    sendUserData();
  }, [logUserData]);

  useEffect(() => {
    const generate = async () => {
      if (!latestData) return;
      const description = await getImageDescription(latestData[0].data);
      setImageDescription(description ?? null);
      if (description !== null) {
        const image = await generateImageFromDescription(description);
        setImageURL(image);
      }
    };

    generate();
  }, [latestData]);

  useEffect(() => {
    if (!latestData?.[0]?.data?.ip) return;
    console.log("found ip")
    const scan = async () => {
      const result = await runNmapScan(latestData?.[0]?.data?.ip);
      setNmapOutput(result);
    };
  
    scan();
  }, [latestData]);

  const base64Only = imageURL ? imageURL.split(',')[1] : null;

  return (
    <main className="p-6">
      <h1 className="text-3xl font-bold mb-2">DarkHorse 🕵️</h1>
      <p className="mb-4">Below is a visualization of the data we collected about your device:</p>

      {base64Only  ? ( // Check if base64Only exists
                <div style={{ marginTop: '20px' }}>
                    <h2>Pixelated Visualization:</h2>
                    <PixelatedImageDisplay
                        base64Image={base64Only}
                        pixelationFactor={10} // You can adjust this value (e.g., 5 for more, 20 for less detail)
                    />
                </div>
            ) : (
                // Show a loading indicator or placeholder while image is being generated
                <p>Generating image visualization...</p>
            )}

      {imageDescription && (
        <p className="italic text-gray-600 mb-4">"{imageDescription}"</p>
      )}

      {nmapOutput && (
        <pre className="bg-black text-green-300 p-4 rounded-xl overflow-x-auto max-w-xl text-sm">
          {nmapOutput}
        </pre>
      )}

      <pre className="bg-black text-green-300 p-4 rounded-xl overflow-x-auto max-w-xl text-sm">
        {JSON.stringify(latestData?.[0]?.data, null, 2)}
      </pre>
    </main>
  );
}
