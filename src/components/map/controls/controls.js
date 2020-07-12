import React from 'react';
import {View, StyleSheet} from 'react-native';
import IconButton from '../../button/icon/icon';

const Controls = ({style, buttonsProps}) => {
  return (
    <View style={style}>
      {buttonsProps.buttons.map((button, key) => (
        <IconButton
          key={key}
          icon={button.icon}
          onPress={button.onPress}
          style={styles.iconWrapper(key, buttonsProps.buttons.length - 1)}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  iconWrapper: (index, lastIndex) => ({
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderBottomWidth: index === lastIndex ? 0 : 1,
    borderColor: '#CCC',
  }),
});

export default Controls;
