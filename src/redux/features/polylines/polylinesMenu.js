import React, {useEffect} from 'react';
import {ScrollView, Text, TouchableOpacity} from 'react-native';

import {useSelector} from 'react-redux';
import {selectAllPolylines} from './polylinesSlice';

const PolylinesMenu = () => {
  const polylines = useSelector(selectAllPolylines);

  useEffect(() => {
    console.log('polylines: ', polylines);
  }, [polylines]);

  return (
    <ScrollView>
      {polylines.length > 0 &&
        polylines.map((polyline) => (
          <TouchableOpacity key={polyline._id}>
            <Text>{polyline.name}</Text>
          </TouchableOpacity>
        ))}
    </ScrollView>
  );
};

export default PolylinesMenu;
