import AWS from "aws-sdk";
import { v4 as uuidv4 } from "uuid";
import { ExperimentConfig, ExperimentData, ExperimentDataEntry } from "./types";
import sampleConfig from "./config/sampleConfig";
import { ServiceConfigurationOptions } from "aws-sdk/lib/service";
import bcrypt from "bcrypt";

const CONFIG: ServiceConfigurationOptions = {
  accessKeyId: process.env.ACCESS_KEY_ID,
  secretAccessKey: process.env.SECRET_KEY,
  region: "us-east-1",
  endpoint: process.env.DYNAMO_ENDPOINT,
};

const dynamodb = new AWS.DynamoDB(CONFIG);
const docClient = new AWS.DynamoDB.DocumentClient(CONFIG);
const table = process.env.DYNAMO_TABLE || "empathic-accuracy";

type DBConfig = { id: string; nickname: string; config: ExperimentConfig };

/** PRIVATE */
const scanPaginated = async <T>(
  params: AWS.DynamoDB.DocumentClient.ScanInput
): Promise<T[]> => {
  const _query = async (
    params: AWS.DynamoDB.DocumentClient.ScanInput,
    startKey?: AWS.DynamoDB.DocumentClient.Key
  ): Promise<AWS.DynamoDB.QueryOutput> => {
    if (startKey) {
      params.ExclusiveStartKey = startKey;
    }
    console.log("scan", params);
    return docClient.scan(params).promise();
  };
  let lastEvaluatedKey = undefined;
  let rows: T[] = [];
  do {
    const result: AWS.DynamoDB.ScanOutput = await _query(
      params,
      lastEvaluatedKey
    );
    const items = result.Items as T[] | undefined;
    if (items) {
      rows = rows.concat(items);
    }
    lastEvaluatedKey = result.LastEvaluatedKey;
  } while (lastEvaluatedKey);
  return rows;
};

/** EXPORTED */

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
    config: sampleConfig,
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
  const items = await scanPaginated<DBConfig>({
    TableName: table,
    FilterExpression: "attribute_exists(config)",
  });
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
  experimentId: string
): Promise<ExperimentData | undefined> {
  const item = await scanPaginated<{ subjectData: ExperimentDataEntry }>({
    TableName: table,
    FilterExpression: "begins_with(id, :d)",
    ExpressionAttributeValues: {
      ":d": `DATA-${experimentId}-`,
    },
  });
  return item.map((i) => i.subjectData);
}

export async function putDataEntry(
  experimentId: string,
  dataEntry: ExperimentDataEntry
) {
  const dataId = bcrypt.hashSync(dataEntry.subjectID, 10);
  await docClient
    .put({
      TableName: table,
      Item: {
        id: `DATA-${experimentId}-${dataId}`,
        subjectData: dataEntry,
      },
    })
    .promise();
}

export async function getByKey<T>(key: string): Promise<T> {
  return (await docClient.get({ TableName: table, Key: { id: key } }).promise())
    .Item as T;
}
