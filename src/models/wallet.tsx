export type Transaction = {
    id?: number,
    title : String,
    amount: number,
    datetime : Date,
}

export type Transfer = {
    id: number,
    title : String,
    amount: number,
    datetime : Date,
}

export type Records = Transaction | Transfer
