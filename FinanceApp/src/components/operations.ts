import { CustomHttp } from "../services/custom-http";
import config from "../config/config";
import { ProcessServices } from "../services/processservices";
import { Balance } from "../services/controlbalance";
import { OperationsListType } from "../../types/operations-data.type";
import { DefaultResponseType } from "../../types/default-response.type";
import {CategoriesType } from "../../types/categories-data.type";
import {CategoryOptionsType } from "../../types/category-options.type";


export class Operations {   

    private operationsList : OperationsListType[] | null ; 
    private mainTitleElem : HTMLElement | null  ; 
    private mainContent : HTMLElement | null  ; 
    private formContent : HTMLElement | null  ; 
    private periodsBlock : HTMLElement | null  ; 
    private cancelButton : HTMLElement | null  ; 
    private createButton : HTMLElement | null  ; 
    private cancelButtonCategory : HTMLElement | null  ; 
    private inputAmountElem : HTMLElement | null  ; 
    private inputDateElem : HTMLElement | null  ; 
    private inputCommentElem : HTMLElement | null  ; 
    private dropdown : HTMLElement | null  ; 
    private changeCategoryButton : HTMLElement | null  ; 
    private activeItemRevenue : HTMLElement | null  ; 
    private activeItemExpense : HTMLElement | null  ; 
    private balance : HTMLElement | null  ; 
    private typeSelect : HTMLElement | null  ; 
    private categoryOption : HTMLElement | null  ; 
    private formCategoryChange : HTMLFormElement | null ; 
    private tbodyElem : HTMLElement | null  ; 
    private categoryTypeInput : HTMLElement | null  ; 
    private categoryInput : HTMLElement | null  ; 
    private categoryAmountInput : HTMLElement | null  ; 
    private categoryDateInput : HTMLElement | null  ; 
    private categoryComment : HTMLElement | null  ; 
    private mainButtons : NodeListOf<Element> | null; 
    private activeItemOperations :  Element | null; 
    private inputChangeItems : NodeListOf<Element> | null; 
    private inputCreateItems : NodeListOf<HTMLInputElement> |  null; 
    private inputDates: NodeListOf<Element> | null | undefined;
    private categoryId: string | null | undefined;
    private categoryItems: OperationsListType | null ;
    private periodTime : string | undefined | null = "today"  ;
    private processButtons: NodeListOf<Element> | null ; 
    private modalProcessElem : HTMLElement | null ; 
    private categoryName: string | undefined;
    private categoryList : CategoriesType[] | null;
    private categories: CategoriesType[] | null | undefined ;
    private periodsButtons :  NodeListOf<Element> | null ; 

    constructor() {   
        this.operationsList = null; 
        this.mainTitleElem = document.getElementById('main-title');
        this.mainContent = document.getElementById('wrapper-operations');
        this.formContent = document.getElementById('form-operations');
        this.periodsBlock = document.getElementById('operations-periods');
        this.mainButtons = document.querySelectorAll('.btn-operations');
        this.createButton = document.getElementById('createbtn');
        this.cancelButton = document.getElementById('cancelbtn');
        this.cancelButtonCategory = document.getElementById('cancel-category');
        this.inputAmountElem = document.getElementById('input-amount');
        this.inputDateElem = document.getElementById('input-date');
        this.inputCommentElem = document.getElementById('input-comment');
        this.dropdown = document.getElementById('dropdown');
        this.changeCategoryButton = document.getElementById('change-category');
        this.activeItemRevenue = document.getElementById('active-revenue')
        this.activeItemExpense = document.getElementById('active-expenses')
        // this.activeItems = document.getElementsByTagName('a');
        this.activeItemOperations =document.querySelector('[data-active="operations"]')
        this.inputChangeItems =document.querySelectorAll('[data-input="change"]');
        this.inputCreateItems =document.querySelectorAll('[data-input="creation"]');
        this.balance = document.getElementById('balance__quantity');
        this.inputDates = null ; 
        // this.intervalDate1 = null ; 
        // this.intervalDate2 = null ; 
        this.categoryId = null; 
        this.typeSelect = document.getElementById('typeSelect');
        this.categoryOption = document.getElementById('categorySelect');
        this.tbodyElem = document.getElementById('tbody');
        this.formCategoryChange= document.getElementById('form-change-category') as HTMLFormElement;
        this.categoryTypeInput = document.getElementById('input-typecategory');
        this.categoryInput =  document.getElementById('input-category');
        this.categoryAmountInput = document.getElementById('input-categoryamount');
        this.categoryDateInput = document.getElementById('input-categorydate');
        this.categoryComment = document.getElementById('input-categorycomment');
        this.categoryItems = null ; 
        this.init();
        this.processButtons = null ; 
        this.modalProcessElem = null ;
        // this.categoryName = null ; 
        this.categoryList = null ; 
        this.categories = null ;  
        this.periodsButtons = null ; 
          
    }

   private async init():Promise<void>{  
        
        const block = "templates/periodcontent.html";
        if(this.periodsBlock) {  
            this.periodsBlock.innerHTML = await fetch(block).then(response => response.text())
        }
        
        this.periodsButtons =  document.querySelectorAll('[data-time]');
        this.inputDates = document.querySelectorAll('.periods__date.mx-2');
         this.getCategoriesList(this.periodTime,this.inputDates);
        
        this.creationCategory();

        this.periodsButtons.forEach((button: Element)=> {  
            const htmlButton = button as HTMLElement ; 
            htmlButton.onclick = (event: MouseEvent)=> {   
                this.processFilterButons(event);
                this.getCategoriesList(this.periodTime, this.inputDates);
            }
        });
        if(this.cancelButtonCategory) {  
            this.cancelButtonCategory.onclick = ()=>(this.cancelCategory());  
        }
        if(this.changeCategoryButton) {  
            this.changeCategoryButton.onclick = ()=>(this.saveChangesCategory())
        }
    }

   private  cancelCategory():void {  
    if (this.mainContent && this.formCategoryChange && this.mainTitleElem && this.dropdown && this.activeItemOperations && this.categoryItems) {
        this.mainContent.style.display = "block";
        this.formCategoryChange.style.display = 'none';
        this.mainTitleElem.innerText = "Доходы и расходы";
        (this.formCategoryChange as HTMLFormElement).reset();
        this.dropdown.classList.remove('active');
        this.activeItemOperations.classList.add('active');

        if (this.categoryItems.type === "income") {  
            if (this.activeItemRevenue) this.activeItemRevenue.classList.remove('active');
        } else { 
            if (this.activeItemExpense) this.activeItemExpense.classList.remove('active');
        }
        }
    }


    private validateForm(inputs: NodeListOf<HTMLInputElement> |  null):Boolean {  
        let hasError = true; 
        if(inputs) {  
            inputs.forEach((input: Element)=> {  
                if((input as HTMLInputElement).value.trim() === ""){  
                    hasError = false ;
                }
            })     
        }
        return hasError; 
    }

   private processFilterButons(event : MouseEvent): void {  
            const elem: EventTarget | null = event.target;
            
            this.periodsButtons?.forEach(button=> button.classList.remove('active')) ;
            (elem as HTMLElement).classList.add('active');
            this.periodTime = (elem as HTMLElement)?.dataset.time;
            if(this.tbodyElem) {  
                this.tbodyElem.innerHTML = "" ;  
            }  
    }
    
  private async  getCategoriesList(period : string | null | undefined, dates: NodeListOf<Element> | null | undefined):Promise<void> {  
        if(dates) {  
            try {  
                let result : OperationsListType[] | null ; 
                if(period === "today"){  
                    result = await CustomHttp.request(config.host + '/operations');
                } else if (period === "interval"){  
                    result = await CustomHttp.request(config.host + '/operations?period=' + period + "&dateFrom=" + (dates[0] as HTMLInputElement).value + "&dateTo=" + (dates[1] as HTMLInputElement).value);
                } else {   
                    result = await CustomHttp.request(config.host + '/operations?period=' + period);
                }
                if(result) {   
                    this.operationsList = result;
                    this.generateContent(this.operationsList);
                    console.log(this.operationsList);
                    this.processButtons = document.querySelectorAll('[data-process]');
                    this.modalProcessElem = document.getElementById('modal-remove');
                    const removeCategoryButton: HTMLElement | null = document.getElementById('remove-category');
                    const cancelProcessButton: HTMLElement | null = document.getElementById('keep-category');
    
                  if(this.modalProcessElem && removeCategoryButton && cancelProcessButton) {  
                    this.processButtons.forEach((button: Element)=>{  
                        const htmlButton = button as HTMLElement ;
                        htmlButton.onclick = ()=> {  
                            if((button as HTMLElement).dataset.process === "remove") {  
                                (this.modalProcessElem as HTMLElement).style.transform = "scale(1)";
                                removeCategoryButton.onclick = ()=>(this.deleteCategory(button,this.periodTime));
                                cancelProcessButton.onclick = ()=>((this.modalProcessElem as HTMLElement).style.transform = "scale(0)");
                            } else { 
                                this.showChangeForm(button);
                                console.log("gotoChange")
                            }
                        } 
                    })
                  }
                    
                }
            } catch(e) {  
                console.log(e);
            }
        }
     
    }
   private async showChangeForm(button: Element | null):Promise<void>{  
    if(button) {  
        this.categoryId = (button as HTMLElement).dataset.categoryid; 
        if(this.mainContent && this.formCategoryChange && this.dropdown && this.activeItemOperations) {  
            this.mainContent.style.display = "none";
            this.formCategoryChange.style.display = 'block';
            this.dropdown.classList.add('active');
            this.activeItemOperations.classList.remove('active');
        }
        try {  
            const result : DefaultResponseType | OperationsListType = await CustomHttp.request(config.host + '/operations/' + this.categoryId);
            if(result) {   
                if((result as DefaultResponseType).error !== undefined){  
                    throw new Error((result as DefaultResponseType).message)
                }    
                    this.categoryItems = <OperationsListType> result ;
                    if(this.mainTitleElem && this.activeItemRevenue && this.activeItemExpense) { 
                        if (this.categoryItems.type === "income") {  
                 
                            this.mainTitleElem.innerText = "Редактирование дохода";
                            this.activeItemRevenue.classList.add('active');
                        } else {  
                            this.mainTitleElem.innerText = "Редактирование расхода";
                            this.activeItemExpense.classList.add('active');
                        } 
                     }
             
                this.fillInputFields(this.categoryItems);
                }
        } catch(e) {  
            console.log(e);
        }  
      }
    } 

   private fillInputFields(categoryObj: OperationsListType ) {  

        if (this.categoryTypeInput instanceof HTMLInputElement) {
            if (categoryObj.type === "expense") {  
                this.categoryTypeInput.value = "Расход";
            } else {  
                this.categoryTypeInput.value = "Доход";
            }
        }
        if(this.categoryInput instanceof HTMLInputElement && categoryObj.category !== undefined) {  
            this.categoryInput.value = categoryObj.category;
        }
       
        if (this.categoryAmountInput instanceof HTMLInputElement) {
            this.categoryAmountInput.value = categoryObj.amount + "$";
        }
        if (this.categoryDateInput instanceof HTMLInputElement) {
            this.categoryDateInput.value = categoryObj.date;
        }  
        if (this.categoryComment instanceof HTMLInputElement) {
            this.categoryComment.value = categoryObj.comment;
        }  
          
    }

    private generateContent(array: OperationsListType[]) {  
        const category = {  
            expense : 'Расход', 
            income : 'Доход'
        }
        array.forEach((elem,index)=>{   
            const rowElem = document.createElement('tr');

            const cellElemNumber :  HTMLTableCellElement = document.createElement('th');
            cellElemNumber.setAttribute('scope','row');
            cellElemNumber.innerText = (index + 1).toString() ;

            const cellElemType: HTMLTableCellElement = document.createElement('td');
            (elem.type === 'income')?  cellElemType.style.color = "#198754" : cellElemType.style.color = '#DC3545'; 
            cellElemType.innerText = category[elem.type];

            const cellElemCategory : HTMLTableCellElement = document.createElement('td');
            if(elem.category) cellElemCategory.innerText = elem.category; 
          
            const cellElemAmount: HTMLTableCellElement = document.createElement('td');
            cellElemAmount.innerText = (elem.amount).toString() ;

            const dollarSign: HTMLSpanElement = document.createElement('span');
            dollarSign.innerText = "$";
            dollarSign.style.marginLeft = "5px"                                                                                                       

            cellElemAmount.appendChild(dollarSign);

            const cellElemDate: HTMLTableCellElement = document.createElement('td');
            cellElemDate.innerText = elem.date ; 

            const cellElemComment: HTMLTableCellElement = document.createElement('td');
            cellElemComment.innerText = elem.comment ; 

            const cellElemButtons: HTMLTableCellElement = document.createElement('td');
            
            const trashButton:  HTMLButtonElement = document.createElement('button');
            trashButton.setAttribute('type', 'button');;
            trashButton.className = "reset-btn";  
            trashButton.dataset.categoryid = (elem.id).toString();
            trashButton.dataset.process = "remove";
            const trashImage = document.createElement('img');
            trashImage.setAttribute('src' , "images/trash-icon.svg");
            trashImage.setAttribute('alt' , "trash");
            trashButton.appendChild(trashImage); 

            const penButton: HTMLButtonElement  = document.createElement('button');
            penButton.setAttribute('type', 'button');
            penButton.className = "reset-btn"
            penButton.dataset.categoryid = (elem.id).toString();
            penButton.dataset.process = "change";
            const penImage = document.createElement('img');
            penImage.setAttribute('src' , "images/pen-icon.svg");
            penImage.setAttribute('alt' , "pen");
            penButton.appendChild(penImage);
            
            cellElemButtons.appendChild(trashButton);
            cellElemButtons.appendChild(penButton);

            rowElem.appendChild(cellElemNumber);
            rowElem.appendChild(cellElemType);
            rowElem.appendChild(cellElemCategory);
            rowElem.appendChild(cellElemAmount);
            rowElem.appendChild(cellElemDate);
            rowElem.appendChild(cellElemComment);
            rowElem.appendChild(cellElemButtons);
            if(this.tbodyElem)  this.tbodyElem.appendChild(rowElem);
        })
    }


    private creationCategory(): void { 
        if(this.mainButtons && this.cancelButton && this.inputAmountElem && this.createButton) {  
            this.mainButtons.forEach((button: Element) => {  
                button.addEventListener('click', (event: Event)=>this.goToCreation(event))
            });
            this.cancelButton.addEventListener('click', ()=> this.cancelCreation(this.categoryName));
            this.inputAmountElem.addEventListener('keypress',(event: KeyboardEvent)=> ProcessServices.validateAmountInput(event));
            this.createButton.addEventListener('click', ()=> this.generateCategory()) 
        }
     }

   private async getCategories(type:string): Promise<CategoriesType[] | undefined>{  

        try {  
            if(type === "income") {  
                const result: CategoriesType[] | null = await CustomHttp.request(config.host + '/categories/income');
                if(result) {   
                   
                  return result;
                }
            } else {   
                const result: CategoriesType[] | null = await CustomHttp.request(config.host + '/categories/expense');
                if(result) {   
                  return result;
                }
            }
        } catch(e) {  
            console.log(e);
        }
     }

    private async generateCategory():Promise<void> { 

       if(this.validateForm(this.inputCreateItems)) {
         
        const type = (this.typeSelect as HTMLSelectElement).options[0].text === "Доход" ? "income" : "expense";
        const amount = (this.inputAmountElem as HTMLInputElement).value; 
        const date = (this.inputDateElem as HTMLInputElement).value ; 
        const comment = (this.inputCommentElem as HTMLInputElement).value; 
        const categorySelect = this.categoryOption as HTMLSelectElement ; 
        const category = categorySelect.options[categorySelect.selectedIndex].text;

        this.categories = await this.getCategories(type); 
        if(this.categories) {  
            const categoryItem = this.categories.find(item=> item.title === category);
            if(categoryItem) {  
                const categoryId = categoryItem.id
                try {  
                    const result: DefaultResponseType = await CustomHttp.request(config.host + '/operations', "POST", {   
                        type : type,
                        amount : amount,
                        date: date, 
                        comment: comment, 
                        category_id: categoryId,
                    });
        
                    if(result) {   
                        if(result.error !== undefined){  
                            throw new Error(result.message)
                    }  
                    
                    (this.formContent as HTMLFormElement).reset();
                    if(this.dropdown) this.dropdown.classList.remove('active');
                    if(this.activeItemOperations) this.activeItemOperations.classList.add('active');

                    if(type === "income") {  
                       if(this.activeItemRevenue) this.activeItemRevenue.classList.remove('active');
                    } else {  
                        if(this.activeItemExpense) this.activeItemExpense.classList.remove('active')
                    }

                    (this.formContent as HTMLFormElement).style.display = "none";
                    if(this.mainContent) this.mainContent.style.display = "block";
                    if(this.mainTitleElem)  this.mainTitleElem.innerText = "Доходи и расходы"
                    if(this.tbodyElem) this.tbodyElem.innerHTML = "" ; 
                    if(this.balance) {  
                        const balanceValue = await Balance.getBalance() ;
                        if(balanceValue !== undefined) {  
                            this.balance.innerText = balanceValue.toString();
                        } else {  
                            this.balance.innerText = '0'
                        }
                    }  
                     this.getCategoriesList(this.periodTime,this.inputDates);
                    }
                } catch(e) {  
                    console.log(e);
                }

            }
        }
       } 
    }


 private async saveChangesCategory():Promise<void> {  
        let typeValue: string | null ;
     
        if(this.validateForm(this.inputChangeItems as NodeListOf<HTMLInputElement>)){  
            if(this.categoryTypeInput) {  
                const val = (this.categoryTypeInput as HTMLInputElement).value
                val === "Доход" ? typeValue = "income" : typeValue = "expense"; 
                if(this.categoryAmountInput && this.categoryDateInput && this.categoryComment && this.categoryInput) {  
                    const amount = (this.categoryAmountInput as HTMLInputElement ).value.split("").filter((item:string)=> isNaN(Number(item))=== false).join("")
                    const date = (this.categoryDateInput as HTMLInputElement).value ; 
                    const comment = (this.categoryComment as HTMLInputElement).value;
                    const category = (this.categoryInput as HTMLInputElement).value;
                    
                   
                    const categories: CategoriesType[] | undefined = await this.getCategories(typeValue);
                    if(categories) {  
                        const categoryValue = categories.find(elem=> elem.title === category);
                        if(categoryValue) {  
                            const categoryId = categoryValue.id
                            try {  
                                const result: DefaultResponseType = await CustomHttp.request(config.host + '/operations/' + this.categoryId, "PUT", {   
                                    type : typeValue,
                                    amount : amount,
                                    date: date, 
                                    comment: comment, 
                                    category_id: categoryId
                                });
                                if(result) {   
                                    if(result.error !== undefined){  
                                        throw new Error(result.message)
                                }  
                                (this.formCategoryChange as HTMLFormElement ).reset();

                                if(this.dropdown) this.dropdown.classList.remove('active');
                                if(this.activeItemOperations) this.activeItemOperations.classList.add('active');
                                if(typeValue === "income") { 
                                    if(this.activeItemRevenue) this.activeItemRevenue.classList.remove('active');
                                } else {  
                                   if(this.activeItemExpense) this.activeItemExpense.classList.remove('active')
                                }
                                  (this.formCategoryChange as HTMLFormElement ).style.display = "none";
                                if( this.mainContent) this.mainContent.style.display = "block";
                                if(this.tbodyElem) this.tbodyElem.innerHTML = "" ; 
                                if(this.balance) {  
                                    const balanceValue = await Balance.getBalance();
                                    if(balanceValue !== undefined) {  
                                        this.balance.innerText = balanceValue.toString();
                                    } else {  
                                        this.balance.innerText = '0'
                                    }
                                } 
                                    this.getCategoriesList(this.periodTime,this.inputDates);
                                }
                            } catch(e) {  
                                console.log(e);
                            }

                        }
                    }
                }
            }
        } else {  
            return 
        }    
    }     
    private goToCreation(event: Event):void {  
                let eventElem: EventTarget | null = event.target ;
                let dataAttr : string | null | undefined = (eventElem as HTMLElement).dataset.finance;
                
                if(this.dropdown &&  this.activeItemOperations && this.mainContent && this.formContent && this.mainTitleElem ) {  
                    this.dropdown.classList.add('active')
                    this.activeItemOperations.classList.remove('active');
                    this.mainContent.style.display = "none";
                    this.formContent.style.display = 'block';
                    this.mainTitleElem.innerText = `Coздание ${dataAttr}`;
                    this.categoryName = dataAttr ; 
                    if(dataAttr === "дохода") {  
                        if( this.activeItemRevenue && this.typeSelect) {  
                            this.activeItemRevenue.classList.add('active');
                            (this.typeSelect as HTMLSelectElement).options[0].text = "Доход" ;
                            (this.typeSelect as HTMLSelectElement).options[0].value = "category" ;
                            this.selectCategoryOptions(dataAttr); 
                        }
                    } else  {  
                        if(this.activeItemExpense && this.typeSelect) { 
                            this.activeItemExpense.classList.add('active');
                            (this.typeSelect as HTMLSelectElement).options[0].text = "Расход" ;
                            (this.typeSelect as HTMLSelectElement).options[0].value = "category" ;
                            this.selectCategoryOptions(dataAttr);
                        }
                    } 
                }
               
     }
    private cancelCreation(category: string | null | undefined):void {  
        if(this.dropdown) this.dropdown.classList.remove('active')
        if(category === "дохода") {
            if(this.activeItemRevenue) this.activeItemRevenue.classList.remove('active');
        } else {  
            if(this.activeItemExpense) this.activeItemExpense.classList.remove('active');
        }
        if(this.activeItemOperations) this.activeItemOperations.classList.add('active');
        if(this.mainContent) this.mainContent.style.display = "block";
        if(this.formContent) {  
            this.formContent.style.display = 'none';
            (this.formContent as HTMLFormElement).reset();
        }
        if(this.mainTitleElem) this.mainTitleElem.innerText = "Доходы и расходы" ;
     }

   private async selectCategoryOptions(type: string | null | undefined):Promise<void> {  

        try {  
            if(type === "дохода") {  
                const result: CategoriesType[] | null = await CustomHttp.request(config.host + '/categories/income');
                if(result) {   

                    this.categoryList = result;
                    console.log(this.categoryList)
                }
            } else {   
                const result: CategoriesType[] | null = await CustomHttp.request(config.host + '/categories/expense');
                if(result) {   
                    this.categoryList = result;
                }
             }   
            if(this.categoryList && this.typeSelect &&  this.categoryOption) {  
                const category = this.categoryList.map(obj=> obj.title).length ? this.categoryList : [] ;
                console.log(category)
                const categoryOptions: CategoryOptionsType = {
                    category: category,
                    type: ["Категории..."]
                };
                
                const selectedType = (this.typeSelect as HTMLSelectElement).options[0].value;    
                const categoryOptionsForType = selectedType === 'category' ? (categoryOptions.category as CategoriesType[]) : categoryOptions.type;
                this.categoryOption.innerHTML = '';

                if(categoryOptionsForType) {  
                    categoryOptionsForType.forEach((category: CategoriesType | string ,index: number)=> {  
                        const option: HTMLOptionElement | null = document.createElement('option');
                        option.value = (index+1).toString(); 
                        option.text = (category as CategoriesType).title;
                        if(this.categoryOption) this.categoryOption.appendChild(option);
                  })
                }
            }

        } catch(e) {  
            console.log(e);
        }
     }

    private async deleteCategory(button: Element ,period: string | null | undefined):Promise<void> {  

        this.categoryId = (button as HTMLElement).dataset.categoryid;                                                                                                                                                        
            try {  
                const result: DefaultResponseType = await CustomHttp.request(config.host + '/operations/' + this.categoryId, "DELETE");
                if(result) {   
                    if(result.error){  
                        throw new Error(result.message)
                }    
                if(this.modalProcessElem) this.modalProcessElem.style.transform = "scale(0)";
                if(this.tbodyElem) this.tbodyElem.innerHTML = "" ;   
                 this.getCategoriesList(period,this.inputDates);
                 if(this.balance) {  
                    const balanceValue = await Balance.getBalance() ;
                    if(balanceValue !== undefined) {  
                        this.balance.innerText = balanceValue.toString();
                    } else {  
                        this.balance.innerText = '0'
                    }
                  } 
                }
            } catch(e) {  
                console.log(e);
            }
     }
}