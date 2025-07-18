import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useMutation } from 'convex/react';
import { api } from '@packages/backend/convex/_generated/api';
import { Id } from '@packages/backend/convex/_generated/dataModel';

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

    generatingForLogIdRef.current = logId;

    const generate = async () => {
      console.log("Generating new recommendation for logId:", logId);
      const newRecommendation = await generateRecommendation(latestData);

      if (newRecommendation) {
        console.log("Updating recommendation in DB for logId:", logId);
        await updateRecommendation({ id: logId, recommendation: newRecommendation });
        setRecommendation(newRecommendation);
        generatingForLogIdRef.current = null;
      } else {
        console.log("Failed to generate recommendation.");
        setRecommendation(null);
        generatingForLogIdRef.current = null;
      }
    };

    if (!previousRecommendation) {
      generate();
    }
  }, [latestData, logId, previousRecommendation, updateRecommendation, recommendation]);

  if (recommendation === null) {
    if (!previousRecommendation && latestData && logId) {
      return <Text style={styles.loadingText}>Generating recommendation...</Text>;
    }
    return <Text style={styles.noDataText}>No recommendation available.</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Recommendation:</Text>
      <View style={styles.recommendationBox}>
        <Text style={styles.recommendationText}>{recommendation}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#00cc00',
    marginBottom: 8,
  },
  recommendationBox: {
    borderWidth: 1,
    borderColor: '#00cc00',
    borderRadius: 8,
    backgroundColor: 'black',
    padding: 12,
  },
  recommendationText: {
    color: '#00cc00',
    fontSize: 14,
  },
  loadingText: {
    color: '#666',
    fontStyle: 'italic',
  },
  noDataText: {
    color: '#666',
  },
});