"use client";

import { useEffect, useState, useRef } from "react";
import { useMutation } from "convex/react";
import { api } from "@packages/backend/convex/_generated/api";
import { Id } from "@packages/backend/convex/_generated/dataModel";

async function generateRecommendation(data: object): Promise<string | null> {
  try {
    const response = await fetch('/api/generate-recommendation', {
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
    return result.recommendation || null;
  } catch (error) {
    console.error("Error calling generate-recommendation API:", error);
    return null;
  }
}

type RecommendationProps = {
  latestData: object | null;
  logId: Id<"userDataLogs"> | null;
  previousRecommendation: string | null;
};

export default function Recommendation({ latestData, logId, previousRecommendation }: RecommendationProps) {
  const [recommendation, setRecommendation] = useState<string | null>(previousRecommendation);
  const updateRecommendation = useMutation(api.logUserData.updateRecommendation);
  const generatingForLogIdRef = useRef<Id<"userDataLogs"> | null>(null);

  // Update recommendation if it's different from the previous one
  useEffect(() => {
    if (previousRecommendation && recommendation !== previousRecommendation) {
      setRecommendation(previousRecommendation);
      generatingForLogIdRef.current = null;
      return;
    }

    if (!latestData || Object.keys(latestData).length === 0 || !logId) {
      if (!previousRecommendation) {
        setRecommendation(null);
      }
      return;
    }

    if (generatingForLogIdRef.current === logId) {
      return;
    }

    if (!previousRecommendation || previousRecommendation.trim() === "") {
      generatingForLogIdRef.current = logId;

      const generate = async () => {
        try {
          const newRecommendation = await generateRecommendation(latestData);

          if (newRecommendation) {
            await updateRecommendation({ id: logId, recommendation: newRecommendation });
            setRecommendation(newRecommendation);
          } else {
            setRecommendation("Failed to generate recommendation.");
          }
        } catch (error) {
          setRecommendation("Error generating recommendation.");
        } finally {
          generatingForLogIdRef.current = null;
        }
      };
      generate();
    }
  }, [latestData, logId, previousRecommendation, updateRecommendation, recommendation]);

  if (recommendation === null) {
    if ((!previousRecommendation || previousRecommendation.trim() === "") && latestData && logId) {
        return <span>Generating recommendation...</span>;
    }
    return <span>No recommendation available.</span>;
  }

  return (
    <div>
      <p className="text-lg font-bold">Recommendation:</p>
      <div className="border border-green-300 rounded-md">
        <pre className="bg-black text-green-300 p-4 rounded-md overflow-x-auto text-xs scrollbar-hide whitespace-pre-wrap break-words">
          {recommendation}
        </pre>
      </div>
    </div>
  );
}