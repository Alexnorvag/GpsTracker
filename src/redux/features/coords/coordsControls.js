import React, {useState, useRef, useEffect} from 'react';
import {Alert, StyleSheet} from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import _ from 'lodash';
import shortid from 'shortid';

import {useDispatch} from 'react-redux';
import {addCoord, addPointCoord} from './coordsSlice';
import {createPolyline} from '../../features/polylines/polylinesSlice';

import BottomToolbar from 'react-native-bottom-toolbar';
import Icon from 'react-native-vector-icons/AntDesign';
import {IS_ANDROID} from '../../../utils';

const CoordsControls = ({currentLocation, changeModalState}) => {
  const [isBuildingRoute, setIsBuildingRoute] = useState(false);

  const dispatch = useDispatch();

  const watchID = useRef(0);
  const coordId = useRef(0);
  const polyline = useRef({lines: [], points: []});

  const getCoordId = () => coordId.current++;

  const createNewPolyline = () => {
    polyline.current.points.unshift(_.head(polyline.current.lines));
    polyline.current.points.push(_.last(polyline.current.lines));

    dispatch(
      createPolyline({
        ...polyline.current,
        name: shortid.generate(),
      }),
    );

    coordId.current = 0;
    polyline.current.lines = [];
    polyline.current.points = [];
  };

  const isPolylineValid = (polyline) => polyline.lines.length > 2;

  const creatingPolylineHandler = () => {
    isPolylineValid(polyline.current)
      ? createNewPolyline()
      : Alert.alert(
          'Polyline creating failed 🙁',
          "Can't create a new polyline. The distance between two points is too small.",
          [{text: 'OK'}],
          {cancelable: true},
        );
  };

  useEffect(() => {
    watchID.current = Geolocation.watchPosition(
      (position) => {
        const coord = {
          id: getCoordId(),
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };

        polyline.current.lines.push(coord);

        dispatch(addCoord(coord));
      },
      (error) => console.log('error: ', error.message),
      {
        enableHighAccuracy: true,
        timeout: 20000,
        maximumAge: 1000,
        distanceFilter: 11,
      },
    );

    console.log('Started watching with id: ', watchID.current);

    return () =>
      watchID.current !== null && Geolocation.clearWatch(watchID.current);
  }, []);

  return (
    <BottomToolbar wrapperStyle={stylese.wrapper}>
      <BottomToolbar.Action
        title="Build"
        iconName="plus"
        IconElement={<Icon name="plus" size={30} color="black" />}
        onPress={creatingPolylineHandler}
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

          const point = {
            lat,
            lng,
          };

          polyline.current.points.push(point);
          dispatch(addPointCoord(point));
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
