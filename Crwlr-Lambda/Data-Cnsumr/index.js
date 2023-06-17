import AWS from "aws-sdk";
import path from "path";
//reading .env file
import "dotenv/config";
import {
  ReceiveMessageCommand,
  DeleteMessageCommand,
  SQSClient,
} from "@aws-sdk/client-sqs";
const client = new SQSClient({});
const SQS_QUEUE_URL = "# PUt YOUR SQS URL";

// for removing duplicates elements if..
async function keepUniqElm(data, key) {
  return [...new Map(data.map((x) => [key(x), x])).values()];
}

// put function in dynamo db
async function dataToDdb(obj) {
  const DynamoDB = await new AWS.DynamoDB.DocumentClient();
  const response = {
    statusCode: 200,
    body: JSON.stringify(obj),
  };

  var params = {
    TableName: "POKEMON_DB",
    Item: {
      ...obj,
    },
  };

  // await the promise and then await the result, so the function gets invoked.

  await DynamoDB.put(params).promise();
  return response;
}

// SQS Recive message
const receiveMessage = async (queueUrl) =>
  await client.send(
    new ReceiveMessageCommand({
      AttributeNames: ["SentTimestamp"],
      MaxNumberOfMessages: 10,
      MessageAttributeNames: ["All"],
      QueueUrl: queueUrl,
      VisibilityTimeout: 20,
      WaitTimeSeconds: 9,
    })
  );
let finalRes = [];
let cnt = 0;
const sqsMsgReciver = async (queueUrl = SQS_QUEUE_URL) => {
  const { Messages } = await receiveMessage(queueUrl);

  if (Messages) {
    Messages.forEach(async (m) => {
      ++cnt;
      console.log(`count value: ${cnt}`);
      // if(cnt==1){
      console.log("docTxt: ", m.Body);

      let respStr = m.Body;
      let respObj = JSON.parse(respStr);

      finalRes.push(...finalRes, ...respObj);

      await client.send(
        new DeleteMessageCommand({
          QueueUrl: queueUrl,
          ReceiptHandle: m.ReceiptHandle,
        })
      );
    });
  }
  finalRes = keepUniqElm(finalRes, (it) => it.Name);
  if (cnt == 2) {
    for (let i = 0; i < finalRes.length; i++) {
      // console.log(finalRes[i]);
      console.log(dataToDdb(finalRes[i]));
    }
  }
  console.log(finalRes.length);
};

// final export function
export function handler() {
  (async () => {
    sqsMsgReciver();
  })();
}
