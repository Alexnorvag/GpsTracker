import {Platform} from 'react-native';

export const IS_ANDROID = Platform.OS === 'android';

export function onSortOptions(a, b) {
  if (a.label < b.label) {
    return -1;
  }

  if (a.label > b.label) {
    return 1;
  }

  return 0;
}

export const createShapeSource = (coordinates) => ({
  type: 'FeatureCollection',
  features: coordinates.map((coordinate) => ({
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [coordinate.lng, coordinate.lat],
    },
  })),
});

export const createPointsShapeSource = (coordinates) => ({
  type: 'FeatureCollection',
  features: coordinates.map((coordinate) => ({
    type: 'Feature',
    geometry: {
      type: 'MultiPoint',
      coordinates: coordinates.map((coordinate) => [
        coordinate.lng,
        coordinate.lat,
      ]),
    },
  })),
});

export const createPolylineShapeSource = (coordinates) => ({
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'LineString',
        coordinates: coordinates.map((coordinate) => [
          coordinate.lng,
          coordinate.lat,
        ]),
      },
    },
  ],
});

export const BLUETOOTH_CONFIG = {
  prefixUUID: 'f000aa',
  suffixUUID: '-0451-4000-b000-000000000000',
  sensors: {
    0: 'Temperature',
    1: 'Accelerometer',
    2: 'Humidity',
    3: 'Magnetometer',
    4: 'Barometer',
    5: 'Gyroscope',
  },
  serviceUUID: function (num) {
    return this.prefixUUID + num + '0' + this.suffixUUID;
  },
  notifyUUID: function (num) {
    return this.prefixUUID + num + '1' + this.suffixUUID;
  },
  writeUUID: function (num) {
    return this.prefixUUID + num + '2' + this.suffixUUID;
  },
};
