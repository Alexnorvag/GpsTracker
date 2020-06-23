import React from 'react';
import {View} from 'react-native';
import ToolbarControls from '../../../redux/features/coords/coordsControls';

const Toolbar = ({styles, currentLocation}) => {
  return (
    <View style={styles}>
      <ToolbarControls currentLocation={currentLocation}/>
    </View>
  );
};

export default Toolbar;
