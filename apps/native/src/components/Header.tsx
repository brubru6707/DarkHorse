import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function Header() {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image
          source={require('../assets/logo.png')}
          style={styles.logo}
        />
        <Text style={styles.title}>DarkHorse</Text>
      </View>

      <View style={styles.navContainer}>
        <TouchableOpacity onPress={() => (navigation as any).navigate('Home')}>
          <Text style={styles.navLink}>About</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => (navigation as any).navigate('Details')}>
          <Text style={styles.navLink}>Details</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          onPress={() => (navigation as any).navigate('Scan')}
          style={styles.scanButton}>
          <Text style={styles.scanButtonText}>Scan</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '90%',
    backgroundColor: '#0d120d',
    paddingVertical: 12,
    marginTop: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#008000',
    alignSelf: 'center',
    paddingHorizontal: 16,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#006400',
    padding: 8,
    borderRadius: 4,
    marginBottom: 12,
  },
  logo: {
    width: 32,
    height: 32,
    marginRight: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  navContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  navLink: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
  scanButton: {
    backgroundColor: '#00cc00',
    borderRadius: 9999,
    paddingHorizontal: 24,
    paddingVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  scanButtonText: {
    color: 'white',
    fontWeight: '500',
  },
});