export type FormFieldsType = {  
    name: string,
    id: string, 
    element: HTMLElement | null,
    regex:  RegExp| null,  
    valid: boolean
}