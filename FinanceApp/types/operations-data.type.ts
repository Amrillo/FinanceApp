export type OperationsListType = {  
    id: number,
    type: 'expense' | 'income',
    category?: string,
    amount: number,
    date: string,
    comment: string
}


