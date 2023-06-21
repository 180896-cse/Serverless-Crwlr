import {data_Crwlr_data_Sndr} from "./producer.js";
import {sqsMsgReciver} from "./consumer.js";
import 'dotenv/config';
// --------------------- Data Producer ---------------------------- //
export function SQSProducer(){
  (async ()=>{
    await data_Crwlr_data_Sndr().catch((err)=>{console.log(err);});
  })();
  
}


// --------------------- Data Consumer ---------------------------- //
export async function SQSClient() {
  await sqsMsgReciver().catch((err)=>{console.log(err)});
  // (async ()=>{
  //   await sqsMsgReciver().catch((err)=>{console.log(err)});
  // })();
}
// SQSClient();