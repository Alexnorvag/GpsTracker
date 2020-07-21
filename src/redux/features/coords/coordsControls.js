import React, {useState, useRef, useEffect} from 'react';
import {Alert, View, StyleSheet, Text} from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import _ from 'lodash';
import shortid from 'shortid';

import {useDispatch} from 'react-redux';
import {addCoord, addPointCoord, setCoords, setPoints} from './coordsSlice';
import {createPolyline} from '../../features/polylines/polylinesSlice';

import BottomToolbar from 'react-native-bottom-toolbar';
import Icon from 'react-native-vector-icons/AntDesign';
import {IS_ANDROID} from '../../../utils';

const CoordsControls = ({isViewMode, currentLocation, changeModalState}) => {
  const [isBuildingRoute, setIsBuildingRoute] = useState(false);

  const dispatch = useDispatch();

  const watchID = useRef(0);
  const coordId = useRef(0);
  const polyline = useRef({lines: [], points: []});

  const getCoordId = () => coordId.current++;

  const createNewPoint = () => {
    const {longitude: lng, latitude: lat} = currentLocation();
    const point = {
      lat,
      lng,
    };

    polyline.current.points.push(point);
    dispatch(addPointCoord(point));
  };

  const createNewPolyline = () => {
    polyline.current.points.unshift(_.head(polyline.current.lines));
    polyline.current.points.push(_.last(polyline.current.lines));

    dispatch(
      createPolyline({
        ...polyline.current,
        name: shortid.generate(),
      }),
    );
  };

  const isPolylineValid = (polyline) => polyline.lines.length > 2;

  const creatingPolylineHandler = () =>
    isPolylineValid(polyline.current)
      ? createNewPolyline()
      : Alert.alert(
          'Polyline creating failed 🙁',
          "Can't create a new polyline. The distance between two points is too small.",
          [{text: 'OK'}],
          {cancelable: true},
        );

  const restorePolyline = () => {
    coordId.current = 0;
    polyline.current.lines = [];
    polyline.current.points = [];
    dispatch(setCoords([]));
    dispatch(setPoints([]));
  };

  const stopLocationWatching = () => {
    Geolocation.clearWatch(watchID.current);
    watchID.current = null;
  };

  useEffect(() => {
    if (isBuildingRoute) {
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
    }

    // console.log('Started watching with id: ', watchID.current);

    return () =>
      isBuildingRoute && watchID.current !== null && stopLocationWatching();
  }, [isBuildingRoute]);

  return (
    <BottomToolbar wrapperStyle={styles.wrapper}>
      <BottomToolbar.Action
        title="Build"
        iconName="check"
        IconElement={
          <Icon
            name="check"
            size={30}
            color={isBuildingRoute ? '#000' : '#808080'}
          />
        }
        disabled={!isBuildingRoute}
        onPress={() => {
          setIsBuildingRoute(false);
          creatingPolylineHandler();
          restorePolyline();
        }}
      />
      {isBuildingRoute ? (
        <BottomToolbar.Action
          title={'Add location'}
          iconName={'enviromento'}
          IconElement={
            <View style={styles.locationIconWrapper}>
              <View style={styles.coverIcon}>
                <Icon name={'plus'} size={30} color="#000" />
              </View>
              <Icon name={'enviromento'} size={60} color="#000" />
            </View>
          }
          onPress={createNewPoint}
        />
      ) : (
        <BottomToolbar.Action
          title={'Start'}
          iconName={'playcircleo'}
          IconElement={<Icon name={'playcircleo'} size={60} color="#000" />}
          onPress={() => {
            setIsBuildingRoute(true);
          }}
        />
      )}

      <BottomToolbar.Action
        title="Share"
        iconName="sharealt"
        IconElement={<Icon name="sharealt" size={30} color="black" />}
        onPress={changeModalState}
      />
    </BottomToolbar>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    alignItems: 'center',
    paddingBottom: IS_ANDROID ? 0 : 10,
    paddingHorizontal: 10,
  },
  locationIconWrapper: {
    flexDirection: 'row',
  },
  coverIcon: {
    position: 'absolute',
    left: -20,
    top: 15,
  },
});

export default CoordsControls;
