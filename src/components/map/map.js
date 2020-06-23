import React, {useEffect, useRef, useState} from 'react';
import {View, StyleSheet, Alert, TouchableOpacity, Text} from 'react-native';

import {useSelector} from 'react-redux';
import {selectAllCoords} from '../../redux/features/coords/coordsSlice';

import MapboxGL from '@react-native-mapbox-gl/maps';

import BottomToolbar from './bottom-toolbar/toolbar';
import MapControls from './controls/controls';
import {
  IS_ANDROID,
  createShapeSource,
  createPolylineShapeSource,
} from '../../utils';

MapboxGL.setAccessToken(
  'pk.eyJ1IjoiYWxleG5vcnZhZyIsImEiOiJjam1ia2ZoMmQwbDgxM3BxNHN1bGJrZmtqIn0.ac7-waXEpU58Rf5FGn8JbA',
);

const Map = () => {
  const [followOptions, setFollowOptions] = useState({
    followUserMode: 'normal',
    followUserLocation: true,
  });
  // const [zoomLevel, setZoomLevel] = useState(14);
  const coords = useSelector(selectAllCoords);
  const mapRef = useRef();
  const cameraRef = useRef();
  const userLocation = useRef([]);

  const onUserLocationUpdate = (location) => {
    if (location) {
      const {longitude, latitude} = location.coords;

      userLocation.current = {longitude, latitude};
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
  const getCurrentZoomLevel = () => mapRef.current.getZoom();

  const setFollow = async () => {
    const zoom = await getCurrentZoomLevel();
    setFollowOptions({
      followUserMode: 'normal',
      followUserLocation: true,
    });
    // const {longitude, latitude} = getCurrentLocation();
    // console.log('getCurrentLocation: ', getCurrentLocation());
    // cameraRef.current.setCamera({
    //   centerCoordinate: [longitude, latitude],
    //   zoomLevel: 14,
    //   animationDuration: 400,
    //   followUserMode: 'normal',
    //   followUserLocation: true,
    // });
    cameraRef.current.zoomTo(zoom, 400);
  };

  const increaseZoomByValue = async (value = 1) => {
    const zoom = await getCurrentZoomLevel();
    setFollowOptions({followUserMode: null, followUserLocation: false});
    cameraRef.current.zoomTo(zoom + value, 400);
    // cameraRef.current.setCamera({
    //   // centerCoordinate: [longitude, latitude],
    //   zoomLevel: 14,
    //   animationDuration: 400,
    //   followUserMode: 'normal',
    //   followUserLocation: true,
    // });
  };

  useEffect(() => {
    console.log('MAP coords: ', coords);

    console.log('qfqf ', createPolylineShapeSource(coords));
  }, [coords]);

  useEffect(() => {
    MapboxGL.setTelemetryEnabled(true);
  }, []);

  return (
    <View style={styles.container}>
      <MapboxGL.MapView
        ref={mapRef}
        styleURL={'mapbox://styles/alexnorvag/ck9efq0oz2d0x1ioftrtazzyz'}
        style={styles.map}
        zoomEnabled={true}>
        <MapboxGL.UserLocation
          visible={true}
          showsUserHeadingIndicator={true}
          onUpdate={onUserLocationUpdate}
        />
        <MapboxGL.Camera
          ref={cameraRef}
          followUserMode={followOptions.followUserMode}
          followUserLocation={followOptions.followUserLocation}
          onUserTrackingModeChange={async (e) => {
            const {followUserMode, followUserLocation} = e.nativeEvent.payload;
            console.log(followUserLocation, followUserMode);
            // console.log(followOptions);
            // setZoomLevel(zoom);
            // cameraRef.current.zoomTo(zoom);
            if (!followUserMode) {
              setFollowOptions({
                followUserMode,
                followUserLocation,
              });
            }
            // const zoom = await mapRef.current.getZoom();
            // cameraRef.current.zoomTo(zoom);
          }}
        />
        
        <MapboxGL.ShapeSource
          id="polylines"
          shape={createPolylineShapeSource(coords)}>
          <MapboxGL.LineLayer
            id="line-layer"
            sourceLayerID="polylines"
            style={{lineColor: 'red'}}
          />
          <MapboxGL.CircleLayer
            id="point-layer"
            sourceLayerID="polylines"
            style={tyles}
          />
        </MapboxGL.ShapeSource>
      </MapboxGL.MapView>

      <BottomToolbar
        styles={[styles.toolbarContainer]}
        currentLocation={getCurrentLocation}
      />

      <MapControls
        style={styles.mapControlsContainer}
        buttonsProps={{
          buttons: [
            {
              icon: {name: 'plus', size: 30, color: '#000'},
              onPress: () => increaseZoomByValue(1),
            },
            {
              icon: {name: 'minus', size: 30, color: '#000'},
              onPress: () => increaseZoomByValue(-1),
            },
            {
              icon: {name: 'enviromento', size: 30, color: '#000'},
              onPress: setFollow,
            },
          ],
        }}
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
  toolbarContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    minHeight: IS_ANDROID ? 70 : 90,
    justifyContent: 'flex-end',
  },
  mapControlsContainer: {
    position: 'absolute',
    bottom: IS_ANDROID ? 100 : 110,
    right: 0,
    flex: 1,
    backgroundColor: '#ffffff',
    paddingHorizontal: 5,
    paddingVertical: 10,
    borderRadius: 10,
  },
});

export default Map;
