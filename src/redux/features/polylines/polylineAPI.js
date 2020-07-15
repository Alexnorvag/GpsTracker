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
  removeAll: async () => {
    try {
      return await dbPolyline.removeAsync({}, {multi: true});
    } catch (error) {
      console.log(`😲 polylines deleting failed: ${e}`);
    }
  },
  removeMany: async (polylinesIds) => {
    try {
      return await dbPolyline.removeAsync(
        {_id: {$in: polylinesIds}},
        {multi: true},
      );
    } catch (error) {
      console.log(`😲 polylines deleting failed: ${e}`);
    }
  },
  removeOne: async (polylineId) => {
    try {
      return await dbPolyline.removeAsync({_id: polylineId});
    } catch (error) {
      console.log(`😲 polylines deleting failed: ${e}`);
    }
  },
  updateOne: async (docId, docName) => {
    try {
      return await dbPolyline.updateAsync({_id: docId}, {name: docName});
    } catch (error) {
      console.log(`😲 polyline updating failed: ${e}`);
    }
  },
};
