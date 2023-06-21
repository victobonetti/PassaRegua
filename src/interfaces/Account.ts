import Item from "./Item";
import Payment from "./Payment";

export default interface Account {
    id: String,
    userId: String,
    items: Item[],
    payments: Payment[],
    paidAmount: number,
    accountTotal: number,
    createdAt:String,
    updatedAt?:String,
}