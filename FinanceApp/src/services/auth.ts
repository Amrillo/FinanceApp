import { LogoutResponseType} from "../../types/logout.type";
import { RefreshTokenType } from "../../types/refresh-token.type";
import { UserDataType } from "../../types/user-data.type";
import config from "../config/config";

export class Auth {   

   public  static accessTokenKey:string = "accessToken"; 
   private static refreshTokenKey:string = "refreshToken"; 
   private static userInfoKey:string = "userInfo";

   public static async processUnathorizedResponce():Promise<Boolean> {  
        const refreshToken: string | null= localStorage.getItem(this.refreshTokenKey); 
        if(refreshToken) {  
           const response: Response = await fetch(config.host + '/refresh', {  
            method: 'POST',
            headers : {  
                'Content-type': 'application/json', 
                'Accept': 'application/json',
            },
            body: JSON.stringify({refreshToken: refreshToken})
           });
           if(response && response.status === 200) {  
             const result: RefreshTokenType  = await response.json(); 
             if(result.tokens.accessToken && result.tokens.refreshToken && !result.error ) {  
                this.setTokens(result.tokens.accessToken, result.tokens.refreshToken);
                return true ; 
             }
           }
        }
        this.removeTokens(); 
        location.href = '#/login';
        return false ; 
    }

   public static async logOut():Promise<Boolean> {  
        const refreshToken: string | null = localStorage.getItem(this.refreshTokenKey);

        if(refreshToken) {  
            const response: Response = await fetch(config.host + '/logout' , {
                method : 'POST',
                headers : {  
                    'Content-type': 'application/json', 
                    'Accept': 'application/json',
                },
                body: JSON.stringify({refreshToken: refreshToken})
            });

            if(response && response.status === 200) {  
                const result : LogoutResponseType | null = await response.json();
                if(result && !result.error) {  
                    Auth.removeTokens();
                    localStorage.removeItem(Auth.userInfoKey);
                    return true; 
                } 
            }
        }
        return false ; 
         
    }
   public static setTokens(accessToken:string, refreshToken:string):void {  
        localStorage.setItem(this.accessTokenKey, accessToken);
        localStorage.setItem(this.refreshTokenKey, refreshToken);
    }    

   public static setUserInfo(data: UserDataType):void {   
        localStorage.setItem(this.userInfoKey, JSON.stringify(data));
    }

   public static removeTokens():void {   
        localStorage.removeItem(this.accessTokenKey);
        localStorage.removeItem(this.refreshTokenKey);
    };  

   public static getUserInfo():UserDataType | null {   
       const userInfo: string | null = localStorage.getItem(this.userInfoKey);
       if(userInfo) {  
         return  JSON.parse(userInfo)
       }
         return null ; 
    }

}