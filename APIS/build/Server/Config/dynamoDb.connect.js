"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DynamoDB = exports.Table = void 0;
const aws_sdk_1 = __importDefault(require("aws-sdk"));
aws_sdk_1.default.config.update({
    accessKeyId: process.env.accessKeyId,
    secretAccessKey: process.env.secretAccessKey,
    region: "us-east-1",
});
//  var db =  new AWS.DynamoDB.DocumentClient();
const Table = "POKEMON_DB";
exports.Table = Table;
//   const Table: string = "POKEMON_DB";
const DynamoDB = new aws_sdk_1.default.DynamoDB.DocumentClient();
exports.DynamoDB = DynamoDB;
console.log(`connection with Dynamo DB is sucess!`);
