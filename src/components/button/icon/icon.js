import React from 'react';
import {TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';

const ControlButton = ({icon, style, onPress}) => {
  return (
    <TouchableOpacity style={style} onPress={onPress} activeOpacity={0.7}>
      <Icon name={icon.name} size={icon.size} color={icon.color} />
    </TouchableOpacity>
  );
};

export default ControlButton;
