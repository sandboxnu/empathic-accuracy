import AWS, { DynamoDB } from "aws-sdk";
import { ExperimentConfig, ExperimentData, ExperimentDataEntry } from "./types";
AWS.config.update({
  accessKeyId: process.env.ACCESS_KEY_ID,
  secretAccessKey: process.env.SECRET_KEY,
  region: "us-east-1",
});

const DYNAMO_ENDPOINT = process.env.DYNAMO_ENDPOINT;

const dynamodb = new AWS.DynamoDB({ endpoint: DYNAMO_ENDPOINT });
const docClient = new AWS.DynamoDB.DocumentClient({
  endpoint: DYNAMO_ENDPOINT,
});
const table = "empathic-accuracy";

export async function setupTable() {
  await dynamodb
    .createTable({
      TableName: table,
      KeySchema: [{ AttributeName: "id", KeyType: "HASH" }],
      AttributeDefinitions: [{ AttributeName: "id", AttributeType: "S" }],
      BillingMode: "PAY_PER_REQUEST",
    })
    .promise();
}

export async function getConfig(
  experimentId: number
): Promise<ExperimentConfig | undefined> {
  const data = await docClient
    .get({
      TableName: table,
      Key: { id: `CONFIG-${experimentId}` },
    })
    .promise();
  return data.Item?.config as ExperimentConfig;
}

export async function setConfig(
  experimentId: number,
  config: ExperimentConfig
) {
  await docClient
    .update({
      TableName: table,
      Key: {
        id: `CONFIG-${experimentId}`,
      },
      UpdateExpression: `SET config=:config`,
      ExpressionAttributeValues: {
        ":config": config,
      },
    })
    .promise();
}

export async function getAllData(
  experimentId: number
): Promise<ExperimentData> {
  const data = await docClient
    .get({ TableName: table, Key: { id: `DATA-${experimentId}` } })
    .promise();
  return data.Item?.subjectData as ExperimentData;
}

export async function putDataEntry(
  experimentId: number,
  dataEntry: ExperimentDataEntry
) {
  await docClient
    .update({
      TableName: table,
      Key: {
        id: `DATA-${experimentId}`,
      },
      UpdateExpression: `SET subjectData=list_append(if_not_exists(subjectData, :empty_list), :data_entry)`,
      ExpressionAttributeValues: {
        ":data_entry": [dataEntry],
        ":empty_list": [],
      },
    })
    .promise();
}
