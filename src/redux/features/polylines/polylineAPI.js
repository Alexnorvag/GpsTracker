import {dbPolyline} from '../../../db';

export const polylineAPI = {
  fetchAll: async (callback) => {
    try {
      const res = await dbPolyline.findAsync({});
      //    dbPolyline.findAsync({}, function (err, docs) {
      //     callback(docs);
      //     // console.log('polylines: ', docs);
      //     // return docs;
      //   });

      return res;
    } catch (error) {
      console.log(`😲 polylines finding failed: ${e}`);
    }
  },
  createOne: () => {
    try {
      return dbPolyline.insert([{a: 5}, {a: 42}], function (err, newDocs) {
        console.log('new insert: ', newDocs);
      });
    } catch (error) {
      console.log(`😲 polylines inserting failed: ${e}`);
    }
  },
};
