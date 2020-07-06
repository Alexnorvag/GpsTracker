import React, {useState, useRef, useEffect} from 'react';
import {StyleSheet} from 'react-native';
import Geolocation from '@react-native-community/geolocation';

import {useDispatch, useSelector} from 'react-redux';
import {addCoord, addPointCoord} from './coordsSlice';
import {
  createPolyline,
  selectAllPolylines,
} from '../../features/polylines/polylinesSlice';

import BottomToolbar from 'react-native-bottom-toolbar';
import Icon from 'react-native-vector-icons/AntDesign';
import {IS_ANDROID} from '../../../utils';

const CoordsControls = ({currentLocation, changeModalState}) => {
  const [isBuildingRoute, setIsBuildingRoute] = useState(false);
  const polylines = useSelector(selectAllPolylines);

  const dispatch = useDispatch();

  const watchID = useRef(0);
  const coordId = useRef(0);
  const polylineId = useRef(0);
  const polyline = useRef({name: 'Untitled', lines: [], points: []});

  const getPolylineId = () => polylineId.current++;
  const getCoordId = () => coordId.current++;

  useEffect(() => {
    if (polylines.length > 0) {
      const lastId =
        polylines.reduce((prev, current) =>
          +current.id > +prev.id ? current : prev,
        ).id + 1;

      polylineId.current = lastId;
    }
  }, [polylines]);

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
        onPress={() => {
          dispatch(
            createPolyline({
              id: getPolylineId(),
              ...polyline.current,
              name: `Untitled-${polylineId.current - 1}`,
            }),
          );
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
