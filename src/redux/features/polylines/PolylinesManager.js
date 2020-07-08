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
      <View style={styles.cont}>
        <SideMenu
          menu={
            <View style={styles.menu}>
              <TouchableOpacity onPress={toggleSideMenu}><Text>Menu</Text></TouchableOpacity>
            </View>
          }
          edgeHitWidth={250}
          isOpen={isOpen}
          onChange={(isOpen) => updateSideMenuState(isOpen)}>
          <View style={styles.container}>
            <Text>Side bar content</Text>
          </View>
          <TouchableOpacity onPress={toggleSideMenu} style={styles.button}>
            <Text>Side</Text>
          </TouchableOpacity>
        </SideMenu>
      </View>
    // </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  cont: {
    position: 'absolute',
    top: 50,
    width: 100,
    height: 50,
    // flex: 1,
    padding: 20,
    // width: window.width,
    // height: window.height,
  },
  menu: {
    // flex: 1,
    backgroundColor: 'gray',
    padding: 20,
  },
  button: {
    position: 'absolute',
    top: 20,
    padding: 50,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
});

export default PolylinesManager;
