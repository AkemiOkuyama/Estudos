import * as Location from 'expo-location';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

export default function MapaScreen() {
  const [location, setLocation] = useState<Location.LocationObjectCoords | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setErrorMsg('Permissão de localização necessária para encontrar postos de descarte.');
          return;
        }

        let loc = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced
        });
        setLocation(loc.coords);
      } catch (error) {
        setErrorMsg('Não foi possível obter sua localização.');
      }
    })();
  }, []);

  if (errorMsg) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{errorMsg}</Text>
      </View>
    );
  }

  if (!location) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={styles.loadingText}>Buscando sua localização...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        userInterfaceStyle="dark"
        initialRegion={{
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
      >
        <Marker 
          coordinate={{ latitude: location.latitude, longitude: location.longitude }} 
          title="Você está aqui" 
          pinColor="blue" 
        />

        <Marker 
          coordinate={{ latitude: location.latitude + 0.01, longitude: location.longitude + 0.01 }} 
          title="Posto de Reciclagem" 
          description="Descarte de Lixo Eletrônico"
          pinColor="green"
        />
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212', justifyContent: 'center', alignItems: 'center' },
  map: { width: '100%', height: '100%' },
  errorText: { color: '#ef5350', padding: 20, textAlign: 'center' },
  loadingText: { color: '#fff', marginTop: 10 }
});