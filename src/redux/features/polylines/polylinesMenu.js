import React, {useEffect} from 'react';
import {
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';

import {useSelector} from 'react-redux';
import {selectAllPolylines} from './polylinesSlice';

import {commonStyles} from '../../../styles';

const PolylinesMenu = () => {
  const polylines = useSelector(selectAllPolylines);

  useEffect(() => {
    console.log('polylines: ', polylines);
  }, [polylines]);

  return (
    <ScrollView style={[commonStyles.listContainer]}>
      {polylines.length > 0 &&
        polylines.map((polyline) => (
          <View key={polyline._id} style={[commonStyles.listItem]}>
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
            <View style={[commonStyles.listControls]}>
              <TouchableOpacity
                onPress={() => console.log('removal id: ', polyline._id)}>
                <Icon name={'delete'} size={30} color="#FF0033" />
              </TouchableOpacity>
            </View>
          </View>
        ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  listButton: {
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
  },
});

export default PolylinesMenu;
