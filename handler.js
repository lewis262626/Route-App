import * as dynamoDbLib from "./libs/dynamo-lib";
import { success, failure } from "./libs/response-lib";

export const hello = async (event, context) => {
  const data = JSON.parse(event.body);

  const params = {
    TableName: process.env.tableName,

    Key: {
      icao: data.icao,
    }
  };

  try {
    const results = await dynamoDbLib.call("get", params);

    if (results.Item) {
      return success(results.Item);
    } else {
      return failure({ status: false, error: "item not found"});
    }
  } catch (e) {
    return failure({ status: false});
  }
};