"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const apollo_server_1 = require("apollo-server");
// import {ApolloServer} from "@apollo/server";
const extctData_Model_1 = require("./Models/extctData.Model");
const extctData_Controller_1 = require("./Controllers/extctData.Controller");
const dynamoDb_connect_1 = require("./Config/dynamoDb.connect");
const path_1 = __importDefault(require("path"));
require('dotenv').config({ path: path_1.default.resolve(__dirname, '../.env') });
dynamoDb_connect_1.DynamoDB;
//creating instance of typeDefs
const crwlrModl = new extctData_Model_1.CrwlrModel();
const typeDefs = crwlrModl.crwlrFunc();
//creating instance of controller
const crwlrCntlr = new extctData_Controller_1.CrwlrCntlr();
const resolvers = crwlrCntlr.crwlrCntrlrFunc();
const PORT = process.env.PORT;
const apolloServer = new apollo_server_1.ApolloServer({
    typeDefs,
    resolvers,
    introspection: process.env.NODE_ENV !== 'production',
});
apolloServer.listen(PORT).then(({ url }) => { console.log(`server started at link ${url}`); }).catch((err) => { console.log(`error occured at creation of server${err}`); });
// This final export 
// export const graphqlHandler = startServerAndCreateLambdaHandler(
//     apolloServer,
//     // We will be using the Proxy V2 handler
//     handlers.createAPIGatewayProxyEventV2RequestHandler(),
//   );
