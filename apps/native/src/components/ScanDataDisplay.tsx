import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';

interface ScanDataDisplayProps {
  data: object | undefined;
}

export default function ScanDataDisplay({ data }: ScanDataDisplayProps) {
  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <Text style={styles.dataText}>
          {JSON.stringify(data, null, 2)}
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: '#00cc00',
    borderRadius: 8,
    backgroundColor: 'black',
    padding: 8,
    marginBottom: 16,
  },
  scrollView: {
    maxHeight: 200,
  },
  dataText: {
    color: '#00cc00',
    fontSize: 12,
    fontFamily: 'monospace',
  },
});