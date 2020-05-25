import AWS, { DynamoDB } from "aws-sdk";
import { v4 as uuidv4 } from "uuid";
import { ExperimentConfig, ExperimentData, ExperimentDataEntry } from "./types";
import sampleConfig from "./sampleConfig";
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

type DBConfig = { id: string; nickname: string; config: ExperimentConfig };
type DBData = {
  id: string;
  subjectData: ExperimentData;
};

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

export async function createExperiment(): Promise<string> {
  const exId = uuidv4();
  const exp: DBConfig = {
    id: `CONFIG-${exId}`,
    nickname: "Blank Experiment",
    config: sampleConfig as ExperimentConfig,
  };
  await docClient
    .put({
      TableName: table,
      Item: exp,
    })
    .promise();
  return exId;
}

export async function getExperiments(): Promise<DBConfig[]> {
  const items = (
    await docClient
      .scan({
        TableName: table,
        FilterExpression: "attribute_exists(config)",
      })
      .promise()
  ).Items as DBConfig[];
  for (const item of items) {
    item.id = item.id.slice("CONFIG-".length);
  }
  return items || [];
}

export async function getExperiment(
  experimentId: string
): Promise<DBConfig | undefined> {
  const item = (
    await docClient
      .get({
        TableName: table,
        Key: { id: `CONFIG-${experimentId}` },
      })
      .promise()
  ).Item as DBConfig | undefined;
  if (item !== undefined) {
    item.id = item.id.slice("CONFIG-".length);
  }
  return item as DBConfig;
}

export async function setExperiment(
  experimentId: string,
  nickname: string,
  config: ExperimentConfig
) {
  await docClient
    .update({
      TableName: table,
      Key: {
        id: `CONFIG-${experimentId}`,
      },
      UpdateExpression: `SET config=:config, nickname=:nickname`,
      ExpressionAttributeValues: {
        ":config": config,
        ":nickname": nickname,
      },
    })
    .promise();
}

export async function getAllData(
  experimentId: number
): Promise<ExperimentData | undefined> {
  const item = (
    await docClient
      .get({ TableName: table, Key: { id: `DATA-${experimentId}` } })
      .promise()
  ).Item as DBData;
  return item?.subjectData as ExperimentData;
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
