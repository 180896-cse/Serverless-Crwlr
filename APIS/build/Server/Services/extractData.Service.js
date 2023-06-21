"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CrwlrService = void 0;
const dynamoDb_connect_1 = require("../Config/dynamoDb.connect");
class CrwlrService {
    srvrChk() {
        return `TEST OK!`;
    }
    async getRcrd(partionKey, sortKey) {
        const params = {
            Key: {
                "#": partionKey,
                "Name": sortKey
            },
            TableName: dynamoDb_connect_1.Table
        };
        const result = await dynamoDb_connect_1.DynamoDB.get(params).promise();
        if (!result.Item) {
            return ('NO Record Found!!');
        }
        else {
            return result.Item;
        }
    }
    async getPagenatedData(partionKey, sortKey, fltrName, fltrVal, srtPrptyVal, pageLmt) {
        var _a;
        const authnticFltrOpt = ["Name", "Type", "Total", "Location"];
        if (authnticFltrOpt.includes(fltrName)) {
            let ExclusiveStartKey;
            let resLen;
            do {
                const params = {
                    TableName: dynamoDb_connect_1.Table,
                    Limit: pageLmt,
                    // KeyConditionExpression: " #srt < :srtKey",
                    // KeyConditionExpression: `${srtPrptyName} = ${srtPrptyVal}`,
                    // true = ascending, false = descending
                    // ScanIndexForward:false,
                    FilterExpression: "#fltr = :fltrKey",
                    ExpressionAttributeValues: {
                        // ":srtKey": srtPrptyVal,
                        ":fltrKey": fltrVal,
                        // ":sortKey":sortKey
                    },
                    ExpressionAttributeNames: {
                        // "#srt": srtPrptyName,
                        // "#srtKey": "Name",
                        "#fltr": fltrName
                    },
                    ExclusiveStartKey,
                };
                let result = await dynamoDb_connect_1.DynamoDB.scan(params).promise();
                ExclusiveStartKey = result.LastEvaluatedKey;
                resLen = (_a = result.Items) === null || _a === void 0 ? void 0 : _a.length;
                return result.Items;
                // console.log(result.Items);
                // console.log("nex turn");
                // console.log(result.Items?.length);
            } while (resLen);
        }
        else {
            console.log(`Invalid Filter Option !`);
        }
    }
    async updtName(partionKey, sortKey, updVal) {
        const resp = await this.getRcrd(partionKey, sortKey);
        if (resp) {
            const params = {
                Key: {
                    "#": partionKey,
                    "Name": sortKey
                },
                TableName: dynamoDb_connect_1.Table,
                UpdateExpression: "SET #nm = :d",
                ExpressionAttributeValues: {
                    ":d": updVal
                },
                ExpressionAttributeNames: {
                    "#nm": "Attack"
                },
                ReturnValues: "UPDATED_NEW"
            };
            let respsone = await dynamoDb_connect_1.DynamoDB.update(params).promise();
            return respsone;
        }
        else {
            return (`No Record Found!`);
        }
    }
    async delteRcrd(partionKey, sortKey) {
        const resp = await this.getRcrd(partionKey, sortKey);
        if (resp) {
            const params = {
                Key: {
                    "#": partionKey,
                    "Name": sortKey
                },
                TableName: dynamoDb_connect_1.Table,
            };
            return await dynamoDb_connect_1.DynamoDB.delete(params).promise();
        }
        else {
            return (`No Record Found!`);
        }
    }
}
exports.CrwlrService = CrwlrService;
