import React from 'react';
import {View, Text} from 'react-native';
import IconButton from '../../button/icon/icon';

const Controls = ({style, buttonsProps}) => {
  return (
    <View style={style}>
      {buttonsProps.buttons.map((button, key) => (
        <IconButton key={key} icon={button.icon} onPress={button.onPress}/>
      ))}
    </View>
  );
};

export default Controls;
