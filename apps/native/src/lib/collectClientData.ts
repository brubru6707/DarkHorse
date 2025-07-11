import * as Device from 'expo-device';
import * as Battery from 'expo-battery';
import * as Network from 'expo-network';
import * as Location from 'expo-location';
import { Platform } from 'react-native';

export async function collectClientData() {
  // Get battery info
  const batteryLevel = await Battery.getBatteryLevelAsync();
  const batteryState = await Battery.getPowerStateAsync();

  // Get network info
  const networkState = await Network.getNetworkStateAsync();
  const ipAddress = await Network.getIpAddressAsync();

  // Get location (approximate)
  let location = null;
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status === 'granted') {
      location = await Location.getCurrentPositionAsync({});
    }
  } catch (error) {
    console.log("Location permission denied or error:", error);
  }

  // Get device info
  const deviceInfo = {
    brand: Device.brand,
    manufacturer: Device.manufacturer,
    modelName: Device.modelName,
    osName: Device.osName,
    osVersion: Device.osVersion,
    deviceType: Device.deviceType,
    totalMemory: Device.totalMemory,
    supportedCpuArchitectures: Device.supportedCpuArchitectures,
  };

  return {
    // Device information
    deviceInfo,
    platform: Platform.OS,
    osVersion: Platform.Version,
    
    // Battery information
    batteryLevel,
    batteryState: Battery.BatteryState[batteryState.batteryState],
    batteryCharging: batteryState.batteryState === Battery.BatteryState.CHARGING,
    
    // Network information
    ipAddress,
    isConnected: networkState.isConnected,
    isInternetReachable: networkState.isInternetReachable,
    connectionType: networkState.type,
    
    // Location information
    location: location ? {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      accuracy: location.coords.accuracy,
    } : null,
    
    // Screen information
    screen: {
      width: Dimensions.get('window').width,
      height: Dimensions.get('window').height,
      scale: Dimensions.get('window').scale,
      fontScale: Dimensions.get('window').fontScale,
    },
    
    // Other device capabilities
    hasCamera: await Camera.isAvailableAsync(),
    hasTouchscreen: Device.isDevice,
    isEmulator: !Device.isDevice,
    
    // Timestamp
    timestamp: new Date().toISOString(),
  };
}