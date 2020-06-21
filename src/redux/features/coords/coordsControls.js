import React, {useState, useRef} from 'react';
import {StyleSheet} from 'react-native';

import {useDispatch} from 'react-redux';
import {addCoord} from './coordsSlice';

import BottomToolbar from 'react-native-bottom-toolbar';
import Icon from 'react-native-vector-icons/AntDesign';
import {IS_ANDROID} from '../../../utils';

const CoordsControls = ({currentLocation}) => {
  const [isBuildingRoute, setIsBuildingRoute] = useState(false);
  const dispatch = useDispatch();

  const _id = useRef(0);

  const getId = () => _id.current;
  const incrementId = () => (_id.current += 1);

  return (
    <BottomToolbar wrapperStyle={stylese.wrapper}>
      <BottomToolbar.Action
        title="Build"
        iconName="check"
        IconElement={<Icon name="check" size={30} color="black" />}
        onPress={(index, propsOfThisAction) =>
          console.warn(index + ' title: ' + propsOfThisAction.title)
        }
      />
      <BottomToolbar.Action
        title={isBuildingRoute ? 'Pause' : 'Start'}
        iconName={isBuildingRoute ? 'pausecircleo' : 'playcircleo'}
        IconElement={
          <Icon
            name={isBuildingRoute ? 'pausecircleo' : 'playcircleo'}
            size={60}
            color="black"
          />
        }
        onPress={() => {
          setIsBuildingRoute((p) => !p);

          // if (isBuildingRoute) {
          //   stopHandler();
          // } else {
          //   startHandler();
          // }
          const {longitude: lng, latitude: lat} = currentLocation();

          dispatch(
            addCoord({
              id: getId(),
              lat,
              lng,
            }),
          );
          incrementId();
        }}
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
  );
};

const stylese = StyleSheet.create({
  wrapper: {
    flex: 1,
    alignItems: 'center',
    paddingBottom: IS_ANDROID ? 0 : 10,
    paddingHorizontal: 10,
  },
});

export default CoordsControls;
