import { Auth } from "./auth";

export class CustomHttp {   

   public static async request(url: string, method : string = "GET", body: object | null = null):Promise<any> {  

        const params: RequestInit = {   
            method: method,
            headers: {   
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            }
        };
        let token: string | null = localStorage.getItem(Auth.accessTokenKey)

        if(token) {   
            if(params) {  
                (params.headers as Record<string, string>)['x-auth-token']= token ;
            }
              
        }

        if(body) {  
            params.body = JSON.stringify(body);
        }
        const response: Response = await fetch(url,params);

        if(response.status < 200 || response.status >= 300) {  
            if(response.status === 401) {  
              const result: Boolean = await Auth.processUnathorizedResponce();
              if(result) {  
                 return await this.request(url, method, body);
              } else {  
                return null ;
              }
            }
            throw new Error(response.statusText);
        }
  
        return await response.json();
    }
}