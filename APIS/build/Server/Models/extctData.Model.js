"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CrwlrModel = void 0;
class CrwlrModel {
    crwlrFunc() {
        const typeDefs = `#graphql
    type rcrd{
          Name: String!
        #   Location: String!
          Total:String!
          Type:String!
    }

    type Query{
        isSrvrUp:String
        getRcrd(partionKey:String!,sortKey:String!):rcrd
        getPagenatedData(partionKey:String,sortKey:String,fltrName:String,fltrVal:String,srtPrptyVal:String,pageLmt:Int!):[rcrd]
    }
    type Mutation{
        updtName(partionKey:String!,sortKey:String!,updVal:String!):rcrd
        delteRcrd(partionKey:String!,sortKey:String!):rcrd
    }
    
    `;
        return typeDefs;
    }
}
exports.CrwlrModel = CrwlrModel;
