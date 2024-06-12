import { RouterFieldType } from "../types/router-filelds.type";
import { Form } from "./components/form";
import { Main } from "./components/main";


export class Router {   


       private contentElement : HTMLElement | null ; 
       readonly stylesElement : HTMLElement | null ; 
       private titleElement : HTMLElement | null ; 
       readonly menuItems: NodeListOf <Element> ; 
       private routes : RouterFieldType[] ;



    constructor() {  

        this.contentElement = document.getElementById('content');
        this.stylesElement =  document.getElementById('styles');
        this.titleElement = document.getElementById('title');
        this.menuItems = document.querySelectorAll('.nav-link');

        this.routes = [
          {  
            route: '#/login',
            title: 'Вход',
            template: 'templates/login.html',
            styles: 'styles/form.css',
            load: ()=> {  
              new Form("login")
            }
          },
          {
            route: '#/signup',
            title: 'Регистрация',
            template: 'templates/signup.html',
            styles: 'styles/form.css',
            load: ()=> {  
              new Form("signup")
            }
          },
            {
            route: '#/',
            title: 'Главная страница',
            template: 'templates/main.html',
            styles: null,
            load: ()=> {  
              new Main('main')
              },
            },
            {
              route: '#/operations',
              title: 'Доходы и расходы',
              template: 'templates/main.html',
              styles: 'styles/operations.css',
              load: ()=> {  
                new Main("operations")
              },
            },
            {
              route: '#/categories/income',
              title: 'Доходы',
              template: 'templates/main.html',
              styles: 'styles/incomeExpense.css',
              load: ()=> {  
                new Main("income")
              },
            },
            {
              route: '#/categories/expense',
              title: 'Расходы',
              template: 'templates/main.html',
              styles: 'styles/incomeExpense.css',
              load: ()=> {  
                new Main("expense")
              },
            },
          ] 
        }
    
   public async openRoutes():Promise<void> {   

        let urlRote: string = window.location.hash.split('?')[0];
       
        // поиск заголовка сайта внутри объекта
        const newRoute : RouterFieldType | undefined = this.routes.find(item=> item.route === urlRote);

        if(!newRoute) {  
           window.location.href = '#/login';
           return
        }
        //  загрузка необходимых параметров для отражения страницы 
        if(this.contentElement) {  
            const result: string | null =  await fetch(newRoute.template).then(response=> response.text());
            if(result) {  
              this.contentElement.innerHTML = result ; 
              this.removeLinkTag();
            } 
         }
      
        if(newRoute.styles) {  
           this.createStyleLink(newRoute.styles);
        }
        if(this.titleElement) {  
          this.titleElement.innerText = newRoute.title;
        }
        //  запуск класса по сраницам 
        newRoute.load();
    }
    
     private createStyleLink(href: string): void {  
          const link: HTMLLinkElement | null = document.createElement("link");
          const head : HTMLHeadElement | null = document.head || document.getElementsByTagName("head")[0];
              link.rel = "stylesheet";
              link.type = "text/css";
              link.href = href;
          head.append(link);
      }

     private removeLinkTag(): void {  
          const linkElement : HTMLElement | null = document.querySelector('link[rel="stylesheet"]');
          if(linkElement) {  
              if(linkElement.parentNode) {  
                linkElement.parentNode.removeChild(linkElement);
              }
          }
      }
}

