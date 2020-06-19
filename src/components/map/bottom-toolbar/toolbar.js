import React from 'react';
import {View, StyleSheet} from 'react-native';
import BottomToolbar from 'react-native-bottom-toolbar';
import Icon from 'react-native-vector-icons/AntDesign';
import {IS_ANDROID} from '../../../utils';

const Toolbar = ({styles}) => {
  return (
    <View style={styles}>
      <BottomToolbar wrapperStyle={stylese.wrapper}>
        <BottomToolbar.Action
          title="Menu"
          iconName="menufold"
          IconElement={<Icon name="menufold" size={30} color="black" />}
          onPress={(index, propsOfThisAction) =>
            console.warn(index + ' title: ' + propsOfThisAction.title)
          }
        />
        <BottomToolbar.Action
          title="Start"
          iconName="pausecircleo"
          // iconName="playcircleo"
          IconElement={<Icon name="playcircleo" size={60} color="black" />}
          onPress={(index, propsOfThisAction) =>
            console.warn(index + ' title: ' + propsOfThisAction.title)
          }
        />
        <BottomToolbar.Action
          title="Share"
          iconName="sharealt"
          IconElement={<Icon name="sharealt" size={30} color="black" />}
          onPress={(index, propsOfThisAction) =>
            console.warn(index + ' title: ' + propsOfThisAction.title)
          }
        />
      </BottomToolbar>
    </View>
  );
};

const stylese = StyleSheet.create({
  wrapper: {
    flex: 1,
    alignItems: 'center',
    paddingBottom: IS_ANDROID ? 0 : 10,
  },
});

export default Toolbar;
