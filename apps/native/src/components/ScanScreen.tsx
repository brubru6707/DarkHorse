import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { api } from '../lib/convex';
import { useMutation, useQuery } from "convex/react";
import Header from '../components/Header';
import ScanDataDisplay from '../components/ScanDataDisplay';
import NmapOutputDisplay from '../components/NmapOutputDisplay';
import HistoryTimeline from '../components/History';
import ImageVisualization from '../components/ImageVisualization';
import Recommendation from '../components/Recommendation';

export default function ScanScreen() {
  const logUserData = useMutation(api.logUserData.logUserData);
  const latestDataLogs = useQuery(api.logUserData.getUserDataLogs);
  const navigation = useNavigation();
  const [initialScanAttempted, setInitialScanAttempted] = useState(false);

  const latestDataEntry = useMemo(() => {
    if (!latestDataLogs || latestDataLogs.length === 0) return null;
    return latestDataLogs[latestDataLogs.length - 1];
  }, [latestDataLogs]);

  const sendUserData = useCallback(async () => {
    try {
      const data = await collectClientData();
      await logUserData({ data });
      console.log("User data logged successfully.");
    } catch (error) {
      console.error("Failed to log user data:", error);
      navigation.navigate('Auth');
    }
  }, [logUserData, navigation]);

  useEffect(() => {
    if (latestDataLogs !== undefined && latestDataLogs?.length === 0 && !initialScanAttempted) {
      sendUserData();
      setInitialScanAttempted(true);
    }
  }, [latestDataLogs, initialScanAttempted, sendUserData]);

  const handleStartNewScan = useCallback(() => {
    sendUserData();
  }, [sendUserData]);

  return (
    <View style={styles.container}>
      <Header />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.scanButtonContainer}>
          <TouchableOpacity
            style={styles.newScanButton}
            onPress={handleStartNewScan}
          >
            <Text style={styles.newScanButtonText}>Start New Scan?</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.grid}>
          <View style={styles.column}>
            <NmapOutputDisplay
              latestData={latestDataEntry?.data ?? {}}
              logId={latestDataEntry?._id ?? null}
              previousNmapData={latestDataEntry?.nmapData ?? null}
            />
            <ScanDataDisplay data={latestDataEntry?.data ?? {}} />
          </View>

          <View style={styles.column}>
            <View style={styles.imageContainer}>
              <ImageVisualization
                latestData={latestDataEntry?.data ?? {}}
                logId={latestDataEntry?._id ?? null}
                previousImageURL={latestDataEntry?.imageURL ?? null}
                previousImageDescription={latestDataEntry?.imageDescription ?? null}
              />
              <Text style={styles.imageCaption}>Is this you? 👀</Text>
            </View>
            <View style={styles.recommendationContainer}>
              <Recommendation
                latestData={latestDataEntry?.data ?? {}}
                logId={latestDataEntry?._id ?? null}
                previousRecommendation={latestDataEntry?.recommendations ?? null}
              />
            </View>
          </View>
        </View>
        
        <HistoryTimeline
          historicalEntries={
            latestDataLogs?.map(entry => ({
              id: entry._id as string,
              timestamp: new Date(entry.timestamp).toISOString(),
              data: entry.data,
              nmapData: entry.nmapData ?? '',
              imageDescription: entry.imageDescription ?? '',
              imageURL: entry.imageURL ?? '',
              recommendation: entry.recommendations ?? ''
            })) ?? []
          }
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0d120d',
  },
  content: {
    padding: 16,
  },
  scanButtonContainer: {
    alignItems: 'center',
    marginVertical: 16,
  },
  newScanButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#00cc00',
    borderRadius: 4,
    paddingHorizontal: 32,
    paddingVertical: 12,
  },
  newScanButtonText: {
    color: '#00cc00',
    fontSize: 18,
  },
  grid: {
    flexDirection: 'column',
  },
  column: {
    marginBottom: 16,
  },
  imageContainer: {
    backgroundColor: 'black',
    padding: 16,
    borderWidth: 1,
    borderColor: '#00cc00',
    borderRadius: 4,
    marginBottom: 16,
  },
  imageCaption: {
    color: 'white',
    textAlign: 'center',
    fontSize: 18,
    marginTop: 8,
  },
  recommendationContainer: {
    backgroundColor: 'black',
    padding: 16,
    borderWidth: 1,
    borderColor: '#00cc00',
    borderRadius: 4,
  },
});