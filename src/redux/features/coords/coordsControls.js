import React, {useState, useRef, useEffect} from 'react';
import {StyleSheet} from 'react-native';
import Geolocation from '@react-native-community/geolocation';

import {useDispatch} from 'react-redux';
import {addCoord, addPointCoord} from './coordsSlice';
import {fetchPolylines, createPolyline} from '../../features/polylines/polylinesSlice';

import BottomToolbar from 'react-native-bottom-toolbar';
import Icon from 'react-native-vector-icons/AntDesign';
import {IS_ANDROID} from '../../../utils';

const CoordsControls = ({currentLocation, changeModalState}) => {
  const [isBuildingRoute, setIsBuildingRoute] = useState(false);

  const dispatch = useDispatch();

  const watchID = useRef(0);
  const coordId = useRef(0);

  const getCoordId = () => coordId.current++;

  useEffect(() => {
    watchID.current = Geolocation.watchPosition(
      (position) => {
        dispatch(
          addCoord({
            id: getCoordId(),
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          }),
        );
      },
      (error) => console.log('error: ', error.message),
      {
        enableHighAccuracy: true,
        timeout: 20000,
        maximumAge: 1000,
        distanceFilter: 30,
      },
    );

    return () =>
      watchID.current !== null && Geolocation.clearWatch(watchID.current);
  }, []);

  return (
    <BottomToolbar wrapperStyle={stylese.wrapper}>
      <BottomToolbar.Action
        title="Build"
        iconName="check"
        IconElement={<Icon name="check" size={30} color="black" />}
        onPress={(index, propsOfThisAction) => {
          // console.warn(index + ' title: ' + propsOfThisAction.title)
          dispatch(fetchPolylines());
        }}
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
          const {longitude: lng, latitude: lat} = currentLocation();

          dispatch(
            addPointCoord({
              lat,
              lng,
            }),
          );
        }}
      />
      <BottomToolbar.Action
        title="Share"
        iconName="sharealt"
        IconElement={<Icon name="sharealt" size={30} color="black" />}
        onPress={changeModalState}
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
