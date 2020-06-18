import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, SafeAreaView} from 'react-native';
import MapboxGL from '@react-native-mapbox-gl/maps';

import {IS_ANDROID} from '../../utils';
import Map from '../../components/map/map';

MapboxGL.setAccessToken(
  'pk.eyJ1IjoiYWxleG5vcnZhZyIsImEiOiJjam1ia2ZoMmQwbDgxM3BxNHN1bGJrZmtqIn0.ac7-waXEpU58Rf5FGn8JbA',
);

const App = () => {
  const [isAndroidPermissionGranted, setIsAndroidPermissionGranted] = useState(
    false,
  );
  const [
    isFetchingAndroidPermission,
    setIsFetchingAndroidPermission,
  ] = useState(false);

  useEffect(() => {
    const fetchAndroidPermission = async () => {
      if (IS_ANDROID) {
        const isGranted = await MapboxGL.requestAndroidLocationPermissions();
        console.log('IS GRANTED: ', isGranted);
        setIsAndroidPermissionGranted(isGranted);
        setIsFetchingAndroidPermission(false);
      }
    };

    fetchAndroidPermission();
  }, [isAndroidPermissionGranted]);

  return (
    <View style={styles.page}>
      {IS_ANDROID && !isAndroidPermissionGranted ? (
        isFetchingAndroidPermission ? null : (
          <SafeAreaView
            style={{backgroundColor: 'blue'}}
            forceInset={{top: 'always'}}>
            <View>
              <Text>
                You need to accept location permissions in order to use this
                example applications
              </Text>
            </View>
          </SafeAreaView>
        )
      ) : (
        <Map />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  page: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#005b96',
  },
  // mapControls: {
  //   alignSelf: 'stretch',
  //   height: 70,
  //   backgroundColor: 'green',
  // },
});

export default App;
