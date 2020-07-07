import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import SideMenu from 'react-native-side-menu-updated';

const window = Dimensions.get('window');

const PolylinesManager = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSideMenu = () => setIsOpen((state) => !state);
  const updateSideMenuState = (isOpen) => setIsOpen(isOpen);

  return (
    // <SafeAreaView>
      <SideMenu
        // menu={
        //   <View style={styles.menu}>
        //     <Text>Menu</Text>
        //   </View>
        // }
        isOpen={isOpen}
        onChange={(isOpen) => updateSideMenuState(isOpen)}>
        <View style={styles.container}>
          <Text>Side bar content</Text>
        </View>
        <TouchableOpacity onPress={toggleSideMenu} style={styles.button}>
          <Text>Side</Text>
        </TouchableOpacity>
      </SideMenu>
    // </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  menu: {
    flex: 1,
    width: window.width,
    height: window.height,
    backgroundColor: 'gray',
    padding: 20,
  },
  button: {
    position: 'absolute',
    top: 20,
    padding: 10,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
});

export default PolylinesManager;
