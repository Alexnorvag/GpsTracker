import DataStore from 'react-native-local-mongodb';
import AsyncStorage from '@react-native-community/async-storage';

export const dbPolyline = new DataStore({
  filename: 'polylines',
  autoload: true,
  storage: AsyncStorage,
  timestampData: true,
});
