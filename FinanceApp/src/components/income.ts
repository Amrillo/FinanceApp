import { CustomHttp } from "../services/custom-http";
import config from "../config/config";
import { CategoriesType } from "../../types/categories-data.type";
import { DefaultResponseType } from "../../types/default-response.type";

export class Income {   
    
    private page : string | null; 
    private categoryList : CategoriesType[] | null ;
    private categoryId : number | null ; 
    private incomeContent : HTMLElement | null ;  
    private categoryAdd : HTMLElement | null ;  
    private categoryChange : HTMLElement | null ;  
    private categoryCreate : HTMLElement | null ;  
    private cancelCreateBtn : HTMLElement | null ;  
    private mainTitleElem : HTMLElement | null ;  
    private createBtn : HTMLElement | null ;  
    private createInputElem : HTMLElement | null ;  
    private createInputValue : string | null ;

    constructor(page: string) {  
        this.page = page
        this.categoryList = null; 
        this.categoryId = null; 
        this.incomeContent = document.getElementById('income-content');
        this.categoryAdd = document.getElementById('category-add');
        this.categoryChange = document.getElementById('category-change');
        this.categoryCreate = document.getElementById('category-create');
        this.createInputValue = null; 
        this.cancelCreateBtn = document.getElementById('cancel-create-btn');
        this.mainTitleElem = document.getElementById('main-title');
        this.createBtn = document.getElementById('createBtn');
        this.addCategory = this.addCategory.bind(this);
        this.cancelCategory = this.cancelCategory.bind(this);
        this.processCategory = this.processCategory.bind(this);
        this.createInputElem = document.getElementById('create-name');
        // this.categoryItems = {};
        this.init();
        this.categoryAddEvents();
        
    }

   private async init():Promise<void> {   
       
        try {  
            if(this.page === "income") {  
                const result : CategoriesType[] | null = await CustomHttp.request(config.host + '/categories/income');
                if(result) {   
                      this.categoryList = result;
                }
            } else {   
                const result: CategoriesType[] | null = await CustomHttp.request(config.host + '/categories/expense');
                if(result) {   
                     this.categoryList = result;
                }
            }
            this.showCategories();
            this.changeCategory(this.mainTitleElem);
            this.deleteCategory();
        } catch(e) {  
            console.log(e);
        }
    }

   private categoryAddEvents():void {  
        if(this.categoryAdd) this.categoryAdd.onclick = this.addCategory ; 
        if(this.cancelCreateBtn) this.cancelCreateBtn.onclick = this.cancelCategory ; 
         if(this.createBtn) this.createBtn.onclick = this.processCategory ;
    }

   private  cancelCategory():void {  
        if(this.page === "income") {  
            if(this.mainTitleElem) this.mainTitleElem.innerText= "Доходы";
        } else {  
          if(this.mainTitleElem) this.mainTitleElem.innerText= "Расходы";
        }
        if(this.categoryCreate) this.categoryCreate.style.display = "none";
        if(this.incomeContent)  this.incomeContent.style.display = "flex";
        if(this.createInputElem) (this.createInputElem as HTMLInputElement).value = "" ;  
    }

   private addCategory():void { 
    if(this.mainTitleElem && this.incomeContent && this.categoryCreate ) { 
            if(this.page === "income") {  
                this.mainTitleElem.innerText= "Создание категории доходов";
            } else {  
                this.mainTitleElem.innerText= "Создание категории расходов";
            }
            
            this.incomeContent.style.display = "none";
            this.categoryCreate.style.display = "block";
        }
    }
   private processCategory():void {  
        if(this.createInputElem) {  
             this.createInputValue = (this.createInputElem as HTMLInputElement).value.trim();
            if(this.createInputValue) {  
                if(this.validateFields(this.createInputValue)) {  
                    this.createCategory();
                } else {  
                    alert('Напишите корректное слово')
                }
            } else {  
                alert('Запольните поля')
            }
        }
    }

  private async createCategory():Promise<void> {  
        try {  
            let result : DefaultResponseType | CategoriesType; 
            
            if(this.page === "income") {  
                result  = await CustomHttp.request(config.host + '/categories/income', "POST", 
                {   
                   title :  this.createInputValue
                });
               if(this.mainTitleElem) this.mainTitleElem.innerText = "Доходы";
            } else {  
                result = await CustomHttp.request(config.host + '/categories/expense', "POST", 
                {   
                   title :  this.createInputValue
                });
                if(this.mainTitleElem) this.mainTitleElem.innerText = "Расходы";
            }
            
            if(result) {   
                if((result as DefaultResponseType).error){  
                     throw new Error((result as DefaultResponseType).message)
                 }
              console.log(result);

            //   if(!localStorage.getItem('categories')) {  
            //      if((result as CategoriesType[]).length > 1) {  
            //         localStorage.setItem('categories', JSON.stringify(result));
            //      } else {  
            //         console.log(result);
            //      }
            //   }
              if(  this.categoryCreate && this.incomeContent &&  this.createInputElem) {  
                this.categoryCreate.style.display = "none"
                this.incomeContent.style.display = "flex";
                (this.createInputElem as HTMLInputElement).value = "" ; 
                this.refreshPage(this.incomeContent);
              }
              this.init();
            }
        } catch(e) {  
            console.log(e);
        }
    }

  private showCategories():void {  
        if(this.categoryList ) {  
            this.categoryList.forEach((item: CategoriesType)=> {
                const contentElem =  this.createCategoryElement(item);
                if(this.categoryAdd) this.categoryAdd.before(contentElem); 
              })
        }
    }

  private createCategoryElement(item: CategoriesType ): HTMLElement {  
        const contentElem: HTMLElement | null= document.createElement('div');
        const titleCategory: HTMLElement | null = document.createElement('h2');
        const controlsBtn: HTMLElement | null=  document.createElement('div');

        contentElem.className = "col income-col";

        titleCategory.className = "text-left font-weight-bolder fs-4 pb-2";
        titleCategory.innerText = item.title;

        controlsBtn.className = "row button-wrapper";
        controlsBtn.innerHTML = `
        <div class="col">
            <button type="button" class="btn btn-primary income-change" data-id=${item.id} data-title=${item.title}>Редактировать</button>
        </div>
        <div class="col">
            <button type="button" class="btn btn-danger income-delete" data-id=${item.id} data-title=${item.title}>Удалить</button>
        </div>
        `;
        contentElem.append(titleCategory);
        contentElem.append(controlsBtn);
        return contentElem;         
    }

     private validateFields(elem: string): Boolean {  
        const regExp: RegExp = /^[А-Я][а-я]*/;
        const validElem: Array<string> | null = elem.match(regExp);

        if(elem.length > 1 && validElem ) {  
            return true  
        }
        return false          
    }

   private refreshPage(parent: HTMLElement ): void {  
        while (parent.childElementCount > 1) {
            if(parent.firstChild) {  
                parent.removeChild(parent.firstChild);
            }
        }
    }

    private  changeCategory(title: HTMLElement | null):void {  
        if(title) {  
            const changeButtons: NodeListOf<Element> = document.querySelectorAll('.btn.btn-primary.income-change');
            const saveChangesBtn: HTMLElement | null = document.getElementById('save-changes');
            const cancelChangesBtn: HTMLElement | null = document.getElementById('cancel-changes');
            const saveInputElem: HTMLElement | null  = document.getElementById('save-input');
            const that: Income = this ; 
            
            changeButtons.forEach((button: Element)=> { 
                const htmlButton = button as HTMLButtonElement 
                htmlButton.onclick = (e:Event)=> {   
                    const target = e.target as HTMLElement ;
                    const elem: string | undefined= target.dataset.title ;
                   
                  if(that.incomeContent) that.incomeContent.style.display = "none";
                  if(that.categoryChange) that.categoryChange.style.display = "block";
                   if(this.page === "income") {  
                         title.innerText = 'Редактирование категории доходов';
                   } else {  
                        title.innerText = 'Редактирование категории расходов';
                   } 
                   if(elem) {  
                    if(saveInputElem) (saveInputElem as HTMLInputElement).value = elem.toString()
                   }
                
                    that.categoryId = Number(target.dataset.id);
                   }
                });
            if(cancelChangesBtn) {  
                cancelChangesBtn.onclick = ()=> {  
                    if(that.categoryChange) that.categoryChange.style.display = "none";
                    if(that.incomeContent)  that.incomeContent.style.display = "flex";
                    if(this.page === "income") {  
                        title.innerText = "Доходы";
                    } else {  
                        title.innerText = "Расходы";
                    }
                }
            }
            
            if(saveChangesBtn) {  
                saveChangesBtn.onclick = ()=> {
                    if(saveInputElem) {  
                        const saveInputValue = (saveInputElem as HTMLInputElement).value.trim();
                        if(saveInputValue) {   
                            if(that.validateFields(saveInputValue)) {  
                                that.processData(that.categoryChange, this.categoryId, "PUT", { title: saveInputValue}); 
                             } else {  
                                 alert('Напишите корректное слово')
                             }
                        }
                    else {  
                        alert('Запольните поля')
                    }
                }
            }
        }
     }
  }
   private async processData(content: HTMLElement | null, id: number | null , method: string, body: {title: string} | null):Promise<void> { 
        if(content)  {  
            try {  
                let result : DefaultResponseType ; 
                if(this.page === "income") { 
                    result = await CustomHttp.request(config.host + '/categories/income/' + id, method , body);
                } else {  
                    result = await CustomHttp.request(config.host + '/categories/expense/' + id, method , body);
                }
                if(result) {   
                    if(result.error){  
                        throw new Error(result.message)
                   }
    
                 if(method === "DELETE") {  
                    content.classList.remove('open');
                 } else {   
                    if(this.page === "income") {  
                       if(this.mainTitleElem)  this.mainTitleElem.innerText = "Доходы" ; 
                    } else {  
                       if(this.mainTitleElem) this.mainTitleElem.innerText = "Расходы" ; 
                    }
                    content.style.display = "none"
                    if(this.incomeContent) this.incomeContent.style.display = "flex";
                 }
                 if(this.incomeContent) {  
                    this.refreshPage(this.incomeContent);
                 }
                  this.init();
                }
    
            } catch(e) {  
                console.log(e);
            }
        }
    }
  private deleteCategory():void {  
        const modalText = {  
            income : "Вы действительно хотите удалить категорию? Связанные доходы будут удалены навсегда.",
            expense: "Вы действительно хотите удалить категорию? Связанные расходы будут удалены навсегда."
        }

        const deleteCategory:  NodeListOf<Element> = document.querySelectorAll('.btn.btn-danger.income-delete');
        const modalDialog: HTMLElement | null = document.getElementById('income-modal');
        const keepButton: HTMLElement | null = document.getElementById('keepbtn');
        const deleteButton: HTMLElement | null =  document.getElementById('deletebtn');
        const modalContent: HTMLElement | null =  document.getElementById('modal-body');

        deleteCategory.forEach((button : Element)=> {   
            const htmlButton = button as HTMLButtonElement
            htmlButton.onclick = (e: Event)=> {  
            this.categoryId = Number((e.target as HTMLElement).dataset.id) ;
            
            if(modalDialog) modalDialog.classList.add('open');
             if(this.page === "income") {  
              if(modalContent)  modalContent.innerText = modalText.income ; 
             } else {  
               if(modalContent)  modalContent.innerText = modalText.expense ; 
             }
            }
        });
        if(keepButton) {  
            keepButton.onclick = ()=> {  
             if(modalDialog) modalDialog.classList.remove('open');
            }
        }
        if(deleteButton) {  
            deleteButton.onclick = ()=> {  
                this.processData(modalDialog,this.categoryId, "DELETE", null); 
            }
        }
    }
}