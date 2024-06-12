export type RouterFieldType = {  
    route: string,
    title: string,
    template: string,
    styles: string | null,
    load(): void    
}