import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import {BleManager} from 'react-native-ble-plx';
import {IS_ANDROID, BLUETOOTH_CONFIG} from '../../utils';

const BluetoothManager = ({modalVisible, changeModalState}) => {
  const [info, setInfo] = useState('');
  const [values, setValues] = useState({});
  const [devices, setDevices] = useState([]);
  const [isScanning, setIsScanning] = useState(false);
  const devs = useRef([]);

  const manager = useRef({});

  const isDeviceExist = (devices, device) => {
    if (devices.length < 1) return false;
    const isExist = devices.some((_device) => _device.id === device.id);

    return isExist;
  };

  const setError = (message) => setInfo('ERROR: ' + message);
  const updateValue = (key, value) => setValues((v) => ({...v, [key]: value}));

  const stopScanning = () => {
    manager.current.stopDeviceScan();
    setInfo('Stopped');
    setIsScanning(false);
  };

  const scanDevices = () => {
    manager.current.startDeviceScan(null, null, (error, device) => {
      setInfo('Scanning...');
      setIsScanning(true);
      if (!isDeviceExist(devs.current, device)) {
        devs.current = [...devs.current, device];
      }

      setDevices(devs.current);

      if (error) {
        setError(error.message);
        return;
      }
    });

    setTimeout(stopScanning, 30000);
  };

  const connectToDevice = (selectedDevice) => {
    const deviceName =
      selectedDevice.localname || selectedDevice.name || selectedDevice.id;
    console.log('selected device: ', deviceName);
    stopScanning()
    setInfo(`Connecting to ${deviceName}`);
  };

  // if (device.name === 'TI BLE Sensor Tag' || device.name === 'SensorTag') {
  //   setInfo('Connecting to TI Sensor');
  //   manager.current.stopDeviceScan();
  //   device
  //     .connect()
  //     .then((device) => {
  //       setInfo('Discovering services and characteristics');
  //       return device.discoverAllServicesAndCharacteristics();
  //     })
  //     .then((device) => {
  //       setInfo('Setting notifications');
  //       return setupNotifications(device);
  //     })
  //     .then(
  //       () => {
  //         setInfo('Listening...');
  //       },
  //       (error) => {
  //         setError(error.message);
  //       },
  //     );
  // }
  // });

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

  useEffect(() => {
    manager.current = new BleManager();
    console.log('manager: ', manager.current);

    if (!IS_ANDROID) {
      manager.onStateChange((state) => {
        if (state === 'PoweredOn') scanDevices();
      });
    } else {
      scanDevices();
    }
  }, []);

  return (
    <Modal
      animationType="slide"
      visible={modalVisible}
      onRequestClose={changeModalState}>
      <View style={styles.infoWrapper}>
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
      <ScrollView style={styles.bleScrollContainer}>
        {devices.map((device, index) => (
          <TouchableOpacity
            key={index}
            style={styles.bleItemWrapper}
            onPress={() => connectToDevice(device)}>
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
