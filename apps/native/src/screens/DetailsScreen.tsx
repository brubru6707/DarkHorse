import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import Header from '../components/Header';

const dataFields = [
  // ... same dataFields array as in your web version ...
];

export default function DetailsScreen() {
  return (
    <View style={styles.container}>
      <Header />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>🔐 Data Exposure Details</Text>
        
        <View style={styles.grid}>
          {dataFields.map((field, idx) => (
            <View key={idx} style={styles.card}>
              <Text style={styles.cardTitle}>{field.title}</Text>
              <Text style={styles.cardText}>{field.danger}</Text>
            </View>
          ))}
        </View>
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
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#00cc00',
    marginBottom: 20,
    textAlign: 'center',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#00cc00',
    backgroundColor: '#0d120d',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#00cc00',
    marginBottom: 8,
  },
  cardText: {
    fontSize: 16,
    color: 'white',
  },
});