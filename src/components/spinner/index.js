import React from 'react';
import {View, StyleSheet, ActivityIndicator} from 'react-native';

const Spinner = ({size = 'large', color = '#0000ff', styles = {}}) => {
  return (
    <View style={[spinerStyles.container, spinerStyles.horizontal, styles]}>
      <ActivityIndicator size={size} color={color} />
    </View>
  );
};

const spinerStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  horizontal: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
});

export default Spinner;
