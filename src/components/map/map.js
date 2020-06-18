import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  ActivityIndicator,
} from 'react-native';
import MapboxGL from '@react-native-mapbox-gl/maps';
import BottomToolbar from './bottom-toolbar/toolbar';

MapboxGL.setAccessToken(
  'pk.eyJ1IjoiYWxleG5vcnZhZyIsImEiOiJjam1ia2ZoMmQwbDgxM3BxNHN1bGJrZmtqIn0.ac7-waXEpU58Rf5FGn8JbA',
);

MapboxGL.setTelemetryEnabled(false);

const Map = () => {
  const [userLocation, setUserLocation] = useState([]);

  const onUserLocationUpdate = (location) => {
    if (location) {
      console.log('location: ', location);
      const {longitude, latitude} = location.coords;

      setUserLocation([longitude, latitude]);
    }
  };

  useEffect(() => {
    MapboxGL.setTelemetryEnabled(false);
  }, []);

  return (
    <View style={styles.container}>
      <MapboxGL.MapView
        styleURL={'mapbox://styles/alexnorvag/ck9efq0oz2d0x1ioftrtazzyz'}
        style={styles.map}>
        <MapboxGL.UserLocation
          visible={true}
          showsUserHeadingIndicator={true}
          onUpdate={onUserLocationUpdate}
        />
        <MapboxGL.Camera
          zoomLevel={3}
          followUserMode={'normal'}
          followUserLocation
        />
      </MapboxGL.MapView>

      {/* <View style={[styles.controlsContainer, {bottom: 80}]}>
        <TouchableOpacity
          onPress={() => {
            console.log('press');
          }}>
          <Text>User Tracking Mode: {userTrackingModeText()}</Text>
        </TouchableOpacity>
      </View>

      <View style={[styles.controlsContainer, {bottom: 150}]}>
        <TouchableOpacity onPress={onToggleUserLocation}>
          <Text>
            Toggle User Location: {showUserLocation ? 'true' : 'false'}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={[styles.controlsContainer, {bottom: 220}]}>
        <TouchableOpacity onPress={onToggleHeadingIndicator}>
          <Text>
            Toggle user heading indicator:{' '}
            {showsUserHeadingIndicator ? 'true' : 'false'}
          </Text>
        </TouchableOpacity>
      </View> */}
      <BottomToolbar styles={[styles.controlsContainer]}/>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#03396c',
  },
  map: {
    flex: 1,
  },
  controlsContainer: {
    borderRadius: 30,
    position: 'absolute',
    bottom: 16,
    left: 48,
    right: 48,
    paddingVertical: 16,
    minHeight: 60,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
});

export default Map;
