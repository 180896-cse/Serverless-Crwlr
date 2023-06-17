import { CrwlrService } from "../Services/extractData.Service";

//Creating instance of Crwaller service
const crwlrSrvc = new CrwlrService();

export class CrwlrCntlr {
  crwlrCntrlrFunc() {
    const resolvers = {
      Query: {
        isSrvrUp: () => {
          return crwlrSrvc.srvrChk();
        },

        getRcrd: async (parents: any, args: any) => {
          return await crwlrSrvc.getRcrd(args.partionKey, args.sortKey);
        },

        getPagenatedData: async (parents: any, args: any) => {
          if (args.srtPrptyVal == "true") {
          }
          return await crwlrSrvc.getPagenatedData(
            args.partionKey,
            args.sortKey,
            args.fltrName,
            args.fltrVal,
            args.srtPrptyVal,
            args.pageLmt
          );
        },
      },

      Mutation: {
        updtName: async (parents: any, args: any) => {
          return await crwlrSrvc.updtName(
            args.partionKey,
            args.sortKey,
            args.updVal
          );
        },
        delteRcrd: async (parent: any, args: any) => {
          return await crwlrSrvc.delteRcrd(args.partionKey, args.sortKey);
        },
      },
    };

    return resolvers;
  }
}
