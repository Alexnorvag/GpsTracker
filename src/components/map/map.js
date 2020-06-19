import React, {useEffect, useState, useMemo, useCallback, useRef} from 'react';
import {View, StyleSheet, Alert} from 'react-native';

import {useSelector, useDispatch} from 'react-redux';
import {selectAllCoords} from '../../redux/features/coords/coordsSlice';

import MapboxGL from '@react-native-mapbox-gl/maps';

import BottomToolbar from './bottom-toolbar/toolbar';
import {IS_ANDROID} from '../../utils';

MapboxGL.setAccessToken(
  'pk.eyJ1IjoiYWxleG5vcnZhZyIsImEiOiJjam1ia2ZoMmQwbDgxM3BxNHN1bGJrZmtqIn0.ac7-waXEpU58Rf5FGn8JbA',
);

const shape = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [76.343981, 10.279141],
      },
    },
  ],
};

const Map = () => {
  const coords = useSelector(selectAllCoords);
  const userLocation = useRef([]);

  const onUserLocationUpdate = (location) => {
    if (location) {
      const {latitude, longitude} = location.coords;

      userLocation.current = {latitude, longitude};
    } else {
      Alert.alert(
        'Location failed',
        'No location found. Turn on gps to continue.',
        [{text: 'OK'}],
        {cancelable: true},
      );
    }
  };

  const getCurrentLocation = () => userLocation.current;

  useEffect(() => {
    console.log('MAP coords: ', coords);
  }, [coords]);

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

        <MapboxGL.ShapeSource
          id="line1"
          shape={{
            type: 'FeatureCollection',
            features: coords.map((coord) => ({
              type: 'Feature',
              geometry: {
                type: 'Point',
                coordinates: [coord.lng, coord.lat],
              },
            })),
          }}>
          <MapboxGL.CircleLayer
            id="sf2010CircleFill"
            sourceLayerID="sf2010"
            style={tyles}
          />
        </MapboxGL.ShapeSource>
      </MapboxGL.MapView>

      <BottomToolbar
        styles={[styles.controlsContainer]}
        currentLocation={getCurrentLocation}
      />
    </View>
  );
};

const tyles = {
  visibility: 'visible',
  circleRadius: 5,
  circleColor: '#A9A9A9',
  circleStrokeColor: '#A9A9A9',
  circleStrokeWidth: 5,
  circleOpacity: 1,
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
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    minHeight: IS_ANDROID ? 70 : 90,
    justifyContent: 'flex-end',
  },
});

export default Map;
