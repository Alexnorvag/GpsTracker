import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  ActivityIndicator,
} from 'react-native';
import MapboxGL from '@react-native-mapbox-gl/maps';
import {onSortOptions} from '../../utils';

MapboxGL.setAccessToken(
  'pk.eyJ1IjoiYWxleG5vcnZhZyIsImEiOiJjam1ia2ZoMmQwbDgxM3BxNHN1bGJrZmtqIn0.ac7-waXEpU58Rf5FGn8JbA',
);

MapboxGL.setTelemetryEnabled(false);

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
  // const [showUserLocation, setShowUserLocation] = useState(false);
  // const [showsUserHeadingIndicator, setShowsUserHeadingIndicator] = useState(
  //   false,
  // );
  const [userLocation, setUserLocation] = useState([]);
  // const [
  //   userSelectedUserTrackingMode,
  //   setUserSelectedUserTrackingMode,
  // ] = useState(trackingOptions[0].data);
  // const [currentTrackingMode, setCurrentTrackingMode] = useState(
  //   trackingOptions[0].data,
  // );

  // const onToggleUserLocation = () => setShowUserLocation((l) => !l);

  // const onToggleHeadingIndicator = () =>
  //   setShowsUserHeadingIndicator((l) => !l);

  const onUserLocationUpdate = (location) => {
    const {longitude, latitude} = location.coords;

    setUserLocation([longitude, latitude]);

    console.log('location: ', location.timestamp);
    // console.log('location: ', location.coords.longitude);
  };

  // userTrackingModeText = () => {
  //   switch (currentTrackingMode) {
  //     case MapboxGL.UserTrackingModes.Follow:
  //       return 'Follow';
  //     case MapboxGL.UserTrackingModes.FollowWithCourse:
  //       return 'FollowWithCourse';
  //     case MapboxGL.UserTrackingModes.FollowWithHeading:
  //       return 'FollowWithHeading';
  //     default:
  //       return 'None';
  //   }
  // };

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
