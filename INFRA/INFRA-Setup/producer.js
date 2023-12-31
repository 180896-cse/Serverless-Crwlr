import fetch from "node-fetch";
import fs from "fs";
import cheerio from "cheerio";
import { SendMessageCommand, SQSClient } from "@aws-sdk/client-sqs";

//----------------- Pokemon WebPage Crwllr data sender-----------------------//
const client = new SQSClient({});
const SQS_QUEUE_URL = "https://sqs.us-east-1.amazonaws.com/438117354177/PokeData";
export async function data_Crwlr_data_Sndr(){
 
  //----------------- SQS Messsage Sender-----------------------//

  async function sqsMsgSendr(data) {

    const main = async (sqsQueueUrl = SQS_QUEUE_URL) => {
      const command = new SendMessageCommand({
        QueueUrl: sqsQueueUrl,
        DelaySeconds: 10,
        MessageAttributes: {
          Author: {
            DataType: "String",
            StringValue: "Shantanu Pratap",
          },
          Database: {
            DataType: "String",
            StringValue: "Pokemon Data",
          },
        },
        MessageBody: data,
      });
  
      const response = await client.send(command);
      console.log(response);
      return response;
    };
    main();
  }


    //-----------------Pokemon WebPage Crwllr-----------------------//
  async function crwlr(){
    const response = await fetch("https://pokemondb.net/pokedex/all/");

    const rawHtml = await response.text();

    const $lddData = cheerio.load(rawHtml);

    const headers = $lddData("th");

    // extracting all headers name

    const headerNames = [];

    for(let element of headers){
      headerNames.push($lddData(element).text());
    }

    // headers.each((index, element) => {
    //   headerNames.push($lddData(element).text());
    // });

    // getting elements of all row
    const rows = $lddData("tbody tr");

    const rowsData = [];

    // for(let row of rows){
    //   const rowCellData = [];
    //   const cells = $lddData(row).find("td");
    //   for(let cell of cells ){
    //     const image = $lddData(cell).find("img").attr("src");
    //     if (image) {
    //       rowCellData.push(image);
    //     } else {
    //       rowCellData.push($lddData(cell).text());
    //     }
    //   }
    // }
    for(let row of rows){
      const rowCellData = [];

      const cells = $lddData(row).find("td");

      for(let cell of cells ){
        const image = $lddData(cell).find("img").attr("src");
        if (image) {
          rowCellData.push(image);
        } else {
          rowCellData.push($lddData(cell).text());
        }
      }
      rowsData.push(rowCellData);
    }
    // rows.each((index, row) => {
    //   const rowCellData = [];

    //   const cells = $lddData(row).find("td");

  
      // cells.each((index, cell) => {
      //   const image = $lddData(cell).find("img").attr("src");

      //   if (image) {
      //     rowCellData.push(image);
      //   } else {
      //     rowCellData.push($lddData(cell).text());
      //   }
      // });

    //   rowsData.push(rowCellData);
    // });
    // console.log(rowsData);

    // exporting the data in JSON Format
    var cnt = 0;
    // going through each row
    const tableData = rowsData.map((row) => {
      // create a new object

      let obj = {};

      ++cnt;
      // forEach element in headerNames
      headerNames.forEach((headerName, i) => {
        // add a key-value pair to the object where the key is the current header name and the value is the value at the same index in the row

        obj[headerName] = row[i];
      });

      return obj;
    });
    // console.log(tableData);
    // console.log(tableData.slice(0,2));
    let tableDataJsonString;
    for (let i = 0; i < 2; i++) {
      if (i == 0) {
        tableDataJsonString = JSON.stringify(tableData.slice(0, 597), null, 2);
        sqsMsgSendr(tableDataJsonString);
        // console.log(JSON.parse(tableDataJsonString));
        // console.log(process.env); 
        tableDataJsonString = "";
         
      } else {
        tableDataJsonString = JSON.stringify(
          tableData.slice(597, 1195),
          null,
          2
        );
        sqsMsgSendr(tableDataJsonString);
        // console.log(JSON.parse(tableDataJsonString));
        tableDataJsonString = "";
        
      }
    }
  }
  crwlr().catch((err)=>{console.log(err);})

}