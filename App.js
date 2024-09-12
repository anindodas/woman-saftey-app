import * as Location from 'expo-location';
import * as SMS from 'expo-sms';
import React, { useState } from 'react';
import { Alert, Button, StyleSheet, Text, View } from 'react-native';

const App = () => {
  const [location, setLocation] = useState(null);

  const getLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert("Permission to access location was denied");
      return;
    }

    const loc = await Location.getCurrentPositionAsync({});
    setLocation(loc.coords);
  };

  const sendSOS = async () => {
    if (location) {
      const isAvailable = await SMS.isAvailableAsync();
      if (isAvailable) {
        const { result } = await SMS.sendSMSAsync(
          ['1234567890'], // Replace with emergency contact number(s)
          `SOS! I need help. My location: https://maps.google.com/?q=${location.latitude},${location.longitude}`
        );

        if (result === 'sent') {
          Alert.alert("SOS message sent successfully!");
        } else {
          Alert.alert("SOS message not sent.");
        }
      } else {
        Alert.alert("SMS service is not available on this device.");
      }
    } else {
      Alert.alert("Location not available. Please try again.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>SOS App</Text>
      <Button title="Get Location" onPress={getLocation} />
      <Button title="Send SOS" onPress={sendSOS} />
      {location && (
        <Text style={styles.location}>
          Location: {location.latitude}, {location.longitude}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  location: {
    marginTop: 20,
    fontSize: 16,
  },
});

export default App;
