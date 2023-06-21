import {Table,DynamoDB} from "../Config/dynamoDb.connect";

interface IextractData{
    srvrChk():void;
    getRcrd(partionKey:String,sortKey:String):void;
    getPagenatedData(partionKey:String,sortKey:String,fltrName:String,fltrVal:String,srtPrptyVal:Boolean,pageLmt:Number):void;
    updtName(partionKey:String,sortKey:String,updVal:String):void;
    delteRcrd(partionKey:String,sortKey:String):void;
}

export class CrwlrService implements IextractData{
        srvrChk(){
           return `TEST OK!`;
            
        }
        async getRcrd(partionKey:String,sortKey:String){
            const params = {
                Key: {
                  "#": partionKey,
                  "Name": sortKey
                },
                TableName: Table
              };
              const result = await DynamoDB.get(params).promise();
              if(!result.Item){
                return ('NO Record Found!!')
              }else{
              return result.Item;
              }
            }


          
        async getPagenatedData(partionKey:String,sortKey:String,fltrName:string,fltrVal:String,srtPrptyVal:Boolean,pageLmt:number){
            const authnticFltrOpt = ["Name","Type","Total","Location"]
            if(authnticFltrOpt.includes(fltrName)){
            let ExclusiveStartKey:any;
            let resLen:any;
            do{
            const params ={
                TableName: Table,
                Limit: pageLmt,
                // KeyConditionExpression: " #srt < :srtKey",
                // KeyConditionExpression: `${srtPrptyName} = ${srtPrptyVal}`,
                // true = ascending, false = descending
                
                // ScanIndexForward:false,
                FilterExpression: "#fltr = :fltrKey",
                ExpressionAttributeValues:{
                    // ":srtKey": srtPrptyVal,
                    ":fltrKey":fltrVal,
                    // ":sortKey":sortKey
                  },
                  ExpressionAttributeNames:{
                    // "#srt": srtPrptyName,
                    // "#srtKey": "Name",
                    "#fltr": fltrName
                },
                ExclusiveStartKey,
            }
            let result = await DynamoDB.scan(params).promise()
            ExclusiveStartKey = result.LastEvaluatedKey;
            resLen = result.Items?.length
            return result.Items;
            // console.log(result.Items);
            // console.log("nex turn");
            // console.log(result.Items?.length);
            }while(resLen);
        }else{console.log(`Invalid Filter Option !`);
        }
           
        }    


        async updtName(partionKey:String,sortKey:String,updVal:String){
            const resp = await this.getRcrd(partionKey,sortKey); 
            if (resp){
               const params = {
                    Key: {
                        "#": partionKey,
                        "Name": sortKey
                    },
                    TableName: Table,
                    UpdateExpression: "SET #nm = :d",
                   ExpressionAttributeValues:{
                      ":d":updVal
                    },
                    ExpressionAttributeNames:{
                        "#nm": "Attack"
                    },
                    ReturnValues:"UPDATED_NEW"
                }
                let respsone = await DynamoDB.update(params).promise();
                return respsone;
               
                
                
            }else{
                return(`No Record Found!`);
            }
        }



       async delteRcrd(partionKey:String,sortKey:String){
            const resp = await this.getRcrd(partionKey,sortKey); 
            if (resp){
            const params = {
                Key: {
                    "#": partionKey,
                    "Name": sortKey
                },
                TableName: Table,
            }
            return await DynamoDB.delete(params).promise();
        }else{
            return (`No Record Found!`);
        }

        }

}