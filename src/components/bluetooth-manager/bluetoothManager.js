import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import {getStatusBarHeight} from 'react-native-status-bar-height';
import Icon from 'react-native-vector-icons/AntDesign';

import {BleManager} from 'react-native-ble-plx';
import base64 from 'react-native-base64';

import {IS_ANDROID, BLUETOOTH_CONFIG} from '../../utils';

const some_test_data = base64.encode('Some string to encode to base64');

const BluetoothManager = ({modalVisible, changeModalState}) => {
  const [info, setInfo] = useState('');
  const [values, setValues] = useState({});
  const [devices, setDevices] = useState([]);
  const [isScanning, setIsScanning] = useState(false);
  // const [isBleOn, setIsBleOn] = useState(false);
  const _devices = useRef([]);
  const manager = useRef({});
  const stopScanningTimer = useRef(null);

  const isDeviceExist = (devices, device) => {
    if (devices.length < 1) return false;
    const isExist = devices.some((_device) => _device.id === device.id);

    return isExist;
  };

  const setError = (message) => setInfo('ERROR: ' + message);
  const updateValue = (key, value) => setValues((v) => ({...v, [key]: value}));

  const startScanning = () => {
    if (!IS_ANDROID) {
      manager.current.onStateChange((state) => {
        if (state === 'PoweredOn') scanDevices();
      });
    } else {
      scanDevices();
    }
  };

  const stopScanning = () => {
    manager.current.stopDeviceScan();
    setInfo('Stopped');
    setIsScanning(false);
  };

  const scanDevices = () => {
    manager.current.startDeviceScan(null, null, (error, device) => {
      setInfo('Scanning...');
      setIsScanning(true);
      console.log('serviceUUIDs: ', device);

      if (device && !isDeviceExist(_devices.current, device)) {
        _devices.current = [..._devices.current, device];
      }

      setDevices(_devices.current);

      if (error) {
        Alert.alert(
          `Ooops! ${error.message}.`,
          `Try to turn on your bluetooth.`,
          // `Say, "Karisha shines as a Sun." 😎 If doesn't helped just try to turn on your bluetooth.`,
          [{text: 'OK 👨‍🔧'}],
          {cancelable: true},
        );
        return;
      }
    });

    stopScanningTimer.current = setTimeout(stopScanning, 20000);
  };

  const connectToDevice = async (selectedDevice) => {
    const deviceName =
      selectedDevice.localname || selectedDevice.name || selectedDevice.id;
    // console.log('($*)!"(*)($!)"($: ', selectedDevice.serviceUUIDs)
    // stopScanning();
    setInfo(`Connecting to ${deviceName}`);

    console.log('selected device: ', selectedDevice.id);

    const device = await manager.current.connectToDevice(selectedDevice.id);

    console.log('device: ', device);

    const full = await device.discoverAllServicesAndCharacteristics();

    console.log('full: ', full);

    const services = await device.services();
    console.log('services: ', services);

    const characteristics = await device.characteristicsForService(services[3].uuid);
    console.log('characteristics: ', characteristics);

    const writing = await device.writeCharacteristicWithResponseForService(
      services[3].uuid,
      characteristics[0].uuid,
      some_test_data,
    );
    console.log('writing: ', writing);

    // selectedDevice
    //   .connect()
    //   .then(async (device) => {
    //     setInfo('Discovering services and characteristics');
    //     // const res = await device.discoverAllServicesAndCharacteristics()
    //     // const services = await res.services(selectedDevice.id)
    //     // console.log('*^&£&*&^*&^*&^*&&^: ', services);
    //     return device.discoverAllServicesAndCharacteristics();
    //   })
    //   .then((device) => {
    //     setInfo('Setting notifications');
    //     // console.log('*^&£&*&^*&^*&^*&: ', device._manager.id);

    //     return manager.current.writeCharacteristicWithResponseForDevice(
    //       selectedDevice.id,
    //       CTLR_XTIC,
    //       'Cg==',
    //       );

    //     // for (const id in BLUETOOTH_CONFIG.sensors) {
    //     //   const service = BLUETOOTH_CONFIG.serviceUUID(id);
    //     //   const characteristicW = BLUETOOTH_CONFIG.writeUUID(id);
    //     //   const characteristicN = BLUETOOTH_CONFIG.notifyUUID(id);

    //     //   device
    //     //     .writeCharacteristicWithResponseForService(
    //     //       CTLR_SVC, CTLR_XTIC, 'Cg==',
    //     //     )
    //     //     .then((characteristic) => {
    //     //       this.info(characteristic.value);
    //     //       return;
    //     //     });
    //     //   // return setupNotifications(device);
    //     // }
    //   })
    //   .then(
    //     () => {
    //       setInfo('Listening...');
    //     },
    //     (error) => {
    //       setError(error.message);
    //     },
    //   );
  };

  const setupNotifications = async (device) => {
    for (const id in BLUETOOTH_CONFIG.sensors) {
      const service = BLUETOOTH_CONFIG.serviceUUID(id);
      const characteristicW = BLUETOOTH_CONFIG.writeUUID(id);
      const characteristicN = BLUETOOTH_CONFIG.notifyUUID(id);

      const characteristic = await device.writeCharacteristicWithResponseForService(
        service,
        characteristicW,
        'AQ==' /* 0x01 in hex */,
      );

      console.log('characteristic: ', characteristic);

      device.monitorCharacteristicForService(
        service,
        characteristicN,
        (error, characteristic) => {
          if (error) {
            setError(error.message);
            return;
          }
          updateValue(characteristic.uuid, characteristic.value);
        },
      );
    }
  };

  useEffect(
    () => {
      // const checkBluetoothState = async (manager) => {
      //   const bleState = (await manager.state()) === 'PoweredOn';
      //   setIsBleOn(bleState);
      // };

      manager.current = new BleManager();

      // checkBluetoothState(manager.current);

      // if (isBleOn) {
      startScanning();
      // }

      return () => {
        clearInterval(stopScanningTimer.current);
        stopScanning();
      };
    },
    [
      /* isBleOn */
    ],
  );

  return (
    <Modal
      animationType="slide"
      visible={modalVisible}
      onRequestClose={changeModalState}>
      <View style={styles.infoWrapper}>
        {!isScanning && (
          <View style={styles.reloadButton}>
            <TouchableOpacity
              onPress={() => {
                setDevices([]);
                startScanning();
              }}>
              <Icon name={'reload1'} size={24} color={'black'} />
            </TouchableOpacity>
          </View>
        )}
        <View style={styles.infoTextWrapper}>
          <Text style={styles.infoText}>{info}</Text>
          {isScanning && (
            <View style={styles.infoSpinner}>
              <ActivityIndicator size="small" color="#000" />
            </View>
          )}
        </View>
        <View style={styles.closeButton}>
          <TouchableOpacity onPress={changeModalState}>
            <Icon name={'close'} size={24} color={'black'} />
          </TouchableOpacity>
        </View>
      </View>
      <Text>{values.value}</Text>
      <ScrollView style={styles.bleScrollContainer}>
        {devices.length > 0 &&
          devices.map((device, index) => (
            <TouchableOpacity
              key={index}
              style={styles.bleItemWrapper}
              onPress={() => {
                stopScanning();
                connectToDevice(device);
              }}>
              <Text>{device.localname || device.name || device.id}</Text>
            </TouchableOpacity>
          ))}
      </ScrollView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  infoWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    top: getStatusBarHeight(true),
    paddingVertical: 10,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
    zIndex: 10000,
  },
  infoTextWrapper: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoText: {
    fontSize: 18,
  },
  infoSpinner: {
    paddingLeft: 5,
  },
  reloadButton: {
    position: 'absolute',
    left: 0,
    paddingHorizontal: 10,
    backgroundColor: 'red',
  },
  closeButton: {
    position: 'absolute',
    right: 0,
    paddingHorizontal: 10,
  },
  bleScrollContainer: {
    paddingTop: 20,
    paddingHorizontal: 10,
  },
  bleItemWrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    margin: 5,
    borderWidth: 2,
    borderRadius: 40,
  },
});

export default BluetoothManager;
