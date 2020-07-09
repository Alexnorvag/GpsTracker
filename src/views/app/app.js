import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, SafeAreaView} from 'react-native';
import MapboxGL from '@react-native-mapbox-gl/maps';

import store from '../../redux/store';
import {Provider} from 'react-redux';

import {IS_ANDROID} from '../../utils';
import Map from '../../components/map/map';
import PolylineManager from '../../redux/features/polylines/PolylinesManager'

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

        setIsAndroidPermissionGranted(isGranted);
        setIsFetchingAndroidPermission(false);
      }
    };
    fetchAndroidPermission();
  }, []);

  return (
    <Provider store={store}>
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
          // <Map />
          <PolylineManager/>
        )}
      </View>
    </Provider>
  );
};

const styles = StyleSheet.create({
  page: {
    flex: 1,
    flexDirection: 'column',
    // justifyContent: 'center',
    // alignItems: 'center',
    backgroundColor: '#008080',
  },
});

export default App;
