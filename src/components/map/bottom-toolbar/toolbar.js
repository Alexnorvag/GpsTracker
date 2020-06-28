import React from 'react';
import {View} from 'react-native';
import ToolbarControls from '../../../redux/features/coords/coordsControls';

const Toolbar = ({styles, currentLocation, changeModalState}) => {
  return (
    <View style={styles}>
      <ToolbarControls
        currentLocation={currentLocation}
        changeModalState={changeModalState}
      />
    </View>
  );
};

export default Toolbar;
