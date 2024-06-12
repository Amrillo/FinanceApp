import config from "../config/config";
import { Auth } from "../services/auth";
import { CustomHttp } from "../services/custom-http";
import { Operations } from "./operations";
import { Income } from "./income";
import { ProcessServices } from "../services/processservices";
import { ChartTable } from "./chart";
import { Balance } from "../services/controlbalance";
import { ParamsMainType } from "../../types/main-params.type";
import { UserDataType } from "../../types/user-data.type";
import { BalanceResponseType } from "../../types/balance-response.type";

export class Main {   


    readonly period: string= 'today'; 
    private page : string | null; 
    private balance : HTMLElement | null ; 
    private mainContentElem : HTMLElement | null ; 
    private mainTitleElem : HTMLElement | null ; 
    private balanceAmount : HTMLElement | null ; 
    private periodsBlock : HTMLElement | null ; 
    private chartBlock : HTMLElement | null ; 
    private activeItems:  HTMLCollectionOf<HTMLAnchorElement> | null;
    private inputDates: NodeListOf<Element> | null;
    private params : ParamsMainType[] = [] ; 
    // private currentChart: Chart | null;

    constructor(page: string) {  
        this.page = page; 
        this.balance = document.getElementById('balance__quantity');
        this.mainContentElem = document.getElementById('operations');
        this.mainTitleElem = document.getElementById('main-title')
        this.activeItems = document.getElementsByTagName('a');
        this.balanceAmount = document.getElementById('balance-amount');
        this.periodsBlock = document.getElementById('periods');
        this.chartBlock = document.getElementById('chart');
        // this.currentChart = null ;
        this.inputDates = null; 
        this.params = [
            {   
                page: "operations",
                template: "templates/operations.html",
                title : 'Доходы и расходы',
                load() {   
                    new Operations();
                }
            },
            {   
                page: "income",
                template: "templates/income.html",
                title : 'Доходы',
                load() {   
                    new Income("income");
                }
            },
            {   
                page: "expense",
                template: "templates/income.html",
                title : 'Расходы',
                load() {   
                    new Income("expense");
                }
            },
            {   
                page: "main",
                template: 'templates/periodcontent.html',
                template2: 'templates/chart.html',
                title : 'Главная',
                load(){   
                }
            }
        ]
       this.init()   
    }
    
   private async init(): Promise<void> {

                const currentPage: ParamsMainType | undefined = this.params.find(param=> param.page === this.page);
                if(currentPage) { 

                    if(currentPage.page === "main" && currentPage.template2) { 
                        if(this.periodsBlock && this.chartBlock) {  
                            this.periodsBlock.innerHTML = await fetch(currentPage.template).then(response => response.text());
                            this.chartBlock.innerHTML = await fetch(currentPage.template2).then(response => response.text());
                            this.inputDates = document.querySelectorAll('.periods__date.mx-2');
                             ChartTable.createChart('income-chart','expense-chart',this.inputDates,null); 
                        }
                        
                    } else { 
                        if(this.mainTitleElem && this.mainContentElem) {  
                            this.mainContentElem.innerHTML = await fetch(currentPage.template).then(response => response.text());
                            this.mainTitleElem.innerText = currentPage.title;
                        }   
                    }

                             const buttons: NodeListOf<Element> | null = document.querySelectorAll('[data-time]');
                            ProcessServices.activeElement(buttons,this.inputDates);
                            
                            const userName: HTMLElement | null = document.getElementById('userName') ; 
                            if(userName) {  
                                userName.innerText = (Auth.getUserInfo() as UserDataType).name + " " + (Auth.getUserInfo() as UserDataType).lastName;
                            }
                            
                            const itemsArray = Array.from(this.activeItems as HTMLCollectionOf<HTMLAnchorElement>);
                            const dropdownbtn: HTMLElement | null = document.getElementById('dropdown');
                            if(dropdownbtn) {  
                                if(this.page === currentPage.page) {  
                                    currentPage.load();
                                    this.removeActiveItems(this.activeItems);
                                    
                                    itemsArray.forEach((item)=> {   
                                        if(item.dataset.active == currentPage.page) {  
                                            if(item.dataset.active === "income" || item.dataset.active === "expense"){  
                                                dropdownbtn.classList.add('active');
                                            }
                                            item.classList.add('active');
                                        }
                                    })
                                } 
                                dropdownbtn.onclick = ()=> { 
                                    this.removeActiveItems(this.activeItems)
                                        dropdownbtn.classList.toggle('active');
                                }
                            }
                }
            
            
            if(this.balance) {  
                const balanceValue = await Balance.getBalance() ;
                if(balanceValue !== undefined) {  
                    this.balance.innerText = balanceValue.toString();
                } else {  
                    this.balance.innerText = '0'
                }
            }

            this.processLogout();
            this.changeBalance();
    }

   private  removeActiveItems(items: HTMLCollectionOf<HTMLAnchorElement> | null ):void {  
        if(items === null) return ;
        const itemsArray  = Array.from(items);
        itemsArray.forEach(item=> {  
            item.classList.remove('active');
        })
    }

   private processLogout():void {
        const logoutElem: HTMLElement | null= document.getElementById('logout') ;
        const logoutModal : HTMLElement | null = document.getElementById('logout-modal');
        const logoutBtn: HTMLElement | null = document.getElementById('logout-btn');
        const closebtn : HTMLElement | null = document.getElementById('close-btn');
        if(logoutElem && logoutModal) {  
            logoutElem.onclick = ()=>{  
                logoutModal.classList.add('open');    
            }
        }
        if(logoutBtn) {  
            logoutBtn.onclick = ()=> {  
                Auth.logOut();
                window.location.href = "#/login";
            }
        }
        if(closebtn && logoutModal) {  
            closebtn.onclick = ()=> {  
                logoutModal.classList.remove('open');
            }
        }
    }   

    private changeBalance():void {  

        const modalBalance: HTMLElement | null = document.getElementById('modal-balance');
        const balanceShow: HTMLElement | null = document.getElementById('balance');
        const cancelButton: HTMLElement | null = document.getElementById('cancel-btn');
        const changeButton: HTMLElement | null = document.getElementById('change-btn');

        if(modalBalance) {  
            if(balanceShow) {  
                balanceShow.onclick = ()=> {  
                    modalBalance.classList.add('open');
                    if(this.balanceAmount && this.balance) {  
                        (<HTMLInputElement> this.balanceAmount).value = this.balance.innerText ; 
                    }
                }
            }
            if(cancelButton) {  
                cancelButton.onclick = ()=> {  
                    modalBalance.classList.remove('open');
                }
            }
            if(changeButton) {  
                changeButton.onclick = ()=> {  
                    modalBalance.classList.remove('open');
                     this.updateBalance();
                }
            }
        }
       if(this.balanceAmount)  {  
             this.balanceAmount.addEventListener('keypress',(event)=>(ProcessServices.validateAmountInput(event)));
       }
        
    }

   private async updateBalance():Promise<void> {  

        const newBalance = (<HTMLInputElement> this.balanceAmount).value;
        try {  
            const result: BalanceResponseType | null = await CustomHttp.request(config.host + '/balance', "PUT" , {   
                newBalance: newBalance 
            });
            if(result) {   
               if(this.balance) {  
                  this.balance.innerText = result.balance.toString(); 
               } 
            }
        } catch(e) {  
            console.log(e);
        }
    }
}