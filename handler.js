import * as dynamoDbLib from "./libs/dynamo-lib";
import { success, failure } from "./libs/response-lib";
import { getDistance } from 'geolib';

export const hello = async (event, context) => {
  const data = JSON.parse(event.body);
  console.log(data.country);

  const params = {
    TableName: process.env.tableName,

    FilterExpression: "runway_length >= :max_length and type_airport = :type and country = :country",
    ExpressionAttributeValues: {
      ":max_length": 7000,
      ":type": "Airports",
      ":country": data.country,
    }
  };

  let airports;
  try {
    const results = await dynamoDbLib.call("scan", params);

    if (results.Items) {
      airports = results.Items;
    } else {
      return failure({ status: false, error: "No airports found" });
    }
  } catch (e) {
    console.log(e);
    return failure({ status: false });
  }

  let i, j;
  let lst = [];
  let backup_lst = [];
  for (i = 0; i < airports.length; i++) {
    for (j = 0; j < airports.length; j++) {
      let distance = getDistance(
        { latitude: parseFloat(airports[i].lat), longitude: parseFloat(airports[i].lon) },
        { latitude: parseFloat(airports[j].lat), longitude: parseFloat(airports[j].lon) }
      );

      if (distance/1000 >= 200) {
        let pair = { airport1: i, airport2: j, distance: distance };
        backup_lst.push(pair);
      }

      if (distance/1000 >= 0.8*data.distance && distance/1000 <= data.distance ) {
        let pair = { airport1: i, airport2: j, distance: distance };
        lst.push(pair);
      }
    }
  }

  if (lst.length == 0) {
    if (backup_lst.length == 0) {
      return failure({ status: false, error: "No airports found" });
    } else {
      lst = backup_lst;
    }
  }

  let randomNum = Math.floor(Math.random() * lst.length);
  let airport_dic = lst[randomNum];
  let resp = {
    'distance': airport_dic.distance / 1000,
    'airport1': airports[airport_dic.airport1],
    'airport2': airports[airport_dic.airport2]
  };
  return success(resp);
};
