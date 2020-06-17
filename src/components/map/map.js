import React, {useEffect, useRef, useState} from 'react';
import {View, StyleSheet} from 'react-native';
import MapboxGL from '@react-native-mapbox-gl/maps';
import {onSortOptions} from '../../utils';

MapboxGL.setAccessToken(
  'pk.eyJ1IjoiYWxleG5vcnZhZyIsImEiOiJjam1ia2ZoMmQwbDgxM3BxNHN1bGJrZmtqIn0.ac7-waXEpU58Rf5FGn8JbA',
);

const trackingOptions = Object.keys(MapboxGL.UserTrackingModes)
  .map((key) => ({
    label: key,
    data: MapboxGL.UserTrackingModes[key],
  }))
  .concat([
    {
      label: 'None',
      data: 'none',
    },
  ])
  .sort(onSortOptions);

const Map = () => {
  const [showUserLocation, setShowUserLocation] = useState(false);
  const [showsUserHeadingIndicator, setShowsUserHeadingIndicator] = useState(
    false,
  );

  useEffect(() => {
    MapboxGL.setTelemetryEnabled(false);
  }, []);

  useEffect(() => {
    console.log('modes: ', trackingOptions);
  }, [trackingOptions]);

  return (
    <View style={styles.container}>
      <MapboxGL.MapView
        styleURL={'mapbox://styles/alexnorvag/ck9efq0oz2d0x1ioftrtazzyz'}
        style={styles.map}>
        <MapboxGL.UserLocation
          visible={showUserLocation}
          showsUserHeadingIndicator={showsUserHeadingIndicator}
        />
        <MapboxGL.Camera
          defaultSettings={{
            centerCoordinate: [-111.8678, 40.2866],
            zoomLevel: 2,
          }}
          followZoomLevel={3}
          // followUserLocation={
          //   this.state.userSelectedUserTrackingMode !== 'none'
          // }
        />

        {/* <MapboxGL.UserLocation onPress={this.onUserMarkerPress} /> */}
      </MapboxGL.MapView>
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
});

export default Map;
