import {Platform} from 'react-native';

export const IS_ANDROID = Platform.OS === 'android';

export function sortByProperty(a, b) {
  if (a > b) {
    return -1;
  } else if (a < b) {
    return 1;
  } else {
    return 0;
  }
}

export const createPointsShapeSource = (coordinates) => ({
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      geometry: {
        type: 'MultiPoint',
        coordinates: coordinates.map((coordinate) => [
          coordinate.lng,
          coordinate.lat,
        ]),
      },
    },
  ],
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

export const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export const timestampToDate = (timestamp) => {
  const currentDate = new Date(timestamp);
  const date = currentDate.getDate();
  const month = currentDate.getMonth();
  const year = currentDate.getFullYear();

  const pad = (n) => (n < 10 ? '0' + n : n);
  const formatedDate = `${pad(date)} ${MONTH_NAMES[month]} ${year}`;

  return formatedDate;
};

export const isPlural = (number) => number !== 1;
