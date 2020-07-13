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

import {useSelector, useDispatch} from 'react-redux';
import {selectAllPolylines, updatePolyline} from './polylinesSlice';

import {commonStyles} from '../../../styles';

const PolylinesMenu = ({toggleSideMenu}) => {
  const [isAllSelected, setIsAllSelected] = useState(false);
  const [selectedList, setSelectedList] = useState([]);
  const polylines = useSelector(selectAllPolylines);

  const dispatch = useDispatch();

  isAllItemsSelected = () =>
    !_.isEmpty(polylines) && polylines.length === selectedList.length;

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

  useEffect(() => setIsAllSelected(isAllItemsSelected()), [
    polylines,
    selectedList,
  ]);

  useEffect(() => {
    console.log('polylines: ', polylines);
  }, [polylines]);

  return (
    <View style={styles.menuContainer}>
      <View style={styles.menuControlsContainer}>
        <TouchableOpacity
          style={[styles.selectAllContainer, styles.menuControls]}
          onPress={changeAllItemsSelecting}>
          <CheckBox
            lineWidth={1}
            value={isAllSelected}
            onChange={changeAllItemsSelecting}
            animationDuration={0}
            onCheckColor={'#000'}
            onTintColor={'#000'}
          />
          <Text style={styles.menuControlsLabels}>Select All</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.menuControls]}>
          <Icon name={'sharealt'} size={25} color="#000" />
          <Text style={[styles.menuControlsLabels]}>Share</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.menuControls, styles.deleteItemsContol]}>
          <Icon name={'delete'} size={25} color="#FFF" />
          <Text style={[styles.menuControlsLabels, styles.deleteItemsLabel]}>
            Delete
          </Text>
        </TouchableOpacity>
      </View>
      <ScrollView style={[commonStyles.listContainer]}>
        {!_.isEmpty(polylines) &&
          polylines.map((polyline) => (
            <View key={polyline._id} style={[commonStyles.listItem]}>
              <CheckBox
                lineWidth={1}
                value={isItemIncludes(polyline._id)}
                onValueChange={() => changeItemSelecting(polyline._id)}
                animationDuration={0.27}
                onCheckColor={'#000'}
                onTintColor={'#000'}
              />
              <TouchableOpacity
                key={polyline._id}
                style={[commonStyles.listItemContent, styles.listButton]}
                onPress={toggleSideMenu}>
                <View
                  style={{
                    backgroundColor: 'red',
                    flex: 1,
                    flexDirection: 'column',
                  }}>
                  <Text>{`Polyline: ${polyline.name}`}</Text>
                </View>
              </TouchableOpacity>
              <View
                style={[commonStyles.listItemControls, styles.listControls]}>
                <TouchableOpacity
                  onPress={() => {
                    dispatch(updatePolyline({_id: polyline._id, name: 'test-1'}));
                  }}>
                  <Icon name={'edit'} size={25} color="#000" />
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
  menuControlsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#F5F5F5',
    paddingVertical: 7,
    paddingHorizontal: 10,
  },
  menuControls: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 25,
    paddingHorizontal: 9,
    paddingVertical: 5,
    backgroundColor: '#FFF',
  },
  menuControlsLabels: {
    paddingHorizontal: 5,
  },
  selectAllContainer: {
    // paddingVertical: 7,
    // flexDirection: 'row',
    // alignItems: 'center',
  },
  deleteItemsContol: {
    borderColor: '#FFF',
    backgroundColor: '#FF0033',
  },
  deleteItemsLabel: {
    color: '#FFF',
  },
  listButton: {
    // borderRadius: 0,
  },
  listControls: {
    // borderRadius: 0,
  },
});

export default PolylinesMenu;
