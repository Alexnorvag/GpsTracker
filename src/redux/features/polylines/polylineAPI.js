import {dbPolyline} from '../../../db';

export const polylineAPI = {
  fetchAll: async () => {
    try {
      return await dbPolyline.findAsync({});
    } catch (error) {
      console.log(`😲 polylines finding failed: ${e}`);
    }
  },
  createOne: async (newDoc) => {
    try {
      return await dbPolyline.insertAsync(newDoc);
    } catch (error) {
      console.log(`😲 polylines inserting failed: ${e}`);
    }
  },
};
