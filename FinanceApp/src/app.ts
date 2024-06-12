import { Router } from "./router";

import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/common.css';
import './styles/main.css';

class App  {   
    

    private router : Router ; 


    constructor(){  
       this.router = new Router();

       window.addEventListener('DOMContentLoaded', this.directRoute.bind(this));
       window.addEventListener('popstate',this.directRoute.bind(this));
        
    }

   private directRoute():void {  
        this.router.openRoutes()
    }
}

(new App());