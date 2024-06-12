import { CustomHttp } from "./custom-http";
import config from "../config/config";
import { BalanceResponseType } from "../../types/balance-response.type";

export class Balance {  

  public static async getBalance(): Promise<number | undefined> {  
        try {  
            const result : BalanceResponseType = await CustomHttp.request(config.host + '/balance');
            if(result) {  
               return result.balance;  
            }
        } catch(error) {  
            console.log(error);
        }
    } 
    
}