import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableHighlight,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import {BleManager} from 'react-native-ble-plx';
import {IS_ANDROID, BLUETOOTH_CONFIG} from '../../utils';

const BluetoothManager = ({modalVisible, changeModalState}) => {
  const [info, setInfo] = useState('');
  const [values, setValues] = useState({});

  const manager = useRef({});

  const setError = (message) => setInfo('ERROR: ' + message);
  const updateValue = (key, value) => setValues((v) => ({...v, [key]: value}));

  const scanAndConnect = () => {
    manager.current.startDeviceScan(null, null, (error, device) => {
      setInfo('Scanning...');
      console.log(device.id);

      if (error) {
        setError(error.message);
        return;
      }

      if (device.name === 'TI BLE Sensor Tag' || device.name === 'SensorTag') {
        setInfo('Connecting to TI Sensor');
        manager.current.stopDeviceScan();
        device
          .connect()
          .then((device) => {
            setInfo('Discovering services and characteristics');
            return device.discoverAllServicesAndCharacteristics();
          })
          .then((device) => {
            setInfo('Setting notifications');
            return setupNotifications(device);
          })
          .then(
            () => {
              setInfo('Listening...');
            },
            (error) => {
              setError(error.message);
            },
          );
      }
    });
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
        if (state === 'PoweredOn') scanAndConnect();
      });
    } else {
      scanAndConnect();
    }
  }, []);

  return (
    <View style={styles.centeredView}>
      <Modal
        animationType="slide"
        visible={modalVisible}
        onRequestClose={changeModalState}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text>{info}</Text>
          </View>
        </View>
        <View style={styles.closeButton}>
          <TouchableOpacity onPress={changeModalState}>
            <Icon name={'close'} size={24} color={'black'} />
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    position: 'absolute',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    alignItems: 'center',
    elevation: 5,
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
});

export default BluetoothManager;
