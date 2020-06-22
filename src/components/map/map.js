import React, {useEffect, useRef, useState} from 'react';
import {View, StyleSheet, Alert, TouchableOpacity, Text} from 'react-native';

import {useSelector} from 'react-redux';
import {selectAllCoords} from '../../redux/features/coords/coordsSlice';

import MapboxGL from '@react-native-mapbox-gl/maps';

import BottomToolbar from './bottom-toolbar/toolbar';
import MapControls from './controls/controls';
import {IS_ANDROID, createShapeSource} from '../../utils';

MapboxGL.setAccessToken(
  'pk.eyJ1IjoiYWxleG5vcnZhZyIsImEiOiJjam1ia2ZoMmQwbDgxM3BxNHN1bGJrZmtqIn0.ac7-waXEpU58Rf5FGn8JbA',
);

const Map = () => {
  const [followOptions, setFollowOptions] = useState({
    followUserMode: 'normal',
    followUserLocation: true,
  });
  const [currentTrackingMode, setCurrentTrackingMode] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(14);
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

  const setFollowLocation = () => {
    console.log("currentTrackingMode: ", currentTrackingMode)
    // setCurrentTrackingMode()
    // console.log('Foollow mode: ');
    setFollowOptions({
      followUserMode: 'normal',
      followUserLocation: true,
    });
  };

  const getCurrentZoomLevel = () => mapRef.current.getZoom();

  const increaseZoomByValue = async (value = 1) => {
    const currentZoom = await getCurrentZoomLevel();
    // console.log('mapRef: ', mapRef.current);
    // console.log('cameraRef: ', cameraRef.current);
    // cameraRef.current.setCamera({
    //   followUserLocation: false,
    //   zoomLevel: currentZoom + value
    // });
    // cameraRef.current.zoomTo(currentZoom + value, 400);
    // cameraRef.current.setCamera({
    //   followUserLocation: true,
    // });
    setZoomLevel(currentZoom + value);
  };

  useEffect(() => {
    console.log('MAP coords: ', coords);
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
        zoomEnabled={true}
        // onRegionDidChange={(e) => {
        // console.log('e: ', e);
        // setFollowLocation(false);
        // }}
        // onRegionWillChange={() => {
        //   console.log('will change');
        // }}
        // onRegionDidChange={() => {
        //   console.log('did change');
        // }}
        // onRegionIsChanging={() => {
        //   console.log('is changing');
        // }}
      >
        <MapboxGL.UserLocation
          visible={true}
          showsUserHeadingIndicator={true}
          onUpdate={onUserLocationUpdate}
        />
        <MapboxGL.Camera
          ref={cameraRef}
          zoomLevel={zoomLevel}
          followUserMode={followOptions.followUserMode}
          followUserLocation={followOptions.followUserLocation}
          onUserTrackingModeChange={(e) => {
            const {followUserMode} = e.nativeEvent.payload;
            // console.log('follow user mode: ', followUserMode);
            setCurrentTrackingMode(followUserMode || 'none');
            // if (followUserMode) {
              setFollowOptions({
                followUserLocation: true,
                followUserMode: 'normal',
              });
            // } 
            // else {
              // setFollowOptions({
              //   followUserLocation: true,
              //   followUserMode: null,
              // });
            // }
          }}
        />

        <MapboxGL.ShapeSource id="polylines" shape={createShapeSource(coords)}>
          <MapboxGL.CircleLayer
            id="polylinePoints"
            sourceLayerID="points"
            style={tyles}
          />
        </MapboxGL.ShapeSource>
      </MapboxGL.MapView>

      <BottomToolbar
        styles={[styles.toolbarContainer]}
        currentLocation={getCurrentLocation}
      />

      {/* <TouchableOpacity onPress={changeFollowSettings}>
        <Text>text</Text>
      </TouchableOpacity> */}

      <MapControls
        style={styles.mapControlsContainer}
        buttonsProps={{
          buttons: [
            {
              icon: {name: 'plus', size: 25, color: '#000'},
              onPress: () => increaseZoomByValue(1),
            },
            {
              icon: {name: 'minus', size: 25, color: '#000'},
              onPress: () => increaseZoomByValue(-1),
            },
            {
              icon: {name: 'enviromento', size: 25, color: '#000'},
              onPress: setFollowLocation,
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
    bottom: 100,
    right: 0,
    flex: 1,
    backgroundColor: '#ffffff',
    paddingHorizontal: 5,
    paddingVertical: 10,
    borderRadius: 10,
  },
});

export default Map;
