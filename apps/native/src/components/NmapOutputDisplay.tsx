import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';

// Props: logId, previousNmapData, latestData
interface NmapOutputDisplayProps {
  logId: string | null;
  previousNmapData: string | null;
  latestData: any;
}

export default function NmapOutputDisplay({ logId, previousNmapData, latestData }: NmapOutputDisplayProps) {
  const [nmapData, setNmapData] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (previousNmapData) {
      setNmapData(previousNmapData);
      return;
    }
    const runScan = async () => {
      if (!latestData?.ip || !logId) return;
      setLoading(true);
      try {
        // Replace this with your actual API call for Expo/React Native
        const response = await fetch('https://your-api-endpoint/nmap', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ip: latestData.ip, logId }),
        });
        const result = await response.text();
        setNmapData(result);
      } catch (e) {
        setNmapData('Error running Nmap scan.');
      } finally {
        setLoading(false);
      }
    };
    runScan();
  }, [previousNmapData, latestData, logId]);

  if (loading || !nmapData) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="small" color="#00cc00" />
        <Text style={styles.loadingText}>Nmap running...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView horizontal style={styles.scrollView}>
        <Text style={styles.nmapText}>{nmapData}</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: '#00cc00',
    borderRadius: 8,
    backgroundColor: '#111',
    marginVertical: 8,
    padding: 8,
    maxHeight: 200,
  },
  scrollView: {
    padding: 4,
  },
  nmapText: {
    color: '#00cc00',
    fontFamily: 'monospace',
    fontSize: 12,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  loadingText: {
    color: '#00cc00',
    marginLeft: 8,
  },
});
