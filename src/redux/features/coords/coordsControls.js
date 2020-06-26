import React, {useState, useRef, useEffect} from 'react';
import {StyleSheet} from 'react-native';

import {useDispatch} from 'react-redux';
import {addCoord} from './coordsSlice';

import BottomToolbar from 'react-native-bottom-toolbar';
import Icon from 'react-native-vector-icons/AntDesign';
import {BleManager} from 'react-native-ble-plx';
import {IS_ANDROID, BLUETOOTH_CONFIG} from '../../../utils';

const CoordsControls = ({currentLocation}) => {
  const [isBuildingRoute, setIsBuildingRoute] = useState(false);
  const [info, setInfo] = useState('');
  const [values, setValues] = useState({});

  const dispatch = useDispatch();

  const manager = useRef({});
  const _id = useRef(0);

  const getId = () => _id.current;
  const incrementId = () => (_id.current += 1);
  const setError = (message) => setInfo('ERROR: ' + message);
  const updateValue = (key, value) => setValues((v) => ({...v, [key]: value}));

  const scanAndConnect = () => {
    this.manager.startDeviceScan(null, null, (error, device) => {
      this.info('Scanning...');
      console.log(device);

      if (error) {
        this.error(error.message);
        return;
      }

      if (device.name === 'TI BLE Sensor Tag' || device.name === 'SensorTag') {
        this.info('Connecting to TI Sensor');
        this.manager.stopDeviceScan();
        device
          .connect()
          .then((device) => {
            this.info('Discovering services and characteristics');
            return device.discoverAllServicesAndCharacteristics();
          })
          .then((device) => {
            this.info('Setting notifications');
            return this.setupNotifications(device);
          })
          .then(
            () => {
              this.info('Listening...');
            },
            (error) => {
              this.error(error.message);
            },
          );
      }
    });
  };

  useEffect(() => {
    manager.current = new BleManager();

    if (!IS_ANDROID) {
      manager.onStateChange((state) => {
        if (state === 'PoweredOn') scanAndConnect();
      });
    } else {
      scanAndConnect();
    }
  }, []);

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
