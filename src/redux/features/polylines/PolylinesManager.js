import React, {useState, useEffect} from 'react';
import {View, TouchableOpacity, StyleSheet, Dimensions} from 'react-native';
import {getStatusBarHeight} from 'react-native-status-bar-height';
import SideMenu from 'react-native-side-menu-updated';
import Icon from 'react-native-vector-icons/AntDesign';

import {useDispatch} from 'react-redux';
import {fetchPolylines, deletePolylines} from './polylinesSlice';
import PolylinesMenu from './polylinesMenu';

import Map from '../../../components/map/map';

const window = Dimensions.get('window');

const PolylinesManager = () => {
  const [isOpen, setIsOpen] = useState(true);

  const dispatch = useDispatch();

  const toggleSideMenu = () => setIsOpen((state) => !state);
  const updateSideMenuState = (isOpen) => setIsOpen(isOpen);

  useEffect(() => {
    // dispatch(deletePolylines());
    // Get all polylines from db
    dispatch(fetchPolylines());
  }, []);

  return (
    // <SafeAreaView style={styles.container}>
    <SideMenu
      menu={
        <View style={styles.menu}>
          <PolylinesMenu toggleSideMenu={toggleSideMenu} />
        </View>
      }
      isOpen={isOpen}
      openMenuOffset={window.width - 40}
      onChange={(isOpen) => updateSideMenuState(isOpen)}>
      <View style={styles.container}>
        <Map />
      </View>
      <TouchableOpacity onPress={toggleSideMenu} style={styles.openMenuButton}>
        <Icon
          name={isOpen ? 'doubleleft' : 'doubleright'}
          size={25}
          color="black"
        />
      </TouchableOpacity>
    </SideMenu>
    // </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  menu: {
    flex: 1,
    backgroundColor: '#FFF',
    padding: 0,
    margin: 0,
  },
  openMenuButton: {
    position: 'absolute',
    top: (window.height - 55) / 2 - getStatusBarHeight(),
    paddingHorizontal: 5,
    paddingVertical: 15,
    borderBottomRightRadius: 12,
    borderTopRightRadius: 12,
    backgroundColor: '#F5F5F5',
  },
  container: {
    flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
    // backgroundColor: '#F5FCFF',
  },
});

export default PolylinesManager;
