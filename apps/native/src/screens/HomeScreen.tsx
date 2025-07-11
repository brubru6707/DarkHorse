import React from 'react';
import { View, Text, StyleSheet, ImageBackground, TouchableOpacity } from 'react-native';
import Header from '../components/Header';
import { useNavigation } from '@react-navigation/native';

export default function HomeScreen() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Header />
      <ImageBackground 
        source={require('../assets/hero-bg.jpg')} 
        style={styles.hero}
        resizeMode="cover"
      >
        <View style={styles.heroContent}>
          <Text style={styles.heroTitle}>DarkHorse Security</Text>
          <Text style={styles.heroSubtitle}>See what your device reveals about you</Text>
          <TouchableOpacity 
            style={styles.scanButton}
            onPress={() => navigation.navigate('Scan' as never)}
          >
            <Text style={styles.scanButtonText}>Run Scan</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0d120d',
  },
  hero: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroContent: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#00cc00',
    marginBottom: 10,
  },
  heroSubtitle: {
    fontSize: 18,
    color: 'white',
    marginBottom: 20,
    textAlign: 'center',
  },
  scanButton: {
    backgroundColor: '#00cc00',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
  },
  scanButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});