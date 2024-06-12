import config from "../config/config";
import { CustomHttp } from "../services/custom-http";
import { Auth } from "../services/auth";
import { FormFieldsType } from "../../types/form-fields.type";
import { DefaultResponseType } from "../../types/default-response.type";
import { FormLoginType } from "../../types/form-lgin.type";

export class Form {  

   private agreeElem: HTMLElement | null ;  
   private submitBtn: HTMLElement | null ;  
   private password : string | null
   private fields :  FormFieldsType[]  ; 
   private page : string | null ; 

    constructor(page: string) {   
       this.agreeElem = null;
       this.submitBtn = null;
       this.password = null;
       this.page =  page ;

        this.fields = [
            {   
                name: "email",
                id: "email", 
                element: null,
                regex:   /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,  
                valid: false
             },
             {   
                name: "password",
                id: "password", 
                element: null,
                regex:  /^(?=.*[A-Z])(?=.*\d).{8,}$/ ,  
                valid: false
             }
        ] 

        if(this.page === 'signup') {  
         this.fields.unshift(  
            {   
               name: "name",
               id: "name", 
               element: null,
               regex: /(^[A-ZА-Я][a-zа-я]+ *)([А-ЯA-Z][a-zа-я]+)/, 
               valid: false
            },
             {   
                name: "password-confirm",
                id: "password-confirm", 
                element: null,
                regex:  null,  
                valid: false
             }
         ) 
        }
        const that: Form = this ;
        this.submitBtn = document.getElementById('submit-btn');
        this.agreeElem =  document.getElementById('checkbox');

        this.fields.forEach((item: FormFieldsType)=> {  
      
           item.element = document.getElementById(item.id);
           if(item.element) { 
               item.element.oninput = function() {   
                  that.validateField.call(that, item, (this as HTMLInputElement));
                  if(item.id === 'password') {  
                     that.password = (this as HTMLInputElement).value;
                  } 
            }
           }
        });
        if(this.submitBtn) {  
            this.submitBtn.onclick = function() {  
               that.proccessForm()
         }
        }
    }

   private validateField(field: FormFieldsType, element : HTMLElement ):void  { 
      const that: Form = this;
      const parentElem : ParentNode | null  =  element.parentNode;
      const elem = element as HTMLInputElement;
      if(parentElem instanceof HTMLElement) {  
         if(field.id === "password-confirm" && elem.value) { 
            if(that.password == elem.value) {  
              this.removeError(parentElem, field);
           } else {  
              this.showError(parentElem,field);
           }  
        } else if(!elem.value || (field.regex && !elem.value.match(field.regex))) {   
              this.showError(parentElem, field);
  
        } else {  
              this.removeError(parentElem, field);
        }
      }
       this.validateForm();
    }
    
    private showError(elem: HTMLElement,field: FormFieldsType): void {   
         const inputError: Element | null = elem.nextElementSibling ; 
         elem.style.border = '1px solid red';
         field.valid = false ; 
         if(inputError) (inputError as HTMLElement).style.display = "block";
    } 
    private  removeError(elem: HTMLElement,field: FormFieldsType): void {  
         const inputError = elem.nextElementSibling ; 
         elem.style.border = '1px solid green';
         field.valid = true ; 
         if(inputError)  (inputError as HTMLElement).style.display = "none";
    }
    
   private validateForm():boolean {   
      const isFormValid = this.fields.every(item => item.valid === true);
      if(isFormValid) {  
        if(this.submitBtn) this.submitBtn.removeAttribute('disabled');
          return true
      } else {  
        if(this.submitBtn) this.submitBtn.setAttribute('disabled','disabled');
        return false
      }
   }

  private async proccessForm():Promise<void> {  
       if(this.validateForm()) {  
        const emailField = this.fields.find(item=> item.name === "email")?.element as HTMLInputElement ; 
        const email : string  = emailField.value ; 

        const passwordField = this.fields.find(item=> item.name === "password")?.element as HTMLInputElement;
        const password: string =  passwordField.value
         if(this.page === "signup"){
            const fullNameField =  this.fields.find(item=> item.name === "name")?.element as HTMLInputElement;
            const fullName: string  = fullNameField.value ;
            const nameArr = fullName.split(' ');  
            const passwordRepeatField =  this.fields.find(item=> item.name === "password-confirm")?.element as HTMLInputElement ;
             try {  
                  const result: DefaultResponseType = await CustomHttp.request(config.host + '/signup', 'POST', {  
                  name: nameArr[0],
                  lastName: nameArr[1],
                  email: email,
                  password: password,
                  passwordRepeat: passwordRepeatField.value
               })
               if(result) {   
                  if(result.error) {  
                     throw new Error(result.message);
                  }
                  location.href = '#/login';
               }
                
             } catch(e) {  
                 console.log(e)
             }  
         }   else {  
            try {  
               const result: DefaultResponseType | FormLoginType = await CustomHttp.request(config.host + '/login','POST', {   
                  email: email,
                  password: password,
                  rememberMe: this.agreeElem? (this.agreeElem as HTMLInputElement).checked : false
            })
               if(result) {  
                  if((result as DefaultResponseType).error) {  
                     throw new Error((result as DefaultResponseType).message)
                  } 
                  Auth.setTokens((result as FormLoginType).tokens.accessToken,(result as FormLoginType).tokens.refreshToken);
                  Auth.setUserInfo({  
                     name: (result as FormLoginType).user.name, 
                     lastName : (result as FormLoginType).user.lastName,
                     id: (result as FormLoginType).user.id
                  });
                  
                  location.href = "#/"
               }
            } catch(e) {  
               console.log(e);
            }
         }
   
       }
    }
}