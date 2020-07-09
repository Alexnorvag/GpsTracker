import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  // SafeAreaView,
  Dimensions,
} from 'react-native';
import SideMenu from 'react-native-side-menu-updated';
import Icon from 'react-native-vector-icons/AntDesign';

import Map from '../../../components/map/map';

const window = Dimensions.get('window');

const PolylinesManager = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSideMenu = () => setIsOpen((state) => !state);
  const updateSideMenuState = (isOpen) => setIsOpen(isOpen);

  return (
    // <SafeAreaView style={styles.container}>
    <SideMenu
      menu={
        <View style={styles.menu}>
          <TouchableOpacity onPress={toggleSideMenu}>
            <Text>Menu</Text>
          </TouchableOpacity>
        </View>
      }
      // edgeHitWidth={250}
      isOpen={isOpen}
      onChange={(isOpen) => updateSideMenuState(isOpen)}>
      <View style={styles.container}>
        {/* <Text>Side bar content</Text> */}
        <Map />
      </View>
      <TouchableOpacity onPress={toggleSideMenu} style={styles.button}>
        <Icon name={'doubleright'} size={25} color="black" />
      </TouchableOpacity>
    </SideMenu>
    // </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  menu: {
    flex: 1,
    backgroundColor: 'gray',
    padding: 80,
    width: window.width,
    height: window.height,
  },
  button: {
    position: 'absolute',
    top: (window.height - 55) / 2,
    paddingHorizontal: 5,
    paddingVertical: 15,
    borderBottomRightRadius: 12,
    borderTopRightRadius: 12,
    backgroundColor: '#FFF',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
});

export default PolylinesManager;
