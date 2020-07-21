import React from 'react';
import {View} from 'react-native';
import ToolbarControls from '../../../redux/features/coords/coordsControls';

const Toolbar = ({styles, currentLocation, changeModalState, isViewMode}) => {
  return (
    <View style={styles}>
      <ToolbarControls
        currentLocation={currentLocation}
        changeModalState={changeModalState}
        isViewMode={isViewMode}
      />
    </View>
  );
};

export default Toolbar;
