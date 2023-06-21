import AWS from "aws-sdk";

// AWS.config.update({
//     accessKeyId: process.env.accessKeyId,
//     secretAccessKey:  process.env.secretAccessKey,
//     region: "us-east-1",
//   });
  //  var db =  new AWS.DynamoDB.DocumentClient();
  const Table: string = process.env.DB_Name!;
//   const Table: string = "POKEMON_DB";
  const DynamoDB = new AWS.DynamoDB.DocumentClient();
  console.log(`connection with Dynamo DB is sucess!`);
  
  export { Table, DynamoDB };
