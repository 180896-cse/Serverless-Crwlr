"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CrwlrCntlr = void 0;
const extractData_Service_1 = require("../Services/extractData.Service");
//Creating instance of Crwaller service
const crwlrSrvc = new extractData_Service_1.CrwlrService();
class CrwlrCntlr {
    crwlrCntrlrFunc() {
        const resolvers = {
            Query: {
                isSrvrUp: () => { return crwlrSrvc.srvrChk(); },
                getRcrd: async (parents, args) => {
                    return await crwlrSrvc.getRcrd(args.partionKey, args.sortKey);
                },
                getPagenatedData: async (parents, args) => {
                    if (args.srtPrptyVal == "true") { }
                    return await crwlrSrvc.getPagenatedData(args.partionKey, args.sortKey, args.fltrName, args.fltrVal, args.srtPrptyVal, args.pageLmt);
                }
            },
            Mutation: {
                updtName: async (parents, args) => {
                    return await crwlrSrvc.updtName(args.partionKey, args.sortKey, args.updVal);
                },
                delteRcrd: async (parent, args) => {
                    return await crwlrSrvc.delteRcrd(args.partionKey, args.sortKey);
                }
            }
        };
        return resolvers;
    }
}
exports.CrwlrCntlr = CrwlrCntlr;
