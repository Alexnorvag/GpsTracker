import React, {useEffect, useRef, useState} from 'react';
import {View, StyleSheet, Alert} from 'react-native';

import {useSelector, useDispatch} from 'react-redux';
import {selectAllCoords} from '../../redux/features/coords/coordsSlice';
import {
  fetchPolylines,
  deletePolylines,
} from '../../redux/features/polylines/polylinesSlice';

import MapboxGL from '@react-native-mapbox-gl/maps';

import Spinner from '../spinner';
import PolylinesManager from '../../redux/features/polylines/PolylinesManager';
import BottomToolbar from './bottom-toolbar/toolbar';
import MapControls from './controls/controls';
import BluetoothManager from '../bluetooth-manager/bluetoothManager';
import {
  IS_ANDROID,
  createPolylineShapeSource,
  createPointsShapeSource,
} from '../../utils';

MapboxGL.setAccessToken(
  'pk.eyJ1IjoiYWxleG5vcnZhZyIsImEiOiJjam1ia2ZoMmQwbDgxM3BxNHN1bGJrZmtqIn0.ac7-waXEpU58Rf5FGn8JbA',
);

const Map = () => {
  const [mapLoading, setMapLoading] = useState(true);
  const [followOptions, setFollowOptions] = useState({
    followUserMode: 'normal',
    followUserLocation: true,
  });
  const [bleModalVisible, setBleModalVisible] = useState(false);
  const coords = useSelector(selectAllCoords);
  const pointsCoords = useSelector((state) => state.coords.points);
  const polylinesLoading = useSelector((state) => state.polylines.loading);
  const mapRef = useRef();
  const cameraRef = useRef();
  const userLocation = useRef([]);

  const dispatch = useDispatch();

  const onUserLocationUpdate = (location) => {
    if (location) {
      const {longitude, latitude} = location.coords;

      userLocation.current = {longitude, latitude};
    }
    // else {
    //   Alert.alert(
    //     'Location failed',
    //     'No location found. Turn on gps to continue.',
    //     [{text: 'OK'}],
    //     {cancelable: true},
    //   );
    // }
  };

  const getCurrentLocation = () => userLocation.current;
  const getCurrentZoomLevel = () => mapRef.current.getZoom();

  const setFollow = async () => {
    const zoom = await getCurrentZoomLevel();
    cameraRef.current.zoomTo(zoom, 400);

    setFollowOptions({
      followUserMode: 'normal',
      followUserLocation: true,
    });
  };

  const increaseZoomByValue = async (value) => {
    const currentZoom = await getCurrentZoomLevel();
    const zoom = currentZoom + value;

    setFollowOptions({followUserMode: null, followUserLocation: false});

    cameraRef.current.zoomTo(zoom, 400);
  };

  const changeModalState = () => setBleModalVisible((v) => !v);

  useEffect(() => {
    MapboxGL.setTelemetryEnabled(true);

    // dispatch(deletePolylines());
    // Get all polylines from db
    dispatch(fetchPolylines());
  }, []);

  return (
    <View style={styles.container}>
      {(mapLoading || polylinesLoading) && (
        <Spinner color="#f5b52e" styles={styles.spinner} />
      )}
      <MapboxGL.MapView
        ref={mapRef}
        styleURL={'mapbox://styles/alexnorvag/ck9efq0oz2d0x1ioftrtazzyz'}
        style={styles.map}
        zoomEnabled={true}
        onDidFinishRenderingMapFully={() => setMapLoading(false)}>
        <MapboxGL.Camera
          ref={cameraRef}
          followUserMode={followOptions.followUserMode}
          followUserLocation={followOptions.followUserLocation}
          onUserTrackingModeChange={(e) => {
            const {followUserMode, followUserLocation} = e.nativeEvent.payload;
            if (!followUserMode) {
              setFollowOptions({
                followUserMode,
                followUserLocation,
              });
            }
          }}
        />
        <MapboxGL.UserLocation
          visible={true}
          showsUserHeadingIndicator={true}
          onUpdate={onUserLocationUpdate}
        />

        {coords.length !== 0 && (
          <MapboxGL.ShapeSource
            id="polyLines"
            shape={createPolylineShapeSource(coords)}>
            <MapboxGL.LineLayer
              id="line-layer"
              sourceLayerID="polyLines"
              style={lineStyle}
            />
          </MapboxGL.ShapeSource>
        )}
        {pointsCoords.length !== 0 && (
          <MapboxGL.ShapeSource
            id="polyPoints"
            shape={createPointsShapeSource(pointsCoords)}>
            <MapboxGL.CircleLayer
              id="point-layer"
              sourceLayerID="polyPoints"
              style={pointStyle}
            />
          </MapboxGL.ShapeSource>
        )}
      </MapboxGL.MapView>

      {/* <PolylinesManager /> */}

      {bleModalVisible && (
        <BluetoothManager
          modalVisible={bleModalVisible}
          changeModalState={changeModalState}
        />
      )}
      <BottomToolbar
        styles={[styles.toolbarContainer]}
        currentLocation={getCurrentLocation}
        changeModalState={changeModalState}
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

const lineStyle = {
  lineColor: '#f5b52e',
  lineWidth: 6,
};

const pointStyle = {
  visibility: 'visible',
  circleRadius: 6,
  circleColor: '#000000',
  circleStrokeColor: '#ed5b35',
  circleStrokeWidth: 3,
  circleOpacity: 1,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#008080',
  },
  spinner: {
    position: 'absolute',
    backgroundColor: 'rgba(0, 128, 128, 0.4)',
    width: '100%',
    height: '100%',
    zIndex: 1,
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
    paddingHorizontal: 4,
    borderRadius: 10,
  },
  centeredView: {
    position: 'absolute',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});

export default Map;
