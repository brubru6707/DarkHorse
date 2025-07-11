import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Image } from 'react-native';

interface HistoricalEntry {
  id: string;
  timestamp: string;
  data: object;
  nmapData: string;
  imageDescription: string;
  imageURL: string;
  recommendation: string;
}

interface HistoryTimelineProps {
  historicalEntries: HistoricalEntry[];
}

export default function HistoryTimeline({ historicalEntries = [] }: HistoryTimelineProps) {
  const [selectedEntryId, setSelectedEntryId] = useState<string | null>(
    historicalEntries.length > 0 ? historicalEntries[0].id : null
  );
  const [displayData, setDisplayData] = useState({
    scanData: '',
    nmapData: '',
    imageDescription: '',
    imageURL: '',
    recommendation: ''
  });

  useEffect(() => {
    if (historicalEntries.length > 0) {
      const firstEntry = historicalEntries[0];
      setSelectedEntryId(firstEntry.id);
      updateDisplayData(firstEntry);
    }
  }, [historicalEntries]);

  const updateDisplayData = (entry: HistoricalEntry) => {
    setDisplayData({
      scanData: JSON.stringify(entry.data, null, 2),
      nmapData: entry.nmapData,
      imageDescription: entry.imageDescription,
      imageURL: entry.imageURL,
      recommendation: entry.recommendation
    });
  };

  const handleEntryClick = (entry: HistoricalEntry) => {
    setSelectedEntryId(entry.id);
    updateDisplayData(entry);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Activity History</Text>

      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.timelineContainer}
      >
        <View style={styles.timelineLine} />
        
        {historicalEntries.map((entry) => (
          <View key={entry.id} style={styles.entryContainer}>
            <TouchableOpacity onPress={() => handleEntryClick(entry)}>
              <Text style={styles.dateText}>
                {new Date(entry.timestamp).toLocaleDateString()}
              </Text>
              <View 
                style={[
                  styles.circle,
                  selectedEntryId === entry.id && styles.selectedCircle
                ]}
              />
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>

      <View style={styles.dataContainer}>
        <View style={styles.column}>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Nmap Data</Text>
            <ScrollView style={styles.cardContent}>
              <Text style={styles.cardText}>{displayData.nmapData}</Text>
            </ScrollView>
          </View>
          
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Scan Data</Text>
            <ScrollView style={styles.cardContent}>
              <Text style={styles.cardText}>
                {displayData.scanData || 'No historical data available'}
              </Text>
            </ScrollView>
          </View>
        </View>

        <View style={styles.column}>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Image</Text>
            {displayData.imageURL ? (
              <Image 
                source={{ uri: displayData.imageURL }} 
                style={styles.image}
              />
            ) : (
              <Text style={styles.noDataText}>No image available</Text>
            )}
          </View>
          
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Image Description</Text>
            <ScrollView style={styles.cardContent}>
              <Text style={styles.cardText}>{displayData.imageDescription}</Text>
            </ScrollView>
          </View>
          
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Recommendation</Text>
            <ScrollView style={styles.cardContent}>
              <Text style={styles.cardText}>{displayData.recommendation}</Text>
            </ScrollView>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#0d120d',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 16,
    textAlign: 'center',
  },
  timelineContainer: {
    paddingVertical: 40,
    position: 'relative',
  },
  timelineLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: '#008000',
    top: '50%',
  },
  entryContainer: {
    marginHorizontal: 24,
    alignItems: 'center',
  },
  dateText: {
    color: 'white',
    fontSize: 12,
    marginBottom: 8,
  },
  circle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#0d120d',
    borderWidth: 2,
    borderColor: '#008000',
  },
  selectedCircle: {
    backgroundColor: '#0d120d',
    borderColor: '#00cc00',
    transform: [{ scale: 1.2 }],
  },
  dataContainer: {
    flexDirection: 'column',
  },
  column: {
    marginBottom: 16,
  },
  card: {
    borderWidth: 1,
    borderColor: '#00cc00',
    borderRadius: 8,
    backgroundColor: 'black',
    padding: 16,
    marginBottom: 16,
  },
  cardTitle: {
    color: '#00cc00',
    fontWeight: 'bold',
    marginBottom: 8,
  },
  cardContent: {
    maxHeight: 200,
  },
  cardText: {
    color: '#00cc00',
    fontSize: 12,
  },
  image: {
    width: '100%',
    height: 200,
    resizeMode: 'contain',
    borderWidth: 1,
    borderColor: '#008000',
    borderRadius: 4,
  },
  noDataText: {
    color: '#666',
    textAlign: 'center',
  },
});