import AWS from "aws-sdk";

AWS.config.update({
  accessKeyId: process.env.accessKeyId,
  secretAccessKey: process.env.secretAccessKey,
  region: "us-east-1",
});
const Table: string = "demoTbl";

const DynamoDB = new AWS.DynamoDB.DocumentClient();
console.log(`connection with Dynamo DB is sucess!`);

export { Table, DynamoDB };
