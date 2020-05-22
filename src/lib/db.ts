import AWS, { DynamoDB } from "aws-sdk";
import { ExperimentConfig } from "./types";
AWS.config.update({
  accessKeyId: process.env.ACCESS_KEY_ID,
  secretAccessKey: process.env.SECRET_KEY,
  region: "us-east-1",
});

const DYNAMO_ENDPOINT = "http://localhost:8000";

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
