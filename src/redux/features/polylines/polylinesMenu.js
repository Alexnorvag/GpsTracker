import React, {useEffect, useState, useRef, createRef} from 'react';
import {
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
} from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import Icon from 'react-native-vector-icons/AntDesign';
import _ from 'lodash';

import {useSelector, useDispatch} from 'react-redux';
import {
  selectAllPolylines,
  updatePolyline,
  deleteManyPolylines,
} from './polylinesSlice';

import {timestampToDate, isPlural} from '../../../utils';
import {commonStyles} from '../../../styles';

const PolylinesMenu = ({buildPolyline}) => {
  const [isAllSelected, setIsAllSelected] = useState(false);
  const [selectedList, setSelectedList] = useState([]);
  const [selectedItemId, setSelectedItemId] = useState('');
  const [textItemValue, setTextItemValue] = useState('');
  const polylines = useSelector(selectAllPolylines);
  const collectionRef = useRef(polylines.map(() => createRef()));

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

  changeItemName = (text) => setTextItemValue(text);

  inputBlurHandler = (currentItemId, currItemName) => {
    if (!_.isEmpty(selectedItemId) && textItemValue !== currItemName) {
      dispatch(
        updatePolyline({
          _id: currentItemId,
          name: textItemValue,
        }),
      );
    }
    setTextItemValue('');
    setSelectedItemId('');
  };

  useEffect(() => setIsAllSelected(isAllItemsSelected()), [
    polylines,
    selectedList,
  ]);

  // useEffect(() => {
  //   console.log('polylines: ', polylines);
  // }, [polylines]);

  return (
    <View style={styles.menuContainer}>
      <View style={styles.menuControlsContainer}>
        <TouchableOpacity
          style={[styles.menuControls]}
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
          style={[styles.menuControls, styles.deleteItemsContol]}
          onPress={() => {
            dispatch(deleteManyPolylines(selectedList));
            selectedList.map((item) =>
              console.log('id to delete item: ', item),
            );
          }}>
          <Icon name={'delete'} size={25} color="#FFF" />
          <Text style={[styles.menuControlsLabels, styles.deleteItemsLabel]}>
            Delete
          </Text>
        </TouchableOpacity>
      </View>
      <ScrollView style={[commonStyles.listContainer]}>
        {!_.isEmpty(polylines) &&
          polylines.map((polyline, index) => (
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
                style={[commonStyles.listItemContent, styles.listItemContainer]}
                onPress={() => buildPolyline(polyline._id)}>
                <TextInput
                  style={styles.itemInput}
                  ref={collectionRef.current[index]}
                  onFocus={() => {
                    setSelectedItemId(polyline._id);
                    setTextItemValue(polyline.name);
                  }}
                  onBlur={() => inputBlurHandler(polyline._id, polyline.name)}
                  onChangeText={changeItemName}>
                  {polyline.name}
                </TextInput>
                <View style={styles.itemDescriptionContainer}>
                  <Text style={styles.itemDescription}>{`${
                    polyline.points?.length || 0
                  } location${
                    isPlural(polyline.points?.length || 0) ? 's' : ''
                  }`}</Text>
                  <Text style={styles.itemDescription}>{`${timestampToDate(
                    polyline.createdAt,
                  )} - ${timestampToDate(polyline.updatedAt)}`}</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  if (_.isEmpty(textItemValue) && _.isEmpty(selectedItemId)) {
                    buildPolyline(polyline._id);
                  }
                }}>
                <Icon
                  name={
                    selectedItemId === polyline._id
                      ? textItemValue === polyline.name
                        ? 'closecircleo'
                        : 'checkcircleo'
                      : 'rightcircleo'
                  }
                  size={25}
                  color="#000"
                />
              </TouchableOpacity>
              <View
                style={[commonStyles.listItemControls, styles.listControls]}>
                <TouchableOpacity
                  onPress={() => {
                    collectionRef.current[index].current.focus();
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
  deleteItemsContol: {
    borderColor: '#FFF',
    backgroundColor: '#FF0033',
  },
  deleteItemsLabel: {
    color: '#FFF',
  },
  listItemContainer: {
    flex: 1,
    flexDirection: 'column',
  },
  itemInput: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  itemDescriptionContainer: {
    flexDirection: 'column',
  },
  itemDescription: {
    color: '#383838',
    paddingTop: 4,
  },
});

export default PolylinesMenu;
