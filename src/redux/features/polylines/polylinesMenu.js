import React, {useEffect, useState} from 'react';
import {
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import Icon from 'react-native-vector-icons/AntDesign';
import _ from 'lodash';

import {useSelector} from 'react-redux';
import {selectAllPolylines} from './polylinesSlice';

import {commonStyles} from '../../../styles';

const PolylinesMenu = () => {
  const [isAllSelected, setIsAllSelected] = useState(false);
  const [selectedList, setSelectedList] = useState([]);
  const polylines = useSelector(selectAllPolylines);

  isAllItemsSelected = () => polylines.length === selectedList.length;

  changeAllItemsSelecting = () => {
    isAllSelected
      ? setSelectedList([])
      : setSelectedList(polylines.map((polyline) => polyline._id));
    setIsAllSelected(!isAllSelected);
  };

  changeItemSelecting = (itemId) =>
    setSelectedList((list) =>
      isItemIncludes(itemId)
        ? list.filter((_itemId) => _itemId !== itemId)
        : [...list, itemId],
    );

  isItemIncludes = (itemId) => selectedList.includes(itemId);

  console.log('RESULT LIST: ', selectedList);

  useEffect(() => {
    setIsAllSelected(isAllItemsSelected());
  }, [selectedList]);

  useEffect(() => {
    console.log('polylines: ', polylines);
  }, [polylines]);

  return (
    <View style={styles.menuContainer}>
      <View style={styles.menuControls}>
        <TouchableOpacity
          style={styles.selectAllContainer}
          onPress={changeAllItemsSelecting}>
          <CheckBox
            boxType={'square'}
            lineWidth={1}
            disabled={false}
            value={isAllSelected}
            // value={isAllItemsSelected()}
            onChange={changeAllItemsSelecting}
            animationDuration={0.35}
          />
          <Text>Select All</Text>
        </TouchableOpacity>
        <Text>Delete</Text>
        <Text>Open</Text>
        <Text>Rename</Text>
      </View>
      <ScrollView style={[commonStyles.listContainer]}>
        {polylines.length > 0 &&
          polylines.map((polyline) => (
            <View key={polyline._id} style={[commonStyles.listItem]}>
              <View style={styles.cbContainer}>
                <CheckBox
                  boxType={'square'}
                  lineWidth={1}
                  disabled={false}
                  value={isItemIncludes(polyline._id)}
                  onValueChange={() => changeItemSelecting(polyline._id)}
                  animationDuration={0.35}
                />
              </View>
              <TouchableOpacity
                key={polyline._id}
                style={[commonStyles.listButton, styles.listButton]}>
                <View
                  style={{
                    backgroundColor: 'red',
                    flex: 1,
                    flexDirection: 'column',
                  }}>
                  <Text>{`Polyline: ${polyline.name}`}</Text>
                </View>
              </TouchableOpacity>
              <View style={[commonStyles.listControls, styles.listControls]}>
                <TouchableOpacity
                  onPress={() => console.log('removal id: ', polyline._id)}>
                  <Icon name={'delete'} size={30} color="#FF0033" />
                </TouchableOpacity>
              </View>
            </View>
          ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  menuContainer: {
    flex: 1,
    flexDirection: 'column',
  },
  menuControls: {
    flexDirection: 'row',
    // backgroundColor: 'blue',
  },
  selectAllContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cbContainer: {
    paddingHorizontal: 10,
  },
  listButton: {
    // borderRadius: 0,
  },
  listControls: {
    // borderRadius: 0,
  },
});

export default PolylinesMenu;
