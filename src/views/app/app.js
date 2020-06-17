import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

import Map from '../../components/map/map';

const App = () => {
  return (
    <View style={styles.page}>
      <Map />
      <Text style={styles.mapControls}>Here will be placed buttons</Text>
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
  mapControls: {
    alignSelf: 'stretch',
    height: 70,
    backgroundColor: 'green',
  },
});

export default App;
