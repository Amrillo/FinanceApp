import Chart from 'chart.js/auto'
import { CustomHttp } from '../services/custom-http';
import config from '../config/config';
import { OperationsListType } from '../../types/operations-data.type';
import {ChartConfiguration} from 'chart.js'


export class ChartTable {  
     
      private static incomeChart: Chart | null = null ;  
      private static expenseChart: Chart | null = null;
      public static period: string = 'today';
      private static operationsList : OperationsListType[] | null ; 

    static async createChart(incomeId: string, expenseId: string, dates: NodeListOf<Element>, period: string | null): Promise<void> {  
        if(this.incomeChart) {  
          this.incomeChart.destroy();
          }
        if(this.expenseChart) {  
          this.expenseChart.destroy();
        }

      try {  
        let result: OperationsListType[] | null ; 
        if(period === "today"){  
            result = await CustomHttp.request(config.host + '/operations');
          } else if (period === "interval"){  
              result = await CustomHttp.request(config.host + '/operations?period=' + period + "&dateFrom=" + (dates[0] as HTMLInputElement).value + "&dateTo=" + (dates[1] as HTMLInputElement).value);
          } else {   
              result = await CustomHttp.request(config.host + '/operations?period=' + period);
          }
        if(result) {   
            this.operationsList = result;

            const filteredIncome: OperationsListType[] | undefined = this.operationsList.filter(elem=> elem.type === "income");
            const filteredExpense: OperationsListType[] | undefined= this.operationsList.filter(elem=> elem.type === "expense");
  
            const amountsIncome: Array<number>  =  filteredIncome.map(item=> item.amount);
            const amountsExpense: Array<number> =  filteredExpense.map(item=> item.amount);
  
            const incomeCategories: string[]  =  filteredIncome.map(item=> item.category).filter(category=> category !== undefined) as string[];
            const expenseCategories : string[] =  filteredExpense.map(item=> item.category).filter(category=> category !== undefined) as string[];
  
            const ctx1: HTMLElement | null = document.getElementById(incomeId) ; 
            const ctx2:  HTMLElement | null  = document.getElementById(expenseId) ;

            if(ctx1 && ctx2) {  
              (ctx1 as HTMLCanvasElement).width = 360 ;
              (ctx1 as HTMLCanvasElement).height = 360 ;
              (ctx2 as HTMLCanvasElement).width = 360 ;
              (ctx2 as HTMLCanvasElement).height = 360 ;
            }
          
          const config1:ChartConfiguration = {   
            type: 'pie',
            data: {  
              labels: incomeCategories,
              datasets: [{
                label: 'Доходы',
                data: amountsIncome,
                backgroundColor: [
                  '#DC3545',
                  '#FD7E14', 
                  '#FFC107',
                  '#20C997',
                  '#0D6EFD',
                  '#454545',
                  "#999999",
                   "#00FF00",
                   "#0000FF",
                   "#800000",
                   "#00FFFF",
                   "#800080"
                ],
                hoverOffset: 4
              }] ,
            }
          }
            
        //   const config1 = {    
        //     labels: incomeCategories,
        //   datasets: [{
        //     label: 'Доходы',
        //     data: amountsIncome,
        //     backgroundColor: [
        //       '#DC3545',
        //       '#FD7E14', 
        //       '#FFC107',
        //       '#20C997',
        //       '#0D6EFD',
        //       '#454545',
        //       "#999999",
        //        "#00FF00",
        //        "#0000FF",
        //        "#800000",
        //        "#00FFFF",
        //        "#800080"
        //     ],
        //     hoverOffset: 4
        //   }] ,
        // }

        const config2: ChartConfiguration = {  
          type: 'pie',
          data: {  
            labels: expenseCategories,
            datasets: [{
              label: 'Расходы',
              data: amountsExpense,
              backgroundColor: [
                '#DC3545',
                '#FD7E14',
                '#FFC107',
                '#20C997',
                '#0D6EFD',
                '#454545',
                "#999999",
                 "#00FF00",
                 "#0000FF",
                 "#800000",
                 "#00FFFF",
                 "#800080"
              ],
              hoverOffset: 4
            }] ,
          } 
       
      }
          // const config2 = {   
          //     labels: expenseCategories,
          //   datasets: [{
          //     label: 'Расходы',
          //     data: amountsExpense,
          //     backgroundColor: [
          //       '#DC3545',
          //       '#FD7E14',
          //       '#FFC107',
          //       '#20C997',
          //       '#0D6EFD',
          //       '#454545',
          //       "#999999",
          //        "#00FF00",
          //        "#0000FF",
          //        "#800000",
          //        "#00FFFF",
          //        "#800080"
          //     ],
          //     hoverOffset: 4
          //   }] ,
          // }
       
            this.incomeChart =  new Chart(ctx1 as HTMLCanvasElement,  config1);


          // this.incomeChart =  new Chart(ctx1 as HTMLCanvasElement, {
          //   type: 'pie',
          //   title: "Доход",
          //   data: config1
          // });
  
           this.expenseChart = new Chart(ctx2 as HTMLCanvasElement, config2);

          // this.expenseChart = new Chart(ctx2 as HTMLCanvasElement, {
          //   type: 'pie',
          //   title: "Расход",
          //   data:  config2
          // });
         
          }
          console.log(this.operationsList);

        } catch(e) {  
            console.log(e);
        }

        // return [this.incomeChart, this.expenseChart]
    }
}






