import { CustomDataset } from "../../types/custom-dataset.type";
import { ChartTable } from "../components/chart";

export class ProcessServices {  
    

    public static activeElement(elements: NodeListOf<Element> | null , dates:NodeListOf<Element> | null):void{ 
  
    if(elements && dates) {  
            elements.forEach((element: Element) => {

                element.addEventListener('click', function(event: Event):void{  
                    elements.forEach((el:Element) => {
                        el.classList.remove('active');
                    });
                    const selectedElem: EventTarget | null = event.target as Element ; 
                 
                    if(selectedElem) {  
                        element.classList.add('active');
                        // const selectedDataset: CustomDataset = (selectedElem as HTMLElement).dataset
                        // const period = event.target.dataset.time;
                        const period: string | undefined = ((selectedElem as HTMLElement).dataset as CustomDataset)?.time ;
                        if(period !== undefined) {  
                            ChartTable.createChart("income-chart", "expense-chart" , dates, period);
                        }
                    }
                    
                })
           })
        }
     }

    static  validateAmountInput(event: KeyboardEvent): void {  
        const charCode = event.which || event.keyCode; 
        if (charCode < 48 || charCode > 57 || event.ctrlKey || event.metaKey) {
            event.preventDefault();
        }
    }


}