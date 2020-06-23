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
