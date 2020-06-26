import React, {useState, useRef} from 'react';
import {View, Text, Modal} from 'react-native';
import {BleManager} from 'react-native-ble-plx';
import {IS_ANDROID, BLUETOOTH_CONFIG} from '../../utils';

const BluetoothManager = () => {
  const [info, setInfo] = useState('');
  const [values, setValues] = useState({});

  const manager = useRef({});

  const setError = (message) => setInfo('ERROR: ' + message);
  const updateValue = (key, value) => setValues((v) => ({...v, [key]: value}));

  const scanAndConnect = () => {
    manager.current.startDeviceScan(null, null, (error, device) => {
      setInfo('Scanning...');
      console.log(device);

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

    if (!IS_ANDROID) {
      manager.onStateChange((state) => {
        if (state === 'PoweredOn') scanAndConnect();
      });
    } else {
      scanAndConnect();
    }
  }, []);

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => {
        Alert.alert('Modal has been closed.');
      }}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalText}>Hello World!</Text>

          <TouchableHighlight
            style={{...styles.openButton, backgroundColor: '#2196F3'}}
            onPress={() => {
              setModalVisible(!modalVisible);
            }}>
            <Text style={styles.textStyle}>Hide Modal</Text>
          </TouchableHighlight>
        </View>
      </View>
    </Modal>
  );
};

export default BluetoothManager;
