import {ApolloServer} from "apollo-server";
// import {ApolloServer} from "@apollo/server";
import {CrwlrModel} from "./Models/extctData.Model";
import {CrwlrCntlr} from "./Controllers/extctData.Controller";
import {Table,DynamoDB} from "./Config/dynamoDb.connect"
import { startStandaloneServer } from '@apollo/server/standalone';
import { startServerAndCreateLambdaHandler, handlers } from '@as-integrations/aws-lambda';
import AWS, { Config } from "aws-sdk";
import serverless from 'serverless-http';
import path from "path";
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
DynamoDB;

//creating instance of typeDefs
const crwlrModl = new CrwlrModel();
const typeDefs = crwlrModl.crwlrFunc();


//creating instance of controller
const crwlrCntlr = new CrwlrCntlr();
const resolvers = crwlrCntlr.crwlrCntrlrFunc();

const PORT = process.env.PORT;


const apolloServer:ApolloServer = new ApolloServer({
    typeDefs,
    resolvers,
    introspection: process.env.NODE_ENV !== 'production',
})


apolloServer.listen(PORT).then(({url})=>{console.log(`server started at link ${url}`)}).catch((err)=>{console.log(`error occured at creation of server${err}`)});
  


// This final export 
// export const graphqlHandler = startServerAndCreateLambdaHandler(
//     apolloServer,
//     // We will be using the Proxy V2 handler
//     handlers.createAPIGatewayProxyEventV2RequestHandler(),
//   );